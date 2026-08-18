/**
 * MODO DEMONSTRAÇÃO — sem backend FastAPI real.
 *
 * Este arquivo exporta um objeto com a MESMA forma que a instância do
 * axios usada antes (api.get/post/patch/delete, devolvendo { data } e
 * lançando erros com err.response.data.detail), mas por baixo dos panos
 * usa `src/lib/localTasks.js`, que guarda tudo em localStorage. Nenhuma
 * requisição de rede é feita.
 *
 * PARA VOLTAR A USAR O BACKEND FASTAPI DE VERDADE, troque este arquivo por:
 *
 *   import axios from 'axios'
 *   import { supabase } from './supabaseClient'
 *
 *   const api = axios.create({
 *     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
 *   })
 *
 *   api.interceptors.request.use(async (config) => {
 *     const { data } = await supabase.auth.getSession()
 *     const token = data?.session?.access_token
 *     if (token) config.headers.Authorization = `Bearer ${token}`
 *     return config
 *   })
 *
 *   export default api
 *
 * (é literalmente o que este arquivo tinha antes — e lembre de trocar
 * supabaseClient.js de volta para o Supabase real também)
 */

import { localTasksApi } from './lib/localTasks'

export default localTasksApi
