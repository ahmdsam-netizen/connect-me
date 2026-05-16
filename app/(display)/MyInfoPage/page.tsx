"use client"
import axios from "axios";
import { useEffect, useState } from "react"
import { PostComponent } from "@/components/post"

interface Post {
  id: string
  postedAt : Date | string | null
  content: string
  likes: number
  comments: number
  authorId : string | number
}

export default function myInfo(){

    const [userName , setUserName] = useState("") 
    const [name , setName] = useState("") 
    const [posts , setPosts] = useState<Post[]>([])
    const [followers , setFollowers] = useState(0) 
    const [followings , setFollowings] = useState(0)  
    const [whileDeleting , setWhileDeleting] = useState(false)
    const [isLoading , setIsLoading] = useState(false) 

    useEffect(() => {
        async function getData(){
            try {
                setIsLoading(true) ;
                const res = await axios.get("/api/user/aboutMe") ;
                const data = res.data.response ;
                setUserName(data.userName) 
                setName(data.name) 
                setPosts(data.posts) 
                setFollowers(data.followers) 
                setFollowings(data.followings) 
            } 
            catch (error) {
                console.log("Failed to fetch info")
            } finally {
                setIsLoading(false)
            }
        }
        getData() ;
    } , [])

    async function toDeletePost(postId : string){
        setWhileDeleting(true)
        try {
            await axios.delete("/api/post/deletePost", { params: { postId } })
            // Remove the deleted post from the list
            setPosts(prev => prev.filter(p => p.id !== postId))
        } catch (error) {
            console.error("Failed to delete post:", error)
            alert("Failed to delete post")
        } finally {
            setWhileDeleting(false)
        }
    }

    if (isLoading) {
        return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
            <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-slate-400 text-lg">Loading posts...</p>
            </div>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 p-8">
            {/* User Profile Header */}
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8 mb-8">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-indigo-400 mb-2">{name}</h1>
                    <p className="text-xl text-slate-400 mb-8">@{userName}</p>
                    
                    {/* Stats */}
                    <div className="flex gap-8 justify-center w-full">
                        <div className="text-center px-6 py-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <p className="text-3xl font-bold text-indigo-400">{posts.length}</p>
                            <p className="text-slate-400 text-sm mt-1">Posts</p>
                        </div>
                        <div className="text-center px-6 py-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <p className="text-3xl font-bold text-emerald-400">{followers}</p>
                            <p className="text-slate-400 text-sm mt-1">Followers</p>
                        </div>
                        <div className="text-center px-6 py-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <p className="text-3xl font-bold text-cyan-400">{followings}</p>
                            <p className="text-slate-400 text-sm mt-1">Following</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Posts Section */}
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-indigo-400 mb-6">My Posts</h2>
                {posts.length === 0 ? (
                    <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 text-center">
                        <p className="text-slate-400 text-lg">No posts yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div key={post.id} className="group">
                                <div className="flex gap-3 mb-3">
                                    <button
                                        disabled={whileDeleting}
                                        onClick={() => toDeletePost(post.id)}
                                        className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <PostComponent
                                    key={post.id}
                                    post={post}
                                    onLikesUpdate={(postId, newCount) => {
                                        setPosts(prev =>
                                            prev.map(p => p.id === postId ? { ...p, likes: (newCount) } : p)
                                        )
                                    }}
                                    onCommentsUpdate={(postId, newCount) => {
                                        setPosts(prev =>
                                            prev.map(p => p.id === postId ? { ...p, comments: (newCount) } : p)
                                        )
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}