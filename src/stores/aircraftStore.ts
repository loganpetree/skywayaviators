import { create } from 'zustand'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Aircraft } from '@/types/aircraft'

interface AircraftState {
  aircraft: Aircraft[]
  loading: boolean
  error: string | null
  fetched: boolean
  fetchAircraft: () => Promise<void>
  getAircraftByTailNumber: (tailNumber: string) => Aircraft | null
}

export const useAircraftStore = create<AircraftState>((set, get) => ({
  aircraft: [],
  loading: false,
  error: null,
  fetched: false,

  fetchAircraft: async () => {
    try {
      console.log('🛩️ Zustand Store: Starting aircraft fetch...')
      set({ loading: true, error: null })

      const aircraftCollection = collection(db, 'aircraft')
      const q = query(aircraftCollection, where('isHidden', '==', false))
      const aircraftSnapshot = await getDocs(q)

      const aircraftList = aircraftSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Aircraft[]

      console.log('✅ Zustand Store: Fetched', aircraftList.length, 'aircraft')
      console.log('📋 Aircraft list:', aircraftList.map(a => ({ id: a.id, tailNumber: a.tailNumber, type: a.type })))

      set({
        aircraft: aircraftList,
        loading: false,
        fetched: true
      })
    } catch (error) {
      console.error('❌ Zustand Store: Error fetching aircraft:', error)
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch aircraft',
        loading: false
      })
    }
  },

  getAircraftByTailNumber: (tailNumber: string) => {
    const { aircraft } = get()
    return aircraft.find(plane => plane.tailNumber === tailNumber) || null
  }
}))
