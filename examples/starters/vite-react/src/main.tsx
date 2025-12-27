import React from 'react'
import ReactDOM from 'react-dom/client'

import '../../../dist/rarog-core.min.css'
import '../../../dist/rarog-utilities.min.css'
import '../../../dist/rarog-components.min.css'

import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
