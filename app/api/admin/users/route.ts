import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/lib/db/models/user";
import { verifyAuth } from "@/lib/auth/verify";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const auth = verifyAuth(request);

        // Auth object holds the decrypted token data
        if (!auth || auth.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const users = await UserModel.getAllUsers(50);
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error("Admin users fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
