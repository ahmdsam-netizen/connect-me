'use client'
import axios from "axios"
import { useState } from "react"

export default function CreatePostPage() {
  const [content, setContent] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function toPost() {
    setLoading(true)
    const res = await axios.post("/api/post/createPost", { content })
    setMessage(res.data.response)
    setLoading(false)
    setContent("")
  }

  const charLimit = 280

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">

        {/* Card */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">

          {/* Header */}
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">New Post</h1>
          <p className="text-sm text-slate-400 mb-6">Share what's on your mind</p>

          {/* Textarea */}
          <textarea
            rows={6}
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={charLimit}
            className="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />

          {/* Char counter */}
          <div className="flex justify-end mt-2 mb-6">
            <span className={`text-xs font-medium ${content.length >= charLimit ? 'text-red-400' : 'text-slate-400'}`}>
              {content.length}/{charLimit}
            </span>
          </div>

          {/* Post button */}
          <button
            onClick={toPost}
            disabled={!content.trim() || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900/50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Success message */}
        {message && (
          <div className="mt-6 px-5 py-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-300 text-sm text-center font-medium">
            ✓ {message}
          </div>
        )}

      </div>
    </div>
  )
}