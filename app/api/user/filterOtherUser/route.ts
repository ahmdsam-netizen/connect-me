import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){

    const filter = req.nextUrl.searchParams.get("filter") ;

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

    if(filter == null) {
        return NextResponse.json(
            {"response" : "Please send filter and userId !"} ,
            {status : 411}
        )
    }

    try {
        const users = await prisma.user.findMany({
            where : {
                AND : [
                    {OR : [
                        { userName : { contains : filter , mode : "insensitive" } } ,
                        { name : { contains : filter , mode : "insensitive" } } , 
                    ]} ,
                    {userId : {not : userId}}
                ]
            }
        }) ;

        return NextResponse.json({
            "response" : users 
        } , {status : 200})
    } 
    catch (error : any) {
        return NextResponse.json(
            {"response" : error.message } ,
            {status : 500}
        )
    }
    
}