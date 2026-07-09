using Microsoft.EntityFrameworkCore;
using HousePays.Modelos;

namespace HousePays.Dados
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Pessoa> Pessoas => Set<Pessoa>();
        public DbSet<Transacao> Transacoes => Set<Transacao>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // configuraçao do relacionamento 1 - n com cascade delete
            modelBuilder.Entity<Transacao>()
                .HasOne(t => t.Pessoa)
                .WithMany(p => p.Transacoes)
                .HasForeignKey(t => t.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}
