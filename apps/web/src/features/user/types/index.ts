export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  dob: string
  gender: "male" | "female" | "other"
  speciality: string
  avatar: string
}

export interface Clinic {
  id: string
  name: string
  photo: string
  street: string
  city: string
  state: string
  pincode?: string
  country: string
}

export interface Invoice {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "failed"
}

export interface Billing {
  planType: string
  card: {
    last4: string
    type: string
    expiry?: string
  }
  invoices: Invoice[]
}
