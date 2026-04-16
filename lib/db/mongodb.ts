import { MongoClient, Db } from 'mongodb'
import { initializeDatabase } from './init'
import { env } from '../env'

const uri = env.MONGODB_URI

const options = {
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (env.isDev) {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = globalThis as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  try {
    const client = await clientPromise
    const db: Db = client.db(env.MONGODB_DB)

    // Initialize indexes on first connection
    // We can just rely on the existing init logic, just making sure it runs once
    // A robust way to ensure it only runs once per server startup
    if (!('_mongoInitialized' in globalThis)) {
      await initializeDatabase(db)
        ; (globalThis as any)._mongoInitialized = true
    }

    return { client, db }
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}

export async function closeDatabase() {
  const client = await clientPromise;
  await client.close()
}
