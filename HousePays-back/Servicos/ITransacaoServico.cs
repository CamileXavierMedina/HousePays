using System.Collections.Generic;
using System.Threading.Tasks;
using HousePays.Modelos;
using HousePays.Modelos.Dtos;

namespace HousePays.Servicos
{
    public interface ITransacaoServico
    {
        Task<IEnumerable<Transacao>> ListarTransacoesAsync();
        Task<Transacao> CadastrarTransacaoAsync(TransacaoCadastroDto dto);
    }
}
