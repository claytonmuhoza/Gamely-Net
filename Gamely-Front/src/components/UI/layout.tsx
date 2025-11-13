import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Header from './Header'
import Footer from './Footer'

type Props = { children?: React.ReactNode }

const Layout: React.FC<Props> = ({ children }) => {
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

      <Box component="main" sx={{ flexGrow: 1, py: 3, px: 2 }}>
        {children}
      </Box>

      <Footer />
    </Box>
  )
}

export default Layout