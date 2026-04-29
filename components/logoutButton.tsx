"use client"
import { signOut } from "next-auth/react";

export function LogoutButton() {
    
    async function handleLogout() {
        try {
            // Clear all client-side storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear all cookies
            document.cookie.split(";").forEach(function(c) {
                document.cookie = c
                    .replace(/^ +/, "")
                    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            // Sign out
            await signOut({ 
                redirect: false,
            });
            
            // Hard refresh to signin page
            window.location.href = '/signin';
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = '/signin';
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
        >
            Sign Out
        </button>
    )
}
