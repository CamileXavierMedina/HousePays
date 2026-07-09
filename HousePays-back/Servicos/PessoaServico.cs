using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using HousePays.Excecoes;
using HousePays.Modelos;
using HousePays.Modelos.Dtos;
using HousePays.Repositorios;

namespace HousePays.Servicos
{
    public class PessoaServico : IPessoaServico
    {
        private readonly IPessoaRepositorio _pessoaRepositorio;
        private readonly ILogger<PessoaServico> _logger;

        // construtor que recebe o repositorio de pessoas e o logger
        public PessoaServico(IPessoaRepositorio pessoaRepositorio, ILogger<PessoaServico> logger)
        {
            _pessoaRepositorio = pessoaRepositorio;
            _logger = logger;
        }

        // busca e lista todos os moradores com suas transaçoes
        public async Task<IEnumerable<Pessoa>> ListarPessoasAsync()
        {
            _logger.LogInformation("Iniciando listagem de todas as pessoas.");
            return await _pessoaRepositorio.ObterTodasComTransacoesAsync();
        }

        // calcula receitas, despesas e saldo individual de cada morador e consolida o saldo geral
        public async Task<RelatorioTotaisDto> ObterRelatorioTotaisAsync()
        {
            _logger.LogInformation("Gerando relatório consolidado de totais por morador.");
            var pessoas = await _pessoaRepositorio.ObterTodasComTransacoesAsync();

            var pessoasTotais = pessoas.Select(p =>
            {
                var totalReceitas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Receita)
                    .Sum(t => t.Valor);

                var totalDespesas = p.Transacoes
                    .Where(t => t.Tipo == TipoTransacao.Despesa)
                    .Sum(t => t.Valor);

                var saldo = totalReceitas - totalDespesas;

                return new PessoaTotaisDto
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Idade = p.Idade,
                    TotalReceitas = totalReceitas,
                    TotalDespesas = totalDespesas,
                    Saldo = saldo
                };
            }).ToList();

            var totalReceitasGeral = pessoasTotais.Sum(pt => pt.TotalReceitas);
            var totalDespesasGeral = pessoasTotais.Sum(pt => pt.TotalDespesas);
            var saldoLiquidoGeral = totalReceitasGeral - totalDespesasGeral;

            _logger.LogInformation("Relatório gerado com sucesso. Total de moradores processados: {Quantidade}.", pessoasTotais.Count);

            return new RelatorioTotaisDto
            {
                Pessoas = pessoasTotais,
                TotalReceitasGeral = totalReceitasGeral,
                TotalDespesasGeral = totalDespesasGeral,
                SaldoLiquidoGeral = saldoLiquidoGeral
            };
        }

        // cadastra uma nova pessoa validando nome obrigatorio e idade nao negativa
        public async Task<Pessoa> CadastrarPessoaAsync(PessoaCadastroDto dto)
        {
            _logger.LogInformation("Iniciando processo de cadastro para a pessoa '{Nome}'.", dto.Nome);

            if (string.IsNullOrWhiteSpace(dto.Nome))
            {
                _logger.LogWarning("Falha ao cadastrar pessoa: Nome é obrigatório.");
                throw new ValidacaoExcecao("O nome da pessoa é obrigatorio!");
            }

            if (dto.Idade < 0)
            {
                _logger.LogWarning("Falha ao cadastrar pessoa: Idade negativa ({Idade}).", dto.Idade);
                throw new ValidacaoExcecao("A idade nao pode ser negativa");
            }

            var novaPessoa = new Pessoa
            {
                Nome = dto.Nome.Trim(),
                Idade = dto.Idade
            };

            await _pessoaRepositorio.AdicionarAsync(novaPessoa);
            _logger.LogInformation("Cadastro concluído com sucesso. Id gerado: {Id}.", novaPessoa.Id);

            return novaPessoa;
        }

        // remove um morador se ele existir no banco de dados
        public async Task ExcluirPessoaAsync(Guid id)
        {
            _logger.LogInformation("Iniciando remoção da pessoa com Id {Id}.", id);

            var pessoa = await _pessoaRepositorio.ObterPorIdAsync(id);
            if (pessoa == null)
            {
                _logger.LogWarning("Pessoa com Id {Id} não encontrada para exclusão.", id);
                throw new NaoEncontradoExcecao("Pessoa nao identificada!");
            }

            await _pessoaRepositorio.RemoverAsync(pessoa);
            _logger.LogInformation("Pessoa {Nome} ({Id}) removida com sucesso.", pessoa.Nome, id);
        }
    }
}
