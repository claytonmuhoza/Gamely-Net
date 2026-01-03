import { Box, Button, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Home, SentimentVeryDissatisfied } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export function NotFoundPage() {
    const { t } = useTranslation()
    const nav = useNavigate()

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
                textAlign: 'center',
                px: 3
            }}
        >
            <Box
                sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    bgcolor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                }}
            >
                <SentimentVeryDissatisfied sx={{ fontSize: 64, color: 'grey.400' }} />
            </Box>

            <Typography
                variant="h1"
                sx={{
                    fontWeight: 800,
                    fontSize: { xs: '4rem', md: '6rem' },
                    color: 'text.secondary',
                    mb: 1
                }}
            >
                404
            </Typography>

            <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
            >
                {t('common.pageNotFound')}
            </Typography>

            <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 400, mb: 4 }}
            >
                {t('common.pageNotFoundDescription')}
            </Typography>

            <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    startIcon={<Home />}
                    onClick={() => nav('/')}
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    {t('common.backHome')}
                </Button>
            </Stack>
        </Box>
    )
}
