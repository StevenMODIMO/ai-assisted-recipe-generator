import AuthForm from "@/components/auth-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Signup() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/recipe");
  return (
    <div>
      <AuthForm type="signup" />
    </div>
  );
}
