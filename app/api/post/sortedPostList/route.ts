import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse , NextRequest } from "next/server";

export async function GET(req : NextRequest){

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

    if(!userId){
        return NextResponse.json(
            {"response" : "Invalid user"} ,
            {status : 411} 
        )
    }

    try {

        const myFollowing = await prisma.connection.findMany({
            where : {
                byId : userId
            }
        })
        
        const followingIds = myFollowing.map(con => con.toId)
        
        // Here there is something new that is been used 
        const list = await prisma.post.findMany({
            where : {
                authorId : {
                    in : followingIds
                }
            },
            orderBy : {
                postedAt : 'desc'
            },
            include: {
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            }
        })
        return NextResponse.json(
            {"response" : list.map((l) => ({
                id : l.id ,
                authorId : l.authorId ,
                content : l.content ,
                likes : l._count.likes ,
                comments : l._count.comments ,
                postedAt : l.postedAt
            }))} , 
            {status : 200}
        )
    } 
    catch (error : any) {
        return NextResponse.json(
            {"response" : error.message} ,
            {status : 5000}
        )
    }

}