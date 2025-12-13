using GamePlatform.Application.Puissance;
using GamePlatforme.domain.Entities;
namespace GamePlatform.Application.Interfaces.Services;

public interface IPuissanceGameService
{
    Task<PuissanceGameDto> StrartGameAsync(StartPuissanceGameCommande command, CancellationToken cancellationToken = default);
    Task<PuissanceGameDto?> PlayMoveAsync(PlayPuissanceGameCommande command, CancellationToken cancellationToken = default);
    Task<PuissanceGameDto?> GetByIdAsync(Guid gameId, CancellationToken cancellationToken = default);
}