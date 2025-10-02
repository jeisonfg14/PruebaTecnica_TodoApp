using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApi.DTOs;
using TodoApi.Services;

namespace TodoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITodoTaskService _todoTaskService;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITodoTaskService todoTaskService, ILogger<TasksController> logger)
        {
            _todoTaskService = todoTaskService;
            _logger = logger;
        }

        /// <summary>
        /// Gets all tasks for the current user with optional filtering
        /// </summary>
        /// <param name="filter">Optional filter parameters</param>
        /// <returns>List of tasks</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoTaskDto>>> GetTasks([FromQuery] TaskFilterDto? filter = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                var tasks = await _todoTaskService.GetTasksByUserIdAsync(userId, filter);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting tasks for user");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets a specific task by ID
        /// </summary>
        /// <param name="id">Task ID</param>
        /// <returns>Task details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoTaskDto>> GetTask(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var task = await _todoTaskService.GetTaskByIdAsync(id, userId);
                
                if (task == null)
                {
                    return NotFound(new { message = "Task not found" });
                }

                return Ok(task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting task {TaskId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Creates a new task
        /// </summary>
        /// <param name="createTaskDto">Task creation data</param>
        /// <returns>Created task</returns>
        [HttpPost]
        public async Task<ActionResult<TodoTaskDto>> CreateTask(CreateTodoTaskDto createTaskDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var task = await _todoTaskService.CreateTaskAsync(createTaskDto, userId);
                
                _logger.LogInformation("Task created successfully: {TaskId}", task.Id);
                return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating task");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Updates an existing task
        /// </summary>
        /// <param name="id">Task ID</param>
        /// <param name="updateTaskDto">Task update data</param>
        /// <returns>Updated task</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<TodoTaskDto>> UpdateTask(int id, UpdateTodoTaskDto updateTaskDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var task = await _todoTaskService.UpdateTaskAsync(id, updateTaskDto, userId);
                
                if (task == null)
                {
                    return NotFound(new { message = "Task not found" });
                }

                _logger.LogInformation("Task updated successfully: {TaskId}", id);
                return Ok(task);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating task {TaskId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Deletes a task
        /// </summary>
        /// <param name="id">Task ID</param>
        /// <returns>Success result</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _todoTaskService.DeleteTaskAsync(id, userId);
                
                if (!result)
                {
                    return NotFound(new { message = "Task not found" });
                }

                _logger.LogInformation("Task deleted successfully: {TaskId}", id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting task {TaskId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Toggles task completion status
        /// </summary>
        /// <param name="id">Task ID</param>
        /// <returns>Success result</returns>
        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> ToggleTaskCompletion(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _todoTaskService.ToggleTaskCompletionAsync(id, userId);
                
                if (!result)
                {
                    return NotFound(new { message = "Task not found" });
                }

                _logger.LogInformation("Task completion toggled: {TaskId}", id);
                return Ok(new { message = "Task completion status updated" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error toggling task completion {TaskId}", id);
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets task statistics for the current user
        /// </summary>
        /// <returns>Task statistics</returns>
        [HttpGet("statistics")]
        public async Task<ActionResult<TaskStatisticsDto>> GetStatistics()
        {
            try
            {
                var userId = GetCurrentUserId();
                var statistics = await _todoTaskService.GetTaskStatisticsAsync(userId);
                return Ok(statistics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting task statistics");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets current user ID from JWT claims
        /// </summary>
        /// <returns>Current user ID</returns>
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("id")?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid user token");
            }
            return userId;
        }
    }
}