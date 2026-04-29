import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import {NextResponse , NextRequest} from "next/server"

export async function PUT(req : NextRequest){

    const { postId } = await req.json() 

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
            {"response" : "User ID not found"} ,
            {status : 401}
        )
    }
    
    try {
        // this is the thing that u need to watch
        await prisma.like.create({
            data : {
                at : {
                    connect: { id: postId }
                } 
            }
        })
        return NextResponse.json(
            {"response" : "Liked the post ! " } ,
            { status : 200 }
        )
    } 
    catch (error : any) {
        return NextResponse.json(
            {"response" : error.message} ,
            { status : 500 }
        )
    }

}