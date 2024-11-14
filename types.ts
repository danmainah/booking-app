export type Accomodation = {
    [x: string]: unknown
    type: string
    no_of_rooms: number
    images: string[]
    available: boolean
  }

export type Booking = {
    accomodation: string 
    author: string 
    checkIn: Date
    checkOut: Date
  }