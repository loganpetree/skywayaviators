import { NextRequest, NextResponse } from 'next/server'
import { addDoc, collection, doc, updateDoc, increment, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pagePath, additionalData } = body

    if (!pagePath) {
      return NextResponse.json({ error: 'pagePath is required' }, { status: 400 })
    }

    // Add individual page view record to pageViews collection
    await addDoc(collection(db, 'pageViews'), {
      pagePath,
      timestamp: new Date(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      viewerType: 'anonymous',
      userAgent: request.headers.get('user-agent') || 'unknown',
      referrer: request.headers.get('referer') || null,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      ...additionalData
    })

    // Update global page view counter
    const counterRef = doc(db, 'analytics', 'totalPageViews')
    try {
      await updateDoc(counterRef, {
        count: increment(1),
        lastUpdated: new Date()
      })
    } catch {
      // If the document doesn't exist, create it
      await setDoc(counterRef, {
        count: 1,
        lastUpdated: new Date(),
        createdAt: new Date()
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording page view:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
