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
 
 ├── 📁 housepays-front (Pasta com o código React/TS)
 
 └── 📄 HousePays.sln (Arquivo de solução na raiz)


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

## Clone o Repositório

```bash
git clone https://github.com/CamileXavierMedina/HousePays.git
```

---
##### Camile Xavier Medina 
###### 08 de junho de 2026.
###### Brasília-df.
