const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const Jogador = sequelize.define('Jogador', {
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pontuacao: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    // Token secreto usado para proteger as respostas individuais de cada participante.
    chaveAcesso: {
        type: DataTypes.STRING(64),
        allowNull: true
    }
});

module.exports = Jogador;
