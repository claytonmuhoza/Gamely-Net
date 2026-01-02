import type { Puissance4StateDto } from './types'

export function isPuissance4StateDto(x: any): x is Puissance4StateDto {
    return (
        x &&
        typeof x === 'object' &&
        typeof x.lobbyId === 'string' &&
        typeof x.phase === 'string' &&
        Array.isArray(x.players) &&
        typeof x.currentPlayerId === 'string' &&
        Array.isArray(x.grid)
    )
}
