function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendPasswordResetEmail(email: string, resetUrl: URL) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.RESEND_FROM_EMAIL ??
    (process.env.NODE_ENV === "production"
      ? undefined
      : "Recipely <onboarding@resend.dev>");

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is required in production.");
  }

  const safeUrl = escapeHtml(resetUrl.toString());
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Reset your Recipely password",
      text: `Use this link to reset your Recipely password. It expires in 30 minutes: ${resetUrl}`,
      html: `<p>We received a request to reset your Recipely password.</p><p><a href="${safeUrl}">Reset your password</a></p><p>This link expires in 30 minutes. If you did not request a reset, you can ignore this email.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend email request failed with status ${response.status}.`);
  }
}
