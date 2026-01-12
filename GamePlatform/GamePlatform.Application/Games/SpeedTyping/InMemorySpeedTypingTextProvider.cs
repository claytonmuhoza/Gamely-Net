namespace GamePlatform.Application.Games.SpeedTyping;

public sealed class InMemorySpeedTypingTextProvider : ISpeedTypingTextProvider
{
    private static readonly (string id, string text)[] Texts =
    [
        ("t1", "Le développement logiciel demande rigueur et collaboration pour créer des applications robustes."),
        ("t2", "SignalR permet des communications en temps réel entre le serveur et les clients web."),
        ("t3", "La clean architecture sépare le domaine métier des détails techniques d'infrastructure."),
        ("t4", "Les tests unitaires garantissent la qualité du code et facilitent la maintenance à long terme."),
        ("t5", "L'agilité encourage l'adaptation rapide aux changements et la livraison continue de valeur."),
        ("t6", "La programmation orientée objet utilise l'encapsulation, l'héritage et le polymorphisme."),
        ("t7", "Les microservices divisent une application en services indépendants et déployables séparément."),
        ("t8", "Le refactoring améliore la structure du code sans modifier son comportement externe."),
        ("t9", "Les design patterns sont des solutions éprouvées à des problèmes récurrents de conception."),
        ("t10", "La persistance des données nécessite une stratégie adaptée au volume et à la criticité.")
    ];

    public (string textId, string text) GetRandomText()
    {
        var idx = Random.Shared.Next(Texts.Length);
        return Texts[idx];
    }
}