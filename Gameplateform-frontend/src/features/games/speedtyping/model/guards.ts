import type { SpeedTypingStateDto, SpeedTypingRunnerDto } from './types'

export function isSpeedTypingRunnerDto(x: any): x is SpeedTypingRunnerDto {
    return (
        x &&
        typeof x === 'object' &&
        typeof x.clientId === 'string' &&
        typeof x.pseudo === 'string' &&
        typeof x.typedText === 'string' &&
        typeof x.correctChars === 'number' &&
        typeof x.errorCount === 'number' &&
        typeof x.wpm === 'number' &&
        typeof x.accuracy === 'number' &&
        (x.finishedAtUnixMs === null || typeof x.finishedAtUnixMs === 'number') &&
        (x.rank === null || typeof x.rank === 'number')
    )
}

export function isSpeedTypingStateDto(x: any): x is SpeedTypingStateDto {
    return (
        x &&
        typeof x === 'object' &&
        typeof x.lobbyId === 'string' &&
        typeof x.phase === 'string' &&
        typeof x.textId === 'string' &&
        typeof x.text === 'string' &&
        typeof x.startedAtUnixMs === 'number' &&
        (x.endedAtUnixMs === null || typeof x.endedAtUnixMs === 'number') &&
        Array.isArray(x.runners) &&
        x.runners.every(isSpeedTypingRunnerDto)
    )
}