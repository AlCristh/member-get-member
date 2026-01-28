# member-get-member - Backend

API backend para um programa de indicação ("Member Get Member"), onde usuários podem se cadastrar, gerar códigos de indicação e indicar novos membros.

---

## 📌 Visão Geral

Este projeto tem como objetivo implementar um sistema de **indicação de usuários**, onde:

- Cada membro possui um **código de indicação único**
- Novos membros podem se cadastrar usando o código de outro membro
- O sistema é preparado para evolução futura, como **créditos, recompensas e relatórios**

O foco do projeto é demonstrar:
- Boas práticas de arquitetura
- Organização em camadas
- Clareza nas regras de negócio
- Código limpo e extensível

---

## 🧠 Regras de Negócio (implementadas até o momento)

### ✔ Cadastro de Membro
- O sistema permite cadastrar membros com:
  - Nome
  - E-mail
  - Código de indicação (opcional)

### ✔ Validação de E-mail
- Não é permitido cadastrar dois membros com o mesmo e-mail

### ✔ Código de Indicação
- Cada membro possui um código de indicação único
- O código é gerado automaticamente no momento do cadastro
- O usuário não pode escolher manualmente seu código

### ✔ Persistência
- Os dados são armazenados em banco de dados PostgreSQL

### ⚠ Regras em evolução
As regras abaixo **ainda não estão implementadas**, mas fazem parte do roadmap do projeto:
- Validação do código de indicação informado
- Relação entre quem indicou e quem foi indicado
- Sistema de créditos ou recompensas
- Limites de indicação
- Relatórios de indicações

---

## 🏗 Arquitetura do Projeto

O projeto segue uma arquitetura em camadas:

controller → service → repository → database
            ↓
           dto / mapper

Estrutura de pacotes:

com.alejandro.membergetmember
├── api
│   ├── controller
│   └── dto
│       └── member
├── domain
│   └── entity
├── repository
├── service
│   └── impl
└── MemberGetMemberBackendApplication.java

🛠 Tecnologias Utilizadas

Java 17

Spring Boot 4

Spring Data JPA

Spring Security

PostgreSQL

Maven

Lombok

▶ Como Rodar o Projeto Localmente
Pré-requisitos:

Java 17+

Maven

PostgreSQL

1️⃣ Clone o repositório
git clone <url-do-repositorio>
cd member-get-member/backend

2️⃣ Configure o banco de dados

No arquivo application.properties:

spring.datasource.url=jdbc:postgresql://localhost:5432/member_get_member
spring.datasource.username=postgres
spring.datasource.password=postgres

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

3️⃣ Rode a aplicação
mvn spring-boot:run


A aplicação estará disponível em:

http://localhost:8080

🔐 Segurança

Atualmente o projeto utiliza Spring Security padrão, exigindo autenticação para acessar os endpoints.

⚠ Configuração temporária apenas para ambiente de desenvolvimento.

👤 Autor

Desenvolvido por Alejandro Magalhães
Projeto com fins educacionais e demonstrativos.
