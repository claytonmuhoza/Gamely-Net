import { http } from '../../../../shared/api/http'
import type { SpeedTypingStateDto, UpdateSpeedTypingProgressRequest } from '../model/types'

export async function getSpeedTypingState(lobbyId: string): Promise<SpeedTypingStateDto> {
    const res = await http.get<SpeedTypingStateDto>(`/api/games/${lobbyId}/state`)
    return res.data
}

export async function updateSpeedTypingProgress(
    lobbyId: string,
    req: UpdateSpeedTypingProgressRequest
): Promise<void> {
    await http.post(`/api/games/${lobbyId}/speedtyping/progress`, req)
}
