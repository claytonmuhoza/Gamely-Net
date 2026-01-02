namespace GamePlatform.Application.Games.SpeedTyping;

public sealed class InMemorySpeedTypingTextProvider : ISpeedTypingTextProvider
{
    private static readonly (string id, string text)[] Texts =
    [
        ("t1", "Le développement logiciel demande rigueur et collaboration."),
        ("t2", "SignalR permet des mises à jour temps réel entre clients."),
        ("t3", "La clean architecture sépare le domaine des détails techniques.")
    ];

    public (string textId, string text) GetRandomText()
    {
        var idx = Random.Shared.Next(Texts.Length);
        return Texts[idx];
    }
}