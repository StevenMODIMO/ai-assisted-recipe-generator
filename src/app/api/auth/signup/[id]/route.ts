import { type NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const { id } = await params;
  try {
    const user = await User.findOneAndDelete({ _id: id }, { new: true });
    return NextResponse.json("user deleted successfully");
  } catch (error) {
    return NextResponse.json(error);
  }
}
