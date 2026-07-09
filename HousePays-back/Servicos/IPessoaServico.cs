using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HousePays.Modelos;
using HousePays.Modelos.Dtos;

namespace HousePays.Servicos
{
    public interface IPessoaServico
    {
        Task<IEnumerable<Pessoa>> ListarPessoasAsync();
        Task<RelatorioTotaisDto> ObterRelatorioTotaisAsync();
        Task<Pessoa> CadastrarPessoaAsync(PessoaCadastroDto dto);
        Task ExcluirPessoaAsync(Guid id);
    }
}
