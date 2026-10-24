const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const ControlePartida = sequelize.define('ControlePartida', {
    chaveHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    }
});

module.exports = ControlePartida;