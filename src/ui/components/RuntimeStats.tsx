import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'

import { useRuntimeData } from '../hooks/runtimeContext'
import { useEffect, useState } from 'react'

const runtimeEventsBroadcast = new BroadcastChannel('runtime-events')

const RuntimeStats = () => {
  const [requestsMocked, setRequestsMocked] = useState(0);
  const [requestsNotMocked, setRequestsNotMocked] = useState(0);
  const { runtimeData } = useRuntimeData()

  useEffect(() => {
    if (runtimeData) {
        setRequestsMocked(runtimeData.mockedRequestCount)
        setRequestsNotMocked(runtimeData.nonMockedRequestCount)
    }
  }, [])

  useEffect(() => {
    runtimeEventsBroadcast.postMessage('retrieve');

    runtimeEventsBroadcast.addEventListener('message', ({ data }) => {
        console.log('[RuntimeStats] message posted: ', data);
        if (data.mockedRequestCount) {
            console.log('requestsMocked ++')
            setRequestsMocked(data.mockedRequestCount)
        }
        if (data.nonMockedRequestCount) {
            console.log('requestsNotMocked ++')
            setRequestsNotMocked(data.nonMockedRequestCount)
        }
    })

    return () => runtimeEventsBroadcast.close()
  }, [])

  if (runtimeData == null || !runtimeData.mockingInProgress && (requestsMocked === 0 && requestsNotMocked === 0)) {
    return null
  }

  return (
    <FormControl style={{ width: '100%' }}>
      <FormLabel id="mc--url-matching-radio-buttons-group-label">Mock session stats</FormLabel>
      <div style={{
        display: 'flex'
      }}>
        <div>
          <div> Requests replaced: {requestsMocked} </div>
          <div> Requests completed as normal: {requestsNotMocked} </div>
        </div>
      </div>
    </FormControl>
  )
}

export default RuntimeStats
