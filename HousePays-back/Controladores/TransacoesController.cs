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
    [Route("transacoes")]
    public class TransacoesController : ControllerBase
    {
        private readonly ITransacaoServico _transacaoServico;
        private readonly ILogger<TransacoesController> _logger;

        // construtor que injeta o serviço de transaçoes e o logger
        public TransacoesController(ITransacaoServico transacaoServico, ILogger<TransacoesController> logger)
        {
            _transacaoServico = transacaoServico;
            _logger = logger;
        }

        // rota para listar todas as transaçoes registradas no sistema
        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            _logger.LogInformation("Recebida requisição GET /transacoes.");
            try
            {
                var transacoes = await _transacaoServico.ListarTransacoesAsync();
                return Ok(transacoes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao listar transações.");
                return StatusCode(500, "Ocorreu um erro interno no servidor.");
            }
        }

        // rota para cadastrar uma nova transaçao validando regras de negocio
        [HttpPost]
        public async Task<IActionResult> Cadastrar([FromBody] TransacaoCadastroDto dto)
        {
            _logger.LogInformation("Recebida requisição POST /transacoes para lançar nova movimentação.");
            try
            {
                var novaTransacao = await _transacaoServico.CadastrarTransacaoAsync(dto);
                return Created($"/transacoes/{novaTransacao.Id}", novaTransacao);
            }
            catch (ValidacaoExcecao ex)
            {
                _logger.LogWarning(ex, "Erro de validação ao cadastrar transação.");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro interno ao cadastrar transação.");
                return StatusCode(500, "Ocorreu um erro interno no servidor.");
            }
        }
    }
}
