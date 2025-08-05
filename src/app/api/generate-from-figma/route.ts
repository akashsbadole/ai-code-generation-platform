import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface FigmaGenerationRequest {
  projectContext: {
    name: string
    description: string
    type: string
    scale: string
    architecture: string
    deployment: string
  }
  selectedTech: { [key: string]: { name: string, version: string } }
  requirements: {
    functional: string
    nonFunctional: string
    businessLogic: string
    integrations: string
  }
  aiProvider: string
  figmaUrl: string
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
    const body = await request.json()
    const { projectContext, selectedTech, requirements, aiProvider, figmaUrl } = body

    if (!figmaUrl) {
      return NextResponse.json(
        { error: 'No Figma URL provided' },
        { status: 400 }
      )
    }

    // Create ZAI instance
    const zai = await ZAI.create()

    // Generate code from Figma URL
    const prompt = `Generate code from a Figma design. The Figma URL is: ${figmaUrl}

Project Context:
- Name: ${projectContext.name}
- Description: ${projectContext.description}
- Type: ${projectContext.type}
- Architecture: ${projectContext.architecture}

Technology Stack:
${Object.entries(selectedTech).map(([category, tech]) => 
  `- ${category}: ${tech.name} v${tech.version}`
).join('\n')}

Requirements:
${requirements.functional}

Please generate code that would match a typical Figma design. Since I cannot access the actual Figma file, please:

1. Generate a modern, responsive HTML/CSS implementation based on the project context
2. Include typical Figma design elements like:
   - Modern typography and spacing
   - Consistent color scheme
   - Responsive layout
   - Clean component structure
   - Professional styling

3. Generate multiple files if needed (HTML, CSS, JavaScript)
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
  "explanation": "Explanation of the generated Figma-to-code conversion"
}

Generate production-ready, responsive code that follows modern design principles and best practices for converting Figma designs to code.`

    // Generate code using ZAI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert frontend developer specializing in converting Figma designs to code. Generate clean, responsive HTML/CSS/JavaScript that matches modern design principles. Always respond with valid JSON.'
        },
        {
          role: 'user',
          content: prompt
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
    console.error('Figma-based code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code from Figma', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}