import { http } from '../../../../shared/api/http'
import type { DropPuissance4DiscRequest, Puissance4StateDto } from '../model/types'

export async function getPuissance4State(lobbyId: string): Promise<Puissance4StateDto> {
    const res = await http.get<Puissance4StateDto>(`/api/games/${lobbyId}/state`)
    return res.data
}

export async function dropPuissance4Disc(lobbyId: string, req: DropPuissance4DiscRequest): Promise<void> {
    await http.post(`/api/games/${lobbyId}/puissance4/drop`, req)
}
