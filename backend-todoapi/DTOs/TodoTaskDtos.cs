using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs
{
    // DTOs for TodoTask
    public class TodoTaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public int Priority { get; set; }
        public int UserId { get; set; }
    }

    public class CreateTodoTaskDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Range(1, 5)]
        public int Priority { get; set; } = 1;
    }

    public class UpdateTodoTaskDto
    {
        [StringLength(200)]
        public string? Title { get; set; }

        [StringLength(1000)]
        public string? Description { get; set; }

        [Range(1, 5)]
        public int? Priority { get; set; }

        public bool? IsCompleted { get; set; }
    }

    // DTO for Dashboard statistics
    public class TaskStatisticsDto
    {
        public int TotalTasks { get; set; }
        public int CompletedTasks { get; set; }
        public int PendingTasks { get; set; }
        public double CompletionRate { get; set; }
        public int TasksCreatedToday { get; set; }
        public int TasksCompletedToday { get; set; }
    }

    // DTO for filtering tasks
    public class TaskFilterDto
    {
        public bool? IsCompleted { get; set; }
        public int? Priority { get; set; }
        public DateTime? CreatedAfter { get; set; }
        public DateTime? CreatedBefore { get; set; }
        public string? SearchTerm { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}