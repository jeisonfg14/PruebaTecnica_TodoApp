using Microsoft.EntityFrameworkCore;
using AutoMapper;
using TodoApi.Data;
using TodoApi.Models;
using TodoApi.DTOs;

namespace TodoApi.Services
{
    public interface ITodoTaskService
    {
        Task<IEnumerable<TodoTaskDto>> GetTasksByUserIdAsync(int userId, TaskFilterDto? filter = null);
        Task<TodoTaskDto?> GetTaskByIdAsync(int taskId, int userId);
        Task<TodoTaskDto> CreateTaskAsync(CreateTodoTaskDto createTaskDto, int userId);
        Task<TodoTaskDto?> UpdateTaskAsync(int taskId, UpdateTodoTaskDto updateTaskDto, int userId);
        Task<bool> DeleteTaskAsync(int taskId, int userId);
        Task<TaskStatisticsDto> GetTaskStatisticsAsync(int userId);
        Task<bool> ToggleTaskCompletionAsync(int taskId, int userId);
    }

    public class TodoTaskService : ITodoTaskService
    {
        private readonly TodoDbContext _context;
        private readonly IMapper _mapper;

        public TodoTaskService(TodoDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TodoTaskDto>> GetTasksByUserIdAsync(int userId, TaskFilterDto? filter = null)
        {
            var query = _context.TodoTasks.Where(t => t.UserId == userId);

            if (filter != null)
            {
                if (filter.IsCompleted.HasValue)
                    query = query.Where(t => t.IsCompleted == filter.IsCompleted.Value);

                if (filter.Priority.HasValue)
                    query = query.Where(t => t.Priority == filter.Priority.Value);

                if (filter.CreatedAfter.HasValue)
                    query = query.Where(t => t.CreatedAt >= filter.CreatedAfter.Value);

                if (filter.CreatedBefore.HasValue)
                    query = query.Where(t => t.CreatedAt <= filter.CreatedBefore.Value);

                if (!string.IsNullOrEmpty(filter.SearchTerm))
                    query = query.Where(t => t.Title.Contains(filter.SearchTerm) || 
                                           (t.Description != null && t.Description.Contains(filter.SearchTerm)));
            }

            query = query.OrderByDescending(t => t.CreatedAt);

            if (filter != null)
            {
                query = query.Skip((filter.Page - 1) * filter.PageSize).Take(filter.PageSize);
            }

            var tasks = await query.ToListAsync();
            return _mapper.Map<IEnumerable<TodoTaskDto>>(tasks);
        }

        public async Task<TodoTaskDto?> GetTaskByIdAsync(int taskId, int userId)
        {
            var task = await _context.TodoTasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            return task != null ? _mapper.Map<TodoTaskDto>(task) : null;
        }

        public async Task<TodoTaskDto> CreateTaskAsync(CreateTodoTaskDto createTaskDto, int userId)
        {
            var task = _mapper.Map<TodoTask>(createTaskDto);
            task.UserId = userId;
            task.CreatedAt = DateTime.UtcNow;

            _context.TodoTasks.Add(task);
            await _context.SaveChangesAsync();

            return _mapper.Map<TodoTaskDto>(task);
        }

        public async Task<TodoTaskDto?> UpdateTaskAsync(int taskId, UpdateTodoTaskDto updateTaskDto, int userId)
        {
            var task = await _context.TodoTasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
                return null;

            // Handle completion status change
            if (updateTaskDto.IsCompleted.HasValue && updateTaskDto.IsCompleted.Value != task.IsCompleted)
            {
                if (updateTaskDto.IsCompleted.Value)
                    task.MarkAsCompleted();
                else
                    task.MarkAsPending();
            }

            _mapper.Map(updateTaskDto, task);
            task.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return _mapper.Map<TodoTaskDto>(task);
        }

        public async Task<bool> DeleteTaskAsync(int taskId, int userId)
        {
            var task = await _context.TodoTasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
                return false;

            _context.TodoTasks.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<TaskStatisticsDto> GetTaskStatisticsAsync(int userId)
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var totalTasks = await _context.TodoTasks.CountAsync(t => t.UserId == userId);
            var completedTasks = await _context.TodoTasks.CountAsync(t => t.UserId == userId && t.IsCompleted);
            var pendingTasks = totalTasks - completedTasks;

            var tasksCreatedToday = await _context.TodoTasks
                .CountAsync(t => t.UserId == userId && t.CreatedAt >= today && t.CreatedAt < tomorrow);

            var tasksCompletedToday = await _context.TodoTasks
                .CountAsync(t => t.UserId == userId && t.CompletedAt >= today && t.CompletedAt < tomorrow);

            var completionRate = totalTasks > 0 ? (double)completedTasks / totalTasks * 100 : 0;

            return new TaskStatisticsDto
            {
                TotalTasks = totalTasks,
                CompletedTasks = completedTasks,
                PendingTasks = pendingTasks,
                CompletionRate = Math.Round(completionRate, 2),
                TasksCreatedToday = tasksCreatedToday,
                TasksCompletedToday = tasksCompletedToday
            };
        }

        public async Task<bool> ToggleTaskCompletionAsync(int taskId, int userId)
        {
            var task = await _context.TodoTasks
                .FirstOrDefaultAsync(t => t.Id == taskId && t.UserId == userId);

            if (task == null)
                return false;

            if (task.IsCompleted)
                task.MarkAsPending();
            else
                task.MarkAsCompleted();

            await _context.SaveChangesAsync();
            return true;
        }
    }
}