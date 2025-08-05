import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface ImageGenerationRequest {
  image: File
  projectContext: string
  selectedTech: string
  requirements: string
  aiProvider: string
}

interface GeneratedFile {
  path: string
  content: string
  language: string
}

interface CodeGenerationResponse {
  files: GeneratedFile[]
  projectStructure: string[]
  setupCommands: string[]
  dependencies: { [key: string]: string }
  explanation: string
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const projectContext = formData.get('projectContext') as string
    const selectedTech = formData.get('selectedTech') as string
    const requirements = formData.get('requirements') as string
    const aiProvider = formData.get('aiProvider') as string

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert image to base64 for analysis
    const imageBuffer = await image.arrayBuffer()
    const imageBase64 = Buffer.from(imageBuffer).toString('base64')
    const imageDataUrl = `data:${image.type};base64,${imageBase64}`

    // Create ZAI instance for image analysis
    const zai = await ZAI.create()

    // Analyze the image and generate code
    const prompt = `Analyze this image and generate code based on what you see. The image appears to be a design mockup or screenshot.

Project Context: ${projectContext}
Selected Technology: ${selectedTech}
Requirements: ${requirements}

Please analyze the image and:
1. Describe what you see in the image (layout, components, colors, styling)
2. Generate appropriate HTML/CSS code that matches the design
3. If the image shows a complex application, generate multiple files as needed
4. Provide setup instructions

Format your response as JSON with the following structure:
{
  "files": [
    {
      "path": "file/path.ext",
      "content": "file content here",
      "language": "html|css|javascript|etc"
    }
  ],
  "projectStructure": ["file1.html", "file2.css", etc.],
  "setupCommands": ["command1", "command2"],
  "dependencies": {},
  "explanation": "Explanation of what was generated and how it matches the image"
}

Generate responsive, modern code that accurately represents the design shown in the image.`

    // Use ZAI to analyze the image and generate code
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert frontend developer and designer. Analyze images and generate accurate HTML/CSS code that matches the design. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: imageDataUrl
              }
            }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      throw new Error('No response from AI model')
    }

    // Parse the JSON response
    let generatedCode: CodeGenerationResponse
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      generatedCode = JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      throw new Error('Failed to parse generated code')
    }

    // Validate the response structure
    if (!generatedCode.files || !Array.isArray(generatedCode.files)) {
      throw new Error('Invalid response structure: files array missing')
    }

    return NextResponse.json(generatedCode)

  } catch (error) {
    console.error('Image-based code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code from image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}