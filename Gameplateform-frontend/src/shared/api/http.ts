import axios, { AxiosError } from 'axios'
import { env } from '../config/env'

export type ApiError = { code: string; error: string }

// Instance axios
export const http = axios.create({
    baseURL: env.apiBaseUrl,
    headers: { 'Content-Type': 'application/json' },
    // withCredentials: true, // à activer si vous utilisez cookies plus tard
})

// Helper pour transformer les erreurs en une forme stable
export function getErrorMessage(e: unknown): string {
    if (axios.isAxiosError(e)) {
        const ae = e as AxiosError<ApiError>
        const data = ae.response?.data
        if (data?.error) return data.error
        return ae.message
    }
    if (e instanceof Error) return e.message
    return 'Unknown error'
}
