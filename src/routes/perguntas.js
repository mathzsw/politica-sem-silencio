const express = require('express');
const { Pergunta } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const perguntas = await Pergunta.findAll();
        res.json(perguntas);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar perguntas.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const pergunta = await Pergunta.create(req.body);
        res.status(201).json(pergunta);
    } catch (error) {
        res.status(400).json({ erro: 'Erro ao cadastrar pergunta.' });
    }
});

module.exports = router;
