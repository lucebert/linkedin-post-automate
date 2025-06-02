'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface Post {
  id: string
  content: string
  imageUrl?: string
  platform: string
  tone?: string
  createdAt: string
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }
      setUser(user)
      fetchPosts(user.id)
    }

    checkUser()
  }, [router, supabase])

  const fetchPosts = async (userId: string) => {
    try {
      const response = await fetch(`/api/posts?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch posts')
      
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      toast.error('Erreur lors du chargement des posts')
      console.error('Error fetching posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')
      
      setPosts(posts.filter(post => post.id !== postId))
      toast.success('Post supprimé avec succès')
    } catch (error) {
      toast.error('Erreur lors de la suppression du post')
      console.error('Error deleting post:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Chargement de vos posts...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary-700">Historique de vos posts</h1>
        <p className="text-gray-600 mt-2">Retrouvez tous vos posts LinkedIn générés</p>
      </header>

      {posts.length === 0 ? (
        <div className="card text-center text-gray-500">
          <p className="mb-4">Vous n'avez pas encore généré de posts.</p>
          <button 
            onClick={() => router.push('/')}
            className="btn"
          >
            Générer votre premier post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Post LinkedIn</h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                    {post.tone && ` • Style: ${post.tone}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(post.content)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    Copier
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap text-sm">
                {post.content}
              </div>

              {post.imageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Image source :</p>
                  <img 
                    src={post.imageUrl} 
                    alt="Source image" 
                    className="max-h-40 rounded-md"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
