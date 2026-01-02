export function tryParseJson(json: string): any | null {
    try {
        return JSON.parse(json)
    } catch {
        return null
    }
}

export function getField<T = any>(obj: any, ...names: string[]): T | undefined {
    if (!obj || typeof obj !== 'object') return undefined
    for (const n of names) {
        if (obj[n] !== undefined) return obj[n] as T
    }
    return undefined
}
