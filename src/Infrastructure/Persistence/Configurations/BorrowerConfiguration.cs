using WebBook.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace WebBook.Infrastructure.Persistence.Configurations;

public class BorrowerConfiguration : IEntityTypeConfiguration<Borrower>
{
    public void Configure(EntityTypeBuilder<Borrower> builder)
    {
        builder.Property(t => t.Name)
            .HasMaxLength(200)
            .IsRequired();
        builder.Property(t => t.Address)
            .HasMaxLength(200)
            .IsRequired();
        builder.Property(t => t.Phone)
            .HasMaxLength(200)
            .IsRequired();
    }
}
