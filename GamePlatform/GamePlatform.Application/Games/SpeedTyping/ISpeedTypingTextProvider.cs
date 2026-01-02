namespace GamePlatform.Application.Games.SpeedTyping;

public interface ISpeedTypingTextProvider
{
    (string textId, string text) GetRandomText();
}