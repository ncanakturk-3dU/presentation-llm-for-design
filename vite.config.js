import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = dirname(fileURLToPath(import.meta.url))

/**
 * Keep `src/screens/` in step with `content/`, without anyone remembering to.
 *
 * Those files — one `<Deck>.tsx` wrapper and one `<Deck>.states.json` per deck —
 * are generated from the decks by `scripts/lab-states.ts`, and they exist only
 * for designlab: the app mounts `DeckView` itself, so nothing in the bundle
 * imports them. That is exactly why they used to rot. A stale states file breaks
 * nothing loudly — the pinned slide id names content that is gone, the deck
 * falls back to its first slide, and every capture becomes a picture of the
 * cover — so the one place it was ever noticed was a screenshot somebody
 * happened to re-read.
 *
 * The studio runs this dev server, so running the generator here is running it
 * at the only moment that matters: the states are rebuilt before the studio
 * reads them, and again on every save under `content/`.
 *
 * Dev only. A production build never touches `src/screens/`, and writing files
 * out of a build is a surprise nobody asked for.
 */
function labStates() {
  let running = false
  let again = false

  const run = () => {
    if (running) {
      // A save during a run would otherwise be swallowed; queue one re-run
      // rather than a job per keystroke.
      again = true
      return
    }
    running = true
    const child = spawn('npx', ['tsx', 'scripts/lab-states.ts'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (out += d))
    child.on('error', (err) => {
      running = false
      console.error(`[lab:states] could not run the generator — ${err.message}`)
    })
    child.on('close', (code) => {
      running = false
      // Only say something when there is something to say: a deck that does not
      // typecheck, or a states file that actually changed. "up to date" on every
      // keystroke is noise.
      if (code !== 0) console.error(`[lab:states] failed\n${out.trim()}`)
      else {
        const wrote = out.split('\n').filter((l) => l.includes('wrote '))
        if (wrote.length) console.log(`[lab:states] ${wrote.map((l) => l.trim().replace(/^wrote\s+/, '')).join(', ')}`)
      }
      if (again) {
        again = false
        run()
      }
    })
  }

  const contentDir = resolve(root, 'content')
  const isDeck = (file) => file.startsWith(contentDir) && file.endsWith('.ts')

  return {
    name: 'lab-states',
    apply: 'serve',
    configureServer(server) {
      run()
      server.watcher.on('add', (f) => isDeck(f) && run())
      server.watcher.on('change', (f) => isDeck(f) && run())
      server.watcher.on('unlink', (f) => isDeck(f) && run())
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), labStates()],
})
