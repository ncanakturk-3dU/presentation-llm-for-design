import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Deck from './screens/Deck'

/**
 * The presented deck. Everything it draws is the `deck` screen, so the app and
 * designlab render one composition; `preset: 'app'` is what tells the screen
 * that this is the real thing and not a frozen state.
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Deck preset="app" />
    </ErrorBoundary>
  )
}
