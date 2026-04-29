'use client'
import axios from "axios"
import { useState } from "react"

interface User {
    userName : string , 
    name : string ,
}

export default function searchingPage(){
    const [filter , setFilter] = useState("")
    const [users , setUsers] = useState<User[]>([])
    const [loading , setLoading] = useState(false)

    async function handleFollow(userName  : string){
        setLoading(true)
        try {
            await axios.put("/api/user/followUser" , {otherUserName : userName})
        } finally {
            setLoading(false)
        }
    }
    async function findUsers(){
        setLoading(true)
        try {
            const res = await axios.get("/api/user/filterOtherUser" , {params : {filter}});
            const data = res.data.response 
            setUsers(data)   
        }
        finally {
            setLoading(false)
        }
    }

    return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center p-8">
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">

            <h2 className="text-slate-100 text-2xl font-bold mb-7 tracking-wide">
                Find Users
            </h2>

            {/* Search Row */}
            <div className="flex gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-500"
                />
                <button
                    onClick={findUsers}
                    disabled={loading}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
                >
                    {loading ? "..." : "Search"}
                </button>
            </div>

            {/* Results */}
            <div className="flex flex-col gap-2">
                {users.length === 0 && !loading && (
                    <p className="text-slate-500 text-sm text-center py-6">
                    No users found.
                    </p>
                )}

                {users.map((user) => (
                    <div
                        key={user.userName}
                        className="flex justify-between items-center px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg w-full text-left hover:bg-slate-700/50 hover:border-slate-600 transition-all"
                    >
                        <span className="text-indigo-400 text-sm font-mono">
                        @{user.userName}
                        </span>
                        <span className="text-slate-400 text-sm">{user.name}</span>
                        <button
                            onClick={() => handleFollow(user.userName)}
                            disabled={loading}
                            className="text-sm px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95"
                        >
                        Follow
                        </button>
                    </div>
                    ))}
            </div>

        </div>
    </div>
    )
}