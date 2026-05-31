function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}

function safeUrl(url: string): string {
    try {
        const u = new URL(url)
        if (u.protocol !== 'https:' && u.protocol !== 'http:') return '#'
        return url
    } catch {
        return '#'
    }
}

function base(previewText: string, content: string) {
    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="x-apple-disable-message-reformatting"/>
  <title>Travel Log</title>
  <span style="display:none;max-height:0;overflow:hidden">${escapeHtml(previewText)}</span>
</head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:40px 16px">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px">

        <!-- Logo -->
        <tr>
          <td style="padding:0 0 24px 4px">
            <table role="presentation" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:middle;padding-right:8px">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" style="display:block">
                    <line x1="208" y1="128" x2="128" y2="208" stroke="#10b981" stroke-linecap="round" stroke-width="32" fill="none"/>
                    <line x1="192" y1="40" x2="40" y2="192" stroke="#10b981" stroke-linecap="round" stroke-width="32" fill="none"/>
                  </svg>
                </td>
                <td style="vertical-align:middle">
                  <span style="font-size:16px;font-weight:700;color:#0f172a;letter-spacing:-0.01em">Travel Log</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#ffffff;border-radius:12px;border:1px solid #e4e7ec;overflow:hidden">

            <!-- Card body -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:40px 40px 32px">
                ${content}
              </td></tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 4px 0">
            <p style="margin:0;font-size:12px;color:#9aa3af;line-height:1.7">
              You received this email because an action was taken on your Travel Log account.
              If you didn't request this, you can safely ignore this email.
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#c4cad2">
              © ${new Date().getFullYear()} Travel Log &nbsp;·&nbsp; iputuagussetiawan.com
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`
}

function cta(label: string, url: string, color: string) {
    const safe = safeUrl(url)
    return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 24px">
      <tr>
        <td style="border-radius:8px;background:${color}">
          <a href="${safe}"
             style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;letter-spacing:0.01em;line-height:1.5">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`
}

function fallback(url: string) {
    const safe = safeUrl(url)
    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-top:1px solid #f0f2f5">
      <tr><td style="padding-top:20px">
        <p style="margin:0 0 6px;font-size:12px;color:#9aa3af">Button not working? Paste this link into your browser:</p>
        <p style="margin:0;font-size:12px;word-break:break-all">
          <a href="${safe}" style="color:#6366f1;text-decoration:none">${escapeHtml(safe)}</a>
        </p>
      </td></tr>
    </table>`
}

// ── Templates ──────────────────────────────────────────────────────────────────

export function verifyEmailTemplate(name: string, url: string) {
    const safeName = escapeHtml(name)
    return base(
        'Verify your email to activate your Travel Log account.',
        `
      <p style="margin:0 0 20px;font-size:13px;font-weight:600;color:#10b981;letter-spacing:0.06em;text-transform:uppercase">Email Verification</p>
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3">Verify your email address</h1>
      <p style="margin:0 0 6px;font-size:15px;color:#374151;line-height:1.6">Hi <strong>${safeName}</strong>,</p>
      <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.7">
        Thanks for creating a Travel Log account. Please verify your email address to get started — it only takes a second.
      </p>
      ${cta('Verify Email Address', url, '#10b981')}
      <p style="margin:0;font-size:13px;color:#9aa3af;line-height:1.6">
        This link expires in <strong style="color:#6b7280">24 hours</strong>.
      </p>
      ${fallback(url)}
    `
    )
}

export function resetPasswordTemplate(name: string, url: string) {
    const safeName = escapeHtml(name)
    return base(
        'Reset your Travel Log password.',
        `
      <p style="margin:0 0 20px;font-size:13px;font-weight:600;color:#8b5cf6;letter-spacing:0.06em;text-transform:uppercase">Password Reset</p>
      <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3">Reset your password</h1>
      <p style="margin:0 0 6px;font-size:15px;color:#374151;line-height:1.6">Hi <strong>${safeName}</strong>,</p>
      <p style="margin:0;font-size:15px;color:#6b7280;line-height:1.7">
        We received a request to reset the password for your Travel Log account. Click the button below to choose a new password.
      </p>
      ${cta('Reset Password', url, '#8b5cf6')}
      <p style="margin:0;font-size:13px;color:#9aa3af;line-height:1.6">
        This link expires in <strong style="color:#6b7280">1 hour</strong>.
        If you didn't request a password reset, no action is needed — your password will remain unchanged.
      </p>
      ${fallback(url)}
    `
    )
}
