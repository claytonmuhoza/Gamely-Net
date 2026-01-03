import { http } from '../../../shared/api/http'
import type { GameActionLogDto, LobbyListItemDto } from '../model/types'

export async function getGameActions(lobbyId: string): Promise<GameActionLogDto[]> {
    const res = await http.get<GameActionLogDto[]>(`/api/games/${lobbyId}/actions`)
    return res.data
}

export async function getAllLobbies(): Promise<LobbyListItemDto[]> {
    const res = await http.get<LobbyListItemDto[]>('/api/lobbies/all')
    return res.data
}
