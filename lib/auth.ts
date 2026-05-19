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
                console.log("======== AUTHORIZE START ========");
                console.log("Received credentials:", { 
                    username: credentials?.username, 
                    password: credentials?.password ? "***" : "undefined"
                });
                
                if (!credentials?.username || !credentials?.password) {
                    console.log("ERROR: Missing username or password");
                    return null;
                }
                
                try {
                    const user = await prisma.user.findFirst({
                        where : {
                            userName : credentials.username,
                            password : credentials.password
                        }
                    });
                    
                    console.log("Database query result:", user?.userName || "NOT FOUND");
                    
                    if (!user) {
                        console.log("User not found in database for username:", credentials.username);
                        return null;
                    }
                    
                    console.log("User authenticated successfully:", user.userName);
                    console.log("======== AUTHORIZE END ========");
                    
                    return { userName : user.userName, id : user.userId };
                } catch (error: any) {
                    console.error("ERROR in authorize:", error.message);
                    return null;
                }
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
            
            // When user logs in, create a fresh new token (works for both credentials and other providers)
            if(user) {
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
            console.log("======== SESSION CALLBACK ========");
            console.log("Token:", token ? { id: token.id, userName: token.userName } : "null");
            console.log("Session user before:", session.user?.userName);
            
            // If no valid token, return null (no session)
            if(!token || !token.id){
                console.log("ERROR: No valid token, returning null session");
                return null;
            }
            
            // Create fresh session object from token
            session.user = {
                id: token.id,
                userName: token.userName,
                email: token.email || null
            }
            
            console.log("Session user after:", session.user?.userName);
            console.log("======== SESSION CALLBACK END ========");
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