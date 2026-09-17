import { Component, type ReactNode } from 'react'

/**
 * The last line under the deck. `failed` forces the caught look without
 * throwing, so the state can be declared and captured rather than only ever
 * seen when something is already broken.
 */
type Props = { children?: ReactNode; failed?: boolean }
type State = { failed: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  render() {
    if (this.state.failed || this.props.failed) {
      return (
        <div className="deck deck--msg">
          <p className="deck__msg mono">Something in the deck content could not be rendered. Check the item fields and reload.</p>
        </div>
      )
    }
    return this.props.children ?? null
  }
}
