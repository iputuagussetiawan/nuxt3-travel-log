import { betterAuth, type User } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import * as schema from './db/schema'

export type UserWithId = Omit<User, 'id'> & { id: string }

export const auth = betterAuth({
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
                html: resetPasswordHtml(user.name, url)
            })
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmail({
                to: user.email,
                subject: 'Verify your Travel Log email',
                html: verifyEmailHtml(user.name, url)
            })
        }
    }
})

async function sendEmail({
    to,
    subject,
    html
}: {
    to: string
    subject: string
    html: string
}) {
    const { createTransport } = await import('nodemailer')
    const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    })
    await transporter.sendMail({
        from: process.env.SMTP_FROM ?? '"Travel Log" <no-reply@travellog.dev>',
        to,
        subject,
        html
    })
}

function verifyEmailHtml(name: string, url: string) {
    return `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2>Hi ${name},</h2>
      <p style="color:#555">Please verify your email to activate your Travel Log account.</p>
      <a href="${url}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#8b5cf6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Verify Email</a>
    </div>`
}

function resetPasswordHtml(name: string, url: string) {
    return `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
      <h2>Hi ${name},</h2>
      <p style="color:#555">We received a request to reset your Travel Log password.</p>
      <a href="${url}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#8b5cf6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
      <p style="margin-top:24px;color:#888;font-size:12px">This link expires in 1 hour.</p>
    </div>`
}
