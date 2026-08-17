# Trabalho 01 - Sistema Distribuido
### CONCEITO DE SD COM SUPABASE
## Objetivo
Implementar um sistema distribuído de gerenciamento de tarefas, com cliente e
servidor separados, utilizando uma aplicação web simples.
O sistema permitirá que usuários autenticados criem e gerenciem suas próprias tarefas,
enquanto o frontend se comunica com uma API REST desenvolvida separadamente no
backend.

## Tecnologias Utilizadas

- #### Front-end - React 
- #### Back-end - FastAPI

- #### Infraestrutura - Docker

## Como Executar
### Pré-requisitos

- Docker instalado na máquina

Para executar o projeto no Docker, acesse a pasta raiz do projeto e execute o comando abaixo:

```bash
docker compose up --build -d
```
- Acesse o front-end no navegador: http://localhost:80
- A API estará disponível em: http://localhost:5000

Para remover os containers em execução:

```bash
docker compose down
```