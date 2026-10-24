# Configuração do painel administrativo

A rota `/admin` exige autenticação e permite cadastrar perguntas. A senha não fica gravada no código do repositório: configure-a como variável de ambiente no servidor.

## Windows PowerShell

Na pasta do projeto, execute:

```powershell
$env:ADMIN_PASSWORD="ifpecjbg"
npm start
```

Depois, abra `http://localhost:3001/admin` e informe a senha.

## Hospedagem

Nas configurações de variáveis de ambiente do serviço que hospeda o projeto, crie:

- Nome: `ADMIN_PASSWORD`
- Valor: a senha administrativa definida pela equipe (para este projeto: `ifpecjbg`)

Opcionalmente, configure também `ADMIN_SESSION_SECRET` com uma sequência aleatória longa para manter a assinatura das sessões estável entre reinicializações.

A sessão administrativa expira após quatro horas. O cadastro público por `POST /perguntas` continua bloqueado; o formulário autenticado está em `/admin`.
