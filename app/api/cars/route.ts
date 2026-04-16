import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { verifyAuth } from "@/lib/auth/verify";
import { cars as initialCars } from "@/template/catalog";

// Helper to get all cars
export async function GET() {
    try {
        const { db } = await connectToDatabase();
        let cars = await db.collection("cars").find({}).toArray();
        
        // Auto-seed if empty
        if (cars.length === 0) {
            console.log("Seeding cars collection...");
            await db.collection("cars").insertMany(initialCars.map(c => ({
                ...c,
                createdAt: new Date(),
                updatedAt: new Date()
            })));
            cars = await db.collection("cars").find({}).toArray();
        }

        return NextResponse.json({ cars });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
    }
}

// Protected POST to add a car
export async function POST(request: NextRequest) {
    try {
        const user = verifyAuth(request);
        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const carData = await request.json();
        const { db } = await connectToDatabase();
        
        const result = await db.collection("cars").insertOne({
            ...carData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add car" }, { status: 500 });
    }
}
