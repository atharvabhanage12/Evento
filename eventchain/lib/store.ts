import { create } from 'zustand'
import { v4 as randomUUID } from 'uuid'

// Helper function to generate random integer
const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export interface Ticket {
  id: number
  eventId: number
  eventName: string
  purchaseDate: string,
  nftId: string
}

export interface AuthState {
  userId: number,
  walletAddress: string,
  isLoggedIn: boolean
  tickets: Ticket[]
  login: () => void
  logout: () => void
  addTicket: (ticket: Ticket) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  // random userId
  userId: getRandomInt(1, 1000),
  walletAddress: randomUUID().slice(0, 8),
  isLoggedIn: false,
  tickets: [],
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
  addTicket: (ticket) => set((state) => ({ tickets: [...state.tickets, ticket] })),
}))

