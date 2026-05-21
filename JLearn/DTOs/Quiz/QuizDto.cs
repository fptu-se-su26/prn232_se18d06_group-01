namespace JLearn.DTOs.Quiz;

public class QuizQuestionDto
{
    public int QuestionId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string OptionA { get; set; } = string.Empty;
    public string OptionB { get; set; } = string.Empty;
    public string OptionC { get; set; } = string.Empty;
    public string OptionD { get; set; } = string.Empty;
    
}

public class UserAswerDto
{
    public int QuestionId { get; set; }
    public string UserAnswer { get; set; } = string.Empty;
}

public class QuizSubmitDto
{
    public int LessonId { get; set; }
    public List<UserAswerDto> Answer { get; set; }
}

public class QuizResultDetailDto
{
    public int QuestionId { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public string UserAnswer { get; set; } = string.Empty;
    public string CorrectAnswer { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}

public class QuizResultDto
{
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public double Score{ get; set;}
    public List<QuizResultDetailDto> Details { get; set; } = new();
}
