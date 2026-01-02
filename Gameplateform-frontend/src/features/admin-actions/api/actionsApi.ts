import { http } from '../../../shared/api/http'
import type { GameActionLogDto } from '../model/types'

export async function getGameActions(lobbyId: string): Promise<GameActionLogDto[]> {
    const res = await http.get<GameActionLogDto[]>(`/api/games/${lobbyId}/actions`)
    return res.data
}
