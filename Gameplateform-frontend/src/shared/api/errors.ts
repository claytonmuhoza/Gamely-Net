export type ApiError = { code: string; error: string }

export function isApiError(x: unknown): x is ApiError {
    return !!x && typeof x === 'object' && 'code' in x && 'error' in x
}
