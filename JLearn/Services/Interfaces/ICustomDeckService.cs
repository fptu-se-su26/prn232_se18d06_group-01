using JLearn.DTOs.CustomCard;
using JLearn.DTOs.CustomDeck;
using JLearn.DTOs.QuizResult;

namespace JLearn.Services.Interfaces;

public interface ICustomDeckService
{
    // CRUD Decks
    Task<List<CustomDeckDto>> GetDecksByUserAsync(int userId);
    Task<List<CustomDeckDto>> GetPublicDecksAsync();
    Task<CustomDeckDto?> GetDeckByIdAsync(int userId, int deckId);
    Task<CustomDeckDto> CreateDeckAsync(int userId, CustomDeckCreateDto dto);
    Task<CustomDeckDto?> UpdateDeckAsync(int userId, int deckId, CustomDeckCreateDto dto);
    Task<bool> DeleteDeckAsync(int userId, int deckId);
    Task<CustomDeckDto> CloneDeckAsync(int userId, int deckId);
    
    // CRUD Cards
    Task<List<CustomCardDto>> GetCardsByDeckAsync(int userId, int deckId);
    Task<CustomCardDto> AddCardAsync(int userId, int deckId, CustomCardCreateDto dto);
    Task<CustomCardDto> UpdateCardAsync(int userId, int deckId, int cardId, CustomCardUpdateDto dto);
    Task<bool> DeleteCardAsync(int userId, int deckId, int cardId);
    Task<bool> ImportCardsAsync(int userId, int deckId, string content);

    // Quiz Results
    Task<QuizResultDto> SaveQuizResultAsync(int userId, int deckId, QuizResultCreateDto dto);
    Task<List<QuizResultDto>> GetQuizResultsByDeckAsync(int userId, int deckId);
    Task<List<QuizResultDto>> GetUserQuizHistoryAsync(int userId, int limit = 10);
}

