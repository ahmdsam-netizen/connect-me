import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { error } from "console"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req : NextRequest){

    const {otherUserName} = await req.json() 

    console.log(otherUserName)

    if(otherUserName == null){
        return NextResponse.json(
            {"response" : "User not found"} ,
            {status : 401}
        )
    }
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

        const otherUser = await prisma.user.findFirst({
            where : {userName : otherUserName}
        })

        if(!otherUser){
            throw error("User not found")
        }

        await prisma.connection.create({
            data : {
                toId : otherUser.userId ,
                byId : userId 
            }
        })

        return NextResponse.json(
            {"response" : "You start following !"} ,
            {status : 200} 
        )

    } catch (error : any) {
        return NextResponse.json(
            {"response" : error.message} ,
            {status : 500} 
        )
    }

}