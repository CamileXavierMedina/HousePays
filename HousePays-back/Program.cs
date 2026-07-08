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

//evita loop eterno
builder.Services.Configure<Microsoft.AspNetCore.Http.Json.JsonOptions>(options =>
{
    options.SerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
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

//--ROTA DE PESSOAS--//

//lista as pessoas
app.MapGet("/pessoas", async (AppDbContext db) =>
{
    var pessoas = await db.Pessoas
    .Include(p => p.Transacoes)// traaz todas movimentacoes da pessoa x
    .ToListAsync();
    return Results.Ok(pessoas);
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

//--Rota de Transacoes--//

//lista todas transac. cadastradas
app.MapGet("/transacoes", async (AppDbContext db) =>
{
    var transacoes = await db.Transacoes
        .Include(t => t.Pessoa)//junta com os dados de pessoa
        .ToListAsync();
    return Results.Ok(transacoes);
});

//cadastra nova transac.
app.MapPost("/transacoes", async (Transacao novaTransacao, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(novaTransacao.Descricao))
    {
        return Results.BadRequest("A desrcrição da transação é obrigatoria!");
    }

    //valor maior que zero
    if  (novaTransacao.Valor <= 0)
    {
        return Results.BadRequest("O valor da transação deve ser maior que zero!");
    }

    //verifica se apessoa existe no banco de dados
    var pessoa = await db.Pessoas.FindAsync(novaTransacao.PessoaId);
    if (pessoa == null)
    {
        return Results.BadRequest("A pessoa informada pra esta transação nao foi identificada.");
    }

    //menor de idade so cadastra despesas
    if (pessoa.Idade < 18 && novaTransacao.Tipo == TipoTransacao.Receita)
    {
        return Results.BadRequest($"A pessoa '{pessoa.Nome}' tem apenas {pessoa.Idade} anos e, por isso so pode cadastrar despesas!");
    }

    novaTransacao.Pessoa = null;

    db.Transacoes.Add(novaTransacao);
    await db.SaveChangesAsync();

    return Results.Created($"/transacoes/{novaTransacao.Id}", novaTransacao);
});

app.Run();