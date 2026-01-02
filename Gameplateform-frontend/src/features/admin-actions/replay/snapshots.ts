import type { GameActionLogDto } from '../model/types'

export type SnapshotItem = {
    at: string
    actorClientId: string | null
    state: any
}

export function extractStateSnapshots(items: GameActionLogDto[]): SnapshotItem[] {
    const out: SnapshotItem[] = []
    for (const it of items) {
        if (it.actionType !== 'STATE_SNAPSHOT') continue
        try {
            out.push({
                at: it.at,
                actorClientId: it.actorClientId,
                state: JSON.parse(it.payloadJson)
            })
        } catch {
            // ignore invalid json
        }
    }
    return out
}
