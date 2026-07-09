using Microsoft.EntityFrameworkCore;
using HousePays.Dados;
using HousePays.Repositorios;
using HousePays.Servicos;

var builder = WebApplication.CreateBuilder(args);

// Configura o Banco de Dados SQLite
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite("Data Source=housepays.db"));

// Configura as dependências do sistema (Repositórios e Serviços)
builder.Services.AddScoped<IPessoaRepositorio, PessoaRepositorio>();
builder.Services.AddScoped<ITransacaoRepositorio, TransacaoRepositorio>();
builder.Services.AddScoped<IPessoaServico, PessoaServico>();
builder.Services.AddScoped<ITransacaoServico, TransacaoServico>();

// Configura o CORS para o React acessar a API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Porta em que o React roda
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Adiciona os Controladores com configuração para evitar loop de referência cíclica
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Configura o OpenAPI/Swagger se necessário
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Ativa o CORS
app.UseCors("AllowReact");

// Garante que as tabelas do Banco de Dados SQLite sejam criadas automaticamente
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// Endpoint de teste inicial
app.MapGet("/", () => "Api housepays ativa, configurada no sqlite e pronta para as rotas!");

// Mapeia os Controladores
app.MapControllers();

app.Run();