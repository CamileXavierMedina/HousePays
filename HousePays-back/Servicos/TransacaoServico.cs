using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using HousePays.Excecoes;
using HousePays.Modelos;
using HousePays.Modelos.Dtos;
using HousePays.Repositorios;

namespace HousePays.Servicos
{
    public class TransacaoServico : ITransacaoServico
    {
        private readonly ITransacaoRepositorio _transacaoRepositorio;
        private readonly IPessoaRepositorio _pessoaRepositorio;
        private readonly ILogger<TransacaoServico> _logger;

        // construtor que injeta os repositorios de transaçao e pessoa
        public TransacaoServico(
            ITransacaoRepositorio transacaoRepositorio,
            IPessoaRepositorio pessoaRepositorio,
            ILogger<TransacaoServico> logger)
        {
            _transacaoRepositorio = transacaoRepositorio;
            _pessoaRepositorio = pessoaRepositorio;
            _logger = logger;
        }

        // busca e retorna todas as transaçoes registradas
        public async Task<IEnumerable<Transacao>> ListarTransacoesAsync()
        {
            _logger.LogInformation("Iniciando listagem de todas as transações.");
            return await _transacaoRepositorio.ObterTodasAsync();
        }

        // realiza as validaçoes de campos e bloqueia receitas para menores de 18 anos
        public async Task<Transacao> CadastrarTransacaoAsync(TransacaoCadastroDto dto)
        {
            _logger.LogInformation("Iniciando processo de cadastro para a transação '{Descricao}'.", dto.Descricao);

            if (string.IsNullOrWhiteSpace(dto.Descricao))
            {
                _logger.LogWarning("Falha ao cadastrar transação: Descrição é obrigatória.");
                throw new ValidacaoExcecao("A desrcrição da transação é obrigatoria!");
            }

            if (dto.Valor <= 0)
            {
                _logger.LogWarning("Falha ao cadastrar transação: Valor menor ou igual a zero ({Valor}).", dto.Valor);
                throw new ValidacaoExcecao("O valor da transação deve ser maior que zero!");
            }

            var pessoa = await _pessoaRepositorio.ObterPorIdAsync(dto.PessoaId);
            if (pessoa == null)
            {
                _logger.LogWarning("Falha ao cadastrar transação: Pessoa com Id {PessoaId} não encontrada.", dto.PessoaId);
                throw new ValidacaoExcecao("A pessoa informada pra esta transação nao foi identificada.");
            }

            if (pessoa.Idade < 18 && dto.Tipo == TipoTransacao.Receita)
            {
                _logger.LogWarning("Falha ao cadastrar transação: Pessoa '{Nome}' é menor de idade ({Idade} anos) e tentou cadastrar uma Receita.", pessoa.Nome, pessoa.Idade);
                throw new ValidacaoExcecao($"A pessoa '{pessoa.Nome}' tem apenas {pessoa.Idade} anos e, por isso so pode cadastrar despesas!");
            }

            var novaTransacao = new Transacao
            {
                Descricao = dto.Descricao.Trim(),
                Valor = dto.Valor,
                Tipo = dto.Tipo,
                PessoaId = dto.PessoaId
            };

            await _transacaoRepositorio.AdicionarAsync(novaTransacao);
            _logger.LogInformation("Transação cadastrada com sucesso. Id gerado: {Id}.", novaTransacao.Id);

            return novaTransacao;
        }
    }
}
