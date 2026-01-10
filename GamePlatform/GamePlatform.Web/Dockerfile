# Étape de build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copie des fichiers .csproj et restauration des dépendances
COPY ["GamePlatform/GamePlatform.Web/GamePlatform.Web.csproj", "GamePlatform/GamePlatform.Web/"]
COPY ["GamePlatform/GamePlatform.Application/GamePlatform.Application.csproj", "GamePlatform/GamePlatform.Application/"]
COPY ["GamePlatform/GamePlatform.Infrastructure/GamePlatform.Infrastructure.csproj", "GamePlatform/GamePlatform.Infrastructure/"]
COPY ["GamePlatform/GamePlatform.Persistence/GamePlatform.Persistence.csproj", "GamePlatform/GamePlatform.Persistence/"]
COPY ["GamePlatform/GamePlatform.Domain/GamePlatform.Domain.csproj", "GamePlatform/GamePlatform.Domain/"]
COPY ["GamePlatform/GamePlatform.Contracts/GamePlatform.Contracts.csproj", "GamePlatform/GamePlatform.Contracts/"]

RUN dotnet restore "GamePlatform/GamePlatform.Web/GamePlatform.Web.csproj"

# Copie du reste du code et publication
COPY . .
WORKDIR "/src/GamePlatform/GamePlatform.Web"
RUN dotnet publish "GamePlatform.Web.csproj" -c Release -o /app/publish

# Étape finale
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "GamePlatform.Web.dll"]