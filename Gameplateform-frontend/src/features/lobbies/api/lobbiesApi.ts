import { http } from '../../../shared/api/http'

import type { CreateLobbyRequest, CreateLobbyResponse, LobbyListItemDto } from '../model/types'

export async function listWaitingLobbies(): Promise<LobbyListItemDto[]> {
    const res = await http.get<LobbyListItemDto[]>('/api/lobbies')
    return res.data
}

export async function createLobby(req: CreateLobbyRequest): Promise<CreateLobbyResponse> {
    const res = await http.post<CreateLobbyResponse>('/api/lobbies', req)
    return res.data
}
import type { JoinLobbyRequest, LeaveLobbyRequest, LobbyDetailsDto, StartGameRequest } from '../model/types'

export async function getLobbyDetails(lobbyId: string): Promise<LobbyDetailsDto> {
    const res = await http.get<LobbyDetailsDto>(`/api/lobbies/${lobbyId}`)
    return res.data
}

export async function joinLobby(lobbyId: string, req: JoinLobbyRequest): Promise<void> {
    await http.post(`/api/lobbies/${lobbyId}/join`, req)
}

export async function leaveLobby(lobbyId: string, req: LeaveLobbyRequest): Promise<void> {
    await http.post(`/api/lobbies/${lobbyId}/leave`, req)
}

export async function startLobbyGame(lobbyId: string, req: StartGameRequest): Promise<void> {
    await http.post(`/api/lobbies/${lobbyId}/start`, req)
}
