Member Get Member – Backend API

API REST desenvolvida em Java 17 + Spring Boot para gerenciar um programa de indicação (Member Get Member), onde usuários podem se cadastrar, indicar outros usuários e acumular créditos com base nas indicações.

Este projeto foi desenvolvido como case técnico Fullstack, com foco inicial no backend, seguindo boas práticas de arquitetura, validação, segurança e organização de código.

🚀 Tecnologias Utilizadas

Java 17

Spring Boot 4

Spring Web

Spring Data JPA

Spring Security (API stateless)

PostgreSQL

Hibernate

Lombok

Maven

📐 Arquitetura

O projeto segue uma arquitetura em camadas:

api
 ├── controller
 ├── dto
 └── mapper
domain
 ├── entity
 └── enums
repository
service
 ├── interface
 └── impl
config

Camadas:

Controller: expõe os endpoints REST

Service: regras de negócio

Repository: acesso a dados via JPA

DTOs: objetos de entrada e saída

Mapper: conversão entre entidade ↔ DTO

🔐 Segurança

API configurada como STATELESS

CSRF desabilitado (API REST)

Form login e HTTP Basic desativados

Endpoints liberados explicitamente via SecurityConfig

Preparada para futura autenticação via JWT no frontend

⚠️ Este backend não serve páginas HTML.
Toda interação é feita via endpoints REST (Postman/Thunder/Frontend).

❤️ Health Check

Verificação simples de status da API:

GET /health


Resposta:

OK!!

🧩 Entidades Principais
Member

Representa um usuário do sistema.

Campos principais:

id

name

email

referralCode (gerado automaticamente)

referredByCode

credits

createdAt

Referral

Representa uma indicação entre membros.

Campos principais:

id

referrer

referred

status (ENUM)

createdAt

Status possíveis:

CADASTRADO

(pronto para evolução futura)

📌 Regras de Negócio Implementadas

✅ Não permite cadastro de membros com e-mail duplicado

✅ Código de indicação é gerado automaticamente

✅ Um membro não pode se autoindicar

✅ Um membro só pode ser indicado uma única vez

✅ Valida código de indicação inexistente

✅ Retorno de erros padronizado em JSON

✅ Ranking de membros por créditos

✅ Ordenação estável no ranking

🔗 Endpoints Disponíveis
Members
Criar membro
POST /api/members


Body (JSON):

{
  "name": "João Silva",
  "email": "joao@email.com",
  "referredByCode": "ABC12345"
}

Listar membros
GET /api/members

Ranking de membros
GET /api/members/ranking


Ordenado por:

credits (DESC)

createdAt (ASC)

Referrals
Criar indicação
POST /api/referrals


Body (JSON):

{
  "referralCode": "ABC12345",
  "referredMemberId": 2
}

Listar indicações
GET /api/referrals

⚠️ Tratamento de Erros

Erros retornam sempre em formato JSON, com status HTTP adequado.

Exemplo:

{
  "message": "E-mail já cadastrado"
}

🗄️ Banco de Dados

PostgreSQL

Configuração via application.properties

Hibernate gerencia criação das tabelas automaticamente

Exemplo:

spring.datasource.url=jdbc:postgresql://localhost:5432/membergetmember
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update

▶️ Como Executar o Projeto
Pré-requisitos:

Java 17

Maven

PostgreSQL rodando

Passos:
git clone https://github.com/AlCristh/member-get-member.git
cd member-get-member/backend
mvn spring-boot:run


API disponível em:

http://localhost:8080

🧪 Testes

Os endpoints podem ser testados via:

Thunder Client

Postman

Insomnia

🧭 Próximos Passos (Planejado)

🔜 Frontend em React

🔜 Integração via Axios

🔜 Autenticação com JWT

🔜 UI para ranking e indicações

🔜 Validações adicionais no frontend

👤 Autor

Desenvolvido por Alejandro Magalhães
Projeto criado como case técnico Fullstack Júnior