import { NextRequest, NextResponse } from 'next/server'

interface ValidationResult {
  isValid: boolean
  score: number
  issues: {
    critical: string[]
    warning: string[]
    suggestion: string[]
  }
  metrics: {
    completeness: number
    clarity: number
    specificity: number
    structure: number
  }
  recommendations: string[]
}

interface PromptValidationRequest {
  prompt: string
  projectContext: {
    name: string
    type: string
    scale: string
    architecture: string
  }
  selectedTech: { [key: string]: { name: string; version: string } }
  requirements: {
    functional: string
    nonFunctional: string
    businessLogic: string
    integrations: string
  }
}

const validationRules = {
  requiredSections: [
    'Project Overview',
    'Technology Stack',
    'Requirements',
    'Architecture Guidelines',
    'Implementation Guidelines',
    'Security Best Practices',
    'Testing Strategy'
  ],
  technologySpecificChecks: {
    'React': ['components', 'hooks', 'state management', 'typescript'],
    'Node.js': ['api design', 'error handling', 'middleware', 'authentication'],
    'Python': ['type hints', 'exception handling', 'framework patterns', 'testing'],
    'PostgreSQL': ['schema design', 'indexing', 'normalization', 'performance'],
    'MongoDB': ['document modeling', 'indexing', 'aggregation', 'performance']
  },
  qualityKeywords: {
    clarity: ['clear', 'specific', 'detailed', 'comprehensive', 'well-defined'],
    completeness: ['all requirements', 'complete', 'thorough', 'full coverage'],
    structure: ['organized', 'structured', 'logical', 'well-organized'],
    specificity: ['specific steps', 'detailed instructions', 'concrete examples', 'precise']
  }
}

function validatePromptStructure(prompt: string): ValidationResult['issues'] {
  const issues = {
    critical: [] as string[],
    warning: [] as string[],
    suggestion: [] as string[]
  }

  const lowerPrompt = prompt.toLowerCase()

  // Check for required sections
  validationRules.requiredSections.forEach(section => {
    if (!lowerPrompt.includes(section.toLowerCase())) {
      issues.warning.push(`Missing or unclear section: ${section}`)
    }
  })

  // Check for basic structure elements
  if (!prompt.includes('#')) {
    issues.critical.push('Prompt lacks proper heading structure')
  }

  if (!prompt.includes('##')) {
    issues.warning.push('Prompt lacks subheading organization')
  }

  if (prompt.length < 500) {
    issues.warning.push('Prompt seems too short for comprehensive code generation')
  }

  if (prompt.length > 10000) {
    issues.suggestion.push('Consider breaking down very long prompts into smaller, focused sections')
  }

  return issues
}

function validateTechnologyCoverage(prompt: string, selectedTech: { [key: string]: { name: string; version: string } }): ValidationResult['issues'] {
  const issues = {
    critical: [] as string[],
    warning: [] as string[],
    suggestion: [] as string[]
  }

  const lowerPrompt = prompt.toLowerCase()

  Object.entries(selectedTech).forEach(([category, tech]) => {
    const techChecks = validationRules.technologySpecificChecks[tech.name as keyof typeof validationRules.technologySpecificChecks]
    
    if (techChecks) {
      const missingChecks = techChecks.filter(check => !lowerPrompt.includes(check))
      
      if (missingChecks.length > 0) {
        issues.warning.push(`${tech.name} section missing coverage for: ${missingChecks.join(', ')}`)
      }
    }

    // Check if version is mentioned
    if (!lowerPrompt.includes(tech.version)) {
      issues.suggestion.push(`Consider specifying version-specific guidance for ${tech.name} v${tech.version}`)
    }
  })

  return issues
}

function validateRequirementsCoverage(prompt: string, requirements: PromptValidationRequest['requirements']): ValidationResult['issues'] {
  const issues = {
    critical: [] as string[],
    warning: [] as string[],
    suggestion: [] as string[]
  }

  const lowerPrompt = prompt.toLowerCase()
  const lowerFunctional = requirements.functional.toLowerCase()
  const lowerNonFunctional = requirements.nonFunctional.toLowerCase()

  // Check functional requirements coverage
  if (requirements.functional && lowerFunctional.length > 0) {
    const functionalKeywords = extractKeywords(lowerFunctional)
    const missingFunctional = functionalKeywords.filter(keyword => !lowerPrompt.includes(keyword))
    
    if (missingFunctional.length > 2) {
      issues.warning.push('Functional requirements may not be fully addressed in the prompt')
    }
  }

  // Check non-functional requirements coverage
  if (requirements.nonFunctional && lowerNonFunctional.length > 0) {
    const nonFunctionalKeywords = ['performance', 'security', 'scalability', 'reliability']
    const mentionedNonFunctional = nonFunctionalKeywords.filter(keyword => lowerNonFunctional.includes(keyword))
    const missingNonFunctional = mentionedNonFunctional.filter(keyword => !lowerPrompt.includes(keyword))
    
    if (missingNonFunctional.length > 0) {
      issues.warning.push(`Non-functional requirements not fully covered: ${missingNonFunctional.join(', ')}`)
    }
  }

  return issues
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in a real implementation, this would be more sophisticated
  const words = text.split(/\s+/)
  const keywords = words.filter(word => 
    word.length > 4 && 
    !['this', 'that', 'with', 'have', 'will', 'should', 'would', 'could', 'system', 'application'].includes(word)
  )
  return [...new Set(keywords)].slice(0, 10) // Return top 10 unique keywords
}

