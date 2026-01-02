export function isPuissance4State(x: any): boolean {
    // Adaptez quand vous aurez le vrai DTO.
    // Heuristique: board 6x7 ou flattened length 42 + currentPlayerId
    return (
        x &&
        typeof x === 'object' &&
        (Array.isArray(x.board) || Array.isArray(x.grid)) &&
        (typeof x.currentPlayerId === 'string' || typeof x.currentPlayer === 'string')
    )
}

export function isSpeedTypingState(x: any): boolean {
    // Heuristique: texte + progress/players
    return (
        x &&
        typeof x === 'object' &&
        (typeof x.text === 'string' || typeof x.sentence === 'string') &&
        (Array.isArray(x.players) || Array.isArray(x.progress))
    )
}
