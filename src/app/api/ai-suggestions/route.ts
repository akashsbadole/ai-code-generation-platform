import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface AISuggestionRequest {
  projectContext: {
    name: string
    description: string
    type: string
    scale: string
    architecture: string
    deployment: string
  }
  selectedTech: { [key: string]: { name: string; version: string } }
  requirements: {
    functional: string
    nonFunctional: string
    businessLogic: string
    integrations: string
  }
  currentStep: 'technology' | 'context' | 'requirements' | 'generate'
}

interface AISuggestionResponse {
  suggestions: {
    technologies: Array<{
      category: string
      name: string
      version: string
      reason: string
      confidence: number
    }>
    architecture: Array<{
      pattern: string
      description: string
      benefits: string[]
      confidence: number
    }>
    requirements: Array<{
      type: 'functional' | 'nonFunctional' | 'business' | 'integration'
      suggestion: string
      reason: string
      priority: 'high' | 'medium' | 'low'
    }>
    improvements: Array<{
      area: string
      current: string
      suggested: string
      impact: string
    }>
  }
  insights: {
    complexity: 'simple' | 'medium' | 'complex'
    estimatedEffort: string
    recommendedTeamSize: string
    keyChallenges: string[]
    bestPractices: string[]
  }
}

function analyzeProjectComplexity(projectContext: AISuggestionRequest['projectContext'], selectedTech: { [key: string]: { name: string; version: string } }): 'simple' | 'medium' | 'complex' {
  let complexityScore = 0

  // Scale-based complexity
  if (projectContext.scale === 'enterprise') complexityScore += 3
  else if (projectContext.scale === 'medium') complexityScore += 2
  else complexityScore += 1

  // Architecture-based complexity
  if (projectContext.architecture === 'microservices') complexityScore += 3
  else if (projectContext.architecture === 'serverless') complexityScore += 2
  else if (projectContext.architecture === 'mvc') complexityScore += 1

  // Technology stack complexity
  const techCount = Object.keys(selectedTech).length
  complexityScore += Math.min(techCount, 3)

  // Project type complexity
  if (projectContext.type === 'web-app' || projectContext.type === 'mobile') complexityScore += 2
  else if (projectContext.type === 'api' || projectContext.type === 'microservice') complexityScore += 1

  if (complexityScore >= 7) return 'complex'
  if (complexityScore >= 4) return 'medium'
  return 'simple'
}

function generateTechnologySuggestions(projectContext: AISuggestionRequest['projectContext'], currentTech: { [key: string]: { name: string; version: string } }) {
  const suggestions = []
  const currentCategories = Object.keys(currentTech)

  // Suggest missing categories
  const allCategories = ['Frontend', 'Backend', 'Database', 'Mobile', 'AI/ML']
  const missingCategories = allCategories.filter(cat => !currentCategories.includes(cat))

  missingCategories.forEach(category => {
    switch (category) {
      case 'Frontend':
        if (projectContext.type === 'web-app') {
          suggestions.push({
            category: 'Frontend',
            name: 'React',
            version: '18',
            reason: 'React is ideal for modern web applications with its component-based architecture and large ecosystem',
            confidence: 0.9
          })
        }
        break
      case 'Backend':
        suggestions.push({
          category: 'Backend',
          name: 'Node.js',
          version: '20',
          reason: 'Node.js provides excellent performance for I/O operations and has a rich npm ecosystem',
          confidence: 0.85
        })
        break
      case 'Database':
        if (projectContext.scale === 'enterprise') {
          suggestions.push({
            category: 'Database',
            name: 'PostgreSQL',
            version: '16',
            reason: 'PostgreSQL offers robust features, scalability, and excellent data integrity for enterprise applications',
            confidence: 0.9
          })
        } else {
          suggestions.push({
            category: 'Database',
            name: 'MongoDB',
            version: '7.0',
            reason: 'MongoDB provides flexibility and scalability for rapid development and evolving data models',
            confidence: 0.8
          })
        }
        break
      case 'Mobile':
        if (projectContext.type === 'mobile') {
          suggestions.push({
            category: 'Mobile',
            name: 'React Native',
            version: '0.73',
            reason: 'React Native allows cross-platform mobile development with a single codebase',
            confidence: 0.85
          })
        }
        break
    }
  })

  return suggestions
}

function generateArchitectureSuggestions(projectContext: AISuggestionRequest['projectContext']) {
  const suggestions = []

  switch (projectContext.type) {
    case 'web-app':
      if (projectContext.scale === 'enterprise') {
        suggestions.push({
          pattern: 'Microservices Architecture',
          description: 'Distribute application logic across independent services',
          benefits: ['Independent deployment', 'Technology diversity', 'Better fault isolation'],
          confidence: 0.9
        })
      } else {
        suggestions.push({
          pattern: 'MVC Architecture',
          description: 'Separate concerns into Model, View, and Controller layers',
          benefits: ['Clear separation of concerns', 'Easier testing', 'Better maintainability'],
          confidence: 0.8
        })
      }
      break
    case 'api':
      suggestions.push({
        pattern: 'RESTful API with Layered Architecture',
        description: 'Build APIs with clear separation between controllers, services, and data access',
        benefits: ['Scalability', 'Maintainability', 'Testability'],
        confidence: 0.85
      })
      break
    case 'mobile':
      suggestions.push({
        pattern: 'Clean Architecture',
        description: 'Separate business logic from UI and framework concerns',
        benefits: ['Testability', 'Maintainability', 'Platform independence'],
        confidence: 0.8
      })
      break
  }

  return suggestions
}

