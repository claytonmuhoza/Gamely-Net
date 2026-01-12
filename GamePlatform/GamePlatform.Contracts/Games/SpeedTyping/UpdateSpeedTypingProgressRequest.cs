namespace GamePlatform.Contracts.Games.SpeedTyping;

/// <summary>
/// Requête pour mettre à jour le texte tapé par un joueur
/// </summary>
public sealed record UpdateSpeedTypingProgressRequest(
    Guid ClientId,
    string TypedText // Le texte complet tapé jusqu'à maintenant
);