import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

// Simple encryption for API keys (in production, use proper encryption)
const encryptApiKey = (apiKey: string): string => {
  const algorithm = 'aes-256-cbc'
  const key = crypto.randomBytes(32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(apiKey, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return `${iv.toString('hex')}:${encrypted}:${key.toString('hex')}`
}

const decryptApiKey = (encryptedData: string): string => {
  try {
    const [ivHex, encrypted, keyHex] = encryptedData.split(':')
    const algorithm = 'aes-256-cbc'
    const key = Buffer.from(keyHex, 'hex')
    const iv = Buffer.from(ivHex, 'hex')
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    console.error('Error decrypting API key:', error)
    return ''
  }
}

export async function GET(request: NextRequest) {
  try {
    // For demo purposes, we'll use a hardcoded user ID
    // In a real app, you'd get this from authentication
    const userId = 'demo-user-id'

    const apiKeys = await db.apiKey.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Don't return the actual API key
      }
    })

    return NextResponse.json(apiKeys)
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, apiKey } = body

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: 'Provider and API key are required' },
        { status: 400 }
      )
    }

    // Validate provider
    const validProviders = ['claude', 'openai', 'google', 'zai']
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { error: 'Invalid provider' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll use a hardcoded user ID
    const userId = 'demo-user-id'

    // Encrypt the API key before storing
    const encryptedApiKey = encryptApiKey(apiKey)

    // Check if API key already exists for this provider and user
    const existingKey = await db.apiKey.findUnique({
      where: {
        userId_provider: {
          userId,
          provider
        }
      }
    })

    let result
    if (existingKey) {
      // Update existing key
      result = await db.apiKey.update({
        where: { id: existingKey.id },
        data: {
          apiKey: encryptedApiKey,
          isActive: true,
          updatedAt: new Date()
        }
      })
    } else {
      // Create new key
      result = await db.apiKey.create({
        data: {
          userId,
          provider,
          apiKey: encryptedApiKey
        }
      })
    }

    return NextResponse.json({
      id: result.id,
      provider: result.provider,
      isActive: result.isActive,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt
    })
  } catch (error) {
    console.error('Error saving API key:', error)
    return NextResponse.json(
      { error: 'Failed to save API key' },
      { status: 500 }
    )
  }
}