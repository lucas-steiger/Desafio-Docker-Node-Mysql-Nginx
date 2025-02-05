# Desafio Nginx com Node FullCycle 3.0

A ideia principal é que, quando um usuário acessar o Nginx, ele fará uma chamada para a aplicação Node.js. A aplicação Node.js, por sua vez, adicionará um registro no banco de dados MySQL, cadastrando um nome na tabela `people`.

O retorno da aplicação Node.js para o Nginx deverá ser:
- Uma mensagem: `<h1>Full Cycle Rocks!</h1>`
- Uma lista de nomes cadastrados no banco de dados.

## Como Rodar o Projeto

docker-compose up -d