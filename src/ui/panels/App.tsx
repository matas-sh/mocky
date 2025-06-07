import React, { useState } from 'react'
import Main from './Main'
import MockConfig from './MockConfig'

export enum PANELS {
  MAIN = 'MAIN',
  MOCK_CONFIG = 'MOCK_CONFIG'
}

enum NAV_CONTEXTS {
  navigateToMain = 'navigateToMain',
  navigateToMockConfig = 'navigateToMockConfig'
}

const PanelMap = {
  [PANELS.MAIN]: Main,
  [PANELS.MOCK_CONFIG]: MockConfig
} as { 
  [key in PANELS]: (arg: { [ key in NAV_CONTEXTS]: () => void}) => React.ReactNode 
}

function App () {
  const [panelInView, setPanelInView] = useState<PANELS>(PANELS.MAIN)

  return (
    <div id='app-root'>
      {
        panelInView === PANELS.MAIN ?
          <Main navigateToMockConfig={() => setPanelInView(PANELS.MOCK_CONFIG)} />
          :
          <MockConfig navigateToMain={() => setPanelInView(PANELS.MAIN)}/>
      }
    </div>
  )
}

export default App
