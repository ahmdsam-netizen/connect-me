"use client"
import { useSession } from "next-auth/react";
import { LogoutButton } from "./logoutButton";

export function Navbar() {
    const { data: session } = useSession();

    // Only show navbar if user is logged in
    if (!session) {
        return null;
    }

    return (
        <nav className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side - App title */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-indigo-400">Connect Me</h1>
                    </div>

                    {/* Right side - User info and logout */}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-slate-100">{(session.user as any)?.userName}</p>
                            <p className="text-xs text-slate-400">{session.user?.email || 'User'}</p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </nav>
    )
}
