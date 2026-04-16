// User Types
export interface UserProfile {
  id: string
  fullName: string
  email: string
  phone?: string
  address?: string
  city?: string
  licenseNumber?: string
  createdAt?: string
  updatedAt?: string
  walletBalance?: number
  role?: string
}

export interface AuthResponse {
  message: string
  token: string
  userId: string
  user?: UserProfile
}

// Booking Types
export interface Booking {
  id: string
  carId: number
  carName: string
  carPrice: number
  carImage?: string
  startDate: string | Date
  endDate: string | Date
  pickupLocation: string
  dropoffLocation: string
  numberOfDays: number
  totalCost: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  qrCode?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
  expireAt?: string | Date
}

// Payment Types
export interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  paymentMethod: 'card' | 'wallet' | 'upi' | 'cash'
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'refunded_to_wallet'
  transactionId?: string
  carName?: string
  notes?: string
  createdAt: string | Date
  updatedAt?: string
}

// Car Types
export interface Car {
  id: number
  name: string
  model: string
  image: string
  mileage: string
  seats: number
  price: string
  pricePerDay: number
  fuel: string
  category: string
  transmission: string
}

// API Response Types
export interface ApiResponse<T> {
  message?: string
  data?: T
  error?: string
}

// Authentication Context Type
export interface AuthContextType {
  user: UserProfile | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (fullName: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
}

// Form Data Types
export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

export interface BookingFormData {
  carId: number
  startDate: Date
  endDate: Date
  pickupLocation: string
  dropoffLocation: string
}

export interface PaymentFormData {
  bookingId: string
  amount: number
  paymentMethod: 'card' | 'wallet' | 'upi' | 'cash'
}
