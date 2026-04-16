import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { verifyAuth } from "@/lib/auth/verify";
import { ObjectId } from "mongodb";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = verifyAuth(request);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const carData = await request.json();
        const { db } = await connectToDatabase();

        // Remove _id from data if present to avoid immutable update error
        const { _id, ...updateData } = carData;

        await db.collection("cars").updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update car" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = verifyAuth(request);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { db } = await connectToDatabase();

        await db.collection("cars").deleteOne({ _id: new ObjectId(id) });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete car" }, { status: 500 });
    }
}
