import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        // Get userId from query parameters

        // const session = await getServerSession(authOptions) 
        // if(!session || !session.user){
        //     return NextResponse.json(
        //         {"response" : "Unauthorize"} ,
        //         {status : 401}
        //     )
        // }
        
        const userId = req.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { "response": "userId is required" },
                { status: 400 }
            )
        }

        // Fetch user from database
        const user = await prisma.user.findUnique({
            where: {
                userId: userId
            },
            select: {
                userId: true,
                userName: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                // Don't select password for security
            }
        })

        if (!user) {
            return NextResponse.json(
                { "response": "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {"response": user},
            { status: 200 }
        )

    } catch (error: any) {
        console.error("Error fetching user:", error.message);
        return NextResponse.json(
            { "response": error.message || "Failed to fetch user" },
            { status: 500 }
        )
    }
}
