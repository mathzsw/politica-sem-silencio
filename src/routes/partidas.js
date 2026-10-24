const express = require('express');
const crypto = require('crypto');

const {
    Partida,
    Jogador,
    Pergunta,
    Resposta,
    ControlePartida
} = require('../models');

const router = express.Router();
const inicioPerguntas = new Map();

function gerarCodigo() {
    const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let codigo = '';

    for (let i = 0; i < 6; i++) {
        codigo += caracteres[
            Math.floor(Math.random() * caracteres.length)
        ];
    }

    return codigo;
}

function gerarChaveApresentador() {
    return crypto.randomBytes(32).toString('hex');
}

function gerarHashChave(chave) {
    return crypto.createHash('sha256').update(chave).digest('hex');
}

async function verificarApresentador(req, partida) {
    const chaveRecebida = req.get('x-chave-apresentador');

    if (typeof chaveRecebida !== 'string' || !chaveRecebida) {
        return false;
    }

    const controle = await ControlePartida.findOne({
        where: {
            partidaId: partida.id
        }
    });

    if (!controle || !/^[a-f0-9]{64}$/i.test(controle.chaveHash)) {
        return false;
    }

    const hashRecebido = Buffer.from(
        gerarHashChave(chaveRecebida),
        'hex'
    );

    const hashArmazenado = Buffer.from(
        controle.chaveHash,
        'hex'
    );

    return crypto.timingSafeEqual(hashRecebido, hashArmazenado);
}

router.post('/', async (req, res) => {
    let transacao;

    try {
        let codigo = gerarCodigo();

        while (await Partida.findOne({ where: { codigo } })) {
            codigo = gerarCodigo();
        }

        const chaveApresentador = gerarChaveApresentador();

        transacao = await Partida.sequelize.transaction();

        const partida = await Partida.create(
            { codigo },
            { transaction: transacao }
        );

        await ControlePartida.create(
            {
                partidaId: partida.id,
                chaveHash: gerarHashChave(chaveApresentador)
            },
            { transaction: transacao }
        );

        await transacao.commit();

        return res.status(201).json({
            codigo: partida.codigo,
            chaveApresentador
        });
    } catch (error) {
        if (transacao && !transacao.finished) {
            await transacao.rollback();
        }

        console.error('Erro ao criar partida:', error);

        return res.status(500).json({
            erro: 'Erro ao criar partida.'
        });
    }
});

router.post('/:codigo/iniciar', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: {
                codigo: req.params.codigo
            }
        });

        if (!partida) {
            return res.status(404).json({
                erro: 'Partida não encontrada.'
            });
        }

        if (!(await verificarApresentador(req, partida))) {
            return res.status(403).json({
                erro: 'Somente quem criou a sala pode iniciar o quiz.'
            });
        }

        if (partida.status !== 'aguardando') {
            return res.status(400).json({
                erro: 'Essa partida já foi iniciada.'
            });
        }

        const quantidadePerguntas = await Pergunta.count();

        if (quantidadePerguntas === 0) {
            return res.status(400).json({
                erro: 'Cadastre pelo menos uma pergunta antes de iniciar.'
            });
        }

        await partida.update({
            status: 'em_andamento',
            perguntaAtual: 0
        });
        inicioPerguntas.set(partida.id, Date.now());

        return res.json({
            mensagem: 'Quiz iniciado!',
            status: partida.status
        });
    } catch (error) {
        console.error('Erro ao iniciar partida:', error);

        return res.status(500).json({
            erro: 'Erro ao iniciar a partida.'
        });
    }
});

router.get('/:codigo/jogadores', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: {
                codigo: req.params.codigo
            }
        });

        if (!partida) {
            return res.status(404).json({
                erro: 'Partida não encontrada.'
            });
        }

        const jogadores = await Jogador.findAll({
            where: {
                partidaId: partida.id
            },
            attributes: ['id', 'nome', 'pontuacao'],
            order: [['createdAt', 'ASC']]
        });

        return res.json({
            codigo: partida.codigo,
            status: partida.status,
            perguntaAtual: partida.perguntaAtual,
            totalJogadores: jogadores.length,
            jogadores
        });
    } catch (error) {
        console.error('Erro ao buscar jogadores:', error);

        return res.status(500).json({
            erro: 'Erro ao buscar jogadores.'
        });
    }
});

