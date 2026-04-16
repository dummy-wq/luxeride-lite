import { ObjectId } from 'mongodb'
import { getDatabase } from '../mongodb'

export interface Booking {
  _id?: ObjectId
  userId: ObjectId | string
  carId: number
  carName: string
  carPrice: number
  startDate: Date
  endDate: Date
  pickupLocation: string
  dropoffLocation: string
  numberOfDays: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  cancellationDate?: Date
  selectedDays?: string[] // Array of ISO dates
  qrCode?: string
  expireAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export class BookingModel {
  static async create(bookingData: Omit<Booking, '_id' | 'createdAt' | 'updatedAt'>) {
    const db = await getDatabase()
    const collection = db.collection('bookings')

    const { userId, ...rest } = bookingData
    const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId

    const result = await collection.insertOne({
      ...rest,
      userId: userObjectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return result.insertedId
  }

  static async findById(id: ObjectId | string) {
    const db = await getDatabase()
    const collection = db.collection('bookings')
    const objectId = typeof id === 'string' ? new ObjectId(id) : id
    return collection.findOne({ _id: objectId })
  }

  static async findByUserId(userId: ObjectId | string) {
    const db = await getDatabase()
    const collection = db.collection('bookings')
    const objectId = typeof userId === 'string' ? new ObjectId(userId) : userId

    return collection
      .find({ userId: objectId })
      .sort({ createdAt: -1 })
      .toArray()
  }

  static async updateStatus(
    bookingId: ObjectId | string,
    status: Booking['status']
  ) {
    const db = await getDatabase()
    const collection = db.collection('bookings')
    const objectId = typeof bookingId === 'string' ? new ObjectId(bookingId) : bookingId

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

  static async getAllBookings(limit: number = 10, skip: number = 0) {
    const db = await getDatabase()
    const collection = db.collection('bookings')
    return collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .toArray()
  }

  static async updateBooking(
    bookingId: ObjectId | string,
    updates: Partial<Booking>
  ) {
    const db = await getDatabase()
    const collection = db.collection('bookings')
    const objectId = typeof bookingId === 'string' ? new ObjectId(bookingId) : bookingId

    const { _id, createdAt, ...safeUpdates } = updates

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
}
