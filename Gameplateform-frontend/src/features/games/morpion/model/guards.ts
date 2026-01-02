import type { MorpionStateDto } from './types'

export function isMorpionStateDto(x: any): x is MorpionStateDto {
    return (
        x &&
        typeof x === 'object' &&
        typeof x.lobbyId === 'string' &&
        typeof x.phase === 'string' &&
        Array.isArray(x.players) &&
        Array.isArray(x.board) &&
        typeof x.currentPlayerId === 'string'
    )
}
