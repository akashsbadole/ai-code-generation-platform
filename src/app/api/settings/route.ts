import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll use a hardcoded user ID
    const userId = 'demo-user-id'

    let settings = await db.userSettings.findUnique({
      where: { userId }
    })

    // If no settings exist, create default settings
    if (!settings) {
      settings = await db.userSettings.create({
        data: {
          userId,
          theme: 'system',
          editorTheme: 'vs-light',
          fontSize: 14,
          fontFamily: "Consolas, 'Courier New', monospace",
          wordWrap: true,
          minimap: false,
          lineNumbers: 'on',
          autoSave: true,
          notifications: true
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      theme,
      editorTheme,
      fontSize,
      fontFamily,
      wordWrap,
      minimap,
      lineNumbers,
      autoSave,
      notifications
    } = body

    // For demo purposes, we'll use a hardcoded user ID
    const userId = 'demo-user-id'

    const settings = await db.userSettings.upsert({
      where: { userId },
      update: {
        theme,
        editorTheme,
        fontSize,
        fontFamily,
        wordWrap,
        minimap,
        lineNumbers,
        autoSave,
        notifications,
        updatedAt: new Date()
      },
      create: {
        userId,
        theme,
        editorTheme,
        fontSize,
        fontFamily,
        wordWrap,
        minimap,
        lineNumbers,
        autoSave,
        notifications
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}