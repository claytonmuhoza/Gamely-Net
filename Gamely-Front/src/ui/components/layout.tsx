import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Header from './Header.tsx'
import {Outlet} from "react-router-dom";

type Props = { children?: React.ReactNode }

const Layout: React.FC<Props> = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #0f172a 0%, #5b21b6 50%, #0f172a 100%)',
        color: 'common.white'
      }}
    >
      <CssBaseline />
      <Header />

      <Box component="main" sx={{ flexGrow: 1, py: 3, px: 2, pt: '5rem' }}>
        <Outlet/>
      </Box>
    </Box>
  )
}

export default Layout