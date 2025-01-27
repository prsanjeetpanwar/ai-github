import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "langchain/document";

const genAi = new GoogleGenerativeAI(`AIzaSyB9Xce5hD4YcAr9nUYXY6DzviZ_Yd1aUJ0`);

const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

export const AiSummarizeCommit = async (diff: string) => {
    let retries = 3; // Number of retries
    let delay = 2000; // Initial delay in milliseconds

    while (retries > 0) {
        try {
            const response = await model.generateContent([
                `You are an expert software developer and reviewer. Your role is to summarize and explain code commits effectively.
                    
                    Below is a commit represented as a git diff. Please provide:
                    1. A summary of what this commit does.
                    2. Key changes made in the code. (Changes should be in short not to big focus on only main thing not pig lines)
                    3. The purpose of the changes, if it can be inferred.
                    
                    Use the following format:
                    Summary: <summary of what this commit does>
                    Changes: <key changes made in the code>
                    Purpose: <purpose of the changes, if it can be inferred>
                    
                    Keep the response concise yet detailed, highlighting the most critical aspects. \n\n${diff}`
            ]);
            return response.response.text();
        } catch (error:any) {
            if (retries <= 0 || error.statusCode !== 503) {
                throw error;
            }
            console.warn(`Request failed. Retrying in ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay)); // Wait before retrying
            delay *= 2; // Exponential backoff
            retries--;
        }
    }
};

export async function summarizeCode(doc: Document) {
    try {
        const code = doc.pageContent.slice(0, 10000);

        const response = await model.generateContent([
            `you are an intelligent most senior software engineer who specializes in onboarding juniors
             software engineers onto project
            'you are onboarding a junior software engineer and explaining to them the purpose of the 
            ${doc.metadata.source} file here is the code:

            ----

            ${code}

            ----
            '
    Give a summary no more than 100 words of the code above`
        ]);
        return response.response.text();
    } catch (error) {
        console.error('Summarization failed', error);
        return "";
    }
}

export async function generateEmbedding(summary: string) {
    const model = genAi.getGenerativeModel({
        model: 'text-embedding-004',
    });
    const result = await model.embedContent(summary);
    const embedding = result.embedding;
    return embedding.values;
}
