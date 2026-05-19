"use server"

// why do i explicitly need to define "use server" ?

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function signUp(userName : string , password : string , name : string){

    try {
        const user = await prisma.user.create({
            data : {
                userName : userName ,
                password : password ,
                name : name
            }
        })
        return user;
    } 
    catch (error : any) {
        console.error("SignUp Error:", error.message);
        throw error;
    }
    
}