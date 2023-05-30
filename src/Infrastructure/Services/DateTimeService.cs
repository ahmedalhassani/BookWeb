using WebBook.Application.Common.Interfaces;

namespace WebBook.Infrastructure.Services;

public class DateTimeService : IDateTime
{
    public DateTime Now => DateTime.Now;
}
