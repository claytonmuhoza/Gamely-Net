import { useState } from "react";
import {
    Box,
    Typography,
    Container,
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    Pagination,
} from "@mui/material";
import { Search, Gamepad2 } from "lucide-react";
import GameCardList from "../components/GameCardList.tsx";

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

const GamesListPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("popular");
    const [currentPage, setCurrentPage] = useState(1);

    const categories = [
        "Tous les jeux",
        "Action",
        "Aventure",
        "RPG",
        "Sport",
        "Course",
        "Stratégie",
        "Puzzle",
        "Simulation",
    ];

    const games: Game[] = [
        { id: 1, title: "Cyber Warriors", category: "Action", rating: 4.8, players: "2.4M", duration: "30-45 min", image: "", featured: true },
        { id: 2, title: "Magic Quest", category: "RPG", rating: 4.9, players: "1.8M", duration: "60+ min", image: "", featured: true },
        { id: 3, title: "Speed Racing", category: "Course", rating: 4.7, players: "3.1M", duration: "15-20 min", image: "" },
        { id: 4, title: "Dragon Legends", category: "Aventure", rating: 4.6, players: "1.2M", duration: "45-60 min", image: "" },
        { id: 5, title: "Football Manager", category: "Sport", rating: 4.5, players: "900K", duration: "30 min", image: "" },
        { id: 6, title: "Castle Defense", category: "Stratégie", rating: 4.8, players: "1.5M", duration: "20-30 min", image: "" },
        { id: 7, title: "Puzzle Master", category: "Puzzle", rating: 4.4, players: "2.2M", duration: "10-15 min", image: "" },
        { id: 8, title: "Farm Simulator", category: "Simulation", rating: 4.3, players: "800K", duration: "40-50 min", image: "" },
        { id: 9, title: "Space Invaders", category: "Action", rating: 4.7, players: "2.8M", duration: "20-25 min", image: "", featured: true },
        { id: 10, title: "Medieval Quest", category: "RPG", rating: 4.9, players: "1.6M", duration: "60+ min", image: "" },
        { id: 11, title: "Rally Championship", category: "Course", rating: 4.6, players: "1.9M", duration: "25-30 min", image: "" },
        { id: 12, title: "Treasure Hunt", category: "Aventure", rating: 4.5, players: "1.3M", duration: "35-45 min", image: "" },
    ];

    // --- Filtrage ---
    let filteredGames = games.filter((game) => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || game.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // --- Tri ---
    filteredGames = filteredGames.sort((a, b) => {
        switch (sortBy) {
            case "rating":
                return b.rating - a.rating;
            case "az":
                return a.title.localeCompare(b.title);
            case "newest":
                return b.id - a.id;
            default:
                return b.players.localeCompare(a.players);
        }
    });

    // --- Pagination ---
    const gamesPerPage = 9;
    const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
    const startIndex = (currentPage - 1) * gamesPerPage;
    const displayedGames = filteredGames.slice(startIndex, startIndex + gamesPerPage);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(to bottom right, #0f172a, #581c87, #0f172a)",
                pt: 12,
                pb: 8,
            }}
        >
            <Container maxWidth="lg">
                {/* --- HEADER --- */}
                <Box sx={{ mb: 6 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Gamepad2 size={40} color="#a855f7" />
                        <Typography variant="h3" sx={{ color: "white", fontWeight: "bold", fontSize: { xs: "2rem", md: "2.5rem" } }}>
                            Tous les jeux
                        </Typography>
                    </Box>
                    <Typography sx={{ color: "rgba(209,213,219,1)", fontSize: "1.125rem" }}>
                        Découvrez notre collection de {games.length} jeux incroyables
                    </Typography>
                </Box>

                {/* --- FILTRES --- */}
                <Box
                    sx={{
                        backgroundColor: "rgba(30, 41, 59, 0.5)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(168, 85, 247, 0.2)",
                        borderRadius: 3,
                        p: 3,
                        mb: 4,
                    }}
                >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Rechercher un jeu..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search size={20} color="#a855f7" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        color: "white",
                                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                                        borderRadius: 2,
                                        "& fieldset": { borderColor: "rgba(168,85,247,0.3)" },
                                        "&:hover fieldset": { borderColor: "rgba(168,85,247,0.5)" },
                                        "&.Mui-focused fieldset": { borderColor: "#a855f7" },
                                    },
                                    "& .MuiInputBase-input::placeholder": {
                                        color: "rgba(156, 163, 175, 1)",
                                        opacity: 1,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <Select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    sx={{
                                        color: "white",
                                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                                        borderRadius: 2,
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(168,85,247,0.3)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(168,85,247,0.5)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#a855f7",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: "#a855f7",
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: "#1e293b",
                                                color: "white",
                                                border: "1px solid rgba(168, 85, 247, 0.2)",
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="all">Toutes catégories</MenuItem>
                                    {categories.slice(1).map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                            {cat}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <FormControl fullWidth>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    sx={{
                                        color: "white",
                                        backgroundColor: "rgba(15, 23, 42, 0.5)",
                                        borderRadius: 2,
                                        "& .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(168,85,247,0.3)",
                                        },
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "rgba(168,85,247,0.5)",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#a855f7",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            color: "#a855f7",
                                        },
                                    }}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: "#1e293b",
                                                color: "white",
                                                border: "1px solid rgba(168, 85, 247, 0.2)",
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="popular">Plus populaires</MenuItem>
                                    <MenuItem value="rating">Mieux notés</MenuItem>
                                    <MenuItem value="newest">Plus récents</MenuItem>
                                    <MenuItem value="az">A - Z</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>

                {/* --- RÉSULTATS --- */}
                <Typography sx={{ color: "rgba(209,213,219,1)", mb: 3, fontSize: "0.875rem" }}>
                    {filteredGames.length} jeu{filteredGames.length > 1 ? "x" : ""} trouvé
                    {filteredGames.length > 1 ? "s" : ""}
                </Typography>

                {/* --- GRILLE DE JEUX --- */}
                <Grid container spacing={3} sx={{ mb: 6 }}>
                    {displayedGames.map((game) => (
                        <Grid item xs={12} sm={6} md={4} key={game.id}>
                            <GameCardList game={game} />
                        </Grid>
                    ))}
                </Grid>

                {/* --- PAGINATION --- */}
                {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(e, page) => setCurrentPage(page)}
                            size="large"
                            sx={{
                                "& .MuiPaginationItem-root": {
                                    color: "white",
                                    borderColor: "rgba(168,85,247,0.3)",
                                    "&:hover": {
                                        backgroundColor: "rgba(168,85,247,0.2)",
                                        borderColor: "rgba(168,85,247,0.5)",
                                    },
                                    "&.Mui-selected": {
                                        background: "linear-gradient(to right, #9333ea, #ec4899)",
                                        borderColor: "transparent",
                                        "&:hover": {
                                            background: "linear-gradient(to right, #7e22ce, #db2777)",
                                        },
                                    },
                                },
                            }}
                        />
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default GamesListPage;
