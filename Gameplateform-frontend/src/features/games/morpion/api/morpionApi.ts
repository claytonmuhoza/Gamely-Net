import { http } from '../../../../shared/api/http'
import type { MorpionStateDto, PlayMorpionMoveRequest } from '../model/types'

export async function getMorpionState(lobbyId: string): Promise<MorpionStateDto> {
    const res = await http.get<MorpionStateDto>(`/api/games/${lobbyId}/state`)
    return res.data
}

export async function playMorpionMove(lobbyId: string, req: PlayMorpionMoveRequest): Promise<void> {
    await http.post(`/api/games/${lobbyId}/morpion/move`, req)
}
