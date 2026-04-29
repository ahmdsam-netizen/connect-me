import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req : NextRequest) {
    const session = await getServerSession(authOptions) 

    if(!session || !session.user){
        return NextResponse.json(
            {"response" : "Unauthorize"} ,
            {status : 401}
        )
    }
    const userId = (session.user as any).id

    if(!userId){
        return NextResponse.json(
            {"response" : "Invalid userId"} ,
            {status : 401}
        )
    }

    try {
        const myInfo = await prisma.user.findFirst({
            where : {
                userId : userId
            }
        })
        const posts = await prisma.post.findMany({
            where : {authorId : userId}
        })
        const followers = await prisma.connection.count({
            where : {toId : userId}
        })
        const followings = await prisma.connection.count({
            where : {byId : userId}
        })

        return NextResponse.json(
            {
                "response" : {
                    userName : myInfo?.userName ,
                    name : myInfo?.name ,
                    createdAt : myInfo?.createdAt ,
                    lastUpdated : myInfo?.updatedAt ,
                    posts : posts ,
                    followers : followers ,
                    followings : followings ,
                }
            } , 
            {status : 200}
        )
    } 
    catch (error : any) {
        return NextResponse.json(
            {"response" : error.message} , 
            {status : 500}
        )
    }
}