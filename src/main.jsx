import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'

// ErrorBoundary — catches any render-phase exception thrown by descendants
// and replaces the crashed tree with a recoverable inline message + reload
// button. Without this, a single throw from (e.g.) the RPD engine, perio
// Dx engine, or note renderer wipes the whole app to a blank white page
// — the exact scenario that tasks #6, #15, #34, #54 (and others) were
// firefighting before this was in place.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('clinic-shea crashed:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          maxWidth: '640px',
          margin: '40px auto',
          padding: '32px',
          fontFamily: '"Fraunces", Georgia, serif',
          background: '#FBF8F2',
          border: '1px solid #7A1E1E',
          borderRadius: '4px',
          color: '#2E2A26',
        }}>
          <h1 style={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontWeight: 500,
            fontSize: '24px',
            color: '#7A1E1E',
            margin: '0 0 12px 0',
          }}>This tab hit a bug.</h1>
          <p style={{ fontSize: '14px', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            Something errored while rendering the page. The error message is
            below — if you can screenshot it and share it with the developer, who can
            fix it faster. Reloading the page usually clears the state and
            gets you back to a working view.
          </p>
          <pre style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
            background: '#fff',
            border: '1px solid #DDD7CB',
            padding: '12px',
            borderRadius: '3px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            color: '#5A5246',
          }}>{String(this.state.error?.stack || this.state.error || 'Unknown error')}</pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '8px 18px',
              border: '1px solid #7A1E1E',
              background: '#7A1E1E',
              color: '#FBF8F2',
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: '13px',
              cursor: 'pointer',
              borderRadius: '100px',
            }}
          >Reload page</button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    <Analytics />
  </StrictMode>,
)
