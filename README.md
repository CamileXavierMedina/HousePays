# HousePays

## Sistema de Gerenciamento de Gastos Residenciais

O HousePays tem a premissa de auxiliar no controle de gastos da sua residência, tendo como funções disponíveis:
* Cadastro de transações
* Cadastro de pessoas
* Consulta de totais

## Tecnologias e Banco de Dados

* .NET com C# para o back-end.
* React com TypeScript para o front-end.
* SQLite para o banco de dados.

## Estrutura do Projeto

├── HousePays-back (Pasta com o código C#)

├── HousePays-front (Pasta com o código React/TS)

└── HousePays.sln (Arquivo de solução na raiz)

## Lógica do Sistema

A maior parte da lógica de persistência e validações de regras de negócios foi isolada no back-end utilizando C# e LINQ, garantindo a segurança dos dados e melhor organização do código.

## Funcionalidades

### Cadastro de pessoas:
Há a opção de cadastro contendo as funcionalidades básicas de gerenciamento:
* Criação
* Deleção
* Listagem

Em casos em que se delete uma pessoa, todas as transações vinculadas a essa pessoa serão apagadas automaticamente em cascata.

O cadastro de pessoa contém:
* Identificador (único e gerado automaticamente)
* Nome
* Idade

### Cadastro de transações:
Contém as funcionalidades básicas de gerenciamento:
* Criação
* Listagem

Caso a pessoa informada seja menor de idade (menor de 18 anos), apenas despesas poderão ser cadastradas para ela.

O cadastro de transação contém:
* Identificador (único e gerado automaticamente)
* Descrição
* Valor
* Tipo (despesa/receita)
* Pessoa (identificador da pessoa vinculada, que precisa existir no cadastro de moradores)

### Consulta de totais:
Lista todas as pessoas cadastradas, exibindo:
* Total de receitas individuais
* Total de despesas individuais
* Saldo (receita - despesa) de cada morador

Ao final da listagem, é exibido o total geral consolidado da residência, incluindo o total de receitas, o total de despesas e o saldo líquido geral.

## Como Clonar o Repositório

No terminal, execute o comando abaixo para clonar o repositório em sua máquina local:

```bash
git clone https://github.com/CamileXavierMedina/HousePays.git
```

## Como Executar a Aplicação

### Executando o Back-end (API ASP.NET Core)

O back-end utiliza o SQLite, o que significa que não é necessário configurar ou instalar nenhum servidor de banco de dados externo. O arquivo do banco de dados (housepays.db) será criado automaticamente na primeira execução da API.

1. No terminal, navegue até a pasta do back-end:
```bash
cd HousePays-back
```

2. Execute o comando para restaurar as dependências e iniciar a API:
```bash
dotnet run
```

A API estará disponível localmente no seguinte endereço:
* http://localhost:5196

Visualização opcional do banco de dados:
Caso deseje visualizar as tabelas de pessoas e transações em tempo real, abra o DBeaver, crie uma nova conexão do tipo SQLite e selecione o arquivo housepays.db gerado automaticamente dentro da pasta HousePays-back.

---

### Executando o Front-end (React + TypeScript + Vite)

Com a API em execução, inicie o painel web desenvolvido em React.

1. Abra uma nova janela do terminal e navegue até a pasta do front-end:
```bash
cd HousePays-front
```

2. Instale as dependências do projeto:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento do Vite:
```bash
npm run dev
```

4. Abra o navegador e acesse o endereço informado no terminal:
* http://localhost:5173

Comunicação entre Front-end e Back-end:
Mantenha o terminal da API ASP.NET Core em execução enquanto utiliza o Front-end. Dessa forma, todas as informações serão carregadas e persistidas corretamente no banco de dados.

---
##### Camile Xavier Medina 
###### 08 de junho de 2026.
###### Brasília-df.
