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
            var lines = content.Split(new[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries);
            var cardsToAdd = new List<CustomCard>();

            foreach (var line in lines)
            {
                var trimmedLine = line.Trim();
                if (string.IsNullOrEmpty(trimmedLine)) continue;

                // Skip header lines
                if (trimmedLine.Contains("question", StringComparison.OrdinalIgnoreCase) && 
                    trimmedLine.Contains("answer", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }
                if (trimmedLine.Contains("word", StringComparison.OrdinalIgnoreCase) && 
                    trimmedLine.Contains("meaning", StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                string word = "";
                string meaning = "";

                // Parse quoted CSV format: "word","meaning"
                if (trimmedLine.Contains("\",\""))
                {
                    // Strip leading and trailing double quotes if present
                    if (trimmedLine.StartsWith("\"")) trimmedLine = trimmedLine.Substring(1);
                    if (trimmedLine.EndsWith("\"")) trimmedLine = trimmedLine.Substring(0, trimmedLine.Length - 1);

                    var parts = trimmedLine.Split(new[] { "\",\"" }, StringSplitOptions.None);
                    if (parts.Length >= 2)
                    {
                        word = parts[0];
                        // If there are more parts, join them back
                        meaning = string.Join("\",\"", parts.Skip(1));
                    }
                }
                else
                {
                    // Fallback to simple comma split: word,meaning
                    var parts = trimmedLine.Split(',');
                    if (parts.Length >= 2)
                    {
                        word = parts[0].Trim(' ', '"', '\t');
                        meaning = string.Join(",", parts.Skip(1)).Trim(' ', '"', '\t');
                    }
                }

                if (string.IsNullOrWhiteSpace(word) || string.IsNullOrWhiteSpace(meaning))
                    continue;

                var card = new CustomCard
                {
                    DeckId = deckId,
                    Word = word.Trim(),
                    Meaning = meaning.Trim()
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


}
