"use client"
import axios from "axios";
import { useEffect, useState } from "react"
import { PostComponent } from "@/components/post"

interface Posts {
  id: string
  postedAt : Date | string | null
  content: string
  likes: number
  comments: number
  authorId : string | number
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Posts[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true)
        const res = await axios.get("/api/post/sortedPostList")
        setPosts(res.data.response)
      } catch (err) {
        console.error("Failed to fetch posts", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950">
      <div className="flex flex-col gap-4 p-4 max-w-3xl mx-auto pb-24">
        {posts.length === 0 ? (
          <div className="flex items-center justify-center min-h-96">
            <p className="text-slate-500 text-lg">No posts available</p>
          </div>
        ) : (
          posts.map((post) => (
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
          ))
        )}
      </div>
    </div>
  )
}