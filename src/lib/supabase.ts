import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados
export interface Barbearia {
  id: string
  nome: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  telefone: string
  email: string
  descricao?: string
  distancia?: string
  avaliacao: number
  total_avaliacoes: number
  imagem_url?: string
  created_at: string
}

export interface Barbeiro {
  id: string
  barbearia_id: string
  nome: string
  especialidade: string
  bio?: string
  foto_url?: string
  avaliacao: number
  total_avaliacoes: number
  created_at: string
}

export interface Servico {
  id: string
  barbearia_id: string
  nome: string
  duracao_minutos: number
  preco: number
  created_at: string
}

export interface Agendamento {
  id: string
  barbearia_id: string
  barbeiro_id: string
  servico_id: string
  cliente_nome: string
  cliente_email: string
  cliente_telefone: string
  data: string
  horario: string
  status: 'confirmado' | 'cancelado' | 'concluido'
  created_at: string
}

export interface Cliente {
  id: string
  nome: string
  email: string
  telefone: string
  data_nascimento?: string
  endereco?: string
  cidade?: string
  estado?: string
  cep?: string
  created_at: string
}
