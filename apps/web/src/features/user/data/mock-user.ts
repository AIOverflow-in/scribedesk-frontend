import type { User, Clinic, Billing } from "../types"

export const mockUser: User = {
  id: "u1",
  firstName: "Sarah",
  lastName: "Mitchell",
  email: "sarah.mitchell@clinic.com",
  dob: "1985-03-22",
  gender: "female",
  speciality: "Family Medicine",
  avatar: "https://i.pravatar.cc/150?u=sarah",
}

export const mockClinic: Clinic = {
  id: "c1",
  name: "Mitchell Family Medicine",
  photo: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=200&h=200&fit=crop",
  street: "742 Evergreen Terrace",
  city: "Springfield",
  state: "Oregon",
  pincode: "97477",
  country: "United States",
}

export const mockBilling: Billing = {
  planType: "Professional",
  card: {
    last4: "4242",
    type: "Visa",
    expiry: "12/2027",
  },
  invoices: [
    { id: "inv-1", date: "2026-04-01", amount: 299, status: "paid" },
    { id: "inv-2", date: "2026-03-01", amount: 299, status: "paid" },
    { id: "inv-3", date: "2026-02-01", amount: 299, status: "paid" },
    { id: "inv-4", date: "2026-01-01", amount: 249, status: "paid" },
    { id: "inv-5", date: "2025-12-01", amount: 249, status: "paid" },
  ],
}
