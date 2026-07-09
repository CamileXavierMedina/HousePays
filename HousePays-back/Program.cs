using Microsoft.EntityFrameworkCore;
using HousePays.Dados;
using HousePays.Repositorios;
using HousePays.Servicos;

var builder = WebApplication.CreateBuilder(args);

// configura o banco de dados sqlite
builder.Services.AddDbContext<AppDbContext>(options => 
    options.UseSqlite("Data Source=housepays.db"));

// configura as dependencias do sistema (repositorios e serviços)
builder.Services.AddScoped<IPessoaRepositorio, PessoaRepositorio>();
builder.Services.AddScoped<ITransacaoRepositorio, TransacaoRepositorio>();
builder.Services.AddScoped<IPessoaServico, PessoaServico>();
builder.Services.AddScoped<ITransacaoServico, TransacaoServico>();

// configura o cors para o react acessar a api
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // porta em que o react roda
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// adiciona os controladores com configuraçao para evitar loop de referencia ciclica
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// configura o openapi/swagger se necessario
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// ativa o cors
app.UseCors("AllowReact");

// garante que as tabelas do banco de dados sqlite sejam criadas automaticamente
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// endpoint de teste inicial
app.MapGet("/", () => "Api housepays ativa, configurada no sqlite e pronta para as rotas!");

// mapeia os controladores
app.MapControllers();

app.Run();