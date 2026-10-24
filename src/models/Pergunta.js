const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const Pergunta = sequelize.define('Pergunta', {
    enunciado: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    alternativaA: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alternativaB: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alternativaC: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alternativaD: {
        type: DataTypes.STRING,
        allowNull: false
    },
    respostaCorreta: {
        type: DataTypes.ENUM('A', 'B', 'C', 'D'),
        allowNull: false
    }
});

module.exports = Pergunta;
