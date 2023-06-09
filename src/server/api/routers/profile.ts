import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from 'zod';
import clerkClient from "@clerk/clerk-sdk-node";
import { TRPCError } from "@trpc/server";
import { filterUserForClient } from "~/server/helpers/filterUserForClient";




export const profileRouter = createTRPCRouter({

    getUserByUsername: publicProcedure.input(z.object({username: z.string()})).
    query(async ({input}) => {
        const [user] = await clerkClient.users.getUserList({username: [input.username], limit: 1});
    
        if (!user) {
            throw new TRPCError({code: "NOT_FOUND", message: `Could not find user with username ${input.username}`})
        }

        return filterUserForClient(user);
    }
    ),
});
