import {IconButton, ListItemIcon, ListItemText, Menu, MenuItem} from '@mui/material'
import {Language} from '@mui/icons-material'
import {useState} from 'react'
import {useTranslation} from 'react-i18next'

const languages = [
    {code: 'fr', name: 'Français', flag: '🇫🇷'},
    {code: 'en', name: 'English', flag: 'en'}
]

export function LanguageSwitcher() {
    const {i18n} = useTranslation()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleLanguageChange = (langCode: string) => {
        void i18n.changeLanguage(langCode)
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
                    gap: 0.5,
                    borderRadius: 2,
                    px: 1,
                    '&:hover': {
                        bgcolor: 'action.hover'
                    }
                }}
                aria-label="change language"
            >
                <span style={{fontSize: '1.25rem', lineHeight: 1}}>{currentLanguage.flag}</span>
                <Language fontSize="small" sx={{opacity: 0.7}}/>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: 180,
                        mt: 1
                    }
                }}
            >
                {languages.map((lang) => (
                    <MenuItem
                        key={lang.code}
                        selected={i18n.language === lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        sx={{
                            borderRadius: 1,
                            mx: 0.5,
                            '&.Mui-selected': {
                                bgcolor: 'primary.light',
                                '&:hover': {
                                    bgcolor: 'primary.light'
                                }
                            }
                        }}
                    >
                        <ListItemIcon sx={{fontSize: '1.5rem', minWidth: 36}}>
                            {lang.flag}
                        </ListItemIcon>
                        <ListItemText>{lang.name}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )
}