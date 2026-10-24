const express = require('express');
const { Partida, Jogador } = require('../models');

const router = express.Router();

function gerarCodigo() {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codigo = '';

    for (let i = 0; i < 6; i++) {
        codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
    }

    return codigo;
}

router.post('/', async (req, res) => {
    try {
        let codigo = gerarCodigo();

        while (await Partida.findOne({ where: { codigo } })) {
            codigo = gerarCodigo();
        }

        const partida = await Partida.create({ codigo });

        res.status(201).json(partida);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao criar partida.' });
    }
});

router.get('/:codigo', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: { codigo: req.params.codigo },
            include: Jogador
        });

        if (!partida) {
            return res.status(404).json({ erro: 'Partida não encontrada.' });
        }

        res.json(partida);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar partida.' });
    }
});

module.exports = router;
