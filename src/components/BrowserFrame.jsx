import { useEffect, useState } from 'react'

export default function BrowserFrame({ url, reduced }) {
  const [ready, setReady] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), reduced ? 0 : 780)
    return () => clearTimeout(t)
  }, [reduced])

  return (
    <div className="browser">
      <div className="browser__bar">
        <span className="browser__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="browser__url">{url}</span>
      </div>
      <div className="browser__view">
        {!loaded && <span className="browser__spinner" aria-hidden="true" />}
        {ready && (
          <iframe
            className={`browser__frame ${loaded ? 'is-loaded' : ''}`}
            src={url}
            title={url}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setLoaded(true)}
          />
        )}
      </div>
    </div>
  )
}
