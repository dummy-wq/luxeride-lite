import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/lib/db/models/user";
import { verifyAuth } from "@/lib/auth/verify";

// Handle admin actions (ban, timeout, delete)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = verifyAuth(request);
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { action, minutes } = body;

        if (action === "ban") {
            await UserModel.toggleStatus(id, true);
        } else if (action === "unban") {
            await UserModel.toggleStatus(id, false);
        } else if (action === "timeout") {
            await UserModel.timeoutUser(id, minutes || 30);
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({ message: `User ${action}ned successfully` });
    } catch (error) {
        console.error("Admin user patch error:", error);
        return NextResponse.json({ error: "Action failed" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const auth = verifyAuth(request);
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        await UserModel.deleteUser(id);

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Admin user delete error:", error);
        return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
    }
}
