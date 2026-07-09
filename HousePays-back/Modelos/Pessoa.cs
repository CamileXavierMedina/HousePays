// representa a tabela de moradores no banco de dados com nome e idade
using System;
using System.Collections.Generic;

namespace HousePays.Modelos
{
    public class Pessoa
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}
