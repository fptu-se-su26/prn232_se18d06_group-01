using JLearn.DTOs.CustomCard;
using JLearn.DTOs.CustomDeck;
using JLearn.DTOs.QuizResult;
using JLearn.Models;
using JLearn.Services.Interfaces;
using JLearn.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace JLearn.Services;

public class CustomDeckService : ICustomDeckService
{
    private readonly IUnitOfWork _unitOfWork;

    public CustomDeckService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    // CRUD Decks
    public async Task<List<CustomDeckDto>> GetDecksByUserAsync(int userId)
    {
        return await _unitOfWork.CustomDecks.Query()
            .Where(d => d.UserId == userId && !d.IsDeleted)
            .Select(d => new CustomDeckDto
            {
                DeckId = d.DeckId,
                UserId = d.UserId,
                Name = d.Name,
                Description = d.Description,
                CreatedAt = d.CreatedAt,
                IsPublic = d.IsPublic,
                TotalCards = d.CustomCards.Count(c => !c.IsDeleted)
            })
            .ToListAsync();
    }

    public async Task<List<CustomDeckDto>> GetPublicDecksAsync()
    {
        return await _unitOfWork.CustomDecks.Query()
            .Where(d => !d.IsDeleted)
            .Where(d => d.IsPublic == true)
            .Select(d => new CustomDeckDto
            {
                DeckId = d.DeckId,
                UserId = d.UserId,
                Name = d.Name,
                Description = d.Description,
                CreatedAt = d.CreatedAt,
                IsPublic = d.IsPublic,
                TotalCards = d.CustomCards.Count(c => !c.IsDeleted)
            })
            .ToListAsync();
    }

    public async Task<CustomDeckDto?> GetDeckByIdAsync(int userId, int deckId)
    {
        var deck = await _unitOfWork.CustomDecks.Query()
            .Include(d => d.CustomCards)
            .FirstOrDefaultAsync(d => d.DeckId == deckId && !d.IsDeleted);

        if (deck == null) return null;
        if (deck.UserId != userId && !deck.IsPublic) return null;

        return new CustomDeckDto
        {
            DeckId = deck.DeckId,
            UserId = deck.UserId,
            Name = deck.Name,
            Description = deck.Description,
            CreatedAt = deck.CreatedAt,
            IsPublic = deck.IsPublic,
            TotalCards = deck.CustomCards.Count(c => !c.IsDeleted)
        };
    }

    public async Task<CustomDeckDto> CreateDeckAsync(int userId, CustomDeckCreateDto dto)
    {
        var deck = new CustomDeck
        {
            UserId = userId,
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim(),
            IsPublic = dto.IsPublic
        };

        await _unitOfWork.CustomDecks.AddAsync(deck);
        await _unitOfWork.SaveChangesAsync();

        return new CustomDeckDto
        {
            DeckId = deck.DeckId,
            UserId = deck.UserId,
            Name = deck.Name,
            Description = deck.Description,
            CreatedAt = deck.CreatedAt,
            IsPublic = deck.IsPublic,
            TotalCards = 0
        };
    }

