import { api } from "./client";

export type PlayerDto = {
    id: string;
    pseudo: string;
};

export type RegisterPlayerCommand = {
    pseudo: string;
};

export async function registerPlayer(pseudo: string): Promise<PlayerDto> {
    const response = await api.post<PlayerDto>("/api/player/register", {
        pseudo,
    } satisfies RegisterPlayerCommand);
    return response.data;
}
