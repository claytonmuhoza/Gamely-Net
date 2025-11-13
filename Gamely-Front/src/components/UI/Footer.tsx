// src/components/UI/Footer.tsx
import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
      <Box
          component="footer"
          sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)', // slate-900/60
            borderTop: '1px solid rgba(168, 85, 247, 0.2)', // purple border
            py: 10,
            px: 3,
            mt: 15,
            backdropFilter: 'blur(8px)',
          }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {/* Brand */}
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      background: 'linear-gradient(to bottom right, #a855f7, #ec4899)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5,
                    }}
                >
                  <Zap size={18} color="white" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                  Gamely
                </Typography>
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                Votre destination ultime pour les meilleurs jeux en ligne.
              </Typography>
            </Grid>

            {/* Jeux */}
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                Jeux
              </Typography>
              <List dense>
                {['Action', 'Aventure', 'Sport', 'Stratégie'].map((item) => (
                    <ListItemButton
                        key={item}
                        sx={{
                          px: 0,
                          color: 'rgba(255,255,255,0.6)',
                          '&:hover': { color: '#a855f7', backgroundColor: 'transparent' },
                        }}
                    >
                      <ListItemText primary={item} />
                    </ListItemButton>
                ))}
              </List>
            </Grid>

            {/* Support */}
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 'bold', mb: 2 }}>
                Support
              </Typography>
              <List dense>
                {['Centre d’aide', 'Contact', 'FAQ'].map((item) => (
                    <ListItemButton
                        key={item}
                        sx={{
                          px: 0,
                          color: 'rgba(255,255,255,0.6)',
                          '&:hover': { color: '#a855f7', backgroundColor: 'transparent' },
                        }}
                    >
                      <ListItemText primary={item} />
                    </ListItemButton>
                ))}
              </List>
            </Grid>
          </Grid>

          <Box
              sx={{
                borderTop: '1px solid rgba(168,85,247,0.2)',
                pt: 4,
                textAlign: 'center',
              }}
          >
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
              © {new Date().getFullYear()} Gamely. Tous droits réservés.
            </Typography>
          </Box>
        </Container>
      </Box>
  );
};

export default Footer;
