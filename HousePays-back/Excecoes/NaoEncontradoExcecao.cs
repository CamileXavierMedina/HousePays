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
