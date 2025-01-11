import { z } from "zod"; 
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ProjectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(z.object({
   name:z.string(),
   githubUrl:z.string(),
   githubToken:z.string().optional(),

    }))
    .mutation(async ({ ctx, input }) => {
      const userId = (await ctx.user).userId;
      console.log(`Creating project for user: ${userId}`);
      console.log('Inside createProject mutation');
      console.log(ctx);
      console.log(input);
      return true;
    })
});