import { Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function UPDATE(req : NextRequest){

    const { name , userName , userId} = await req.json() ;

    const data : any = {} ;
    if(name !== undefined) data.name = name ;
    if(userName !== undefined) data.userName = userName ;

    try {
        await prisma.user.update({
            where : {
                userId : userId
            } , 
            data
        })

        NextResponse.json(
            {"response" : "Successfully updated !"} , 
            {status : 200}
        )
    } 
    catch (error : any) {

        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if (error.code === "P2002") {
                return NextResponse.json(
                    { error: "Username already taken" },
                    { status: 400 }
                );
            }
        }
        NextResponse.json(
            {"response" : error.message} ,
            {status : 500}
        )
    }
}