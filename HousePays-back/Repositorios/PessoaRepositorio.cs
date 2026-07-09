using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using HousePays.Dados;
using HousePays.Modelos;

namespace HousePays.Repositorios
{
    public class PessoaRepositorio : IPessoaRepositorio
    {
        private readonly AppDbContext _contexto;
        private readonly ILogger<PessoaRepositorio> _logger;

        // construtor que injeta o dbcontext de banco de dados e o logger
        public PessoaRepositorio(AppDbContext contexto, ILogger<PessoaRepositorio> logger)
        {
            _contexto = contexto;
            _logger = logger;
        }

        // busca todos os moradores cadastrados no sqlite
        public async Task<IEnumerable<Pessoa>> ObterTodasAsync()
        {
            _logger.LogInformation("Buscando todas as pessoas no banco de dados SQLite.");
            return await _contexto.Pessoas.ToListAsync();
        }

        // busca moradores incluindo a lista de transaçoes vinculadas
        public async Task<IEnumerable<Pessoa>> ObterTodasComTransacoesAsync()
        {
            _logger.LogInformation("Buscando todas as pessoas com transações inclusas no banco de dados SQLite.");
            return await _contexto.Pessoas
                .Include(p => p.Transacoes)
                .ToListAsync();
        }

        // busca um morador especifico usando a chave unica (guid)
        public async Task<Pessoa?> ObterPorIdAsync(Guid id)
        {
            _logger.LogInformation("Buscando pessoa por Id {Id} no banco de dados SQLite.", id);
            return await _contexto.Pessoas.FindAsync(id);
        }

        // salva um novo registro de morador no sqlite
        public async Task AdicionarAsync(Pessoa pessoa)
        {
            _logger.LogInformation("Adicionando nova pessoa {Nome} com Id {Id} no banco de dados.", pessoa.Nome, pessoa.Id);
            await _contexto.Pessoas.AddAsync(pessoa);
            await _contexto.SaveChangesAsync();
            _logger.LogInformation("Pessoa {Nome} cadastrada com sucesso.", pessoa.Nome);
        }

        // deleta um morador (as transaçoes serao apagadas automaticamente por cascade delete)
        public async Task RemoverAsync(Pessoa pessoa)
        {
            _logger.LogInformation("Removendo pessoa {Nome} com Id {Id} (e suas transações em cascata).", pessoa.Nome, pessoa.Id);
            _contexto.Pessoas.Remove(pessoa);
            await _contexto.SaveChangesAsync();
            _logger.LogInformation("Pessoa {Nome} removida do banco com sucesso.", pessoa.Nome);
        }
    }
}
