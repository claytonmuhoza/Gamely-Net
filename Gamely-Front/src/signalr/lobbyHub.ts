import * as signalR from "@microsoft/signalr"
export function createLobbyConnection(baseUrl: string){
    return new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/hubs/lobby`)
        .withAutomaticReconnect()
        .build();
}