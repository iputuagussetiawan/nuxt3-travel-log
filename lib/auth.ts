import { betterAuth, type User } from "better-auth";
import { createAuthMiddleware } from 'better-auth/plugins'
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your drizzle instance
import * as schema from './db/schema'

export type UserWithId = Omit<User, 'id'> & {
    id: string
}

export const auth = betterAuth({
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === 'get-session') {
                if (!ctx.context.session) {
                    return ctx.json({
                        session: null,
                        user: null
                    })
                }
                return ctx.json(ctx.context.session)
            }
        })
    },
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
        schema,
    }),
    socialProviders: { 
        github: { 
            clientId: process.env.GITHUB_CLIENT_ID as string, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
        }, 
    }, 
});