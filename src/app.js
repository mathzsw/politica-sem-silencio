const express = require('express');
const { engine } = require('express-handlebars');
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database');

const perguntasRoutes = require('./routes/perguntas');
const jogadoresRoutes = require('./routes/jogadores');
const partidasRoutes = require('./routes/partidas');
const adminRoutes = require('./routes/admin');

const { Pergunta, Jogador } = require('./models');

const app = express();

app.engine('hbs', engine({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');
app.set('views', './src/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('src/public'));

app.use('/perguntas', perguntasRoutes);
app.use('/jogadores', jogadoresRoutes);
app.use('/partidas', partidasRoutes);
app.use('/admin', adminRoutes);

app.get('/entrar', (req, res) => {
    res.render('entrar', { layout: false });
});

app.get('/', (req, res) => {
    res.render('home', { layout: false });
});

const PORT = process.env.PORT || 3001;

async function garantirColunaChaveAcesso() {
    const queryInterface = sequelize.getQueryInterface();
    const tabelaJogadores = Jogador.getTableName();
    const colunas = await queryInterface.describeTable(tabelaJogadores);

    // Adiciona a coluna sem apagar os jogadores já cadastrados no banco.
    if (!colunas.chaveAcesso) {
        await queryInterface.addColumn(tabelaJogadores, 'chaveAcesso', {
            type: DataTypes.STRING(64),
            allowNull: true
        });
        console.log('Coluna de acesso privado dos participantes adicionada.');
    }
}

async function carregarPerguntasIniciais() {
    const perguntasIniciais = require('./perguntas-iniciais');
    let cadastradas = 0;

    for (const pergunta of perguntasIniciais) {
        const existente = await Pergunta.findOne({
            where: { enunciado: pergunta.enunciado }
        });

        if (!existente) {
            await Pergunta.create(pergunta);
            cadastradas++;
        }
    }

    if (cadastradas > 0) {
        console.log(`${cadastradas} perguntas iniciais adicionadas ao quiz.`);
    }
}

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log('Banco de dados conectado.');

        await sequelize.sync();

        await garantirColunaChaveAcesso();
        await carregarPerguntasIniciais();

        app.listen(PORT, () => {
            console.log(`Política sem Silêncio rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao conectar ao banco:', error);
    }
}

startServer();
