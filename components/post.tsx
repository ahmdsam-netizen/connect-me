"use client"
import axios from "axios";
import { useEffect, useState } from "react"

interface Comment {
    id : string ,
    writtenData : string ,
    atTime : Date
}

interface Post {
  id: string
  postedAt : Date | string | null
  content: string
  likes: number
  comments: number
  authorId: string | number
}

interface PostComponentProps {
  post: Post
  onLikesUpdate?: (postId: string, newLikesCount: number) => void
  onCommentsUpdate?: (postId: string, newCommentsCount: number) => void
}

// Helper function to format date to relative time
function formatRelativeTime(date: Date | string): string {
  const postDate = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return postDate.toLocaleDateString();
}

export function PostComponent({ post, onLikesUpdate, onCommentsUpdate }: PostComponentProps) {
  const [userName , setUserName] = useState("Anonymous")
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [commentInput, setCommentInput] = useState("")
  const [commentsList, setCommentsList] = useState<Comment[]>([])
  const [likesCount, setLikesCount] = useState(post.likes)
  const [isLoading, setIsLoading] = useState(false)

  // Format date to relative time
  const formattedDate = post.postedAt ? formatRelativeTime(post.postedAt) : "Recently"

  useEffect(() => {
    async function getUserName(){
        try {
            setIsLoading(true)
            const res = await axios.get("/api/user/getUserWithUserId" , {params : {userId : post.authorId}})
            setUserName(res.data.response.userName)
        } finally {
            setIsLoading(false)
        }
    }
    getUserName() ;
  } ,[])

  async function handleLike() {
    if (isLoading) return
    try {
      setIsLoading(true)
      await axios.put("/api/post/likeOnPost", { postId: post.id })
      const newCount = likesCount + 1
      setLikesCount(newCount)
      onLikesUpdate?.(post.id, newCount)
    } catch (err) {
      console.error("Failed to like post", err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAddComment() {
    const trimmedComment = commentInput.trim()
    if (!trimmedComment) return

    try {
      setIsLoading(true)
      await axios.post("/api/post/commentOnPost", { 
        postId: post.id, 
        comment: trimmedComment 
      })
      setCommentInput("")
      onCommentsUpdate?.(post.id, commentsList.length + 1)
    } catch (err) {
      console.error("Failed to add comment", err)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleOpenComments() {
    if (isCommentsOpen) {
      setIsCommentsOpen(false)
      return
    }
    try {
      setIsLoading(true)
      const res = await axios.get("/api/post/getComments", { 
        params: { postId: post.id } 
      })
      setCommentsList(res.data.response)
      console.log(res.data.response)
      setIsCommentsOpen(true)
    } catch (err) {
      console.error("Failed to fetch comments", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-xl border border-slate-700 hover:border-slate-600 transition-all p-6">
      {/* Post Header with Author and Date */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-indigo-400">
            {userName}
          </p>
          <h3 className="text-xs text-slate-500">{formattedDate}</h3>
        </div>
      </div>

      {/* Post Content */}
      <p className="text-slate-100 text-base mb-5 leading-relaxed">{post.content}</p>

      {/* Post Stats */}
      <div className="flex gap-6 border-t border-slate-700 pt-4">
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLoading}
          className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">❤️</span>
          <span className="font-semibold text-sm">{likesCount}</span>
          <span className="text-xs text-slate-500">Like{likesCount !== 1 ? 's' : ''}</span>
        </button>

        {/* Comments Toggle Button */}
        <button
          onClick={handleOpenComments}
          disabled={isLoading}
          className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
          <span className="font-semibold text-sm">{commentsList.length}</span>
          <span className="text-xs text-slate-500">Comment{commentsList.length !== 1 ? 's' : ''}</span>
        </button>
      </div>

      {/* Comments Section */}
      {isCommentsOpen && (
        <div className="mt-4 border-t border-slate-700 pt-4 flex flex-col gap-3">
          {/* Comments List */}
          <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
            {commentsList.length === 0 ? (
              <p className="text-slate-500 text-sm italic">No comments yet. Be the first to comment!</p>
            ) : (
              commentsList.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 break-words hover:bg-slate-700/50 transition-colors"
                >
                  {comment.writtenData}
                </div>
              ))
            )}
          </div>

          {/* Add Comment Input */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleAddComment()}
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-slate-700 bg-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleAddComment}
              disabled={isLoading || !commentInput.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-md"
            >
              {isLoading ? "..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
