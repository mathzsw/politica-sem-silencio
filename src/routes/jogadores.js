const express = require('express');
const { Partida, Jogador } = require('../models');

const router = express.Router();

router.post('/:codigo', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: { codigo: req.params.codigo }
        });

        if (!partida) {
            return res.status(404).json({
                erro: 'Partida não encontrada.'
            });
        }

        if (partida.status !== 'aguardando') {
            return res.status(400).json({
                erro: 'Essa partida já começou.'
            });
        }

        const { nome } = req.body;

        if (typeof nome !== 'string' || !nome.trim()) {
            return res.status(400).json({
                erro: 'Informe um nome válido.'
            });
        }

        const nomeNormalizado = nome.trim();

        const jogadorExistente = await Jogador.findOne({
            where: {
                nome: nomeNormalizado,
                partidaId: partida.id
            }
        });

        if (jogadorExistente) {
            return res.status(409).json({
                erro: 'Esse nome já está sendo usado nesta partida. Escolha outro.'
            });
        }

        const jogador = await Jogador.create({
            nome: nomeNormalizado,
            partidaId: partida.id
        });

        return res.status(201).json({
            mensagem: 'Você entrou na partida!',
            jogador: {
                id: jogador.id,
                nome: jogador.nome,
                pontuacao: jogador.pontuacao
            }
        });
    } catch (error) {
        console.error('Erro ao entrar na partida:', error);

        return res.status(500).json({
            erro: 'Não foi possível entrar na partida.'
        });
    }
});

module.exports = router;