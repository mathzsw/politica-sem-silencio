# Política sem Silêncio

Quiz interativo sobre violência política de gênero e raça no ambiente digital, desenvolvido para um trabalho de História do IFPE — Campus Jaboatão dos Guararapes.

## Funcionalidades

- Salas com código de acesso.
- Perguntas de múltipla escolha.
- Pontuação por acertos e rapidez.
- Ranking dos participantes.
- Painel administrativo protegido por senha.

## Tecnologias

Node.js, Express, Handlebars, Sequelize, SQLite, HTML, CSS e JavaScript.

## Executar localmente

Requisitos: Node.js.

```bash
git clone https://github.com/mathzsw/politica-sem-silencio.git
cd politica-sem-silencio
npm install
npm start
```

Configure a variável de ambiente `ADMIN_PASSWORD` antes de iniciar o servidor para acessar `/admin`. Depois, abra http://localhost:3001.

## Publicação

O projeto precisa de hospedagem compatível com Node.js. Configure `npm install` como comando de build e `npm start` como comando de inicialização.

**Importante:** o SQLite usa um arquivo local, que pode não persistir em hospedagens com armazenamento temporário.

## Trabalho

**Disciplina:** História  
**Docente:** Jandynéa de Paula Carvalho Gomes

**Equipe:** Ádrian Vinícius Oliveira de Almeida, Allycia da Silva Gomes Ribeiro, Ana Heloíza dos Santos e Souza, Edklause Diniz de Oliveira Filho, Maria Helena Medeiros Madruga, Matheus Augusto Rodrigues de Alencar, Melyssa Valéria Souza Almeida, Nicolas Alcantara da Silva e Thais Myller Felix da Silva.
