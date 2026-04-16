import { ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface Payment {
  _id?: ObjectId
  userId: ObjectId | string
  bookingId: ObjectId | string
  amount: number
  currency: string
  paymentMethod: 'card' | 'wallet' | 'upi' | 'cash'
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'refunded_to_wallet'
  transactionId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export class PaymentModel {
  static async create(paymentData: Omit<Payment, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = await getDatabase()
    const collection = db.collection('payments')

    const { userId, bookingId, ...rest } = paymentData
    const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId
    const bookingObjectId = typeof bookingId === 'string' ? new ObjectId(bookingId) : bookingId

    const result = await collection.insertOne({
      ...rest,
      userId: userObjectId,
      bookingId: bookingObjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return result.insertedId
  }

  static async findById(id: ObjectId | string) {
    const db = await getDatabase()
    const collection = db.collection('payments')
    const objectId = typeof id === 'string' ? new ObjectId(id) : id
    return collection.findOne({ _id: objectId })
  }

  static async findByBookingId(bookingId: ObjectId | string) {
    const db = await getDatabase()
    const collection = db.collection('payments')
    const objectId = typeof bookingId === 'string' ? new ObjectId(bookingId) : bookingId
    return collection.findOne({ bookingId: objectId })
  }

  static async findByUserId(userId: ObjectId | string) {
    const db = await getDatabase()
    const collection = db.collection('payments')
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId

    return collection
      .find({ userId: objectId })
      .sort({ createdAt: -1 })
      .toArray()
  }

  static async updateStatus(paymentId: ObjectId | string, status: Payment['status']) {
    const db = await getDatabase()
    const collection = db.collection('payments')
    const objectId = typeof paymentId === 'string' ? new ObjectId(paymentId) : paymentId

    const result = await collection.findOneAndUpdate(
      { _id: objectId },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    return result
  }

  static async getAllPayments(limit: number = 10, skip: number = 0) {
    const db = await getDatabase()
    const collection = db.collection('payments')
    return collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray()
  }
}
