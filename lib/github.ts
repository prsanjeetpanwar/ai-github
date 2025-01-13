import { db } from "../server/db";
import {Octokit} from "octokit";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const githubUrl = `https://github.com/docker/genai-stack`

type Response = {
    commitHash: string,
    commitMessage: string,
    commitAuthorName: string,
    commitAuthorAvatar: string,
    commitDate: string
}

// Define the commit type based on the GitHub API response
type GitHubCommit = {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string | null;
            date: string | null;
        } | null;
    };
    author: {
        avatar_url: string | null;
    } | null;
}

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner,repo]=githubUrl.split(`/`).slice(-2)
    if(!owner && !repo){
        throw new Error(`Invalid githubUrl ${githubUrl}`)
    }
    const {data} = await octokit.rest.repos.listCommits({
        owner,
        repo,
    });
    
   const shortCommit=data.sort((a:any, b:any)=>new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[];
    return  shortCommit.slice(0,10).map((commit:any)=>({
       commitHash: commit.sha as string,
       commitMessage: commit.commit.message ?? "",
       commitAuthorName: commit.commit?.author?.name ?? "",
       commitAuthorAvatar: commit?.author?.avatar_url ?? "",
       commitDate: commit.commit?.author?.date as string


    }))
   }

   

 export const pullCommit =async(projectId:string)=>{
   const{project,githubUrl}=await fetchProjectGithubUrl(projectId)
   const commitHashes=await getCommitHashes(githubUrl)
   const unProcessCommits=await filterUnProcessCommits(projectId,commitHashes)
   console.log(unProcessCommits)
   return unProcessCommits

 }

 async function fetchProjectGithubUrl(projectId:string) {
    const project=await db.project.findUnique({
        where:{id:projectId},
            select:{
                githubUrl:true
            }
    })
    if(!project?.githubUrl) {
        throw new Error(`No githubUrl found for project with id ${projectId}`)
    }
    return {project,githubUrl:project?.githubUrl}
 }

 async function summarizeCommit(githubUrl:string,commitHash:string){
     
 }

 async function filterUnProcessCommits(projectId:string,commitHash:Response[]){
    const processCommits=await db.commit.findMany({
        where:{projectId}
    })
    const unProcessCommits=commitHash.filter((commit)=>!processCommits.some((processCommits)=>processCommits.commitHash===commit.commitHash))
    return unProcessCommits
 }


 // Main execution function
async function main() {
    try {
        const unprocessedCommits = await pullCommit("65777d3f-a8de-4d16-8ea1-b95aa2fbf5b1");
        console.log(unprocessedCommits);
    } catch (error) {
        console.error("Error pulling commits:", error);
    }
}

main();
