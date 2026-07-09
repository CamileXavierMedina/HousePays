using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using HousePays.Dados;
using HousePays.Modelos;

namespace HousePays.Repositorios
{
    public class TransacaoRepositorio : ITransacaoRepositorio
    {
        private readonly AppDbContext _contexto;
        private readonly ILogger<TransacaoRepositorio> _logger;

        // construtor que injeta o dbcontext de banco de dados e o logger
        public TransacaoRepositorio(AppDbContext contexto, ILogger<TransacaoRepositorio> logger)
        {
            _contexto = contexto;
            _logger = logger;
        }

        // busca todas as transaçoes do banco incluindo dados dos moradores
        public async Task<IEnumerable<Transacao>> ObterTodasAsync()
        {
            _logger.LogInformation("Buscando todas as transações no banco de dados SQLite.");
            return await _contexto.Transacoes
                .Include(t => t.Pessoa)
                .ToListAsync();
        }

        // salva um novo registro de lançamento de despesa ou receita no sqlite
        public async Task AdicionarAsync(Transacao transacao)
        {
            _logger.LogInformation("Adicionando nova transação {Descricao} de valor R${Valor} para a pessoa {PessoaId}.", transacao.Descricao, transacao.Valor, transacao.PessoaId);
            await _contexto.Transacoes.AddAsync(transacao);
            await _contexto.SaveChangesAsync();
            _logger.LogInformation("Transação {Descricao} cadastrada com sucesso.", transacao.Descricao);
        }
    }
}
