"use server"

import { generateEmbedding } from "@/lib/gemini"
import { db } from "@/server/db"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { streamText } from "ai"
import { createStreamableValue } from "ai/rsc"


const google=createGoogleGenerativeAI({
    apiKey:"AIzaSyB9Xce5hD4YcAr9nUYXY6DzviZ_Yd1aUJ0"
})

export async function askQuestion(question: string, projectId: string) {
  console.log("Received projectId:", projectId);
  const stream = createStreamableValue();
  const queryVector = await generateEmbedding(question);
  const vectorString = JSON.stringify(queryVector); 
  const result = await db.$queryRaw`
    SELECT "fileName", "sourceCode", "summary"
    FROM "SourceCodeEmbedding"
    WHERE "projectId" = ${projectId}
    


  ` as {
    fileName: string;
    sourceCode: string;
    summary: string;
  }[];

  let context = '';
  for (const doc of result) {
    context += `source: ${doc.fileName}\ncode content: ${doc.sourceCode}\nsummary: ${doc.summary}\n\n`;
  }

  // Rest of your code remains the same
  (async () => {
    const { textStream } = await streamText({
      model: google.languageModel(`gemini-1.5-flash`),
       prompt: `You are an expert code analysis AI assistant. Your role is to help developers understand and work with their codebase.

        CAPABILITIES AND GUIDELINES:
        - Provide detailed, technical explanations with a focus on accuracy
        - Use step-by-step breakdowns when explaining complex concepts
        - Include relevant code examples using proper markdown formatting
        - Focus only on information present in the provided context
        - Clearly indicate when information is not available in the context
        - Maintain a professional, technical tone appropriate for developers
        
        CONTEXT:
        ${context}
        
        QUESTION:
        ${question}
        
        RESPONSE FORMAT:
        1. Always use markdown formatting
        2. Structure code examples with appropriate syntax highlighting
        3. Include relevant file references when discussing specific code
        4. Break down complex explanations into clear sections
        5. When code snippets are needed, format them as: \`\`\`language\ncode\n\`\`\`
        
        IMPORTANT RULES:
        - Only provide information that can be directly derived from the context

        - Do not make assumptions about code or functionality not shown in the context
        - Do not apologize for previous responses
        - Focus on providing actionable, practical insights
        
        Please provide your response based on these guidelines, focusing on accuracy and clarity.`
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();

  return {
    output: stream.value,
    fileReference: result
  };
}

