import type { MorpionStateDto } from '../model/types'

export function getPlayerBySymbol(state: MorpionStateDto, symbol: 'X' | 'O') {
    return state.players.find((p) => p.symbol === symbol) ?? null
}

export function getPseudo(state: MorpionStateDto, clientId: string) {
    return state.players.find((p) => p.clientId === clientId)?.pseudo ?? 'Joueur'
}

export function getWinnerPseudo(state: MorpionStateDto) {
    if (!state.winnerClientId) return null
    return getPseudo(state, state.winnerClientId)
}
