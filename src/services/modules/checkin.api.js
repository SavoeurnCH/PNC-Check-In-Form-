import { api } from '../api/axios'
import { mockSubmitCheckIn } from '../mock/checkin.mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true'

/**
 * Submits the completed visitor check-in form.
 * @param {import('@/types/checkin.types').CheckInPayload} payload
 * @returns {Promise<{data: import('@/types/checkin.types').CheckInResponse}>}
 */
export const submitCheckIn = (payload) => {
  if (USE_MOCK) return mockSubmitCheckIn(payload)
  return api.post('/visitors/check-in', payload)
}
