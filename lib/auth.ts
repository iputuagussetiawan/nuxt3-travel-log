import { betterAuth, type User } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import * as schema from './db/schema'
import { verifyEmailTemplate, resetPasswordTemplate } from './email-templates'
import { sendEmail } from './send-email'

export type UserWithId = Omit<User, 'id'> & { id: string }

export const auth = betterAuth({
    user: {
        additionalFields: {
            role: {
                type: 'string',
                required: false,
                defaultValue: 'user',
                input: false
            }
        }
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === 'get-session') {
                if (!ctx.context.session) {
                    return ctx.json({ session: null, user: null })
                }
                return ctx.json(ctx.context.session)
            }
        })
    },
    database: drizzleAdapter(db, { provider: 'pg', schema }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: 'Reset your Travel Log password',
                html: resetPasswordTemplate(user.name, url)
            })
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            const verifyUrl = new URL(url)
            verifyUrl.searchParams.set('callbackURL', '/verify-email')
            await sendEmail({
                to: user.email,
                subject: 'Verify your Travel Log email',
                html: verifyEmailTemplate(user.name, verifyUrl.toString())
            })
        },
        autoSignInAfterVerification: true
    }
})
