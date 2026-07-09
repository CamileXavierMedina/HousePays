# HousePays

## Sistema De Gerenciamento de Gastos Residenciais

### O HousePays tem a premissa de auxiliar no controle de gastos da sua residência, tendo como funções disponiveis:
* Cadastros de transações;
* Cadastro de pessoas;
* Consulta de totais;

## Tecnologias e Banco de Dados

* *.NET com C# para o back-end.*
* *React com Typescript para o front-end.*
* *Sqlite com vizualização opcional via Dbeaver para o banco de dados.*

## Estrutura

 ├── 📁 HousePays-back (Pasta com o código C#)
 
 ├── 📁 HousePays-front (Pasta com o código React/TS)
 
 └── 📄 HousePays.sln (Arquivo de solução na raiz)


## Logica
### A maioria da logica foi feita isolada via backend utilizando c# e LINQ para segurança dos dados e por ser minha area de dominio!

## Funcionalidades

#### Cadastro de pessoas:
Há a opção de cadastro contendo as funcionalidades básicas de gerenciamento: 
* Criação
* Deleção
* Listagem.
  
##### Em casos que se delete uma pessoa, todas a transações dessa pessoa serão apagadas.

**O cadastro de pessoa deverá conter:**
* Identificador (único e gerado automaticamente);
* Nome;
* Idade;
  
#### Cadastro de transações:
Deverá ser implementado um cadastro contendo as funcionalidades básicas de gerenciamento:
* Criação
* Listagem (sem edição/deleção).
  
##### Caso a pessoa informada seja menor de idade (menor de 18 anos), apenas despesas serão cadastradas.

**O cadastro de transação deverá conter:**
* Identificador (único e gerado automaticamente);
* Descrição;
* Valor;
* Tipo (despesa/receita);
* Pessoa (identificador da pessoa);
  
##### Esse valor precisa existir no cadastro de pessoa;

#### Consulta de totais:
Lista todas as pessoas cadastradas, exibindo:
* Total de receitas
* Despesas
* Saldo (receita – despesa) de cada uma.
  
##### Ao final da listagem, será exibido o total geral de todas as pessoas, incluindo o total de receitas, o total de despesas e o saldo líquido.
### Executando o Back-end (API ASP.NET Core)

O back-end utiliza o **SQLite**, o que significa que **não é necessário instalar nenhum servidor de banco de dados**. O arquivo do banco será criado automaticamente na primeira execução da API.

No terminal, navegue até a pasta do back-end:

```bash
cd HousePays-back
```

Execute o comando para restaurar as dependências e iniciar a API:

```bash
dotnet run
```

A API estará disponível localmente, normalmente em um dos seguintes endereços:

- `http://localhost:5000`
- `http://localhost:5200`

> **Observação:** Verifique no terminal a porta utilizada durante a execução.

> [!TIP]
> **Visualização opcional do banco de dados**
>
> Caso deseje visualizar as tabelas de pessoas e transações em tempo real, abra o **DBeaver**, crie uma nova conexão do tipo **SQLite** e selecione o arquivo `.db` gerado automaticamente dentro da pasta **HousePays-back**.

---

### Executando o Front-end (React + TypeScript + Vite)

Com a API em execução, inicie o painel web desenvolvido em **React**.

Abra uma nova janela do terminal e navegue até a pasta do front-end:

```bash
cd HousePays-front
```

Instale as dependências do projeto:

```bash
npm install
```

Inicie o servidor de desenvolvimento do Vite:

```bash
npm run dev
```

Abra o navegador e acesse o endereço informado no terminal, normalmente:

- `http://localhost:5173`

> [!IMPORTANT]
> **Comunicação entre Front-end e Back-end**
>
> Mantenha o terminal da **API ASP.NET Core** em execução enquanto utiliza o Front-end. Dessa forma, todas as informações serão carregadas e persistidas corretamente no banco de dados.

## Clone o Repositório

```bash
git clone https://github.com/CamileXavierMedina/HousePays.git
```

---
##### Camile Xavier Medina 
###### 08 de junho de 2026.
###### Brasília-df.
