import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import Link from '@mui/material/Link'
import { Response } from 'har-format'
import { useLoadedMock } from '../hooks/loadedMockContext'

const LoadedMockSummary = ({navigateToMockConfig} : { navigateToMockConfig: () => void}) => {
  const { loadedMock } = useLoadedMock()

  if (loadedMock == null) {
    return null
  }

  const [successfulRequests, failedRequests] = Object.values(loadedMock.responses).reduce<Response[][]>((acc, val) => {
    if (val.status === 200) {
      acc[0].push(val)
    } else {
      acc[1].push(val)
    }

    return acc
  }, [[], []])

  return (
    <FormControl style={{ width: '100%' }}>
      <FormLabel id="mc--url-matching-radio-buttons-group-label">Loaded mock summary</FormLabel>
      <div style={{
        display: 'flex'
      }}>
        <div>
          <div> Total requests/responses: {successfulRequests.length + failedRequests.length} </div>
          <div> Successful requests/responses: {successfulRequests.length} </div>
          <div> Failed requests/responses: {failedRequests.length} </div>
        </div>
        <div style={{
          justifySelf: 'flex-start',
          flexGrow: 4,
          textAlign: 'end',
          height: '100%'
        }}>
          <Link href="#" onClick={navigateToMockConfig}>
            <TuneRoundedIcon/>
          </Link>
        </div>
      </div>
    </FormControl>
  )
}

export default LoadedMockSummary
