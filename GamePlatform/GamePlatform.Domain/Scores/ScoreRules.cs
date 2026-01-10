using GamePlatform.Domain;

namespace GamePlatform.Domain.Scores;

public static class ScoreRules
{
    public static ScoreOrdering OrderingFor(GameId gameId)
        => gameId switch
        {
            // SpeedTyping : valeur = temps (ms) => plus petit est meilleur
            GameId.SpeedTyping => ScoreOrdering.LowerIsBetter,

            // Par défaut : plus grand est meilleur
            _ => ScoreOrdering.HigherIsBetter
        };
}