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
    }
});

module.exports = Jogador;
