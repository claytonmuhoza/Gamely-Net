using GamePlatforme.domain.Entities.SpeedTyping;
using Microsoft.EntityFrameworkCore;

namespace GamePlatform.Infrastructure.Persistence;

public static class SpeedTypingSeedData
{
    public static async Task SeedTypingTextsAsync(GamePlatformDbContext context)
    {
        if (await context.TypingTexts.AnyAsync())
            return; // Déjà initialisé

        var texts = new List<TypingText>
        {
            // Easy texts
            new TypingText(
                "Le chat dort paisiblement sur le canapé pendant que son maître lit un livre.",
                TextDifficulty.Easy,
                "fr"
            ),
            new TypingText(
                "Il fait beau aujourd'hui et les oiseaux chantent dans les arbres du jardin.",
                TextDifficulty.Easy,
                "fr"
            ),
            new TypingText(
                "Marie aime préparer des gâteaux au chocolat pour ses amis chaque dimanche.",
                TextDifficulty.Easy,
                "fr"
            ),
            new TypingText(
                "Les enfants jouent au ballon dans le parc pendant que leurs parents discutent.",
                TextDifficulty.Easy,
                "fr"
            ),
            new TypingText(
                "Le soleil brille et la mer est calme ce matin sur la plage déserte.",
                TextDifficulty.Easy,
                "fr"
            ),

            // Medium texts
            new TypingText(
                "La programmation informatique nécessite rigueur, logique et créativité pour résoudre des problèmes complexes de manière élégante et efficace.",
                TextDifficulty.Medium,
                "fr"
            ),
            new TypingText(
                "L'architecture hexagonale permet de séparer la logique métier des détails d'implémentation comme les bases de données ou les frameworks externes.",
                TextDifficulty.Medium,
                "fr"
            ),
            new TypingText(
                "Les développeurs expérimentés savent qu'écrire du code maintenable est bien plus important que d'optimiser prématurément les performances.",
                TextDifficulty.Medium,
                "fr"
            ),
            new TypingText(
                "Entity Framework Core est un ORM moderne qui simplifie considérablement les interactions avec les bases de données relationnelles en .NET.",
                TextDifficulty.Medium,
                "fr"
            ),
            new TypingText(
                "Le pattern Repository permet d'abstraire la couche d'accès aux données et de faciliter les tests unitaires de la logique métier.",
                TextDifficulty.Medium,
                "fr"
            ),

            // Hard texts
            new TypingText(
                "L'implémentation d'un système distribué résilient nécessite une compréhension approfondie des patterns de synchronisation, de la gestion des transactions distribuées et des mécanismes de cohérence éventuelle.",
                TextDifficulty.Hard,
                "fr"
            ),
            new TypingText(
                "Dans le contexte de l'architecture microservices, la communication asynchrone via message queues et event streaming garantit un découplage optimal entre les différents services tout en assurant la traçabilité des opérations.",
                TextDifficulty.Hard,
                "fr"
            ),
            new TypingText(
                "Les principes SOLID constituent le fondement d'une conception orientée objet de qualité : Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation et Dependency Inversion.",
                TextDifficulty.Hard,
                "fr"
            ),
            new TypingText(
                "L'optimisation des requêtes SQL complexes implique l'analyse des plans d'exécution, la création d'index appropriés et la compréhension des statistiques du moteur de base de données.",
                TextDifficulty.Hard,
                "fr"
            ),
            new TypingText(
                "La gestion de la concurrence en programmation asynchrone requiert une maîtrise des concepts de threads, de tasks, de synchronization contexts et des patterns async-await pour éviter les deadlocks.",
                TextDifficulty.Hard,
                "fr"
            )
        };

        await context.TypingTexts.AddRangeAsync(texts);
        await context.SaveChangesAsync();
    }
}