router.get('/:codigo/pergunta', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: {
                codigo: req.params.codigo
            }
        });

        if (!partida) {
            return res.status(404).json({
                erro: 'Partida não encontrada.'
            });
        }

        const perguntas = await Pergunta.findAll({
            order: [['id', 'ASC']]
        });

        if (partida.status === 'finalizada') {
            const ranking = await Jogador.findAll({
                where: {
                    partidaId: partida.id
                },
                attributes: ['id', 'nome', 'pontuacao'],
                order: [
                    ['pontuacao', 'DESC'],
                    ['createdAt', 'ASC']
                ]
            });

            return res.json({
                status: partida.status,
                totalPerguntas: perguntas.length,
                ranking
            });
        }

        if (partida.status !== 'em_andamento') {
            return res.json({
                status: partida.status,
                pergunta: null,
                totalPerguntas: perguntas.length
            });
        }

        const indice = partida.perguntaAtual ?? 0;
        const pergunta = perguntas[indice];
        if (pergunta && !inicioPerguntas.has(partida.id)) {
            inicioPerguntas.set(partida.id, Date.now());
        }

        if (!pergunta) {
            await partida.update({
                status: 'finalizada'
            });

            const ranking = await Jogador.findAll({
                where: {
                    partidaId: partida.id
                },
                attributes: ['id', 'nome', 'pontuacao'],
                order: [
                    ['pontuacao', 'DESC'],
                    ['createdAt', 'ASC']
                ]
            });

            return res.json({
                status: 'finalizada',
                totalPerguntas: perguntas.length,
                ranking
            });
        }

        return res.json({
            status: partida.status,
            numeroPergunta: indice + 1,
            totalPerguntas: perguntas.length,
            pergunta: {
                id: pergunta.id,
                enunciado: pergunta.enunciado,
                alternativaA: pergunta.alternativaA,
                alternativaB: pergunta.alternativaB,
                alternativaC: pergunta.alternativaC,
                alternativaD: pergunta.alternativaD
            }
        });
    } catch (error) {
        console.error('Erro ao buscar pergunta:', error);

        return res.status(500).json({
            erro: 'Erro ao buscar pergunta.'
        });
    }
});

router.post('/:codigo/responder', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: {
                codigo: req.params.codigo
            }
        });

        if (!partida) {
            return res.status(404).json({
                erro: 'Partida não encontrada.'
            });
        }

        if (partida.status !== 'em_andamento') {
            return res.status(400).json({
                erro: 'A partida não está em andamento.'
            });
        }

        const { jogadorId, perguntaId, alternativa } = req.body;

        if (
            !Number.isInteger(Number(jogadorId)) ||
            !Number.isInteger(Number(perguntaId)) ||
            !['A', 'B', 'C', 'D'].includes(alternativa)
        ) {
            return res.status(400).json({
                erro: 'Selecione seu nome e uma alternativa válida.'
            });
        }

        const jogador = await Jogador.findOne({
            where: {
                id: Number(jogadorId),
                partidaId: partida.id
            }
        });

        if (!jogador) {
            return res.status(404).json({
                erro: 'Jogador não encontrado nesta partida.'
            });
        }

        const perguntas = await Pergunta.findAll({
            order: [['id', 'ASC']]
        });

        const pergunta = perguntas[partida.perguntaAtual ?? 0];

        if (!pergunta || pergunta.id !== Number(perguntaId)) {
            return res.status(409).json({
                erro: 'A pergunta mudou. Atualize a tela antes de responder.'
            });
        }

        const respostaExistente = await Resposta.findOne({
            where: {
                partidaId: partida.id,
                jogadorId: jogador.id,
                perguntaId: pergunta.id
            }
        });

        if (respostaExistente) {
            return res.status(409).json({
                erro: 'Você já respondeu a esta pergunta.'
            });
        }

        const correta = alternativa === pergunta.respostaCorreta;
        const inicio = inicioPerguntas.get(partida.id) ?? Date.now();
        const tempoResposta = Math.max(0, (Date.now() - inicio) / 1000);
        const bonusRapidez = correta
            ? (tempoResposta <= 5 ? 3 : tempoResposta <= 10 ? 2 : tempoResposta <= 20 ? 1 : 0)
            : 0;
        const pontosGanhos = correta ? 1 + bonusRapidez : 0;

        await Resposta.create({
            partidaId: partida.id,
            jogadorId: jogador.id,
            perguntaId: pergunta.id,
            alternativaEscolhida: alternativa,
            correta
        });

        if (pontosGanhos > 0) {
            await jogador.increment('pontuacao', { by: pontosGanhos });
            await jogador.reload();
        }

        return res.json({
            correta,
            mensagem: correta
                ? `Resposta correta! +${pontosGanhos} ${pontosGanhos === 1 ? 'ponto' : 'pontos'}${bonusRapidez ? ` (inclui ${bonusRapidez} de bônus por rapidez)` : ''}`
                : 'Resposta incorreta. Você não ganhou pontos.',
            respostaCorreta: pergunta.respostaCorreta,
            pontosGanhos,
            bonusRapidez,
            tempoResposta: Number(tempoResposta.toFixed(1)),
            pontuacao: jogador.pontuacao
        });
    } catch (error) {
        console.error('Erro ao registrar resposta:', error);

        return res.status(500).json({
            erro: 'Erro ao registrar resposta.'
        });
    }
});

