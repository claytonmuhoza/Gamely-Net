import type { SpeedTypingStateDto } from './types'

export function isSpeedTypingStateDto(x: any): x is SpeedTypingStateDto {
    return (
        x &&
        typeof x === 'object' &&
        typeof x.lobbyId === 'string' &&
        typeof x.phase === 'string' &&
        typeof x.textId === 'string' &&
        typeof x.text === 'string' &&
        typeof x.startedAtUnixMs === 'number' &&
        Array.isArray(x.runners)
    )
}
