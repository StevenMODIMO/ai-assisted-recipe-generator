import AuthForm from "@/components/auth-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Login({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) redirect("/recipe");
  const error = searchParams?.error
    ? decodeURIComponent(searchParams.error)
    : null;
  return (
    <div>
      <AuthForm type="login" serverError={error!} />
    </div>
  );
}
