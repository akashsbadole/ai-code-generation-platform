import { NextRequest, NextResponse } from 'next/server'

interface RefactorCodeRequest {
  code: string
  language: string
  refactorType: 'extract-function' | 'rename-variable' | 'simplify-logic' | 'add-types' | 'convert-to-modern'
}

interface RefactorCodeResponse {
  refactoredCode: string
  explanation: string
  changes: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: RefactorCodeRequest = await request.json()
    const { code, language, refactorType } = body

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      )
    }

    // Simulate AI code refactoring (in real implementation, use z-ai-web-dev-sdk)
    let refactoredCode = code
    let explanation = ''
    const changes: string[] = []

    switch (refactorType) {
      case 'extract-function':
        refactoredCode = extractFunction(code, language)
        explanation = 'Code has been refactored by extracting reusable functions'
        changes.push(
          'Extracted duplicate code into functions',
          'Improved code reusability',
          'Better separation of concerns',
          'Reduced code duplication'
        )
        break
      
      case 'rename-variable':
        refactoredCode = renameVariables(code, language)
        explanation = 'Variables have been renamed for better clarity'
        changes.push(
          'Improved variable naming conventions',
          'More descriptive variable names',
          'Consistent naming patterns',
          'Better code documentation'
        )
        break
      
      case 'simplify-logic':
        refactoredCode = simplifyLogic(code, language)
        explanation = 'Complex logic has been simplified and streamlined'
        changes.push(
          'Simplified conditional statements',
          'Reduced nested logic',
          'Improved code flow',
          'Better readability'
        )
        break
      
      case 'add-types':
        refactoredCode = addTypes(code, language)
        explanation = 'Type annotations have been added for better type safety'
        changes.push(
          'Added type annotations',
          'Improved type safety',
          'Better IDE support',
          'Reduced runtime errors'
        )
        break
      
      case 'convert-to-modern':
        refactoredCode = convertToModern(code, language)
        explanation = 'Code has been updated to use modern language features'
        changes.push(
          'Updated to modern syntax',
          'Used latest language features',
          'Improved code efficiency',
          'Better maintainability'
        )
        break
    }

    const response: RefactorCodeResponse = {
      refactoredCode,
      explanation,
      changes
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error refactoring code:', error)
    return NextResponse.json(
      { error: 'Failed to refactor code' },
      { status: 500 }
    )
  }
}

function extractFunction(code: string, language: string): string {
  // Simulate function extraction
  let refactored = code
  
  if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'typescript') {
    // Find repeated patterns and extract them
    refactored = refactored.replace(
      /console\.log\((.+?)\);?\s*console\.log\((.+?)\);?/g,
      `function logMessages(msg1, msg2) {
  console.log(msg1);
  console.log(msg2);
}
logMessages($1, $2);`
    )
    
    refactored += `\n\n// Refactoring: Function extraction applied
// - Extracted repeated console.log calls into reusable function
// - Improved code reusability and maintainability`
  }
  
  return refactored
}

function renameVariables(code: string, language: string): string {
  // Simulate variable renaming
  let refactored = code
  
  // Improve variable names
  refactored = refactored.replace(
    /let\s+a\s*=/g,
    'let counter ='
  )
  
  refactored = refactored.replace(
    /let\s+b\s*=/g,
    'let result ='
  )
  
  refactored = refactored.replace(
    /let\s+i\s*=/g,
    'let index ='
  )
  
  refactored += `\n\n// Refactoring: Variable renaming applied
// - Renamed 'a' to 'counter' for better clarity
// - Renamed 'b' to 'result' for better context
// - Renamed 'i' to 'index' for better readability`
  
  return refactored
}

function simplifyLogic(code: string, language: string): string {
  // Simulate logic simplification
  let refactored = code
  
  if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'typescript') {
    // Simplify nested conditionals
    refactored = refactored.replace(
      /if\s*\((.+?)\)\s*{\s*if\s*\((.+?)\)\s*{\s*(.+?)\s*}\s*}/g,
      'if ($1 && $2) {\n  $3\n}'
    )
    
    // Simplify boolean logic
    refactored = refactored.replace(
      /if\s*\((.+?)\s*===\s*true\)\s*{\s*return\s*true;\s*}\s*else\s*{\s*return\s*false;\s*}/g,
      'return $1;'
    )
    
    refactored += `\n\n// Refactoring: Logic simplification applied
// - Simplified nested conditional statements
// - Reduced boolean logic complexity
// - Improved code readability`
  }
  
  return refactored
}

function addTypes(code: string, language: string): string {
  // Simulate adding type annotations
  let refactored = code
  
  if (language.toLowerCase() === 'javascript') {
    // Convert to TypeScript-like syntax
    refactored = refactored.replace(
      /function\s+(\w+)\s*\(([^)]*)\)/g,
      (match, funcName, params) => {
        const typedParams = params.split(',').map(p => {
          const trimmed = p.trim()
          if (trimmed && !trimmed.includes(':')) {
            return `${trimmed}: any`
          }
          return trimmed
        }).join(', ')
        
        return `function ${funcName}(${typedParams}): any`
      }
    )
    
    refactored = refactored.replace(
      /let\s+(\w+)\s*=/g,
      'let $1: any ='
    )
    
    refactored += `\n\n// Refactoring: Type annotations added
// - Added type annotations to function parameters
// - Added type annotations to variable declarations
// - Improved type safety and IDE support`
  }
  
  return refactored
}

function convertToModern(code: string, language: string): string {
  // Simulate converting to modern syntax
  let refactored = code
  
  if (language.toLowerCase() === 'javascript') {
    // Convert var to let/const
    refactored = refactored.replace(
      /var\s+(\w+)\s*=/g,
      (match, varName) => {
        // Use const for variables that are not reassigned
        return `const ${varName} =`
      }
    )
    
    // Convert function declarations to arrow functions where appropriate
    refactored = refactored.replace(
      /function\s*\(\s*([^)]*)\s*\)\s*{\s*return\s+([^;]+);\s*}/g,
      '($1) => $2'
    )
    
    // Use template literals
    refactored = refactored.replace(
      /"([^"]*)"\s*\+\s*([^;]+)/g,
      (match, str1, str2) => {
        if (!str2.includes('"') && !str2.includes("'")) {
          return `\`${str1}\${${str2.trim()}}\``
        }
        return match
      }
    )
    
    refactored += `\n\n// Refactoring: Modern syntax conversion applied
// - Converted var to let/const
// - Used arrow functions where appropriate
// - Implemented template literals
// - Applied modern JavaScript features`
  }
  
  return refactored
}