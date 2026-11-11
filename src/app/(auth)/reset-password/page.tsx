import PasswordResetForm from "@/components/password-reset-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; token?: string }>;
}) {
  const params = await searchParams;
  return (
    <PasswordResetForm
      mode="reset"
      email={params.email}
      token={params.token}
    />
  );
}
