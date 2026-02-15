import AuthForm from "@/components/auth-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Login({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (session) redirect("/recipe");
    const params = await searchParams;   // 👈 unwrap promise
  const error = params?.error ? decodeURIComponent(params.error) : null;
  return (
    <div>
      <AuthForm type="login" serverError={error!} />
    </div>
  );
}
