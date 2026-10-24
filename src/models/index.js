const Pergunta = require('./Pergunta');
const Jogador = require('./Jogador');
const Partida = require('./Partida');

Partida.hasMany(Jogador, {
    foreignKey: 'partidaId',
    onDelete: 'CASCADE'
});

Jogador.belongsTo(Partida, {
    foreignKey: 'partidaId'
});

module.exports = {
    Pergunta,
    Jogador,
    Partida
};
