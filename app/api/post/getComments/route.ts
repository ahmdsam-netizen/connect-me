import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){
    const postId = req.nextUrl.searchParams.get("postId")
    if(!postId){
        return NextResponse.json(
            {"response" : "nothing"} ,
            {status : 401}
        )
    }

    try {
        const comments = await prisma.comment.findMany({
            where : {
                atId : postId
            }
        })

        return NextResponse.json(
            {"response" : comments.map((comment) => comment)} ,
            {status : 200}
        )
    } catch (error : any) {
        return NextResponse.json(
            {"response" : error.message},
            {status : 500}
        )
    }
}