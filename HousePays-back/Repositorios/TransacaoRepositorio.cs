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

        public TransacaoRepositorio(AppDbContext contexto, ILogger<TransacaoRepositorio> logger)
        {
            _contexto = contexto;
            _logger = logger;
        }

        public async Task<IEnumerable<Transacao>> ObterTodasAsync()
        {
            _logger.LogInformation("Buscando todas as transações no banco de dados SQLite.");
            return await _contexto.Transacoes
                .Include(t => t.Pessoa)
                .ToListAsync();
        }

        public async Task AdicionarAsync(Transacao transacao)
        {
            _logger.LogInformation("Adicionando nova transação {Descricao} de valor R${Valor} para a pessoa {PessoaId}.", transacao.Descricao, transacao.Valor, transacao.PessoaId);
            await _contexto.Transacoes.AddAsync(transacao);
            await _contexto.SaveChangesAsync();
            _logger.LogInformation("Transação {Descricao} cadastrada com sucesso.", transacao.Descricao);
        }
    }
}
