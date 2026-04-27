export interface PersonalDetails {
  firstName: string
  lastName: string
  email: string
  password: string
  dob: string
  gender: "male" | "female" | "other"
  speciality: string
}

export interface ClinicDetails {
  name: string
  street: string
  city: string
  state: string
  pincode: string
  country: string
}

export interface RegisterData {
  personal: PersonalDetails
  clinic: ClinicDetails
}
