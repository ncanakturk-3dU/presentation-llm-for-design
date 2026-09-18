import { useEffect, useRef, useState } from 'react'
import './CopyButton.css'

/**
 * Put `text` on the clipboard, and say whether it landed.
 *
 * Two paths because the deck is opened two ways. On the presenting laptop the
 * origin is secure and `navigator.clipboard` exists; opened from a phone over
 * the LAN it is plain http, where the whole `clipboard` object is undefined —
 * so the old `execCommand` path is not legacy politeness, it is the only one
 * that runs on the device the deck is most often read on.
 */
export async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Denied, or no permission on this origin: fall through and try the old way.
  }
  try {
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    // Off-screen but still focusable — `display: none` cannot be selected, and
    // a fixed position keeps the page from scrolling to it.
    field.style.cssText = 'position:fixed;top:-9999px;opacity:0'
    document.body.appendChild(field)
    field.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(field)
    return ok
  } catch {
    return false
  }
}

/**
 * The copy button on a `codeui` tab, for a pane whose text is meant to be
 * taken away. It says what it did for a moment and then goes back to the
 * offer: a button that stays on `Copied` is a button you cannot tell has been
 * pressed twice. The timer is cleared on unmount because a slide is unmounted
 * by the next arrow press, which on a deck happens faster than two seconds.
 */
export default function CopyButton({ code }: { code: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  async function copy() {
    if (timer.current) clearTimeout(timer.current)
    // A clipboard both paths refuse is the presenter's browser, not a bug in
    // the deck — the button says so rather than failing silently.
    setState((await writeClipboard(code)) ? 'copied' : 'failed')
    timer.current = setTimeout(() => setState('idle'), 1600)
  }

  return (
    <button type="button" className="copybtn mono" onClick={copy} data-state={state}>
      <span aria-hidden="true">{state === 'copied' ? '✓' : state === 'failed' ? '!' : '⧉'}</span>
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Press ⌘C' : 'Copy'}
    </button>
  )
}
