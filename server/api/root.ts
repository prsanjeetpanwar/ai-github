
import { ProjectRouter } from "./routers/project";
import { createCallerFactory, createTRPCRouter } from "./trpc";


export const appRouter = createTRPCRouter({

project:ProjectRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
