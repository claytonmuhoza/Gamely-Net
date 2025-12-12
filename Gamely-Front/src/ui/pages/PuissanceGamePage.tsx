import {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, Box, Button, CircularProgress, Container, Stack, Typography} from '@mui/material';
import Game from '../components/puissance/Game';
import {useCurrentPlayer} from '../../app/hook/useCurrentPlayer';
import {useCases} from '../../app/compositionRoot';
import {PuissanceSignalRClient} from "../../infrastructure/realtime/puissance/PuissanceSignalRClient.ts";


interface GameInstance {
    id: string;
    board: string;
    currentPlayerId: string;
    winnerPlayerId: string | null;
    isFinished: boolean;
    isDraw: boolean;
    playerOneId: string;
}

export default function PuissanceGamePage() {
    const {gameId} = useParams<{ gameId: string }>();
    const navigate = useNavigate();
    const {player} = useCurrentPlayer();

    const [gameInstance, setGameInstance] = useState<GameInstance | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [playing, setPlaying] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Placeholder pour un client SignalR (si vous ajoutez un client dédié comme pour Morpion)
    const signalRClientRef = useRef<PuissanceSignalRClient | null>(null);

    // Rediriger si pas de joueur
    useEffect(() => {
        if (!player) {
            navigate('/');
        }
    }, [player, navigate]);

    // Charger l'état initial via useCases (REST)
    useEffect(() => {
        if (!gameId || !player) return;

        const load = async () => {
            try {
                setLoading(true);
                // Si vous avez un useCase pour puissance : useCases.puissance.get.execute
                const useCase = (useCases as any).puissance?.get;
                let data = null;
                if (useCase && useCase.execute) {
                    data = await useCase.execute(gameId);
                }
                if (data) {
                    setGameInstance(data as GameInstance);
                } else {
                    // fallback mock ou erreur si useCase absent
                    alert('UseCase de récupération de partie non implémenté');
                }
            } catch (err) {
                console.error(err);
                setError('Erreur lors du chargement de la partie');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [gameId, player]);

    // Exemple de connexion SignalR si vous implémentez un client similaire à MorpionSignalRClient
    useEffect(() => {
        if (!gameId || !player) return;
        const client = new PuissanceSignalRClient();
        signalRClientRef.current = client;

        client.onGameUpdated((g) => {
            console.log('[PuissanceGamePage] Game mis à jour via SignalR', g);
            setGameInstance(g)
        });

        client.onError((e) => {
            console.error('PuissanceHub error', e);
            setError(e.message ?? String(e))
        });
        (async () => {
            try {
                await client.joinGame(gameId, player.id);
            } catch (e) {
                setError('Erreur temps réel');
            }
        })();
        return () => {
            client.stop()?.catch(() => {
            });
            signalRClientRef.current = null;
        };
    }, [gameId, player]);

    const handlePlayAction = async (columnIndex: number) => {
        if (!gameInstance || !gameId || !player) return;

        const client = signalRClientRef.current;
        try {
            setPlaying(true);
            setError(null);

            if (client?.playMove) {
                // si un client SignalR est disponible
                await client.playMove(gameId, player.id, columnIndex);
                // on attend l'évènement de mise à jour
                return;
            }

            // Fallback : appeler le useCase REST si disponible
            if ((useCases as any).puissance?.play?.execute) {
                const updated = await (useCases as any).puissance.play.execute({
                    gameId,
                    playerId: player.id,
                    columnIndex
                });
                if (updated) setGameInstance(updated as GameInstance);
            } else {
                // Aucun back-end connecté : log et mise à jour locale minimale
                console.log(`Play fallback: column ${columnIndex}`);
            }
        } catch (err) {
            console.error(err);
            setError('Erreur lors du coup (temps réel)');
        } finally {
            setPlaying(false);
        }
    };

    // Wrapper garanti de type `(columnIndex: number) => void`
    const onPlayWrapper = (columnIndex: number) => {
        if (playing) return; // ignore les clics pendant l'envoi
        void handlePlayAction(columnIndex);
    };

    if (!player) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    padding: '16px',
                }}
            >
                <Alert severity="warning" sx={{maxWidth: '500px'}}>
                    Veuillez d&apos;abord choisir un pseudo.
                </Alert>
            </div>
        );
    }

    if (loading || !gameInstance) {
        return (
            <Container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
                <Stack spacing={2} alignItems="center">
                    <CircularProgress size={60}/>
                    <Typography color="text.secondary">Chargement de la partie...</Typography>
                </Stack>
            </Container>
        );
    }

    return (
        <Box sx={{minHeight: '100vh', p: 4}}>
            <Stack spacing={2} alignItems="center">
                {error && (
                    <Alert severity="error" onClose={() => setError(null)} sx={{width: '100%', maxWidth: 800}}>
                        {error}
                    </Alert>
                )}

                {playing && (
                    <Alert severity="info" sx={{width: '100%', maxWidth: 800}}>
                        Coup en cours d&apos;envoi...
                    </Alert>
                )}

                <Game gameInstance={gameInstance} myPlayerId={player.id} onPlayAction={onPlayWrapper}/>

                <Button variant="outlined" onClick={() => window.location.reload()} sx={{mt: 2}}>
                    Recharger l&apos;état
                </Button>
            </Stack>
        </Box>
    );
}