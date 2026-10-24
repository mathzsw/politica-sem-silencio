const express = require('express');
const { engine } = require('express-handlebars');
const sequelize = require('../database/database');

const perguntasRoutes = require('./routes/perguntas');
const jogadoresRoutes = require('./routes/jogadores');
const partidasRoutes = require('./routes/partidas');

require('./models');

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

app.get('/entrar', (req, res) => {
    res.render('entrar', { layout: false });
});

app.get('/admin', (req, res) => {
    return res.status(404).send('Página não encontrada.');
});

app.get('/', (req, res) => {
    res.render('home', { layout: false });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await sequelize.authenticate();

        console.log('Banco de dados conectado.');

        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Política sem Silêncio rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao conectar ao banco:', error);
    }
}

startServer();