function calculateQualityMetrics(prompt: string, issues: ValidationResult['issues']): ValidationResult['metrics'] {
  const lowerPrompt = prompt.toLowerCase()
  
  // Calculate completeness based on required sections and coverage
  const sectionCount = (prompt.match(/##/g) || []).length
  const completeness = Math.min(100, (sectionCount / validationRules.requiredSections.length) * 100)
  
  // Calculate clarity based on quality keywords and structure
  const clarityKeywords = validationRules.qualityKeywords.clarity
  const clarityScore = clarityKeywords.reduce((score, keyword) => {
    return score + (lowerPrompt.includes(keyword) ? 10 : 0)
  }, 0)
  const clarity = Math.min(100, Math.max(0, clarityScore))
  
  // Calculate specificity based on detailed instructions
  const specificityKeywords = validationRules.qualityKeywords.specificity
  const specificityScore = specificityKeywords.reduce((score, keyword) => {
    return score + (lowerPrompt.includes(keyword) ? 8 : 0)
  }, 0)
  const specificity = Math.min(100, Math.max(0, specificityScore))
  
  // Calculate structure based on organization
  const structureKeywords = validationRules.qualityKeywords.structure
  const structureScore = structureKeywords.reduce((score, keyword) => {
    return score + (lowerPrompt.includes(keyword) ? 12 : 0)
  }, 0)
  const hasGoodStructure = prompt.includes('#') && prompt.includes('##') && prompt.includes('###')
  const structure = Math.min(100, Math.max(0, structureScore + (hasGoodStructure ? 20 : 0)))
  
  return {
    completeness: Math.round(completeness),
    clarity: Math.round(clarity),
    specificity: Math.round(specificity),
    structure: Math.round(structure)
  }
}

function generateRecommendations(issues: ValidationResult['issues'], metrics: ValidationResult['metrics']): string[] {
  const recommendations: string[] = []
  
  // Critical issue recommendations
  if (issues.critical.length > 0) {
    recommendations.push('Address critical structural issues before using the prompt')
  }
  
  // Warning-based recommendations
  if (issues.warning.length > 2) {
    recommendations.push('Consider expanding sections that have missing coverage')
  }
  
  // Metric-based recommendations
  if (metrics.completeness < 70) {
    recommendations.push('Add more detailed sections to improve completeness')
  }
  
  if (metrics.clarity < 60) {
    recommendations.push('Use more specific language and clear instructions')
  }
  
  if (metrics.specificity < 50) {
    recommendations.push('Include concrete examples and detailed implementation steps')
  }
  
  if (metrics.structure < 60) {
    recommendations.push('Improve organization with clear headings and subheadings')
  }
  
  // General recommendations
  recommendations.push('Consider including code examples for complex concepts')
  recommendations.push('Add error handling and edge case considerations')
  recommendations.push('Include testing and validation requirements')
  
  return recommendations
}

export async function POST(request: NextRequest) {
  try {
    const body: PromptValidationRequest = await request.json()
    const { prompt, projectContext, selectedTech, requirements } = body

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required for validation' },
        { status: 400 }
      )
    }

    // Perform validation checks
    const structureIssues = validatePromptStructure(prompt)
    const technologyIssues = validateTechnologyCoverage(prompt, selectedTech)
    const requirementsIssues = validateRequirementsCoverage(prompt, requirements)

    // Combine all issues
    const allIssues = {
      critical: [...structureIssues.critical],
      warning: [...structureIssues.warning, ...technologyIssues.warning, ...requirementsIssues.warning],
      suggestion: [...structureIssues.suggestion, ...technologyIssues.suggestion, ...requirementsIssues.suggestion]
    }

    // Calculate quality metrics
    const metrics = calculateQualityMetrics(prompt, allIssues)

    // Calculate overall score
    const issuePenalties = {
      critical: 20,
      warning: 5,
      suggestion: 1
    }
    
    const totalPenalty = 
      allIssues.critical.length * issuePenalties.critical +
      allIssues.warning.length * issuePenalties.warning +
      allIssues.suggestion.length * issuePenalties.suggestion
    
    const baseScore = 100
    const finalScore = Math.max(0, baseScore - totalPenalty)

    // Generate recommendations
    const recommendations = generateRecommendations(allIssues, metrics)

    const validationResult: ValidationResult = {
      isValid: allIssues.critical.length === 0,
      score: finalScore,
      issues: allIssues,
      metrics,
      recommendations
    }

    return NextResponse.json({
      success: true,
      validation: validationResult
    })

  } catch (error) {
    console.error('Prompt validation error:', error)
    return NextResponse.json(
      { error: 'Failed to validate prompt' },
      { status: 500 }
    )
  }
}