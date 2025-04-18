import { createRoot } from 'react-dom/client'

import { App } from './panels'
import { LoadedMockProvider } from './hooks/loadedMockContext'
import { PreferencesProvider } from './hooks/preferencesContext'
import { RuntimeDataProvider } from './hooks/runtimeContext'

import './index.scss'

const container = document.createElement('popup')
document.body.appendChild(container)

const root = createRoot(container)

root.render(
  <RuntimeDataProvider>
    <PreferencesProvider>
      <LoadedMockProvider>
        <App />
      </LoadedMockProvider>
    </PreferencesProvider>
  </RuntimeDataProvider>
)
