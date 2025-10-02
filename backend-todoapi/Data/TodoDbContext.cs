using Microsoft.EntityFrameworkCore;
using TodoApi.Models;

namespace TodoApi.Data
{
    public class TodoDbContext : DbContext
    {
        public TodoDbContext(DbContextOptions<TodoDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<TodoTask> TodoTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            });

            // Configure TodoTask entity
            modelBuilder.Entity<TodoTask>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.IsCompleted).HasDefaultValue(false);
                entity.Property(e => e.Priority).HasDefaultValue(1);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

                // Configure relationship
                entity.HasOne(t => t.User)
                      .WithMany(u => u.Tasks)
                      .HasForeignKey(t => t.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Configure indexes for better performance
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => e.IsCompleted);
                entity.HasIndex(e => e.CreatedAt);
            });

            // Seed data for development
            SeedData(modelBuilder);
        }

        private static void SeedData(ModelBuilder modelBuilder)
        {
            // Seed test user (password: "TestPassword123!")
            // Hash generated with BCrypt
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "test@example.com",
                    FirstName = "Test",
                    LastName = "User",
                    PasswordHash = "$2a$11$jPw3XmB4klBtb6orV8xuvuyAXeHYq7tpsu8DusnflzSb48yeIdUQm", // TestPassword123!
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed test tasks
            modelBuilder.Entity<TodoTask>().HasData(
                new TodoTask
                {
                    Id = 1,
                    Title = "Complete project setup",
                    Description = "Set up the initial project structure and dependencies",
                    IsCompleted = true,
                    Priority = 3,
                    UserId = 1,
                    CreatedAt = DateTime.UtcNow.AddDays(-2),
                    CompletedAt = DateTime.UtcNow.AddDays(-1)
                },
                new TodoTask
                {
                    Id = 2,
                    Title = "Implement authentication",
                    Description = "Add JWT authentication and user management",
                    IsCompleted = false,
                    Priority = 5,
                    UserId = 1,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new TodoTask
                {
                    Id = 3,
                    Title = "Create frontend components",
                    Description = "Build Angular components for task management",
                    IsCompleted = false,
                    Priority = 4,
                    UserId = 1,
                    CreatedAt = DateTime.UtcNow
                }
            );
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Automatically set UpdatedAt for modified entities
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is TodoTask && e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                ((TodoTask)entry.Entity).UpdatedAt = DateTime.UtcNow;
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}