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

router.post('/', async (req, res) => {
    try {
        const {
            enunciado,
            alternativaA,
            alternativaB,
            alternativaC,
            alternativaD,
            respostaCorreta
        } = req.body;

        if (
            typeof enunciado !== 'string' ||
            typeof alternativaA !== 'string' ||
            typeof alternativaB !== 'string' ||
            typeof alternativaC !== 'string' ||
            typeof alternativaD !== 'string' ||
            !enunciado.trim() ||
            !alternativaA.trim() ||
            !alternativaB.trim() ||
            !alternativaC.trim() ||
            !alternativaD.trim() ||
            !['A', 'B', 'C', 'D'].includes(respostaCorreta)
        ) {
            return res.status(400).json({
                erro: 'Preencha todos os campos e informe uma resposta correta válida.'
            });
        }

        const pergunta = await Pergunta.create({
            enunciado: enunciado.trim(),
            alternativaA: alternativaA.trim(),
            alternativaB: alternativaB.trim(),
            alternativaC: alternativaC.trim(),
            alternativaD: alternativaD.trim(),
            respostaCorreta
        });

        return res.status(201).json({
            mensagem: 'Pergunta cadastrada com sucesso!',
            id: pergunta.id
        });
    } catch (error) {
        console.error('Erro ao cadastrar pergunta:', error);
        return res.status(400).json({
            erro: 'Erro ao cadastrar pergunta.'
        });
    }
});

module.exports = router;