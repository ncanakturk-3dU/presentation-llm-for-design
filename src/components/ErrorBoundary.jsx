import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="app app--msg">
          <p className="app__msg">Something in content.json could not be rendered. Check the item fields and reload.</p>
        </div>
      )
    }
    return this.props.children
  }
}
