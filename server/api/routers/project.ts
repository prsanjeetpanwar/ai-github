import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { pullCommit } from "@/lib/github";
import { checkCredits, indexGithubRepo } from "@/lib/github-loader";

export const ProjectRouter = createTRPCRouter({



  
  getEmbeddings: protectedProcedure
  .input(z.object({ projectId: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.db.sourceCodeEmbedding.findMany({
      where: { projectId: input.projectId },
      select: { id: true, fileName: true, summary: true }
    });
  }),

  getDependencies: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const embeddings = await ctx.db.sourceCodeEmbedding.findMany({
        where: { projectId: input.projectId },
        select: { fileName: true, summary: true }
      });

      return embeddings.flatMap(embedding => {
        const dependencies = (embedding.summary.match(/imports?\s+([^\s]+)/gi) || [])
          .map(dep => dep.split(' ')[1].replace(/['";]/g, ''));
          
        return dependencies.map(dep => ({
          source: embedding.fileName,
          target: dep
        }));
      });
    }),


  
  createProject: protectedProcedure
    .input(z.object({
      name: z.string(),
      githubUrl: z.string().url(),
      githubToken: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.user;

      if (!user) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'User not found in context',
        });
      }

      if (!user.userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User ID not found',
        });
      }

      try {
        const project = await ctx.db.$transaction(async (prisma) => {
          const newProject = await prisma.project.create({
            data: {
              githubUrl: input.githubUrl,
              name: input.name,
            },
          });

          await prisma.userToProject.create({
            data: {
              userId: user.userId,
              projectId: newProject.id,
            },
          });

          return newProject;
        });
        await pullCommit(project.id)
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken)
        return project;

      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create project',
          cause: error,
        });
      }
    }),

  getProject: protectedProcedure
    .query(async ({ ctx }) => { 
      const user = await ctx.user;
    
      return await ctx.db.project.findMany({
        where: {
          userToProjects: { 
            some: {
              userId: user.userId
            }
          },
          deletedAt: null,
        }
      });
    }),
    getCommits:protectedProcedure.input(z.object({
      projectId:z.string()
    })).query(async ({ctx,input}) => {
      pullCommit(input.projectId).then().catch(console.error)
      return await ctx.db.commit.findMany({
        where:{
          projectId:input.projectId
        }
      })
    }),
  //  savedAnswer: protectedProcedure.input(z.object({
  //    projectId:z.string()

  //  }))
  savedAnswer: protectedProcedure.input(z.object({
   projectId:z.string(),
   question:z.string(),
   answer:z.string(),
   filesReferences:z.any()

  })).mutation(async ({ctx,input})=>{
    const user = await ctx.user;
    return await ctx.db.question.create({
      data:{
        answer:input.answer,
        filesReferences:input.filesReferences,
        projectId:input.projectId,
        question:input.question,
        userId:user.userId!

      }
    })
  }),

  getQuestions:protectedProcedure.input(z.object({
    projectId:z.string()
  })).query(async ({ctx,input})=>{
          return await ctx.db.question.findMany({
            where:{
              projectId:input.projectId
            },
            include:{
              user:true
            },
            orderBy:{
            createdAt:'desc'
            }
          })
  }),
  archiveProject: protectedProcedure.input(z.object({
    projectId:z.string()
  })).mutation(async ({ctx,input})=>{
    return await ctx.db.project.update({
       where:{
        id:input.projectId
       },
       data:{
        deletedAt: new Date()
       }
    })
  }),
  getTeamMembers:protectedProcedure.input(z.object({
    projectId:z.string()
  })).query(async ({ctx,input})=>{
    return ctx.db.userToProject.findMany({
      where:{
        projectId:input.projectId
      },
      include:{
        user:true
      }
    })
  }),

  getMyCredits: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.user;
    return await ctx.db.user.findUnique({
      where: {
        id: user.userId!
      },
      select: {
       credits: true
      }
    });
  }),
  checkCredits:protectedProcedure.input(z.object({
githubUrl:z.string(),
githubToken:z.string().optional()

  })).mutation(async ({ctx,input})=>{
    const user = await ctx.user;
    const fileCount= await checkCredits(input.githubUrl, input.githubToken)
    const userCredits=await ctx.db.user.findUnique({
      where:{
        id: user.userId!
      },
      select:{
        credits:true
      }
    })

    return {
      fileCount,
      userCredits:userCredits?.credits || 0
    }
  })
});
