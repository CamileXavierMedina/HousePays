using Microsoft.EntityFrameworkCore;
using HousePays.Models;

namespace HousePays.Data
{
    public class AppDbContext : DbContext
    {
        //recebe as configurac. do banco(definido no program.cs)
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        //Dbsets represent. tabelas q vao ser criadas no sqlite
        public DbSet<Pessoa> Pessoas => Set<Pessoa>();
        public DbSet<Transacao> Transacoes => Set<Transacao>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           //config. da reacao de 1 - n
            modelBuilder.Entity<Transacao>().HasOne(t => t.Pessoa).WithMany(p => p.Transacoes).HasForeignKey(t => t.PessoaId).OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);//se apagar o registro pai os registros filhos tbm sao excluidos
        }
    }

}