import AuthForm from "@/components/auth-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Suspense } from "react";

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
      <Suspense fallback={<div>Unknown Error has Occured</div>}>
        <AuthForm type="login" serverError={error!} />
      </Suspense>
    </div>
  );
}
