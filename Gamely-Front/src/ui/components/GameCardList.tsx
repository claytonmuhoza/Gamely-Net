import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Box,
    Chip,
    IconButton,
    Typography,
    Button,
} from '@mui/material';
import { Play } from 'lucide-react';

interface Game {
  id: number;
  title: string;
  category: string;
  rating: number;
  players: string;
  duration: string;
  image: string;
  featured?: boolean;
}

interface GameCardListProps {
  game: Game;
}

const GameCardList: React.FC<GameCardListProps> = ({ game }) => {
  return (
      <Card
          sx={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            borderRadius: 3,
            border: '1px solid rgba(168, 85, 247, 0.2)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.3s',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'rgba(168, 85, 247, 0.5)',
              transform: 'translateY(-4px)',
            },
          }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
              component="div"
              sx={{
                paddingTop: '56.25%',
                background: 'linear-gradient(to bottom right, #9333ea, #ec4899)',
                position: 'relative',
              }}
          >
            <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                  transition: 'all 0.3s',
                }}
            />

            {game.featured && (
                <Chip
                    label="POPULAIRE"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      backgroundColor: '#eab308',
                      color: 'black',
                      fontWeight: 'bold',
                      fontSize: '0.7rem',
                    }}
                />
            )}

            <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: 0,
                  transition: 'opacity 0.3s',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
            >
              <IconButton
                  sx={{
                    width: 56,
                    height: 56,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      transform: 'scale(1.1)',
                    },
                  }}
              >
                <Play size={28} color="white" fill="white" style={{ marginLeft: 2 }} />
              </IconButton>
            </Box>
          </CardMedia>
        </Box>

        <CardContent>
          <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                mb: 1.5,
                fontSize: '1.125rem',
              }}
          >
            {game.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Chip
                label={game.category}
                size="small"
                sx={{
                  backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  border: 'none',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                }}
            />
          </Box>

          <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                background: 'linear-gradient(to right, #9333ea, #ec4899)',
                color: 'white',
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
                '&:hover': {
                  background: 'linear-gradient(to right, #7e22ce, #db2777)',
                },
              }}
          >
            Jouer maintenant
          </Button>
        </CardContent>
      </Card>
  );
};
export default GameCardList;