import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'

import {
  ContentTypesInput,
  URLMatchingInput,
  FileUploadInput,
  LoadedMockSummary,
  StateButton,
  RuntimeStats
} from '../components'
import {
  RuntimeStore,
  ErrorStore,
} from '../../store'
import { useLoadedMock } from '../hooks/loadedMockContext'
import { useRuntimeData } from '../hooks/runtimeContext'
import TitleSVG from '../../assets/images/title.svg'

const runtimeStore = new RuntimeStore()
const errorStore = new ErrorStore()

/*
 Below use of broadcast is a work around to trigger wake up of background SW.
 The SW should wake up via `chrome.storage.onChanged` triggers by Store.store method
 but currently existing defect - https://bugs.chromium.org/p/chromium/issues/detail?id=1407910&q=chrome.storage.onChanged&can=2
 makes this behaviour unreliable.
*/
const wakeUpSWBroadcast = new BroadcastChannel('wake-up-service-worker')
const errorBroadcast = new BroadcastChannel('error-channel')

function Main({navigateToMockConfig} : { 
  navigateToMockConfig: () => void
}) {
  const { loadedMock } = useLoadedMock()
  const [errorMessage, setErrorMessage] = useState<string | null>()
  const { runtimeData } = useRuntimeData();
  const mockingInProgress = !!runtimeData?.mockingInProgress

  useEffect(() => {
    errorStore.registerUpdateLister((newErrorValue: string) => {
      setErrorMessage(newErrorValue)
    })
    errorStore.getAll().then((initialErrorValue: string | null) => {
      setErrorMessage(initialErrorValue)
    })
    errorBroadcast.addEventListener('message', ({ data }) => {
      console.log('[Main] error: ', data)
      alert(data)
      runtimeStore.overwrite({ mockingInProgress: false })
    })

    return () => {
        wakeUpSWBroadcast.close()
        errorBroadcast.close()
    }
  }, [])

  return (
    <Box sx={{ flexGrow: 1, width: '100%' }}>
        <Grid container rowSpacing={3} columns={1}>
            <Grid xs={1}>
                <TitleSVG height='38px' width={'100%'} />
            </Grid>
            <Grid xs={1}>
                <FileUploadInput mockingInProgress={mockingInProgress} />
            </Grid>
            <Grid xs={1}>
                <ContentTypesInput mockingInProgress={mockingInProgress} />
            </Grid>
            <Grid xs={1}>
                <URLMatchingInput mockingInProgress={mockingInProgress} />
            </Grid>
            <Grid xs={1}>
                <StateButton
                    onClick={() => {
                      wakeUpSWBroadcast.postMessage("wake up!")
                    }} 
                />
            </Grid>
            {(loadedMock?.firstPageURL != null)
            ? <a href="#" onClick={async () => {
                const [focusedTab] = await chrome.tabs.query({ active: true, currentWindow: true, highlighted: true })
                if (focusedTab.id) {
                chrome.tabs.update(focusedTab.id, { url: loadedMock.firstPageURL })
                }
            }} >Launch to first recorded request</a>
            : null}
            {(typeof errorMessage === 'string') && (
            <Grid xs={1}>
                <div style={{ color: 'rgb(211, 47, 47)', fontWeight: 400 }}>
                {`Error: ${errorMessage}`}
                </div>
            </Grid>
            )}
            <Grid xs={1}>
                {LoadedMockSummary({navigateToMockConfig})}
            </Grid>
            <Grid xs={1}>
                <RuntimeStats/>
            </Grid>
        </Grid>
    </Box>
  )
}

export default Main
