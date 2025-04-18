import Button from '@mui/material/Button'

import { useLoadedMock } from '../hooks/loadedMockContext'
import { useRuntimeData } from '../hooks/runtimeContext'
import { DEFAULT_RUNTIME_DATA } from '../../store'

export default function StateButton ({ onClick }: { onClick: () => void }) {
  const { loadedMock } = useLoadedMock()
  const { runtimeData, setRuntimeData } = useRuntimeData()
  const mockingInProgress = !!runtimeData?.mockingInProgress

  return (
    <Button
      variant="contained"
      style={{ width: '100%', backgroundColor: mockingInProgress ? '#D6BE97' : '#707EBC' }}
      onClick={(() => {
        if (runtimeData) {
          setRuntimeData({
            ...runtimeData,
            mockingInProgress: !mockingInProgress
          })
        } else {
          setRuntimeData({
            ...DEFAULT_RUNTIME_DATA,
            mockingInProgress: !mockingInProgress
          })
        }
        onClick()
      })}
      disabled={loadedMock == null}
    >
      {mockingInProgress ? 'Stop Mocking' : 'Start mocking!' }
    </Button>
  )
}
