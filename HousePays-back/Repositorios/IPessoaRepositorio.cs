using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HousePays.Modelos;

namespace HousePays.Repositorios
{
    public interface IPessoaRepositorio
    {
        Task<IEnumerable<Pessoa>> ObterTodasAsync();
        Task<IEnumerable<Pessoa>> ObterTodasComTransacoesAsync();
        Task<Pessoa?> ObterPorIdAsync(Guid id);
        Task AdicionarAsync(Pessoa pessoa);
        Task RemoverAsync(Pessoa pessoa);
    }
}
