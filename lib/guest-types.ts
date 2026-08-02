export type GuestInvite = {
  name: string
  maxGuests: number
  token: string
  status: 'pending' | 'responded'
  attending: 'yes' | 'no' | null
  attendingCount: number | null
}
