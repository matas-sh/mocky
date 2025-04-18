import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import Link from '@mui/material/Link'
import { PANELS } from './App';

function MockConfig({navigateToMain} : {
    navigateToMain: () => void
}) {
    const [coolState] = useState<string>('sfef')

    return (
        <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Grid container rowSpacing={3} columns={1}>
                
            </Grid>
            <Grid container rowSpacing={3} columns={1}>
                <Link href="#" onClick={navigateToMain}>
                    <TuneRoundedIcon/>
                </Link>
            </Grid>
        </Box>
    )
} 

export default MockConfig;