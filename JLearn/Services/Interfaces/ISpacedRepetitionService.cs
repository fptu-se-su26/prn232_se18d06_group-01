using JLearn.DTOs.SpacedRepetition;
using JLearn.DTOs.Vocabulary;

namespace JLearn.Services.Interfaces;

public interface ISpacedRepetitionService
{
    Task<List<VocabularyDto>> GetDueVocabulariesAsync(int userId);
    Task<ReviewResultDto> ProcessReviewAsync(int userId, ReviewRequestDto dto);
    
}