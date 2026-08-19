# Task Manager — Frontend (modo demonstração, standalone)

Este é o frontend (React + Vite) do sistema de gerenciamento de tarefas,
rodando **de forma totalmente independente**: sem Supabase real e sem
backend FastAPI. Autenticação e tarefas são simuladas inteiramente no
navegador (`localStorage`), então dá pra rodar e testar a interface
imediatamente.

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Não precisa configurar `.env` nem subir
nenhum outro serviço.

## O que funciona neste modo

- Cadastro e login com email/senha (guardado localmente)
- Múltiplos "usuários" isolados — cada um só vê suas próprias tarefas
- CRUD completo de tarefas (criar, listar, editar, excluir)
- Validações equivalentes às do backend real (título obrigatório, 401 sem
  sessão, 404 para tarefa inexistente)
- Mensagens de sucesso/erro
- Um aviso fixo no topo ("Modo demonstração") com botão para limpar todos
  os dados salvos localmente

## O que é simulado (e por quê)

Para o frontend funcionar sozinho, dois arquivos foram trocados por
versões locais, mas **mantendo exatamente a mesma interface** que o
resto do app espera — nenhum componente (`Login`, `Tasks`, `TaskForm`
etc.) precisou mudar:

| Arquivo | Hoje (demo) | Depois (real) |
|---|---|---|
| `src/supabaseClient.js` | `src/lib/localAuth.js` — auth fake em `localStorage` | Cliente real do Supabase (`@supabase/supabase-js`) |
| `src/api.js` | `src/lib/localTasks.js` — CRUD fake em `localStorage` | `axios` apontando para a API FastAPI |

Cada um desses dois arquivos tem, em comentário no topo, o código exato
para voltar ao modo real quando o Supabase e o backend estiverem prontos.
`src/lib/localAuth.js` e `src/lib/localTasks.js` podem ser apagados nesse
momento — eles só existem para sustentar o modo demonstração.

## Limitações do modo demo (esperadas)

- Dados ficam só no navegador local (não sincroniza entre dispositivos/abas em modo anônimo)
- Sem confirmação de email, sem recuperação de senha
- Sem qualquer criptografia de senha (não é o objetivo aqui — é só pra destravar o desenvolvimento visual/funcional do frontend)

## Estrutura relevante

```
src/
├── supabaseClient.js   # hoje: mock de auth | depois: cliente Supabase real
├── api.js              # hoje: mock de tarefas | depois: axios -> FastAPI
├── lib/
│   ├── localAuth.js    # implementação do mock de auth
│   └── localTasks.js   # implementação do mock de tarefas
├── context/AuthContext.jsx
├── pages/
│   ├── Login.jsx
│   └── Tasks.jsx
└── components/
    ├── TaskForm.jsx
    ├── TaskList.jsx
    ├── TaskItem.jsx
    └── Alert.jsx
```
