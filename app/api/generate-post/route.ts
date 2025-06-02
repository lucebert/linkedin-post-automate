import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is missing' },
        { status: 500 }
      )
    }

    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the FormData
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const style = formData.get('style') as string || 'professional'
    
    // Validate image
    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      )
    }

    // Convert image file to base64
    const imageBuffer = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const dataURI = `data:${imageFile.type};base64,${base64Image}`

    // Create a system message based on the selected writing style
    let systemPrompt = ''
    
    switch (style) {
      case 'professional':
        systemPrompt = 'Vous êtes un expert LinkedIn qui rédige des posts professionnels et concis. Utilisez un ton formel et axé sur les affaires, avec des insights professionnels.';
        break;
      case 'inspiring':
        systemPrompt = 'Vous êtes un coach motivateur qui rédige des posts LinkedIn inspirants. Utilisez un ton positif et encourageant, avec des appels à l\'action et des citations inspirantes.';
        break;
      case 'humorous':
        systemPrompt = 'Vous êtes un rédacteur créatif qui ajoute une touche d\'humour à chaque post LinkedIn, tout en restant professionnel. Utilisez un ton léger et des analogies amusantes quand c\'est approprié.';
        break;
      case 'educational':
        systemPrompt = 'Vous êtes un éducateur qui transforme le contenu en leçons précieuses pour votre réseau LinkedIn. Structurez le post avec des points d\'apprentissage clairs et des takeaways.';
        break;
      case 'storytelling':
        systemPrompt = 'Vous êtes un conteur qui transforme le contenu en histoires engageantes pour LinkedIn. Utilisez des éléments narratifs comme une introduction captivante, un développement et une conclusion avec un message fort.';
        break;
      default:
        systemPrompt = 'Vous êtes un expert LinkedIn qui rédige des posts professionnels et concis. Utilisez un ton formel et axé sur les affaires.';
    }

    // Call OpenAI API to analyze the image and generate the post
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the vision model
      messages: [
        {
          role: "system",
          content: systemPrompt + " Ne recopiez pas textuellement le contenu de l'image, mais inspirez-vous en pour créer un post LinkedIn original et engageant."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Voici une capture d'écran. Analysez son contenu et générez un post LinkedIn original qui s'en inspire. Ne recopiez pas textuellement le contenu, mais créez un message engageant qui pourrait être partagé sur LinkedIn."
            },
            {
              type: "image_url",
              image_url: {
                url: dataURI
              }
            }
          ]
        }
      ],
      max_tokens: 800,
    })

    // Extract the generated post content
    const generatedPost = response.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer un post. Veuillez réessayer."

    // Create user if doesn't exist in database
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email || '' },
      create: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name,
        avatarUrl: user.user_metadata?.avatar_url
      }
    })

    // Save the generated post to database
    const savedPost = await prisma.post.create({
      data: {
        content: generatedPost,
        imageUrl: dataURI, // In production, you'd want to upload this to a storage service
        platform: 'linkedin',
        tone: style,
        targetRole: null,
        userId: user.id
      }
    })

    // Return the generated post
    return NextResponse.json({ 
      post: generatedPost,
      postId: savedPost.id 
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Failed to generate post' },
      { status: 500 }
    )
  }
}
