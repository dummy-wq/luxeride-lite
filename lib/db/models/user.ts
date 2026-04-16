import { ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'
import bcrypt from 'bcryptjs'

export interface User {
  _id?: ObjectId
  fullName: string
  email: string
  passwordHash: string
  phone?: string
  address?: string
  city?: string
  licenseNumber?: string
  age?: number
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  isBanned?: boolean
  role?: string
  walletBalance: number
}

export class UserModel {
  static async create(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt' | 'walletBalance'>) {
    const db = await getDatabase()
    const collection = db.collection('users')

    // Check if user already exists (ignore soft-deleted users)
    const existingUser = await collection.findOne({ email: userData.email, isActive: { $ne: false } })
    if (existingUser) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(userData.passwordHash, 10)

    const result = await collection.insertOne({
      ...userData,
      passwordHash: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      walletBalance: 0,
    })

    return result.insertedId
  }

  static async findByEmail(email: string) {
    const db = await getDatabase()
    const collection = db.collection('users')
    return collection.findOne({ email })
  }

  static async findById(id: ObjectId | string) {
    const db = await getDatabase()
    const collection = db.collection('users')
    const objectId = typeof id === 'string' ? new ObjectId(id) : id
    return collection.findOne({ _id: objectId })
  }

  static async verifyPassword(plainPassword: string, hash: string) {
    return bcrypt.compare(plainPassword, hash)
  }

  static async updateProfile(userId: ObjectId | string, updates: Partial<User>) {
    const db = await getDatabase()
    const collection = db.collection('users')
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId

    const { _id, createdAt, passwordHash, ...safeUpdates } = updates

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          ...safeUpdates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    return result
  }

  static async getAllUsers(limit: number = 50, skip: number = 0) {
    const db = await getDatabase()
    const collection = db.collection('users')
    return collection
      .find({ isActive: true })
      .limit(limit)
      .skip(skip)
      .toArray()
  }

  static async toggleStatus(userId: string, isBanned: boolean) {
    const db = await getDatabase()
    const collection = db.collection('users')
    const objectId = new ObjectId(userId)
    return collection.updateOne(
      { _id: objectId },
      { $set: { isBanned, updatedAt: new Date() } }
    )
  }

  static async timeoutUser(userId: string, minutes: number) {
    const db = await getDatabase()
    const collection = db.collection('users')
    const objectId = new ObjectId(userId)
    const bannedUntil = new Date(Date.now() + minutes * 60000)
    return collection.updateOne(
      { _id: objectId },
      { $set: { isBanned: true, bannedUntil, updatedAt: new Date() } }
    )
  }

  static async deleteUser(userId: string) {
    const db = await getDatabase()
    const collection = db.collection('users')
    const objectId = new ObjectId(userId)
    // Hard delete — fully removes the user record
    return collection.deleteOne({ _id: objectId })
  }

  static async addLuxeCash(userId: ObjectId | string, amount: number) {
    const db = await getDatabase()
    const collection = db.collection('users')
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId

    return collection.findOneAndUpdate(
      { _id: objectId },
      {
        $inc: { walletBalance: amount },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: 'after' }
    )
  }
}
