const express = require('express');
const { Partida, Jogador } = require('../models');

const router = express.Router();

router.post('/:codigo', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: { codigo: req.params.codigo }
        });

        if (!partida) {
            return res.status(404).json({ erro: 'Partida não encontrada.' });
        }

        if (partida.status !== 'aguardando') {
            return res.status(400).json({ erro: 'Essa partida já começou.' });
        }

        const { nome } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({ erro: 'Informe um nome.' });
        }

        const jogador = await Jogador.create({
            nome: nome.trim(),
            partidaId: partida.id
        });

        res.status(201).json(jogador);
    } catch (error) {
        res.status(400).json({ erro: 'Erro ao entrar na partida.' });
    }
});

module.exports = router;
