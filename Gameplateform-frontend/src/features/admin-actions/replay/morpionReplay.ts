import type { GameActionLogDto } from '../model/types'
import { getField, tryParseJson } from './parsePayload'

export type MorpionReplayState = {
    step: number
    actorClientId: string | null
    board: string[] // 9 cases: "", "X", "O"
    nextSymbol: 'X' | 'O'
    lastMoveIndex: number | null
}

function detectWinner(board: string[]): 'X' | 'O' | null {
    const lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ]
    for (const [a,b,c] of lines) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a] as any
    }
    return null
}

export function buildMorpionReplay(actions: GameActionLogDto[]): MorpionReplayState[] {
    const moves = actions.filter((a) => a.actionType === 'MORPION_MOVE')

    const states: MorpionReplayState[] = []
    const board = Array(9).fill('') as string[]
    let nextSymbol: 'X' | 'O' = 'X'

    // Step 0 = état initial
    states.push({ step: 0, actorClientId: null, board: [...board], nextSymbol, lastMoveIndex: null })

    let step = 0
    for (const m of moves) {
        const payload = tryParseJson(m.payloadJson)
        const index = getField<number>(payload, 'index', 'Index')
        const actor = (getField<string>(payload, 'clientId', 'ClientId') ?? m.actorClientId) ?? null

        if (typeof index !== 'number' || index < 0 || index > 8) continue
        if (board[index] !== '') continue // ignore moves invalides

        board[index] = nextSymbol
        step++

        // calc winner / draw si vous voulez afficher dans UI (optionnel)
        const win = detectWinner(board)
        const draw = !win && board.every((c) => c !== '')
        if (win || draw) {
            states.push({ step, actorClientId: actor, board: [...board], nextSymbol, lastMoveIndex: index })
            // on continue pas forcément — mais on peut, en cas de logs incohérents
            nextSymbol = nextSymbol === 'X' ? 'O' : 'X'
            continue
        }

        nextSymbol = nextSymbol === 'X' ? 'O' : 'X'
        states.push({ step, actorClientId: actor, board: [...board], nextSymbol, lastMoveIndex: index })
    }

    return states
}
