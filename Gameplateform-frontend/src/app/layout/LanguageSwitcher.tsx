import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { Language } from '@mui/icons-material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
]

export function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode)
        handleClose()
    }

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="small"
                sx={{
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                }}
                aria-label="change language"
            >
                <span style={{ fontSize: '1.25rem' }}>{currentLanguage.flag}</span>
                <Language fontSize="small" />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: 180
                    }
                }}
            >
                {languages.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        selected={i18n.language === lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                    >
                        <ListItemIcon sx={{ fontSize: '1.5rem' }}>
                            {lang.flag}
                        </ListItemIcon>
                        <ListItemText>{lang.name}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}