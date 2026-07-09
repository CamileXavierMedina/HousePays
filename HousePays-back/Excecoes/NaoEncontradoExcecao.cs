// erro customizado para quando buscamos algo que nao existe no banco
using System;

namespace HousePays.Excecoes
{
    public class NaoEncontradoExcecao : Exception
    {
        public NaoEncontradoExcecao(string mensagem) : base(mensagem)
        {
        }
    }
}
