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

## Suíte de Testes Automatizados (Pytest)
### Como Instalar as Dependências de Teste
- Acessar o diretório server/
```bash
cd server
```
- Ative o ambiente virtual 
- Instale as dependências
```bash
pip install -r requirements.txt
```
### Como Executar os Testes
- Execução Local (na pasta server ou raiz com venv ativa)
```bash
pytest -v
```
### Execução via Docker:
```bash
docker compose exec server pytest -v
```
### Quantidade de Testes Implementados
- Total: 12 testes automatizados
   - test_auth.py: 5 testes
   - test_tasks.py: 7 testes

### Descrição do que Cada Grupo de Testes Valida   

- #### Autenticação e Registo (server/tests/test_auth.py - 5 testes)
    - test_cadastrar_sucesso: Valida o registo de um novo utilizador com dados válidos (POST /cadastrar).

    - test_cadastrar_falha: Valida o tratamento de exceções e retorno HTTP 400 em caso de erro no registo (ex.: e-mail já registado).

    - test_login_sucesso: Valida o processo de login com credenciais válidas e o retorno do token de acesso JWT (POST /login).

    - test_login_credenciais_invalidas: Valida a recusa de acesso com credenciais incorretas (HTTP 401).

    - test_login_campos_faltando: Valida a validação automática do schema Pydantic quando faltam campos obrigatórios (HTTP 422).

- #### Autorização e Segurança (server/tests/test_tasks.py - 2 testes)
    - test_rota_protegida_sem_token: Valida o bloqueio com código HTTP 401 ao tentar aceder a rotas privadas sem o cabeçalho Authorization.

    - test_rota_protegida_token_invalido: Valida o bloqueio com código HTTP 401 quando o token fornecido é inválido ou expirou.

- #### Operações CRUD de Tarefas (server/tests/test_tasks.py - 5 testes)
    - test_listar_tarefas_sucesso: Valida a recuperação de tarefas pertencentes exclusivamente ao utilizador autenticado (GET /read).

    - test_criar_tarefa_sucesso: Valida a inserção correta de uma nova tarefa com título, descrição, data limite, prioridade e status (POST /create).

    - test_atualizar_tarefa_sucesso: Valida a modificação dos dados de uma tarefa existente (PUT /update).

    - test_atualizar_tarefa_nao_encontrada: Valida o retorno HTTP 404 ao tentar atualizar uma tarefa inexistente ou que pertence a outro utilizador.

    - test_deletar_tarefa_sucesso: Valida a remoção de uma tarefa vinculada ao utilizador autenticado (DELETE /delete).

### Resultado da Execução dos Testes
```bash
=========================================================== test session starts ===========================================================
platform linux -- Python 3.14.7, pytest-9.1.1, pluggy-1.6.0 -- /usr/local/bin/python3.14
cachedir: .pytest_cache
rootdir: /app
plugins: anyio-4.14.2
collected 12 items                                                                                                                        

tests/test_auth.py::test_cadastrar_sucesso PASSED                                                                                   [  8%]
tests/test_auth.py::test_cadastrar_falha PASSED                                                                                     [ 16%]
tests/test_auth.py::test_login_sucesso PASSED                                                                                       [ 25%]
tests/test_auth.py::test_login_credenciais_invalidas PASSED                                                                         [ 33%]
tests/test_auth.py::test_login_campos_faltando PASSED                                                                               [ 41%]
tests/test_tasks.py::test_rota_protegida_sem_token PASSED                                                                           [ 50%]
tests/test_tasks.py::test_rota_protegida_token_invalido PASSED                                                                      [ 58%]
tests/test_tasks.py::test_listar_tarefas_sucesso PASSED                                                                             [ 66%]
tests/test_tasks.py::test_criar_tarefa_sucesso PASSED                                                                               [ 75%]
tests/test_tasks.py::test_atualizar_tarefa_sucesso PASSED                                                                           [ 83%]
tests/test_tasks.py::test_atualizar_tarefa_nao_encontrada PASSED                                                                    [ 91%]
tests/test_tasks.py::test_deletar_tarefa_sucesso PASSED                                                                             [100%]

=========================================================== 12 passed in 0.46s ============================================================
```