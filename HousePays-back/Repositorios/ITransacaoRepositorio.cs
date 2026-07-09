using System.Collections.Generic;
using System.Threading.Tasks;
using HousePays.Modelos;

namespace HousePays.Repositorios
{
    public interface ITransacaoRepositorio
    {
        Task<IEnumerable<Transacao>> ObterTodasAsync();
        Task AdicionarAsync(Transacao transacao);
    }
}
