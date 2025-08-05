import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params

    // For demo purposes, we'll use a hardcoded user ID
    const userId = 'demo-user-id'

    const apiKeyRecord = await db.apiKey.findUnique({
      where: {
        userId_provider: {
          userId,
          provider
        }
      }
    })

    if (!apiKeyRecord || !apiKeyRecord.isActive) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    // Decrypt and return the API key
    const decryptedApiKey = decryptApiKey(apiKeyRecord.apiKey)

    return NextResponse.json({
      provider: apiKeyRecord.provider,
      apiKey: decryptedApiKey
    })
  } catch (error) {
    console.error('Error fetching API key:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API key' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const { provider } = params

    // For demo purposes, we'll use a hardcoded user ID
    const userId = 'demo-user-id'

    const apiKeyRecord = await db.apiKey.findUnique({
      where: {
        userId_provider: {
          userId,
          provider
        }
      }
    })

    if (!apiKeyRecord) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      )
    }

    // Instead of deleting, we'll deactivate it
    await db.apiKey.update({
      where: { id: apiKeyRecord.id },
      data: { isActive: false }
    })

    return NextResponse.json({ message: 'API key deactivated successfully' })
  } catch (error) {
    console.error('Error deactivating API key:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate API key' },
      { status: 500 }
    )
  }
}