'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface ImageUploaderProps {
  onImageSelected: (file: File, preview: string) => void
  imagePreview: string | null
}

export default function ImageUploader({ onImageSelected, imagePreview }: ImageUploaderProps) {
  // Handle file drop and selection
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image valide')
      return
    }
    
    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file)
    onImageSelected(file, previewUrl)
  }, [onImageSelected])

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxFiles: 1,
    multiple: false
  })

  // Handler for paste event (clipboard)
  const handlePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (!file) continue
        
        const previewUrl = URL.createObjectURL(file)
        onImageSelected(file, previewUrl)
        break
      }
    }
  }, [onImageSelected])

  return (
    <div 
      onPaste={handlePaste}
      className="focus:outline-none"
      tabIndex={0}
    >
      {!imagePreview ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <div className="flex justify-center">
              <svg 
                className="w-12 h-12 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            <p className="text-gray-700">
              Glissez et déposez une image ici, ou <span className="text-primary-600">cliquez pour parcourir</span>
            </p>
            <p className="text-sm text-gray-500">
              Vous pouvez aussi coller une image depuis le presse-papier (Ctrl+V)
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Aperçu de l'image"
              className="w-full h-full object-contain bg-gray-50"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                URL.revokeObjectURL(imagePreview)
                onImageSelected(null as any, null)
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Supprimer l'image
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
