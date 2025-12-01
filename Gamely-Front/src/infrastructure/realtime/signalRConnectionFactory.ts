import * as signalR from "@microsoft/signalr";

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7194";

export function createSignalRConnection(hubPath: string): signalR.HubConnection {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}${hubPath}`, {
      withCredentials: false,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();
}
