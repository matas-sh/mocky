import React from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { usePreferences } from '../hooks/preferencesContext'
import { URL_MATCHER_TYPES } from '../../common/constants'

interface URLMatchingInputProps {
  mockingInProgress: boolean
}

export default function URLMatchingInput ({ mockingInProgress }: URLMatchingInputProps) {
  const { preferences, setPreferences } = usePreferences()

  console.log('[URLMatchingInput] preferences: ', preferences)

  return (
    <FormControl>
      <FormLabel id="mc--url-matching-radio-buttons-group-label">
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', columnGap: '4px' }}>
          <span>URL Matching</span>
          <Tooltip 
            title={
              <div style={{ display: 'flex', flexDirection: 'column'}}>
                <span>Allows control on how the outgoing requests are matched. Selecting 'Ignore domain' will match request from url.pathname onwards. 'Match domain' requires URLs in the HAR file to match outgoing requests' URLs exactly, for the requests to be mocked.</span>
              </div>
            }
            placement="top"
          >
            <InfoOutlinedIcon fontSize='small' color='info' />
          </Tooltip>
        </div>
      </FormLabel>
      <RadioGroup
        aria-labelledby="mc--url-matching-radio-buttons-group-label"
        name="url-matching-radio-buttons-group"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          preferences ?
            setPreferences({
              ...preferences,
              urlMatching: (event.target as HTMLInputElement).value
            }) :
            setPreferences({
              contentTypes: [],
              urlMatching: (event.target as HTMLInputElement).value
            })
        }}
        value={preferences?.urlMatching || null}
        row
      >
        {URL_MATCHER_TYPES.map(({ value, label }) => (
          <FormControlLabel
            value={value}
            control={<Radio />}
            label={label}
            key={label}
            disabled={mockingInProgress}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
