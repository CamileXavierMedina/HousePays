using System;

namespace HousePays.Excecoes
{
    public class ValidacaoExcecao : Exception
    {
        public ValidacaoExcecao(string mensagem) : base(mensagem)
        {
        }
    }
}
