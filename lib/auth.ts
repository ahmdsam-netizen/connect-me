import CredentialPorvider from "next-auth/providers/credentials"
import prisma from "./prisma";
import type { NextAuthOptions } from "next-auth";
import { SessionStrategy } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers : [
        CredentialPorvider({
            credentials : {
                username : { label : "username" , type : "text" , placeholder : "samTense3"} ,
                password : { label : "Password" , type : "password" , placeholder : "******"} ,
            } ,
            async authorize(credentials , req){
                console.log("Authorize: Checking credentials for:", credentials?.username);
                
                const user = await prisma.user.findFirst({
                    where : {
                        password : credentials?.password ,
                        userName : credentials?.username ,
                    }
                });
                
                if (!user) {
                    console.log("Authorize: User not found for:", credentials?.username);
                    return null;
                }
                
                console.log("Authorize: User found:", user.userName);
                // const isValid = await bcrypt.compare(credentials.password, user.password);
                // if (!isValid) return null;
                
                return { userName : user.userName, id : user.userId };

                // this return value is passed to jwt callback as user object
            } ,
        })
    ] ,
    secret : process.env.NEXTAUTH_SECRET , 

    session: {
        strategy: "jwt" as SessionStrategy,
        maxAge: 24 * 60 * 60, // 24 hours
    },

    jwt: {
        maxAge: 24 * 60 * 60, // 24 hours
    },

    pages : {
        signIn : "/signin" ,
        newUser : "/signup" ,
    } ,

    callbacks : {
        async jwt({token , user , trigger , account} : any){
            // When signing out, completely clear the token
            if(trigger === "signOut") {
                console.log("JWT: Signing out, clearing token");
                return null;
            }
            
            // When user logs in, create a fresh new token
            if(user && account) {
                console.log("JWT: New login detected for user:", user.userName);
                const newToken = {
                    id : user.id,
                    userName : user.userName,
                    iat : Math.floor(Date.now() / 1000),
                    exp : Math.floor(Date.now() / 1000) + (24 * 60 * 60),
                    jti: `${user.id}-${Math.random().toString(36).substr(2, 9)}`, // Unique token ID
                };
                return newToken;
            }
            
            // Return existing token on refresh
            return token ;
        },

        async session({session , token} : any){
            // If no valid token, return null (no session)
            if(!token || !token.id){
                console.log("Session: No valid token");
                return null;
            }
            
            // Create fresh session object
            if(session.user) {
                session.user.id = token.id ;
                session.user.userName = token.userName
            }
            return session ;
        },

        async signIn({ user , account} : any) {
            console.log("SignIn: User attempting login:", user?.userName);
            // Validate user before login
            if(!user || !user.id || !user.userName) {
                console.log("SignIn: Invalid user data");
                return false;
            }
            console.log("SignIn: User validation passed");
            return true;
        }
    },

    events: {
        async signOut() {
            // Properly clears all NextAuth cookies
        }
    },

    cookies: {
        sessionToken: {
            name: 'next-auth.session-token',
            options: {
                httpOnly: true,
                secure: false, // Set to true in production with HTTPS
                sameSite: 'lax',
                path: '/',
                maxAge: 24 * 60 * 60, // 24 hours
            }
        }
    }
}