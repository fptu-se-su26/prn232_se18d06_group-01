using JLearn.DTOs.CustomCard;
using JLearn.DTOs.CustomDeck;
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
                TotalCards = d.CustomCards.Count(c => !c.IsDeleted),
                DueReviewCount = d.CustomCards.Count(c => !c.IsDeleted && c.NextReviewDate <= DateTime.UtcNow)
            })
            .ToListAsync();
    }

    public async Task<CustomDeckDto> CreateDeckAsync(int userId, CustomDeckCreateDto dto)
    {
        var deck = new CustomDeck
        {
            UserId = userId,
            Name = dto.Name.Trim(),
            Description = dto.Description?.Trim()
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
            TotalCards = 0,
            DueReviewCount = 0
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
        if (deck == null || deck.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập bộ thẻ này.");

        return await _unitOfWork.CustomCards.Query()
            .Where(c => c.DeckId == deckId && !c.IsDeleted)
            .Select(c => new CustomCardDto
            {
                CardId = c.CardId,
                DeckId = c.DeckId,
                Kanji = c.Kanji,
                Hira = c.Hira,
                Kana = c.Kana,
                Meaning = c.Meaning,
                Romaji = c.Romaji,
                Level = c.Level,
                NextReviewDate = c.NextReviewDate,
                EaseFactor = c.EaseFactor,
                Repetitions = c.Repetitions,
                IntervalDays = c.IntervalDays
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
            Kanji = dto.Kanji?.Trim(),
            Hira = dto.Hira?.Trim(),
            Kana = dto.Kana.Trim(),
            Meaning = dto.Meaning.Trim(),
            Romaji = dto.Romaji?.Trim(),
            Level = 1,
            NextReviewDate = DateTime.UtcNow,
            EaseFactor = 2.5,
            Repetitions = 0,
            IntervalDays = 0
        };

        await _unitOfWork.CustomCards.AddAsync(card);
        await _unitOfWork.SaveChangesAsync();

        return new CustomCardDto
        {
            CardId = card.CardId,
            DeckId = card.DeckId,
            Kanji = card.Kanji,
            Hira = card.Hira,
            Kana = card.Kana,
            Meaning = card.Meaning,
            Romaji = card.Romaji,
            Level = card.Level,
            NextReviewDate = card.NextReviewDate,
            EaseFactor = card.EaseFactor,
            Repetitions = card.Repetitions,
            IntervalDays = card.IntervalDays
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

        card.Kanji = dto.Kanji?.Trim();
        card.Hira = dto.Hira?.Trim();
        card.Kana = dto.Kana.Trim();
        card.Meaning = dto.Meaning.Trim();
        card.Romaji = dto.Romaji?.Trim();

        _unitOfWork.CustomCards.Update(card);
        await _unitOfWork.SaveChangesAsync();

        return new CustomCardDto
        {
            CardId = card.CardId,
            DeckId = card.DeckId,
            Kanji = card.Kanji,
            Hira = card.Hira,
            Kana = card.Kana,
            Meaning = card.Meaning,
            Romaji = card.Romaji,
            Level = card.Level,
            NextReviewDate = card.NextReviewDate,
            EaseFactor = card.EaseFactor,
            Repetitions = card.Repetitions,
            IntervalDays = card.IntervalDays
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

    public async Task<bool> ImportCardsAsync(int userId, int deckId, string rawJson)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập bộ thẻ này.");

        try
        {
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                AllowTrailingCommas = true
            };
            var items = JsonSerializer.Deserialize<List<CustomCardCreateDto>>(rawJson, options);
            if (items == null || items.Count == 0) return false;

            foreach (var item in items)
            {
                if (string.IsNullOrWhiteSpace(item.Kana) || string.IsNullOrWhiteSpace(item.Meaning))
                    continue;

                var card = new CustomCard
                {
                    DeckId = deckId,
                    Kanji = item.Kanji?.Trim(),
                    Hira = item.Hira?.Trim(),
                    Kana = item.Kana.Trim(),
                    Meaning = item.Meaning.Trim(),
                    Romaji = item.Romaji?.Trim(),
                    Level = 1,
                    NextReviewDate = DateTime.UtcNow,
                    EaseFactor = 2.5,
                    Repetitions = 0,
                    IntervalDays = 0
                };
                await _unitOfWork.CustomCards.AddAsync(card);
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }
        catch (JsonException)
        {
            throw new ArgumentException("Chuỗi JSON không đúng định dạng chuẩn.");
        }
    }

    // SRS Practicing
    public async Task<List<CustomCardDto>> GetDueCardsAsync(int userId, int deckId)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập bộ thẻ này.");

        return await _unitOfWork.CustomCards.Query()
            .Where(c => c.DeckId == deckId && !c.IsDeleted && c.NextReviewDate <= DateTime.UtcNow)
            .Select(c => new CustomCardDto
            {
                CardId = c.CardId,
                DeckId = c.DeckId,
                Kanji = c.Kanji,
                Hira = c.Hira,
                Kana = c.Kana,
                Meaning = c.Meaning,
                Romaji = c.Romaji,
                Level = c.Level,
                NextReviewDate = c.NextReviewDate,
                EaseFactor = c.EaseFactor,
                Repetitions = c.Repetitions,
                IntervalDays = c.IntervalDays
            })
            .ToListAsync();
    }

    public async Task<CustomCardDto> ReviewCardAsync(int userId, int deckId, int cardId, int rating)
    {
        var deck = await _unitOfWork.CustomDecks.GetByIdAsync(deckId);
        if (deck == null || deck.UserId != userId)
            throw new UnauthorizedAccessException("Bạn không có quyền truy cập bộ thẻ này.");

        var card = await _unitOfWork.CustomCards.GetByIdAsync(cardId);
        if (card == null || card.DeckId != deckId)
            throw new KeyNotFoundException("Không tìm thấy thẻ cần ôn tập.");

        // SM-2 Algorithm
        rating = Math.Clamp(rating, 1, 5);

        // Adjust Ease Factor
        card.EaseFactor = card.EaseFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
        if (card.EaseFactor < 1.3) card.EaseFactor = 1.3;

        if (rating >= 3)
        {
            card.Repetitions++;
            if (card.Repetitions == 1)
            {
                card.IntervalDays = 1;
            }
            else if (card.Repetitions == 2)
            {
                card.IntervalDays = 6;
            }
            else
            {
                card.IntervalDays = (int)Math.Round(card.IntervalDays * card.EaseFactor);
            }
        }
        else
        {
            card.Repetitions = 0;
            card.IntervalDays = 1; // Review again tomorrow
        }

        card.NextReviewDate = DateTime.UtcNow.AddDays(card.IntervalDays);
        card.Level = Math.Clamp(card.Repetitions + 1, 1, 5);

        _unitOfWork.CustomCards.Update(card);
        await _unitOfWork.SaveChangesAsync();

        return new CustomCardDto
        {
            CardId = card.CardId,
            DeckId = card.DeckId,
            Kanji = card.Kanji,
            Hira = card.Hira,
            Kana = card.Kana,
            Meaning = card.Meaning,
            Romaji = card.Romaji,
            Level = card.Level,
            NextReviewDate = card.NextReviewDate,
            EaseFactor = card.EaseFactor,
            Repetitions = card.Repetitions,
            IntervalDays = card.IntervalDays
        };
    }
}
