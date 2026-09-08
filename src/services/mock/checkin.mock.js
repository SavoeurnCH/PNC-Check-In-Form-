/**
 * Mock check-in "backend" used while no real API is wired up. Mirrors the
 * shape a real endpoint should return so swapping to `checkin.api.js`'s real
 * call later requires no changes in the UI/store layer.
 *
 * @param {import('@/types/checkin.types').CheckInPayload} payload
 * @returns {Promise<{data: import('@/types/checkin.types').CheckInResponse}>}
 */
export function mockSubmitCheckIn(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate an occasional network failure so the UI's error/retry path
      // is exercised during development.
      if (import.meta.env.DEV && Math.random() < 0.05) {
        reject({ message: 'Network error — please try again.' })
        return
      }

      resolve({
        data: {
          visitorId: `V-${Date.now()}`,
          fullName: payload.fullName,
          checkedInAt: new Date().toISOString(),
          badgeCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
        },
      })
    }, 900)
  })
}
