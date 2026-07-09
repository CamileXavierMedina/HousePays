// erro customizado para quando alguma regra do sistema nao for seguida
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
