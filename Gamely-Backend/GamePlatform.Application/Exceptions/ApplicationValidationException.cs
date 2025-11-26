namespace GamePlatform.Application.Exceptions;

public class ApplicationValidationException : Exception
{
    public string ErrorCode { get; }

    public ApplicationValidationException(string message, string errorCode)
        : base(message)
    {
        ErrorCode = errorCode;
    }
}