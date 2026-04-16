import { NextRequest, NextResponse } from "next/server";
import { UserModel } from "@/lib/db/models/user";
import jwt from "jsonwebtoken";

import { signupSchema } from "@/lib/schemas/auth";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Schema validation
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 },
      );
    }
    
    const { fullName, email, password } = validation.data;
    const trimmedEmail = email.trim();

    // Create user
    const userId = await UserModel.create({
      fullName,
      email: trimmedEmail,
      passwordHash: password,
      isActive: true,
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: userId.toString(), email: trimmedEmail },
      env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json(
      {
        message: "User created successfully",
        token,
        userId: userId.toString(),
        user: {
          id: userId.toString(),
          fullName,
          email: trimmedEmail,
          isActive: true
        }
      },
      { status: 201 },
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error("Signup error:", error);

    if (error instanceof Error && error.message === "User already exists") {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create user", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
