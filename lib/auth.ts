import { betterAuth, type User } from 'better-auth'
import { createAuthMiddleware } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import * as schema from './db/schema'

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
                html: resetPasswordHtml(user.name, url)
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
                html: verifyEmailHtml(user.name, verifyUrl.toString())
            })
        },
        autoSignInAfterVerification: true
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
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
        from: process.env.SMTP_FROM ?? 'Travel Log <onboarding@resend.dev>',
        to,
        subject,
        html
    })
}

function emailBase(content: string) {
    return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
        <tr><td style="background:#0f172a;padding:24px 32px">
          <span style="font-size:18px;font-weight:700;color:#fff">✈ Travel Log</span>
        </td></tr>
        <tr><td style="padding:32px">${content}</td></tr>
        <tr><td style="padding:16px 32px 24px;border-top:1px solid #f1f5f9">
          <p style="margin:0;font-size:12px;color:#94a3b8">You received this email because an action was taken on your Travel Log account. If you didn't request this, ignore this email.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function verifyEmailHtml(name: string, url: string) {
    return emailBase(`
      <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a">Verify your email</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:15px">Hi ${name}, click the button below to activate your Travel Log account.</p>
      <a href="${url}" style="display:inline-block;padding:12px 28px;background:#10b981;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Verify Email</a>
      <p style="margin:24px 0 0;font-size:12px;color:#94a3b8">This link expires in 24 hours.</p>
    `)
}

function resetPasswordHtml(name: string, url: string) {
    return emailBase(`
      <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a">Reset your password</h2>
      <p style="margin:0 0 24px;color:#64748b;font-size:15px">Hi ${name}, we received a request to reset your password. Click the button below to set a new one.</p>
      <a href="${url}" style="display:inline-block;padding:12px 28px;background:#8b5cf6;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">Reset Password</a>
      <p style="margin:24px 0 0;font-size:12px;color:#94a3b8">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `)
}
