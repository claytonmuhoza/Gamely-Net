export function getPseudo(): string | null {
    return localStorage.getItem('pseudo')
}

export function setPseudo(pseudo: string) {
    localStorage.setItem('pseudo', pseudo.trim())
}
