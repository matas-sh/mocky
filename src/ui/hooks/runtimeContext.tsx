import React, {
  useContext,
  useState,
  createContext,
  useEffect
} from 'react'

import { RuntimeStore, RuntimeData, DEFAULT_RUNTIME_DATA } from '../../common/store'

interface RuntimeContextValue {
  runtimeData: RuntimeData | null
  setRuntimeData: React.Dispatch<React.SetStateAction<RuntimeData | null>> | Function
}

const RuntimeDataContext = createContext<RuntimeContextValue>({
  runtimeData: null,
  setRuntimeData: () => {}
})

interface Props {
  children: React.ReactNode
}

const runtimeStore = new RuntimeStore()

const RuntimeDataProvider: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState<null | RuntimeData>(null)

  useEffect(() => { // reacts to updates made to store
    runtimeStore.registerUpdateLister((newRuntimeDataValue: RuntimeData) => {
      setState(newRuntimeDataValue)
    })
  }, [])

  useEffect(() => { // initialise context with what's already in the store
    runtimeStore.getAll().then((initialRuntimeDataValue) => {
      console.log('[Runtime] setting initial value for runtime context: ', initialRuntimeDataValue)
      if (initialRuntimeDataValue === null) {
        runtimeStore.store(DEFAULT_RUNTIME_DATA)
      } else {
        setState(initialRuntimeDataValue)
      }
    })
  }, [])

  const value: RuntimeContextValue = {
    runtimeData: state,
    setRuntimeData: (newRuntimeDataValue: RuntimeData) => { runtimeStore.overwrite(newRuntimeDataValue) }
  }

  return (
    <RuntimeDataContext.Provider value={value} >
      {children}
    </RuntimeDataContext.Provider>
  )
}

const useRuntimeData = () => {
  const context = useContext(RuntimeDataContext)

  if (context === undefined) {
    throw new Error('useRuntimeData must be used within a RuntimeDataProvider')
  }

  return context
}

export { RuntimeDataProvider, useRuntimeData }
