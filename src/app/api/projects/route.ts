import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll use a hardcoded user ID
    const userId = 'demo-user-id'

    const projects = await db.savedProject.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      description,
      projectContext,
      selectedTech,
      requirements,
      generatedCode,
      versionHistory,
      tags
    } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll use a hardcoded user ID
    const userId = 'demo-user-id'

    const project = await db.savedProject.create({
      data: {
        userId,
        name,
        description,
        projectContext: JSON.stringify(projectContext),
        selectedTech: JSON.stringify(selectedTech),
        requirements: JSON.stringify(requirements),
        generatedCode: JSON.stringify(generatedCode),
        versionHistory: JSON.stringify(versionHistory),
        tags: JSON.stringify(tags || [])
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error saving project:', error)
    return NextResponse.json(
      { error: 'Failed to save project' },
      { status: 500 }
    )
  }
}