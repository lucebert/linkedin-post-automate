'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

const WRITING_STYLES = [
  { id: 'professional', name: 'Professionnel' },
  { id: 'inspiring', name: 'Inspirant' },
  { id: 'humorous', name: 'Humoristique' },
  { id: 'educational', name: 'Éducatif' },
  { id: 'storytelling', name: 'Storytelling' }
]

interface PostGeneratorProps {
  imageFile: File
  isGenerating: boolean
  setIsGenerating: (isGenerating: boolean) => void
  generatedPost: string | null
  setGeneratedPost: (post: string | null) => void
  userId: string
}

export default function PostGenerator({
  imageFile,
  isGenerating,
  setIsGenerating,
  generatedPost,
  setGeneratedPost,
  userId
}: PostGeneratorProps) {
  const [writingStyle, setWritingStyle] = useState('professional')

  const handleGeneratePost = async () => {
    if (!imageFile) return

    setIsGenerating(true)
    setGeneratedPost(null)

    // Create a FormData object to send the image
    const formData = new FormData()
    formData.append('image', imageFile)
    formData.append('style', writingStyle)
    formData.append('userId', userId)

    try {
      const generateToastId = toast.loading('Génération du post en cours...')
      
      // Call our API route
      const response = await fetch('/api/generate-post', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || 'Une erreur est survenue lors de la génération du post')
      }

      const data = await response.json()
      setGeneratedPost(data.post)
      toast.success('Post généré avec succès !', { id: generateToastId })
    } catch (error) {
      console.error('Error generating post:', error)
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Style d'écriture
        </label>
        <select
          value={writingStyle}
          onChange={(e) => setWritingStyle(e.target.value)}
          className="input"
          disabled={isGenerating}
        >
          {WRITING_STYLES.map((style) => (
            <option key={style.id} value={style.id}>
              {style.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleGeneratePost}
        disabled={isGenerating}
        className="btn w-full flex items-center justify-center"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Génération en cours...
          </>
        ) : (
          'Générer un post LinkedIn'
        )}
      </button>
      
      {generatedPost === null && !isGenerating && (
        <p className="text-xs text-gray-500 text-center mt-2">
          L'analyse de l'image et la génération du post peuvent prendre quelques secondes
        </p>
      )}
    </div>
  )
}
