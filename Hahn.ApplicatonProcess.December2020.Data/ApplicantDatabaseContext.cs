using Hahn.ApplicatonProcess.December2020.Domain;
using Microsoft.EntityFrameworkCore;

namespace Hahn.ApplicatonProcess.December2020.Data
{
    public class ApplicantDatabaseContext : DbContext
    {
        public ApplicantDatabaseContext(DbContextOptions<ApplicantDatabaseContext> options) : base(options)
        {
        }

        public DbSet<Applicant> Applicants { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Applicant>()
                .HasKey(x => x.ID);
        }
    }
}