function generateRequirementsSuggestions(requirements: AISuggestionRequest['requirements'], projectContext: AISuggestionRequest['projectContext']) {
  const suggestions = []

  // Analyze functional requirements
  if (!requirements.functional.includes('auth') && !requirements.functional.includes('authentication')) {
    suggestions.push({
      type: 'functional' as const,
      suggestion: 'Add user authentication and authorization system',
      reason: 'Most applications require user management and security',
      priority: 'high' as const
    })
  }

  if (!requirements.functional.includes('api') && projectContext.type === 'web-app') {
    suggestions.push({
      type: 'functional' as const,
      suggestion: 'Implement RESTful API endpoints for data operations',
      reason: 'Web applications typically need API endpoints for frontend-backend communication',
      priority: 'high' as const
    })
  }

  // Analyze non-functional requirements
  if (!requirements.nonFunctional.includes('performance')) {
    suggestions.push({
      type: 'nonFunctional' as const,
      suggestion: 'Define performance requirements and benchmarks',
      reason: 'Performance requirements help ensure application responsiveness',
      priority: 'medium' as const
    })
  }

  if (!requirements.nonFunctional.includes('security')) {
    suggestions.push({
      type: 'nonFunctional' as const,
      suggestion: 'Include security requirements and compliance needs',
      reason: 'Security is crucial for protecting user data and preventing breaches',
      priority: 'high' as const
    })
  }

  // Business logic suggestions
  if (!requirements.businessLogic) {
    suggestions.push({
      type: 'business' as const,
      suggestion: 'Describe core business rules and workflows',
      reason: 'Business logic defines how your application processes data and makes decisions',
      priority: 'high' as const
    })
  }

  return suggestions
}

function generateInsights(projectContext: AISuggestionRequest['projectContext'], selectedTech: { [key: string]: { name: string; version: string } }) {
  const complexity = analyzeProjectComplexity(projectContext, selectedTech)
  
  let estimatedEffort = ''
  let recommendedTeamSize = ''
  let keyChallenges: string[] = []
  let bestPractices: string[] = []

  switch (complexity) {
    case 'simple':
      estimatedEffort = '2-4 weeks'
      recommendedTeamSize = '1-2 developers'
      keyChallenges = ['Technology setup', 'Basic feature implementation', 'Testing']
      bestPractices = ['Start with MVP', 'Use established frameworks', 'Focus on core functionality']
      break
    case 'medium':
      estimatedEffort = '2-6 months'
      recommendedTeamSize = '3-5 developers'
      keyChallenges = ['Architecture design', 'Integration complexity', 'Performance optimization', 'Security implementation']
      bestPractices = ['Implement CI/CD', 'Use automated testing', 'Document architecture decisions', 'Plan for scalability']
      break
    case 'complex':
      estimatedEffort = '6-12 months'
      recommendedTeamSize = '6-10+ developers'
      keyChallenges = ['System integration', 'Performance at scale', 'Security compliance', 'Team coordination', 'Legacy system integration']
      bestPractices = ['Enterprise architecture patterns', 'Comprehensive testing strategy', 'DevOps practices', 'Continuous monitoring', 'Security by design']
      break
  }

  return {
    complexity,
    estimatedEffort,
    recommendedTeamSize,
    keyChallenges,
    bestPractices
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: AISuggestionRequest = await request.json()
    const { projectContext, selectedTech, requirements, currentStep } = body

    // Generate AI-powered suggestions based on current context
    const suggestions = {
      technologies: generateTechnologySuggestions(projectContext, selectedTech),
      architecture: generateArchitectureSuggestions(projectContext),
      requirements: generateRequirementsSuggestions(requirements, projectContext),
      improvements: [] // Will be populated by AI if available
    }

    // Generate project insights
    const insights = generateInsights(projectContext, selectedTech)

    // Try to get AI-powered suggestions using ZAI SDK
    try {
      const zai = await ZAI.create()
      
      const aiPrompt = `Based on the following project context, provide intelligent suggestions for improvement:

Project: ${projectContext.name}
Type: ${projectContext.type}
Scale: ${projectContext.scale}
Architecture: ${projectContext.architecture}

Current Technologies: ${Object.entries(selectedTech).map(([cat, tech]) => `${cat}: ${tech.name} v${tech.version}`).join(', ')}

Requirements:
- Functional: ${requirements.functional}
- Non-Functional: ${requirements.nonFunctional}
- Business Logic: ${requirements.businessLogic}
- Integrations: ${requirements.integrations}

Provide suggestions in the following JSON format:
{
  "improvements": [
    {
      "area": "technology|architecture|requirements|performance|security",
      "current": "brief description of current state",
      "suggested": "specific suggestion for improvement",
      "impact": "expected impact of the suggestion"
    }
  ]
}

Focus on the most impactful suggestions based on the project context and current step: ${currentStep}`

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert software architect and technical advisor. Provide practical, actionable suggestions for software projects.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })

      const aiResponse = completion.choices[0]?.message?.content
      if (aiResponse) {
        try {
          const aiSuggestions = JSON.parse(aiResponse)
          if (aiSuggestions.improvements) {
            suggestions.improvements = aiSuggestions.improvements
          }
        } catch (parseError) {
          console.log('Could not parse AI suggestions, using rule-based suggestions only')
        }
      }
    } catch (aiError) {
      console.log('AI service unavailable, using rule-based suggestions')
      // Continue with rule-based suggestions
    }

    return NextResponse.json({
      success: true,
      suggestions,
      insights
    })

  } catch (error) {
    console.error('AI suggestion error:', error)
    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    )
  }
}