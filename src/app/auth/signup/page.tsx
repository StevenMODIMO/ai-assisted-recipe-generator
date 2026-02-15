import AuthForm from "@/components/auth-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Signup() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/recipe");
  return (
    <div>
      <Suspense fallback={<div>Unknown Error has Occured</div>}>
        <AuthForm type="signup" />
      </Suspense>
    </div>
  );
}
