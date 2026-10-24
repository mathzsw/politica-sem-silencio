# Política sem Silêncio

Quiz interativo sobre casos reais de violência política de gênero e raça no ambiente digital, desenvolvido para um trabalho de História do IFPE — Campus Jaboatão dos Guararapes.

A proposta é transformar o conteúdo pesquisado em uma atividade participativa: os jogadores entram em uma sala com código, respondem às perguntas e acompanham a pontuação e o ranking.

## Funcionalidades

- Criação de salas com código de acesso.
- Entrada de participantes pelo código da sala.
- Sala de espera com lista de jogadores.
- Controle do quiz pelo apresentador.
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
4. Quando todos estiverem na sala de espera, o apresentador inicia o quiz.
5. Os jogadores respondem às perguntas e acompanham o ranking.
6. Ao final, confira a classificação da partida.

## Cadastrar perguntas

Acesse [http://localhost:3001/admin](http://localhost:3001/admin) durante a execução local para cadastrar perguntas, alternativas e a resposta correta.

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

## Contexto do projeto

Trabalho de História sobre casos reais de violência política de gênero no ambiente digital, considerando também o viés de raça.

---

Desenvolvido por Matheus Augusto e equipe.
