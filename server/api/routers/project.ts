import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { pullCommit } from "@/lib/github";

export const ProjectRouter = createTRPCRouter({
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
      return await ctx.db.commit.findMany({
        where:{
          projectId:input.projectId
        }
      })
    })
});