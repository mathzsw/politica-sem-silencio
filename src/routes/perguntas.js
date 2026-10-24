const express = require('express');
const { Pergunta } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const perguntas = await Pergunta.findAll({
            attributes: [
                'id',
                'enunciado',
                'alternativaA',
                'alternativaB',
                'alternativaC',
                'alternativaD'
            ],
            order: [['id', 'ASC']]
        });

        return res.json(perguntas);
    } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        return res.status(500).json({
            erro: 'Erro ao buscar perguntas.'
        });
    }
});

router.post('/', (req, res) => {
    return res.status(403).json({
        erro: 'O cadastro de perguntas está desativado.'
    });
});

module.exports = router;
