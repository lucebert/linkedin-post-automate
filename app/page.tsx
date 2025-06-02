'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import ImageUploader from '@/components/ImageUploader'
import PostGenerator from '@/components/PostGenerator'
import LoginForm from '@/components/Auth/LoginForm'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setIsLoading(false)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Reset all states to initial values
  const handleReset = () => {
    setImageFile(null)
    setImagePreview(null)
    setGeneratedPost(null)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-primary-700">LinkedIn Post Generator</h1>
          <p className="text-gray-600 mt-2">Connectez-vous pour générer des posts LinkedIn</p>
        </header>
        
        <div className="max-w-md mx-auto">
          <div className="card">
            <h2 className="text-xl font-semibold mb-6 text-center">Connexion</h2>
            <LoginForm />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-primary-700">LinkedIn Post Generator</h1>
        <p className="text-gray-600 mt-2">Transformez vos captures d'écran en posts LinkedIn engageants</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">1. Téléchargez votre image</h2>
          <ImageUploader 
            onImageSelected={(file, preview) => {
              setImageFile(file)
              setImagePreview(preview)
              setGeneratedPost(null)
            }}
            imagePreview={imagePreview}
          />
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">2. Générez votre post</h2>
          {imageFile ? (
            <PostGenerator 
              imageFile={imageFile}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              generatedPost={generatedPost}
              setGeneratedPost={setGeneratedPost}
              userId={user.id}
            />
          ) : (
            <div className="bg-gray-50 p-8 rounded text-center text-gray-500">
              Veuillez d'abord télécharger une image
            </div>
          )}
        </div>
      </div>

      {generatedPost && (
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Votre post LinkedIn</h2>
            <button onClick={handleReset} className="text-sm text-primary-600 hover:text-primary-800">
              Recommencer
            </button>
          </div>
          <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
            {generatedPost}
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => navigator.clipboard.writeText(generatedPost)}
              className="btn"
            >
              Copier le texte
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
