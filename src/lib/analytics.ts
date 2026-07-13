declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

function push(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(payload)
}

export const analytics = {
  layoutSwitch(layout: 'cards' | 'table' | 'swipe') {
    push({ event: 'layout_switch', layout })
  },

  filterAudience(audience: string) {
    push({ event: 'filter_audience', audience })
  },

  filterDateRange(dateFrom: string, dateTo: string) {
    push({ event: 'filter_date_range', date_from: dateFrom, date_to: dateTo })
  },

  // search_term is a recognised GA4 parameter — appears in Search Console reports
  filterSearch(searchTerm: string) {
    push({ event: 'filter_search', search_term: searchTerm })
  },

  filterClear() {
    push({ event: 'filter_clear' })
  },

  submitMajlisStart() {
    push({ event: 'submit_majlis_start' })
  },

  submitMajlisSuccess(audience: string) {
    push({ event: 'submit_majlis_success', audience })
  },

  submitMajlisError() {
    push({ event: 'submit_majlis_error' })
  },

  otpRequested() {
    push({ event: 'auth_otp_requested' })
  },

  signInSuccess() {
    push({ event: 'auth_sign_in_success' })
  },

  signOut() {
    push({ event: 'auth_sign_out' })
  },
}
