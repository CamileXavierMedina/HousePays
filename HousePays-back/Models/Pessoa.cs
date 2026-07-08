using System;
using System.Collections.Generic;

namespace HousePays.Models
{
    public class Pessoa
    {
        //Identificador único gerado automaticamente
        public Guid Id { get; set; } = Guid.NewGuid();

        //Nome da pessoa
        public string Nome { get; set; } = string.Empty;

        //Idade da pessoa
        public int Idade { get; set; }

        //Uma pessoa pode ter várias transações
        public ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}