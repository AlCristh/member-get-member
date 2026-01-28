Member Get Member API 🚀

API REST desenvolvida em Java + Spring Boot para gerenciar um programa de indicação (member get member), onde usuários podem indicar outros usuários através de um código único e regras claras de negócio.

Este projeto foi desenvolvido com foco em boas práticas, arquitetura limpa e clareza de regras, simulando um cenário real de mercado.

🧠 Visão Geral do Negócio

Usuários (Member) podem se cadastrar na plataforma

Cada usuário recebe um código único de indicação (referralCode)

Um usuário pode indicar outro usuário

A indicação gera um vínculo persistido (Referral)

Regras de negócio garantem a integridade do processo

📜 Regras de Negócio Implementadas
Cadastro de Membro

✅ E-mail deve ser único

✅ Código de indicação é gerado automaticamente

✅ Data de criação registrada automaticamente

Indicações (Referral)

✅ Código de indicação precisa existir

✅ Auto-indicação não é permitida

✅ Um membro só pode ser indicado uma vez

✅ Regras validadas na camada de serviço

Tratamento de Erros

✅ Erros retornam HTTP 400

✅ Resposta padronizada em JSON

✅ Mensagens claras de negócio

🏗️ Arquitetura

O projeto segue uma arquitetura em camadas:

Controller → Service → Repository → Database


Separação clara de responsabilidades:

Controller: entrada/saída HTTP

Service: regras de negócio

Repository: acesso a dados

DTOs: contratos de entrada e saída

Mapper: conversão Entity ↔ DTO

Handler: tratamento global de exceções

🔐 Segurança

API configurada como stateless

formLogin e httpBasic desativados

Endpoints públicos liberados apenas para facilitar testes

Estrutura preparada para futura evolução com JWT

⚠️ A configuração atual é intencional para ambiente de desenvolvimento e avaliação técnica.

🛠️ Tecnologias Utilizadas

Java 17

Spring Boot 4

Spring Data JPA

Spring Security

PostgreSQL

Maven

Lombok

Thunder Client (testes)

📦 Endpoints Disponíveis
🔹 Criar Membro
POST /api/members


Body:

{
  "name": "João Silva",
  "email": "joao@email.com",
  "referredByCode": null
}


Resposta:

{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "referralCode": "7BFC1790",
  "createdAt": "2026-01-28T15:30:00"
}

🔹 Listar Membros
GET /api/members


Resposta:

[
  {
    "id": 1,
    "name": "Alejandro",
    "email": "alejandro@email.com",
    "referralCode": "7BFC1790"
  }
]

🔹 Criar Indicação (Referral)
POST /api/referrals


Body:

{
  "referralCode": "7BFC1790",
  "referredMemberId": 3
}


Resposta:

{
  "id": 1,
  "referrerId": 1,
  "referredId": 3,
  "createdAt": "2026-01-28T16:10:00"
}

❌ Exemplo de Erro (Regra de Negócio)
Auto-indicação ou indicação duplicada

Status: 400 Bad Request

{
  "message": "Self-referral is not allowed",
  "status": 400,
  "timestamp": "2026-01-28T16:12:00"
}

🚀 Como Executar o Projeto
Pré-requisitos

Java 17+

PostgreSQL

Maven

Configuração do banco

Criar banco no PostgreSQL:

CREATE DATABASE membergetmember;


Configurar application.properties:

spring.datasource.url=jdbc:postgresql://localhost:5432/membergetmember
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update

Executar
mvn spring-boot:run


A aplicação sobe em:

http://localhost:8080

📈 Próximas Evoluções Planejadas

Autenticação com JWT

Créditos por indicação

Listagem de referrals

Testes unitários

Paginação e filtros

👤 Autor

Alejandro Magalhães
Projeto desenvolvido como case técnico e portfólio profissional.