import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';

import { usePreferences } from '../hooks/preferencesContext'
import { useLoadedMock } from '../hooks/loadedMockContext'
import { DEFAULT_URL_MATCHER_TYPE } from '../../common/constants'
import { useMemo } from 'react'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

interface ContentTypesInputProps {
  mockingInProgress: boolean
}

const ContentTypesInput = ({ mockingInProgress }: ContentTypesInputProps) => {
  const { preferences, setPreferences } = usePreferences()
  const { loadedMock } = useLoadedMock()

  const mimeTypes = useMemo(() => {
    if (loadedMock) {
      return new Set(Object.values(loadedMock.responses).map(response => response.content.mimeType));
    }
    
    return null
  }, [loadedMock])

  console.log('[ContentTypesInput] preferences: ', preferences)

  return (
    <FormControl style={{ width: '100%' }}>
      <FormLabel id="mc--url-matching-radio-buttons-group-label">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '4px' }}>
          <span>Content Types</span>
          <Tooltip 
            title="Filter which requests will be resolved with mocked responses based on the the HTTP Content-Type header present in the reponse." 
            placement="top"
          >
            <InfoOutlinedIcon fontSize='small' color='info' />
          </Tooltip>
        </div>
      </FormLabel>
      <Autocomplete
        multiple
        id="mc--resource-types-checkboxes-tags"
        options={
          !loadedMock || !mimeTypes ?  [] : ['All', ...Array.from(mimeTypes)]
        }
        inputValue={ !loadedMock ? 'Please upload a har file to proceed...' : ''}
        disableCloseOnSelect
        value={loadedMock && preferences?.contentTypes || []}
        limitTags={1}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )}
        style={{ width: '100%' }}
        renderInput={(params) => (
          <TextField {...params} />
        )}
        disabled={mockingInProgress || !loadedMock}
        onChange={(event, newValue) => {
          if (newValue[newValue.length - 1] === 'All' && mimeTypes !== null ) {
            preferences ? 
              setPreferences({
                ...preferences,
                contentTypes: Array.from(mimeTypes)
              }) :
              setPreferences({
                urlMatching: DEFAULT_URL_MATCHER_TYPE,
                contentTypes: Array.from(mimeTypes)
              }) 
          } else {
            preferences ? 
              setPreferences({
                ...preferences,
                contentTypes: newValue
              }) :
              setPreferences({
                urlMatching: DEFAULT_URL_MATCHER_TYPE,
                contentTypes: newValue
              }) 
          }
        }}
      />
    </FormControl>
  )
}

export default ContentTypesInput
