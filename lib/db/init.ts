import { Db } from 'mongodb'

let initialized = false

export async function initializeDatabase(db: Db) {
    if (initialized) return

    try {

        // Create unique index on users.email
        await db.collection('users').createIndex(
            { email: 1 },
            { unique: true, background: true }
        )

        // Create index on bookings.userId for fast lookups
        await db.collection('bookings').createIndex(
            { userId: 1 },
            { background: true }
        )

        // Create index on payments.userId and payments.bookingId
        await db.collection('payments').createIndex(
            { userId: 1 },
            { background: true }
        )
        await db.collection('payments').createIndex(
            { bookingId: 1 },
            { background: true }
        )

        initialized = true
        console.log('Database indexes initialized successfully')
    } catch (error) {
        console.error('Error initializing database indexes:', error)
        // Don't throw — indexes failing shouldn't block the app
    }
}
