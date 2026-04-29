import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse , NextRequest } from "next/server";

export async function DELETE(req : NextRequest){

    const postId = req.nextUrl.searchParams.get("postId")

    const session = await getServerSession(authOptions) ;
    if(!session || !session.user){
        return NextResponse.json(
            {"response" : "Unauthorize"} , 
            {status : 401} 
        )
    }

    const userId = (session.user as any).id ;
    if(!userId || !postId){
        return NextResponse.json(
            {"response" : "Invalid userId"} ,
            {status : 401}
        )
    }

    try {
        const user = await prisma.user.findFirst({
            where : {userId : userId}
        })

        if(!user) throw new Error("Unauthorize") ;

        await prisma.$transaction([
            prisma.like.deleteMany({
                where: { atId: postId }
            }),
            prisma.comment.deleteMany({
                where: { atId: postId }
            }),
            prisma.post.delete({
                where: { id: postId }
            })
        ])

        return NextResponse.json(
            {"response" : "Post has been deleted successfully !"} ,
            {status : 200}
        )
    } 
    catch (error : any) {
        console.log(error)
        return NextResponse.json(
            {"response" : error.message } ,
            {status : 500}
        )
    }
}