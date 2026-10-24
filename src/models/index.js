const Pergunta = require('./Pergunta');
const Jogador = require('./Jogador');
const Partida = require('./Partida');
const Resposta = require('./Resposta');
const ControlePartida = require('./ControlePartida');

Partida.hasMany(Jogador, {
    foreignKey: 'partidaId',
    onDelete: 'CASCADE'
});

Jogador.belongsTo(Partida, {
    foreignKey: 'partidaId'
});

Partida.hasMany(Resposta, {
    foreignKey: 'partidaId',
    onDelete: 'CASCADE'
});

Resposta.belongsTo(Partida, {
    foreignKey: 'partidaId'
});

Jogador.hasMany(Resposta, {
    foreignKey: 'jogadorId',
    onDelete: 'CASCADE'
});

Resposta.belongsTo(Jogador, {
    foreignKey: 'jogadorId'
});

Pergunta.hasMany(Resposta, {
    foreignKey: 'perguntaId'
});

Resposta.belongsTo(Pergunta, {
    foreignKey: 'perguntaId'
});

Partida.hasOne(ControlePartida, {
    foreignKey: 'partidaId',
    onDelete: 'CASCADE'
});

ControlePartida.belongsTo(Partida, {
    foreignKey: 'partidaId'
});

module.exports = {
    Pergunta,
    Jogador,
    Partida,
    Resposta,
    ControlePartida
};