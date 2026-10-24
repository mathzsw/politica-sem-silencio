const { DataTypes } = require('sequelize');
const sequelize = require('../../database/database');

const Resposta = sequelize.define('Resposta', {
    alternativaEscolhida: {
        type: DataTypes.ENUM('A', 'B', 'C', 'D'),
        allowNull: false
    },
    correta: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['partidaId', 'jogadorId', 'perguntaId']
        }
    ]
});

module.exports = Resposta;