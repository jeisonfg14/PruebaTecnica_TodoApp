using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;
using TodoApi.Services;
using TodoApi.DTOs;
using Xunit;
using AutoMapper;
using TodoApi.Configuration;

namespace TodoApi.Tests.Services
{
    public class TodoTaskServiceTests : IDisposable
    {
        private readonly TodoDbContext _context;
        private readonly ITodoTaskService _todoTaskService;
        private readonly IMapper _mapper;
        private readonly int _testUserId = 1;

        public TodoTaskServiceTests()
        {
            var options = new DbContextOptionsBuilder<TodoDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new TodoDbContext(options);

            var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
            _mapper = config.CreateMapper();

            _todoTaskService = new TodoTaskService(_context, _mapper);

            // Seed test data
            SeedTestData();
        }

        private void SeedTestData()
        {
            var user = new User
            {
                Id = _testUserId,
                FirstName = "Test",
                LastName = "User",
                Email = "test@example.com",
                PasswordHash = "hashedpassword"
            };

            _context.Users.Add(user);

            var tasks = new List<TodoTask>
            {
                new TodoTask
                {
                    Id = 1,
                    Title = "Test Task 1",
                    Description = "Description 1",
                    Priority = 5, // High priority
                    IsCompleted = false,
                    UserId = _testUserId,
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new TodoTask
                {
                    Id = 2,
                    Title = "Test Task 2",
                    Description = "Description 2",
                    Priority = 3, // Medium priority
                    IsCompleted = true,
                    UserId = _testUserId,
                    CreatedAt = DateTime.UtcNow.AddDays(-1),
                    CompletedAt = DateTime.UtcNow
                }
            };

            _context.TodoTasks.AddRange(tasks);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GetTasksByUserIdAsync_ShouldReturnUserTasks()
        {
            // Act
            var result = await _todoTaskService.GetTasksByUserIdAsync(_testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetTasksByUserIdAsync_WithFilter_ShouldReturnFilteredTasks()
        {
            // Arrange
            var filter = new TaskFilterDto { IsCompleted = false };

            // Act
            var result = await _todoTaskService.GetTasksByUserIdAsync(_testUserId, filter);

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.False(result.First().IsCompleted);
        }

        [Fact]
        public async Task CreateTaskAsync_ShouldCreateNewTask()
        {
            // Arrange
            var createTaskDto = new CreateTodoTaskDto
            {
                Title = "New Task",
                Description = "New Description",
                Priority = 1 // Low priority
            };

            // Act
            var result = await _todoTaskService.CreateTaskAsync(createTaskDto, _testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("New Task", result.Title);
            Assert.Equal(_testUserId, result.UserId);
        }

        [Fact]
        public async Task UpdateTaskAsync_ShouldUpdateExistingTask()
        {
            // Arrange
            var updateTaskDto = new UpdateTodoTaskDto
            {
                Title = "Updated Task",
                Description = "Updated Description",
                Priority = 5 // High priority
            };

            // Act
            var result = await _todoTaskService.UpdateTaskAsync(1, updateTaskDto, _testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Task", result.Title);
            Assert.Equal("Updated Description", result.Description);
        }

        [Fact]
        public async Task DeleteTaskAsync_ShouldDeleteTask()
        {
            // Act
            var result = await _todoTaskService.DeleteTaskAsync(1, _testUserId);

            // Assert
            Assert.True(result);

            var deletedTask = await _todoTaskService.GetTaskByIdAsync(1, _testUserId);
            Assert.Null(deletedTask);
        }

        [Fact]
        public async Task ToggleTaskCompletionAsync_ShouldToggleCompletion()
        {
            // Act
            var result = await _todoTaskService.ToggleTaskCompletionAsync(1, _testUserId);

            // Assert
            Assert.True(result);

            var task = await _todoTaskService.GetTaskByIdAsync(1, _testUserId);
            Assert.True(task?.IsCompleted);
        }

        [Fact]
        public async Task GetTaskStatisticsAsync_ShouldReturnCorrectStatistics()
        {
            // Act
            var result = await _todoTaskService.GetTaskStatisticsAsync(_testUserId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.TotalTasks);
            Assert.Equal(1, result.CompletedTasks);
            Assert.Equal(1, result.PendingTasks);
            Assert.Equal(50, result.CompletionRate);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}