router.post('/:codigo/proxima', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: {
                codigo: req.params.codigo
            }
        });

        if (!partida) {
            return res.status(404).json({
                erro: 'Partida não encontrada.'
            });
        }

        if (!(await verificarApresentador(req, partida))) {
            return res.status(403).json({
                erro: 'Somente quem criou a sala pode avançar as perguntas.'
            });
        }

        if (partida.status !== 'em_andamento') {
            return res.status(400).json({
                erro: 'Não há uma partida em andamento.'
            });
        }

        const totalPerguntas = await Pergunta.count();
        const proximoIndice = (partida.perguntaAtual ?? 0) + 1;

        if (proximoIndice >= totalPerguntas) {
            await partida.update({
                status: 'finalizada'
            });
            inicioPerguntas.delete(partida.id);

            return res.json({
                status: 'finalizada',
                mensagem: 'Quiz finalizado!'
            });
        }

        await partida.update({
            perguntaAtual: proximoIndice
        });
        inicioPerguntas.set(partida.id, Date.now());

        return res.json({
            status: partida.status,
            perguntaAtual: partida.perguntaAtual
        });
    } catch (error) {
        console.error('Erro ao avançar pergunta:', error);

        return res.status(500).json({
            erro: 'Erro ao avançar para a próxima pergunta.'
        });
    }
});

router.get('/:codigo/quiz', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: { codigo: req.params.codigo }
        });

        if (!partida) {
            return res.status(404).send('Partida não encontrada.');
        }

        if (partida.status === 'aguardando') {
            return res.redirect(`/partidas/${encodeURIComponent(partida.codigo)}`);
        }

        return res.render('quiz', {
            layout: false,
            codigo: partida.codigo
        });
    } catch (error) {
        console.error('Erro ao carregar o quiz:', error);
        return res.status(500).send('Erro ao carregar o quiz.');
    }
});

router.get('/:codigo', async (req, res) => {
    try {
        const partida = await Partida.findOne({
            where: {
                codigo: req.params.codigo
            }
        });

        if (!partida) {
            return res.status(404).send('Partida não encontrada.');
        }

        const jogadores = await Jogador.findAll({
            where: {
                partidaId: partida.id
            },
            attributes: ['id', 'nome', 'pontuacao'],
            order: [['createdAt', 'ASC']]
        });

        return res.render('partida', {
            layout: false,
            partida: partida.toJSON(),
            jogadores: jogadores.map(jogador => jogador.toJSON())
        });
    } catch (error) {
        console.error('Erro ao carregar partida:', error);

        return res.status(500).send('Erro ao carregar partida.');
    }
});

module.exports = router;