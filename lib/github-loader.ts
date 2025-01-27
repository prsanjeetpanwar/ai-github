import { GithubRepoLoader } from '@langchain/community/document_loaders/web/github';
import { Document } from 'langchain/document';

import { generateEmbedding, summarizeCode } from './gemini';
import { db } from '@/server/db';
import { Octokit } from 'octokit';
import { auth } from '@clerk/nextjs/dist/types/server';



const getFileCount=async (path:string, octokit:Octokit,githubOwner:string,
    githubRepo:string , acc:number=0)=>{
       const {data}=await octokit.rest.repos.getContent({
              owner:githubOwner,
              repo:githubRepo,
              path
       }) 
       if(!Array.isArray(data) && data.type==='file'){
return acc+1
       }
       if(Array.isArray(data)){
        let FileCount=0
   const directories:string[]=[]
   for (const item of data){
      if(item.type==='dir'){
        directories.push(item.path)
      }
      else{
            FileCount++
      }

   }
   if(directories.length>0){
    const directoryCounts=await Promise.all(
   directories.map(dirPath=>getFileCount(dirPath,octokit,githubOwner,githubRepo,0))
    )
    FileCount+=directoryCounts.reduce((acc,count)=>acc+count,0)
   }
   return acc+FileCount
       }
       return acc
    }

export const checkCredits=async (githubUrl:string, githubToken?:string)=>{
    const octokit=new Octokit({
        auth:githubToken
    })
    const githubOwner=githubUrl.split("/")[3]
    const githubRepo=githubUrl.split("/")[4]
    if(!githubOwner || !githubRepo){
        return 0
    }

    const fileCount=await getFileCount("",octokit,githubOwner,githubRepo,0)
    return fileCount

}




export const LoadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    try {
        const loader = new GithubRepoLoader(githubUrl, {
            accessToken: githubToken || "",
            branch: "main",
            ignoreFiles: ["README.md", "LICENSE.md", "package-lock.json", "pnpm-lock.yaml", "yarn.lock"],
            recursive: true,
            unknown: "warn",
            maxConcurrency: 5
        });

        const docs = await loader.load();
        return docs;
    } catch (error) {
        console.error('Error loading GitHub repository:', error);
        throw error;
    }
};

// async function main() {
//     try {
//         const docs = await LoadGithubRepo("https://github.com/prsanjeetpanwar/ai-github");
//         console.log('Repository documents:', docs);
//     } catch (error) {
//         console.error('Error in main:', error);
//     }
// }

// main();

export const indexGithubRepo = async (projectId: string, githubUrl: string,
    githubToken?: string
) => {
           const docs =await LoadGithubRepo(githubUrl, githubToken);
           const allEmbedding=await generateEmbeddings(docs)
           return Promise.allSettled(allEmbedding.map( async(embedding,indx)=>{
            console.log(`processing ${indx} of ${allEmbedding.length}`)
            if(!embedding) return
            const sourceCodeEmbedding=await  db.sourceCodeEmbedding.create({
                data:{
                    summary:embedding.summary,
                    sourceCode:embedding.sourceCode,
                    fileName:embedding.fileName,
                    projectId,

                }
            })
            await db.$executeRaw`
            UPDATE "SourceCodeEmbedding"
            SET "summaryEmbedding"=${embedding.embedding}:: vector
            WHERE "id"= ${sourceCodeEmbedding.id}
            LIMIT 4
            
            `
           }))
}


const generateEmbeddings=async(docs:Document[])=>{
   return await Promise.all(docs.map(async doc=>{
    const summary=await summarizeCode(doc)
    const embedding=await generateEmbedding(summary)
    return {
        summary,
        embedding,
        sourceCode:JSON.parse(JSON.stringify(doc.pageContent)),
        fileName:doc.metadata.source
    }
   }))
}
