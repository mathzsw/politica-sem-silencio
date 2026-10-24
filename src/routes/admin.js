const express = require('express');
const crypto = require('crypto');
const { Pergunta } = require('../models');

const router = express.Router();
const nomeCookie = 'admin_auth';
const segredoSessao = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');

function gerarAssinatura(expira) {
    return crypto.createHmac('sha256', segredoSessao).update(String(expira)).digest('hex');
}

function estaAutenticado(req) {
    const cookie = (req.headers.cookie || '')
        .split('; ')
        .find(parte => parte.startsWith(nomeCookie + '='));

    if (!cookie) return false;

    const valor = decodeURIComponent(cookie.slice(nomeCookie.length + 1));
    const [expira, assinatura] = valor.split('.');

    if (!expira || !assinatura || Number(expira) <= Date.now()) return false;

    const esperada = gerarAssinatura(expira);
    const assinaturaBuffer = Buffer.from(assinatura);
    const esperadaBuffer = Buffer.from(esperada);

    return assinaturaBuffer.length === esperadaBuffer.length &&
        crypto.timingSafeEqual(assinaturaBuffer, esperadaBuffer);
}

function exigirAutenticacao(req, res, next) {
    if (!estaAutenticado(req)) {
        return res.redirect('/admin');
    }

    next();
}

router.get('/', (req, res) => {
    if (!process.env.ADMIN_PASSWORD) {
        return res.status(503).send('A senha administrativa não foi configurada no servidor.');
    }

    if (estaAutenticado(req)) {
        return res.render('admin', { layout: false });
    }

    return res.render('admin-login', { layout: false, erro: null });
});

router.post('/login', (req, res) => {
    const senhaConfigurada = process.env.ADMIN_PASSWORD;
    const senhaEnviada = String(req.body.senha || '');

    if (!senhaConfigurada) {
        return res.status(503).send('A senha administrativa não foi configurada no servidor.');
    }

    const enviada = Buffer.from(senhaEnviada);
    const configurada = Buffer.from(senhaConfigurada);
    const senhaCorreta = enviada.length === configurada.length &&
        crypto.timingSafeEqual(enviada, configurada);

    if (!senhaCorreta) {
        return res.status(401).render('admin-login', {
            layout: false,
            erro: 'Senha incorreta.'
        });
    }

    const expira = Date.now() + 4 * 60 * 60 * 1000;
    const assinatura = gerarAssinatura(expira);

    res.cookie(nomeCookie, `${expira}.${assinatura}`, {
        httpOnly: true,
        sameSite: 'strict',
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        maxAge: 4 * 60 * 60 * 1000,
        path: '/admin'
    });

    return res.redirect('/admin');
});

router.post('/perguntas', exigirAutenticacao, async (req, res) => {
    const {
        enunciado,
        alternativaA,
        alternativaB,
        alternativaC,
        alternativaD,
        respostaCorreta
    } = req.body;

    if (
        !enunciado?.trim() ||
        !alternativaA?.trim() ||
        !alternativaB?.trim() ||
        !alternativaC?.trim() ||
        !alternativaD?.trim() ||
        !['A', 'B', 'C', 'D'].includes(respostaCorreta)
    ) {
        return res.status(400).render('admin', {
            layout: false,
            erro: 'Preencha a pergunta, as quatro alternativas e a resposta correta.'
        });
    }

    try {
        await Pergunta.create({
            enunciado: enunciado.trim(),
            alternativaA: alternativaA.trim(),
            alternativaB: alternativaB.trim(),
            alternativaC: alternativaC.trim(),
            alternativaD: alternativaD.trim(),
            respostaCorreta
        });

        return res.render('admin', {
            layout: false,
            sucesso: 'Pergunta cadastrada com sucesso.'
        });
    } catch (error) {
        console.error('Erro ao cadastrar pergunta:', error);
        return res.status(500).render('admin', {
            layout: false,
            erro: 'Não foi possível cadastrar a pergunta.'
        });
    }
});

router.post('/sair', (req, res) => {
    res.clearCookie(nomeCookie, { path: '/admin', sameSite: 'strict' });
    return res.redirect('/admin');
});

module.exports = router;
