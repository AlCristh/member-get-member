## 📌 Member Get Member

Sistema completo de indicação de usuários (Member Get Member), onde cada usuário pode convidar outras pessoas, acompanhar o status das indicações e receber créditos quando uma indicação se converte em cadastro.

O projeto foi desenvolvido como case técnico, com foco em clareza de regras de negócio, organização de código e funcionamento ponta a ponta.

## 🚀 Funcionalidades
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

## 🧠 Regras de Negócio

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

## 🏗️ Arquitetura e Decisões Técnicas

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

## Diagram

![mermaid diagram](https://github.com/user-attachments/assets/58b421c6-1613-4730-a006-009938d419de)


## Visão Geral da Arquitetura

A aplicação segue uma arquitetura Full Stack desacoplada, separando claramente responsabilidades entre Frontend, Backend e Persistência, com autenticação baseada em JWT.

Frontend (React + Vite)

O frontend é responsável apenas por experiência do usuário e orquestração de chamadas:

Pages / Layouts: Login, Dashboard, Members, Referrals, Ranking

API Client centralizado:

Anexa automaticamente o JWT no header Authorization

Centraliza tratamento de erros HTTP

Session Storage:

Token JWT armazenado apenas na sessão

Evita login automático após fechar o navegador (boa prática de segurança)

📌 Nenhuma regra de negócio crítica fica no frontend.

🔐 Backend (Spring Boot)

O backend segue uma arquitetura em camadas bem definidas:

Controllers

Exposição da API REST (/auth, /members, /referrals)

Apenas valida request/response

Não contém lógica de negócio

Service Layer

Onde vivem todas as regras de negócio

Exemplos:

Prevenção de autoindicação

Crédito único por conversão

Gestão de status (CONVIDADO → CADASTRADO)

Reenvio de convites com contagem

Security

Spring Security + JWT

Filtro intercepta requisições

Extrai o e-mail do token

Injeta o usuário autenticado no contexto

Repositories

JPA Repositories

Comunicação exclusiva com o banco

Nenhuma lógica de negócio aqui

## Evolutiva

![evolutiva ](https://github.com/user-attachments/assets/65f6a735-023d-4f9d-8809-a0a2e72def49)

o sistema foi pensado para permitir evoluções futuras caso o volume de dados ou acessos cresça significativamente.

Uso de Cache para Indicações Pendentes (Redis)

Em um cenário de alta escala, as indicações por e-mail que ainda não se converteram em cadastro poderiam ser armazenadas temporariamente em um cache (Redis), utilizando TTL (Time To Live).

Fluxo proposto:

Convite enviado para um e-mail ainda não cadastrado

Indicação armazenada como “pendente” no cache

Ao realizar o cadastro:

o sistema valida a existência do convite

persiste a indicação no banco

aplica o crédito ao indicador

remove o registro do cache

Benefícios dessa abordagem:

Redução de dados não utilizados no banco

Melhor performance para consultas de convites pendentes

Expiração automática de convites não utilizados

Preparação para cenários de alto volume de convites

Essa evolução não foi implementada nesta versão por não ser necessária para o escopo do case, evitando complexidade prematura e mantendo a solução simples e robusta.

## 🛠️ Tecnologias Utilizadas
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

## ▶️ Como Rodar o Projeto
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

## Front-end

Na pasta frontend:

npm install
npm run dev


A aplicação ficará disponível em:

http://localhost:5173

## 🔐 Autenticação

A autenticação é feita via JWT

O token é retornado no login e armazenado no front

Todas as rotas protegidas exigem o header:

Authorization: Bearer <token>

## 📡 Endpoints Principais
Autenticação

POST /api/auth/register

POST /api/auth/login

Indicações

POST /api/referrals/invite → convite por e-mail

POST /api/referrals/{id}/resend → reenvio de convite

GET /api/referrals/my → indicações do usuário logado

## 📈 Possíveis Melhorias Futuras Além das já citadas

Envio real de e-mails (SMTP ou serviço externo)

Limite de reenvios por convite

Histórico de ações por indicação

Paginação e filtros na listagem de indicações

Papéis de usuário (ex: ADMIN)

Expiração de convites antigos

Testes automatizados (unitários e integração)

## 📌 Considerações Finais

Este projeto foi desenvolvido com foco em:

clareza de regras de negócio

organização e legibilidade do código

funcionamento completo ponta a ponta

modelagem flexível para evolução futura
