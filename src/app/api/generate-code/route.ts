import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface GenerateCodeRequest {
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
  aiProvider?: string
  apiKeys?: {
    claude?: string
    openai?: string
    google?: string
  }
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
    const body: GenerateCodeRequest = await request.json()
    const { projectContext, selectedTech, requirements, aiProvider, apiKeys } = body

    // For now, we'll use Z.ai as the primary provider
    // In a real implementation, you would integrate with other AI providers here
    let generatedCode: CodeGenerationResponse

    if (aiProvider === "zai" || !aiProvider) {
      // Create ZAI instance
      const zai = await ZAI.create()

      // Construct the prompt for code generation
      const prompt = `Generate a complete ${projectContext.type} application based on the following requirements:

Project Name: ${projectContext.name}
Description: ${projectContext.description}
Architecture: ${projectContext.architecture}
Scale: ${projectContext.scale}
Deployment: ${projectContext.deployment}

Technology Stack:
${Object.entries(selectedTech).map(([category, tech]) => 
  `- ${category}: ${tech.name} v${tech.version}`
).join('\n')}

Functional Requirements:
${requirements.functional}

Non-Functional Requirements:
${requirements.nonFunctional}

Business Logic:
${requirements.businessLogic}

Integration Requirements:
${requirements.integrations}

Please generate:
1. A complete file structure with all necessary files
2. The actual code content for each file
3. Setup commands and dependencies
4. A brief explanation of the generated code

Format your response as JSON with the following structure:
{
  "files": [
    {
      "path": "file/path.ext",
      "content": "file content here",
      "language": "javascript|typescript|python|java|etc"
    }
  ],
  "projectStructure": ["src/", "src/components/", "src/utils/", etc.],
  "setupCommands": ["npm install", "npm run dev", etc.],
  "dependencies": {
    "package-name": "version"
  },
  "explanation": "Brief explanation of the generated code"
}

Generate production-ready, well-structured, and commented code that follows best practices for the selected technologies.`

      // Generate code using ZAI
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert full-stack developer. Generate complete, production-ready code based on the given requirements. Always respond with valid JSON that includes all the requested fields.'
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
    } else {
      // For other AI providers, return a structured response indicating the provider
      // In a real implementation, you would integrate with Claude, OpenAI, or Google AI APIs here
      generatedCode = {
        files: [
          {
            path: "README.md",
            content: `# ${projectContext.name}

${projectContext.description}

## AI Provider: ${aiProvider}

This project was generated using ${aiProvider} as the AI provider.

### Technology Stack:
${Object.entries(selectedTech).map(([category, tech]) => 
  `- **${category}:** ${tech.name} v${tech.version}`
).join('\n')}

### Requirements:
${requirements.functional}

---

*Note: This is a placeholder response. In a production environment, this would contain actual generated code from ${aiProvider}.*`,
            language: "markdown"
          }
        ],
        projectStructure: ["README.md"],
        setupCommands: [`# Setup instructions for ${aiProvider} would go here`],
        dependencies: {},
        explanation: `This project was generated using ${aiProvider} as the AI provider. The actual code generation would be implemented by integrating with the ${aiProvider} API.`
      }
    }

    return NextResponse.json(generatedCode)

  } catch (error) {
    console.error('Code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}