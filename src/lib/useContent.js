import { useEffect, useState } from 'react'

export function useContent() {
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  useEffect(() => {
    let alive = true
    fetch(import.meta.env.BASE_URL + 'content.json', { cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
      .then((data) => { if (alive) setState({ status: 'ready', data, error: null }) })
      .catch((err) => { if (alive) setState({ status: 'error', data: null, error: String(err) }) })
    return () => { alive = false }
  }, [])
  return state
}
