// dados necessarios para cadastrar um morador que vem do front-end
namespace HousePays.Modelos.Dtos
{
    public class PessoaCadastroDto
    {
        public string Nome { get; set; } = string.Empty;
        public int Idade { get; set; }
    }
}