    public async Task<CustomDeckDto?> UpdateDeckAsync(int userId, int deckId, CustomDeckCreateDto dto)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.UserId != userId) return null;

        deck.Name = dto.Name.Trim();
        deck.Description = dto.Description?.Trim();
        deck.IsPublic = dto.IsPublic;

        _unitOfWork.CustomDecks.Update(deck);
        await _unitOfWork.SaveChangesAsync();

        return new CustomDeckDto
        {
            DeckId = deck.DeckId,
            UserId = deck.UserId,
            Name = deck.Name,
            Description = deck.Description,
            CreatedAt = deck.CreatedAt,
            IsPublic = deck.IsPublic,
            TotalCards = deck.CustomCards.Count(c => !c.IsDeleted)
        };
    }

    public async Task<CustomDeckDto> CloneDeckAsync(int userId, int deckId)
    {
        var sourceDeck = await _unitOfWork.CustomDecks.Query()
            .Include(d => d.CustomCards)
            .FirstOrDefaultAsync(d => d.DeckId == deckId && !d.IsDeleted);

        if (sourceDeck == null || !sourceDeck.IsPublic)
            throw new KeyNotFoundException("Không tìm thấy bộ thẻ công khai hoặc bạn không có quyền sao chép.");

        var clonedDeck = new CustomDeck
        {
            UserId = userId,
            Name = $"{sourceDeck.Name} (Bản sao)",
            Description = sourceDeck.Description,
            IsPublic = false
        };

        await _unitOfWork.CustomDecks.AddAsync(clonedDeck);
        await _unitOfWork.SaveChangesAsync();

        var cards = sourceDeck.CustomCards.Where(c => !c.IsDeleted).ToList();
        foreach (var card in cards)
        {
            var clonedCard = new CustomCard
            {
                DeckId = clonedDeck.DeckId,
                Word = card.Word,
                Meaning = card.Meaning
            };
            await _unitOfWork.CustomCards.AddAsync(clonedCard);
        }

        await _unitOfWork.SaveChangesAsync();

        return new CustomDeckDto
        {
            DeckId = clonedDeck.DeckId,
            UserId = clonedDeck.UserId,
            Name = clonedDeck.Name,
            Description = clonedDeck.Description,
            CreatedAt = clonedDeck.CreatedAt,
            IsPublic = clonedDeck.IsPublic,
            TotalCards = cards.Count
        };
    }

    public async Task<bool> DeleteDeckAsync(int userId, int deckId)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.UserId != userId) return false;

        deck.IsDeleted = true;
        _unitOfWork.CustomDecks.Update(deck);

        // Soft delete all cards associated with this deck
        var cards = await _unitOfWork.CustomCards.Query()
            .Where(c => c.DeckId == deckId && !c.IsDeleted)
            .ToListAsync();

        foreach (var card in cards)
        {
            card.IsDeleted = true;
            _unitOfWork.CustomCards.Update(card);
        }

        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    // CRUD Cards
    public async Task<List<CustomCardDto>> GetCardsByDeckAsync(int userId, int deckId)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || (deck.UserId != userId && !deck.IsPublic))
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập bộ thẻ này.");

        return await _unitOfWork.CustomCards.Query()
            .Where(c => c.DeckId == deckId && !c.IsDeleted)
            .Select(c => new CustomCardDto
            {
                CardId = c.CardId,
                DeckId = c.DeckId,
                Word = c.Word,
                Meaning = c.Meaning
            })
            .ToListAsync();
    }

    public async Task<CustomCardDto> AddCardAsync(int userId, int deckId, CustomCardCreateDto dto)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập bộ thẻ này.");

        var card = new CustomCard
        {
            DeckId = deckId,
            Word = dto.Word.Trim(),
            Meaning = dto.Meaning.Trim()
        };

        await _unitOfWork.CustomCards.AddAsync(card);
        await _unitOfWork.SaveChangesAsync();

        return new CustomCardDto
        {
            CardId = card.CardId,
            DeckId = card.DeckId,
            Word = card.Word,
            Meaning = card.Meaning
        };
    }

    public async Task<CustomCardDto> UpdateCardAsync(int userId, int deckId, int cardId, CustomCardUpdateDto dto)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập bộ thẻ này.");

        var card = await _unitOfWork.CustomCards.GetByIdAsync(cardId);
        if (card == null || card.DeckId != deckId)
            throw new KeyNotFoundException("Không tìm thấy thẻ cần cập nhật.");

        card.Word = dto.Word.Trim();
        card.Meaning = dto.Meaning.Trim();

        _unitOfWork.CustomCards.Update(card);
        await _unitOfWork.SaveChangesAsync();

        return new CustomCardDto
        {
            CardId = card.CardId,
            DeckId = card.DeckId,
            Word = card.Word,
            Meaning = card.Meaning
        };
    }

    public async Task<bool> DeleteCardAsync(int userId, int deckId, int cardId)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập bộ thẻ này.");

        var card = await _unitOfWork.CustomCards.GetByIdAsync(cardId);
        if (card == null || card.DeckId != deckId) return false;

        card.IsDeleted = true;
        _unitOfWork.CustomCards.Update(card);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ImportCardsAsync(int userId, int deckId, string content)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập bộ thẻ này.");

        if (string.IsNullOrWhiteSpace(content)) return false;

        try
        {
            var records = ParseCsvContent(content);
            var cardsToAdd = new List<CustomCard>();

            foreach (var parts in records)
            {
                if (parts.Count < 2) continue;

                string word = parts[0].Trim();
                string meaning = parts[1].Trim();

                // Skip header lines
                if (word.Equals("question", StringComparison.OrdinalIgnoreCase) && 
                    meaning.Equals("answer", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }
                if (word.Equals("word", StringComparison.OrdinalIgnoreCase) && 
                    meaning.Equals("meaning", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                if (string.IsNullOrWhiteSpace(word) || string.IsNullOrWhiteSpace(meaning))
                    continue;

                var card = new CustomCard
                {
                    DeckId = deckId,
                    Word = word,
                    Meaning = meaning
                };
                cardsToAdd.Add(card);
            }

            if (cardsToAdd.Count == 0) return false;

            foreach (var card in cardsToAdd)
            {
                await _unitOfWork.CustomCards.AddAsync(card);
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            throw new ArgumentException("Định dạng dữ liệu không hợp lệ. Vui lòng sử dụng định dạng CSV. Chi tiết: " + ex.Message);
        }
    }

    private List<List<string>> ParseCsvContent(string content)
    {
        var records = new List<List<string>>();
        var currentRecord = new List<string>();
        var currentField = new System.Text.StringBuilder();
        bool inQuotes = false;
        
        for (int i = 0; i < content.Length; i++)
        {
            char c = content[i];
            
            if (inQuotes)
            {
                if (c == '"')
                {
                    // Check if it's an escaped quote ""
                    if (i + 1 < content.Length && content[i + 1] == '"')
                    {
                        currentField.Append('"');
                        i++; // Skip the escaped quote
                    }
                    else
                    {
                        inQuotes = false;
                    }
                }
                else
                {
                    currentField.Append(c);
                }
            }
            else
            {
                if (c == '"')
                {
                    inQuotes = true;
                }
                else if (c == ',')
                {
                    currentRecord.Add(currentField.ToString());
                    currentField.Clear();
                }
                else if (c == '\r')
                {
                    // Ignore CR, handle LF next
                }
                else if (c == '\n')
                {
                    currentRecord.Add(currentField.ToString());
                    records.Add(currentRecord);
                    currentRecord = new List<string>();
                    currentField.Clear();
                }
                else
                {
                    currentField.Append(c);
                }
            }
        }
        
        // Add the last field and record if the file doesn't end with a newline
        if (currentField.Length > 0 || currentRecord.Count > 0)
        {
            currentRecord.Add(currentField.ToString());
            records.Add(currentRecord);
        }
        
        return records;
    }

    // Quiz Results
    public async Task<QuizResultDto> SaveQuizResultAsync(int userId, int deckId, QuizResultCreateDto dto)
    {
        var deck = await _unitOfWork.CustomDecks.Query()
            .FirstOrDefaultAsync(d => d.DeckId == deckId && !d.IsDeleted);

        if (deck == null)
            throw new KeyNotFoundException("Bộ thẻ không tồn tại.");

        var percentage = dto.TotalQuestions > 0 
            ? Math.Round(((double)dto.CorrectAnswers / dto.TotalQuestions) * 100, 1) 
            : 0;

        var quizResult = new QuizResult
        {
            UserId = userId,
            DeckId = deckId,
            QuizType = dto.QuizType,
            TotalQuestions = dto.TotalQuestions,
            CorrectAnswers = dto.CorrectAnswers,
            ScorePercentage = percentage,
            CompletedAt = DateTime.UtcNow
        };

        await _unitOfWork.QuizResults.AddAsync(quizResult);
        await _unitOfWork.SaveChangesAsync();

        var user = await _unitOfWork.Users.GetByIdAsync(userId);

        return new QuizResultDto
        {
            QuizResultId = quizResult.QuizResultId,
            DeckId = deck.DeckId,
            DeckName = deck.Name,
            UserId = userId,
            UserFullName = user?.FullName ?? string.Empty,
            QuizType = quizResult.QuizType,
            TotalQuestions = quizResult.TotalQuestions,
            CorrectAnswers = quizResult.CorrectAnswers,
            ScorePercentage = quizResult.ScorePercentage,
            CompletedAt = quizResult.CompletedAt
        };
    }

    public async Task<List<QuizResultDto>> GetQuizResultsByDeckAsync(int userId, int deckId)
    {
        return await _unitOfWork.QuizResults.Query()
            .Include(q => q.CustomDeck)
            .Include(q => q.User)
            .Where(q => q.DeckId == deckId && q.UserId == userId && !q.IsDeleted)
            .OrderByDescending(q => q.CompletedAt)
            .Select(q => new QuizResultDto
            {
                QuizResultId = q.QuizResultId,
                DeckId = q.DeckId,
                DeckName = q.CustomDeck.Name,
                UserId = q.UserId,
                UserFullName = q.User.FullName,
                QuizType = q.QuizType,
                TotalQuestions = q.TotalQuestions,
                CorrectAnswers = q.CorrectAnswers,
                ScorePercentage = q.ScorePercentage,
                CompletedAt = q.CompletedAt
            })
            .ToListAsync();
    }

    public async Task<List<QuizResultDto>> GetUserQuizHistoryAsync(int userId, int limit = 10)
    {
        return await _unitOfWork.QuizResults.Query()
            .Include(q => q.CustomDeck)
            .Include(q => q.User)
            .Where(q => q.UserId == userId && !q.IsDeleted)
            .OrderByDescending(q => q.CompletedAt)
            .Take(limit)
            .Select(q => new QuizResultDto
            {
                QuizResultId = q.QuizResultId,
                DeckId = q.DeckId,
                DeckName = q.CustomDeck.Name,
                UserId = q.UserId,
                UserFullName = q.User.FullName,
                QuizType = q.QuizType,
                TotalQuestions = q.TotalQuestions,
                CorrectAnswers = q.CorrectAnswers,
                ScorePercentage = q.ScorePercentage,
                CompletedAt = q.CompletedAt
            })
            .ToListAsync();
    }
}


