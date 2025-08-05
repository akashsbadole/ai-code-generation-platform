import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface StructureRequest {
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
}

interface StructureResponse {
  structure: { [key: string]: any }
  directories: string[]
  files: string[]
  configFiles: { [key: string]: string }
  explanation: string
}

export async function POST(request: NextRequest) {
  try {
    const body: StructureRequest = await request.json()
    const { projectContext, selectedTech, requirements } = body

    // Create ZAI instance
    const zai = await ZAI.create()

    // Construct the prompt for structure generation
    const prompt = `Generate a complete file structure for a ${projectContext.type} application based on the following requirements:

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
1. A complete file structure as a nested object
2. List of all directories
3. List of all files with their purposes
4. Configuration files that need to be created
5. A brief explanation of the structure

Format your response as JSON with the following structure:
{
  "structure": {
    "src": {
      "components": {},
      "utils": {},
      "services": {},
      "App.js": "Main application component",
      "index.js": "Entry point"
    },
    "public": {
      "index.html": "HTML template",
      "favicon.ico": "Favicon"
    },
    "package.json": "Package configuration",
    "README.md": "Project documentation"
  },
  "directories": ["src/", "src/components/", "src/utils/", "public/"],
  "files": ["src/App.js", "src/index.js", "public/index.html", "package.json", "README.md"],
  "configFiles": {
    "package.json": "content here",
    "tsconfig.json": "content here",
    ".gitignore": "content here"
  },
  "explanation": "Brief explanation of the generated structure"
}

Generate a logical, well-organized file structure that follows best practices for the selected technologies and architecture.`

    // Generate structure using ZAI
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert software architect. Generate complete, well-organized file structures based on the given requirements. Always respond with valid JSON that includes all the requested fields.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 3000
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      throw new Error('No response from AI model')
    }

    // Parse the JSON response
    let generatedStructure: StructureResponse
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      generatedStructure = JSON.parse(jsonMatch[0])
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      throw new Error('Failed to parse generated structure')
    }

    // Validate the response structure
    if (!generatedStructure.structure || !generatedStructure.directories) {
      throw new Error('Invalid response structure: missing required fields')
    }

    return NextResponse.json(generatedStructure)

  } catch (error) {
    console.error('Structure generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate structure', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}