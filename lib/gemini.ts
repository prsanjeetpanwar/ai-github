import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi=new GoogleGenerativeAI( `AIzaSyB9Xce5hD4YcAr9nUYXY6DzviZ_Yd1aUJ0`);
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });

export const AiSummarizeCommit=async(diff:string)=>{
    const response=await model.generateContent([
`You are an expert software developer and reviewer. Your role is to summarize and explain code commits effectively. 
            
            Below is a commit represented as a git diff. Please provide:
            1. A summary of what this commit does.
            2. Key changes made in the code.
            3. The purpose of the changes, if it can be inferred.
            
            Use the following format:
            Summary: <summary of what this commit does>
            Changes: <key changes made in the code>
            Purpose: <purpose of the changes, if it can be inferred>

            Keep the response concise yet detailed, highlighting the most critical aspects.e \n\n${diff}

`
    ])
    return response.response.text()
}




