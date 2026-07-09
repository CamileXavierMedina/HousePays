using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using HousePays.Excecoes;
using HousePays.Modelos.Dtos;
using HousePays.Servicos;

namespace HousePays.Controladores
{
    [ApiController]
    [Route("pessoas")]
    public class PessoasController : ControllerBase
    {
        private readonly IPessoaServico _pessoaServico;
        private readonly ILogger<PessoasController> _logger;

        // construtor que injeta o serviço de moradores e o logger
        public PessoasController(IPessoaServico pessoaServico, ILogger<PessoasController> logger)
        {
            _pessoaServico = pessoaServico;
            _logger = logger;
        }

        // rota que busca todos os moradores cadastrados no sistema
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            _logger.LogInformation("Recebida requisição GET /pessoas.");
            try
            {
                var pessoas = await _pessoaServico.ListarPessoasAsync();
                return Ok(pessoas);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao listar pessoas.");
                return StatusCode(500, "Ocorreu um erro interno no servidor.");
            }
        }

        // rota que gera o relatorio de saldos e totais consolidados da casa
        [HttpGet("totais")]
        public async Task<IActionResult> ObterTotais()
        {
            _logger.LogInformation("Recebida requisição GET /pessoas/totais.");
            try
            {
                var relatorio = await _pessoaServico.ObterRelatorioTotaisAsync();
                return Ok(relatorio);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao obter relatório de totais.");
                return StatusCode(500, "Ocorreu um erro interno no servidor.");
            }
        }

        // rota para cadastrar um novo morador validando os dados
        [HttpPost]
        public async Task<IActionResult> Cadastrar([FromBody] PessoaCadastroDto dto)
        {
            _logger.LogInformation("Recebida requisição POST /pessoas para cadastrar novo morador.");
            try
            {
                var novaPessoa = await _pessoaServico.CadastrarPessoaAsync(dto);
                return Created($"/pessoas/{novaPessoa.Id}", novaPessoa);
            }
            catch (ValidacaoExcecao ex)
            {
                _logger.LogWarning(ex, "Erro de validação ao cadastrar pessoa.");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro interno ao cadastrar pessoa.");
                return StatusCode(500, "Ocorreu um erro interno no servidor.");
            }
        }

        // rota para excluir um morador e apagar suas transaçoes em cascata
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Excluir([FromRoute] Guid id)
        {
            _logger.LogInformation("Recebida requisição DELETE /pessoas/{Id} para exclusão.", id);
            try
            {
                await _pessoaServico.ExcluirPessoaAsync(id);
                return NoContent();
            }
            catch (NaoEncontradoExcecao ex)
            {
                _logger.LogWarning(ex, "Recurso não encontrado para exclusão: {Id}.", id);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro interno ao excluir pessoa com Id {Id}.", id);
                return StatusCode(500, "Ocorreu um erro interno no servidor.");
            }
        }
    }
}
