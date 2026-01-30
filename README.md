📌 Member Get Member

Sistema completo de indicação de usuários (Member Get Member), onde cada usuário pode convidar outras pessoas, acompanhar o status das indicações e receber créditos quando uma indicação se converte em cadastro.

O projeto foi desenvolvido como case técnico, com foco em clareza de regras de negócio, organização de código e funcionamento ponta a ponta.

🚀 Funcionalidades
Autenticação e Usuários

Cadastro de usuários com nome, e-mail e senha

Login com autenticação via JWT

Cada usuário recebe automaticamente:

um código de indicação único

um link de indicação

Indicações

Cadastro de novos usuários via:

código de indicação

link de indicação

Convite de pessoas por e-mail

Controle de status da indicação:

CONVIDADO → convite enviado, ainda não cadastrado

CADASTRADO → convite convertido em cadastro

Reenvio de convites para contatos ainda não cadastrados

Controle de:

data do convite

data do cadastro

quantidade de reenvios

data do último reenvio

Créditos

Crédito automático para o usuário que indicou

Cada conversão gera apenas um crédito

O sistema impede crédito duplicado para o mesmo indicado

Dashboard

Exibe:

código de indicação

link de indicação

saldo de créditos

Tela de gestão de indicações com ações de reenvio

🧠 Regras de Negócio

❌ Autoindicação não é permitida

Um usuário não pode se indicar nem via código, nem via convite por e-mail

❌ Crédito duplicado não é permitido

Cada indicação pode gerar crédito apenas uma vez

✅ Código de indicação é único

✅ Indicações podem existir antes do cadastro

Convites por e-mail criam uma indicação CONVIDADO

Quando o usuário se cadastra com o mesmo e-mail, a indicação é convertida para CADASTRADO

✅ O sistema registra todas as datas importantes

convite

cadastro

crédito

reenvios

🏗️ Arquitetura e Decisões Técnicas
Modelagem de Indicação (Referral)

A entidade Referral foi modelada para suportar dois fluxos:

Convite por e-mail (antes do cadastro)

Cadastro direto via código de indicação

Por isso:

referred pode ser null (convite antes do cadastro)

invitedEmail é usado para associar o convite ao cadastro futuro

Campos como creditedAt garantem idempotência (sem crédito duplicado)

Conversão de Convite

Quando um usuário se cadastra:

Se existir um convite CONVIDADO para aquele e-mail:

o convite é convertido para CADASTRADO

o crédito é aplicado

Caso contrário:

é criado um Referral direto como CADASTRADO

🛠️ Tecnologias Utilizadas
Back-end

Java 17

Spring Boot

Spring Security (JWT)

Spring Data JPA

PostgreSQL

Hibernate

Front-end

React

React Router

Fetch API

Vite

▶️ Como Rodar o Projeto
Pré-requisitos

Java 17+

Node.js 18+

PostgreSQL

Banco de Dados

Crie o banco no PostgreSQL:

CREATE DATABASE membergetmember;

## Execução do backend

O backend utiliza variáveis de ambiente(locais) para dados sensíveis.

abra o Windows / PowerShell na pasta do projeto :

digite:
cd backend
$env:DB_USER="postgres"
$env:DB_PASSWORD="sua senha aqui"
$env:JWT_SECRET="member-get-member-jwt-secret-2026"

.\mvnw spring-boot:run ENTER


A API ficará disponível em:

http://localhost:8080

Front-end

Na pasta frontend:

npm install
npm run dev


A aplicação ficará disponível em:

http://localhost:5173

🔐 Autenticação

A autenticação é feita via JWT

O token é retornado no login e armazenado no front

Todas as rotas protegidas exigem o header:

Authorization: Bearer <token>

📡 Endpoints Principais
Autenticação

POST /api/auth/register

POST /api/auth/login

Indicações

POST /api/referrals/invite → convite por e-mail

POST /api/referrals/{id}/resend → reenvio de convite

GET /api/referrals/my → indicações do usuário logado

📈 Possíveis Melhorias Futuras

Envio real de e-mails (SMTP ou serviço externo)

Limite de reenvios por convite

Histórico de ações por indicação

Paginação e filtros na listagem de indicações

Papéis de usuário (ex: ADMIN)

Expiração de convites antigos

Testes automatizados (unitários e integração)

📌 Considerações Finais

Este projeto foi desenvolvido com foco em:

clareza de regras de negócio

organização e legibilidade do código

funcionamento completo ponta a ponta

modelagem flexível para evolução futura
