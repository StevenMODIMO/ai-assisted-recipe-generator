import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "You must be signed in." }, { status: 401 });
    }

    const { id } = await params;
    if (id !== session.user.id) {
      return NextResponse.json({ message: "You can only delete your own account." }, { status: 403 });
    }

    await dbConnect();
    const user = await User.findOneAndDelete({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "Account not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Account deletion failed:", error);
    return NextResponse.json(
      { message: "Unable to delete your account right now." },
      { status: 500 },
    );
  }
}
