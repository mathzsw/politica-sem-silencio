const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const Partida = sequelize.define('Partida', {
    codigo: {
        type: DataTypes.STRING(6),
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('aguardando', 'em_andamento', 'finalizada'),
        allowNull: false,
        defaultValue: 'aguardando'
    },
    perguntaAtual: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
    }
});

module.exports = Partida;
