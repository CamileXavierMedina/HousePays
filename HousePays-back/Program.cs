using Microsoft.EntityFrameworkCore;
using HousePays.Data;
using HousePays.Models;

var builder = WebApplication.CreateBuilder(args);

//configura o BD sqlite 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=housepays.db"));

//coonfig. o cors pro react acessar a api
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")//porta que o react roda
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();

//ativa allow do cors
app.UseCors("AllowReact");

//garante q criará as tabelas do BD automaticamente
using(var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

//endpoint de teste incial
app.MapGet("/", () => "Api housepays ativa, configurada no sqlite e pronta prs rotas!");

//ROTA DE PESSOAS//

//lista as pessoas
app.MapGet("/pessoas", async (AppDbContext db) =>
{
    var pessoas = await db.Pessoas.ToListAsync();
});

//cadastra alguem novo
app.MapPost("/pessoas", async (Pessoa novaPessoa, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(novaPessoa.Nome))
    {
        return Results.BadRequest("O nome da pessoa é obrigatorio!");
    }

    if (novaPessoa.Idade < 0)
    {
        return Results.BadRequest("A idade nao pode ser negativa");
    }

    //id ja vem no guid.newguid 
    db.Pessoas.Add(novaPessoa);
    await db.SaveChangesAsync();

    return Results.Created($"/pessoas/{novaPessoa.Id}", novaPessoa);

});

//excluir pessoa(exclusao cascata)
app.MapDelete("/pessoas/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var pessoa = await db.Pessoas.FindAsync(id);

    if (pessoa == null)
    {
        return Results.NotFound("Pessoa nao identificada!");
    }

    //entende q config. a exclusao cascata e ja  remove transação sozinho
    db.Pessoas.Remove(pessoa);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();