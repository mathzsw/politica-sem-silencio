# Política sem Silêncio

Quiz interativo sobre casos reais de violência política de gênero e raça no ambiente digital, desenvolvido para um trabalho de História do IFPE — Campus Jaboatão dos Guararapes.

A proposta é transformar o conteúdo pesquisado em uma atividade participativa: os jogadores entram em uma sala com código, respondem às perguntas e acompanham a pontuação e o ranking.

## Funcionalidades

- Criação de salas com código de acesso.
- Entrada de participantes pelo código da sala.
- Sala de espera com lista de jogadores.
- Controle do quiz exclusivo de quem criou a sala.
- Perguntas com quatro alternativas.
- Pontuação por resposta correta e bônus por rapidez.
- Ranking atualizado durante a partida e classificação final.

### Pontuação

| Resultado | Pontos |
| --- | ---: |
| Acertar em até 5 segundos | 4 |
| Acertar em mais de 5 até 10 segundos | 3 |
| Acertar em mais de 10 até 20 segundos | 2 |
| Acertar após 20 segundos | 1 |
| Errar | 0 |

## Segurança

- O painel `/admin` não está disponível publicamente.
- A API bloqueia solicitações públicas de cadastro de perguntas (`POST /perguntas`).
- Somente quem criou uma sala, usando a chave privada gerada para aquela partida, pode iniciá-la ou avançar as perguntas.
- A chave do apresentador é armazenada no banco como hash; ela não deve ser compartilhada com os participantes.

O cadastro público de perguntas está desativado. Para preparar o conteúdo do quiz, a equipe responsável deve inserir as perguntas por um procedimento administrativo privado, sem expor um formulário de cadastro aos participantes.

## Tecnologias

- Node.js
- Express
- Express Handlebars
- Sequelize
- SQLite
- HTML, CSS e JavaScript

## Executar localmente

### Requisitos

- [Node.js](https://nodejs.org/) instalado.
- Git (opcional, para clonar o repositório).

### Instalação

Clone o repositório e entre na pasta:

```bash
git clone https://github.com/mathzsw/politica-sem-silencio.git
cd politica-sem-silencio
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm start
```

Abra [http://localhost:3001](http://localhost:3001) no navegador.

Para desenvolvimento com reinicialização automática:

```bash
npm run dev
```

## Como jogar

1. Abra a página inicial e selecione **Criar partida**.
2. Compartilhe o código da sala com os participantes.
3. Os participantes acessam **Entrar na partida**, informam o código e escolhem seus nomes.
4. Quando todos estiverem na sala de espera, quem criou a partida pode iniciar o quiz.
5. Os jogadores respondem às perguntas e acompanham o ranking.
6. Ao final, confira a classificação da partida.

## Estrutura do projeto

```text
politica-sem-silencio/
├── database/
│   └── database.js
├── src/
│   ├── models/
│   ├── public/
│   ├── routes/
│   ├── views/
│   └── app.js
├── package.json
└── README.md
```

## Publicação na internet

O projeto utiliza Express e precisa de um serviço que execute Node.js; o GitHub Pages sozinho não executa o servidor.

Para publicar, conecte este repositório a um serviço de hospedagem compatível com Node.js, configure o comando de instalação como `npm install` e o comando de inicialização como `npm start`. O servidor usa a variável de ambiente `PORT` quando fornecida pela hospedagem.

**Atenção ao banco de dados:** a versão atual usa SQLite em arquivo. Em hospedagens com sistema de arquivos temporário, as perguntas, salas e pontuações podem ser perdidas quando o serviço reiniciar ou for publicado novamente. Para uso público contínuo, configure armazenamento persistente ou migre para um banco de dados hospedado.

## Contexto e equipe

**Trabalho:** Casos reais de violência política de gênero no ambiente digital, considerando o viés de raça.

**Instituição:** Instituto Federal de Educação, Ciência e Tecnologia de Pernambuco (IFPE) — Campus Jaboatão dos Guararapes.

**Disciplina:** História  
**Docente:** Jandynea

**Discentes:**

1. Ádrian Vinícius Oliveira de Almeida
2. Allycia da Silva Gomes Ribeiro
3. Ana Heloíza dos Santos e Souza
4. Edklause Diniz de Oliveira Filho
5. Maria Helena Medeiros Madruga
6. Matheus Augusto Rodrigues de Alencar
7. Melyssa Valéria Souza Almeida
8. Nicolas Alcantara da Silva
9. Thais Myller Felix da Silva
