import { http } from '../../../shared/api/http.ts'
import type { ScoreEntryDto } from '../model/types.ts'

export async function getTopScores(gameId: string, limit = 10): Promise<ScoreEntryDto[]> {
    const res = await http.get<ScoreEntryDto[]>('/api/scores/top', {
        params: { gameId, limit }
    })
    return res.data
}
