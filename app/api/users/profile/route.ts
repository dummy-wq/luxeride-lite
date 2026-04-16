import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/lib/db/models/user";
import { verifyAuth } from "@/lib/auth/verify";

export async function GET(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle synthetic admin user from hardcoded login
    if (auth.userId === "admin") {
      return NextResponse.json({
        user: {
          id: "admin",
          fullName: "System Administrator",
          email: "admin",
          role: "admin",
        },
      });
    }

    const user = await UserModel.findById(auth.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { passwordHash, ...userData } = user;

    return NextResponse.json({
      user: {
        id: user._id?.toString(),
        ...userData,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await request.json();

    if (auth.userId === "admin") {
      return NextResponse.json({
        message: "Admin profile cannot be updated in this demo",
        user: {
          id: "admin",
          fullName: "System Administrator",
          email: "admin",
          role: "admin",
        },
      });
    }

    // Prevent updating sensitive fields
    const { _id, createdAt, passwordHash, email, walletBalance, isActive, isBanned, role, ...safeUpdates } = updates;

    const updatedUser = await UserModel.updateProfile(auth.userId, safeUpdates);

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { passwordHash: _, ...userData } = updatedUser;

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id?.toString(),
        ...userData,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
