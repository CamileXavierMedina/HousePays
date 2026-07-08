using Microsoft.EntityFrameworkCore;
using HousePays.Data;

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

//endpoint de teste
app.MapGet("/", () => "Api housepays ativa, configurada no sqlite e pronta prs rotas!");

app.Run();