import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req : NextRequest){

    const {content} = await req.json() ;
    console.log(content)
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
        return NextResponse.json(
            {"response" : "Unauthorized"} ,
            { status : 401 }
        )
    }
    
    const userId = (session.user as any).id
    
    if (!userId) {
        return NextResponse.json(
            {"response" : "User ID not found in session"} ,
            { status : 401 }
        )
    }
    console.log(session)
    console.log(userId)

    
    try {
        await prisma.post.create({
            data : {
                content : content , 
                authorId : userId ,
            }
        })
        return NextResponse.json(
            {"response" : "Post has been uploaded successfully ! "} ,
            { status : 200 }
        )
    } 
    catch (error : any) {
        console.log("hellow")

        return NextResponse.json(
            {"response" : error.message} ,
            { status : 500 }
        )
    }
}