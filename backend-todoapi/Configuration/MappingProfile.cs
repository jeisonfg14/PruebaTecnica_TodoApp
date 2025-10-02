using AutoMapper;
using TodoApi.Models;
using TodoApi.DTOs;

namespace TodoApi.Configuration
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // User mappings
            CreateMap<User, UserDto>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.FullName));

            CreateMap<RegisterDto, User>();
            CreateMap<UpdateUserDto, User>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));

            // TodoTask mappings
            CreateMap<TodoTask, TodoTaskDto>();
            CreateMap<CreateTodoTaskDto, TodoTask>();
            CreateMap<UpdateTodoTaskDto, TodoTask>()
                .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
        }
    }
}