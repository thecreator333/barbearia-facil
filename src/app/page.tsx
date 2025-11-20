"use client"

import { useState } from "react"
import { Search, MapPin, Calendar, Clock, Star, Scissors, User, ChevronRight, Check, Mail, Lock, Phone, ArrowLeft, Upload, Plus, X, Building2, Users, AlertCircle, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock data
const barbearias = [
  {
    id: 1,
    nome: "Barbearia Clássica",
    endereco: "Rua Augusta, 1500 - São Paulo",
    latitude: -23.5505,
    longitude: -46.6333,
    distancia: "1.2 km",
    avaliacao: 4.8,
    avaliacoes: 234,
    imagem: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    nome: "The Barber Shop",
    endereco: "Av. Paulista, 2300 - São Paulo",
    latitude: -23.5629,
    longitude: -46.6544,
    distancia: "2.5 km",
    avaliacao: 4.9,
    avaliacoes: 456,
    imagem: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    nome: "Estilo Masculino",
    endereco: "Rua Oscar Freire, 800 - São Paulo",
    latitude: -23.5618,
    longitude: -46.6729,
    distancia: "3.1 km",
    avaliacao: 4.7,
    avaliacoes: 189,
    imagem: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=300&fit=crop"
  }
]

const profissionais = [
  {
    id: 1,
    nome: "Carlos Silva",
    especialidade: "Cortes Clássicos",
    avaliacao: 4.9,
    avaliacoes: 156,
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    bio: "10 anos de experiência em cortes clássicos e modernos"
  },
  {
    id: 2,
    nome: "Roberto Alves",
    especialidade: "Barba & Bigode",
    avaliacao: 4.8,
    avaliacoes: 98,
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    bio: "Especialista em barbas e tratamentos faciais"
  },
  {
    id: 3,
    nome: "André Costa",
    especialidade: "Cortes Modernos",
    avaliacao: 5.0,
    avaliacoes: 203,
    foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
    bio: "Tendências e estilos contemporâneos"
  }
]

const servicos = [
  { id: 1, nome: "Corte de Cabelo", duracao: "30 min", preco: 45 },
  { id: 2, nome: "Barba", duracao: "20 min", preco: 30 },
  { id: 3, nome: "Corte + Barba", duracao: "45 min", preco: 65 },
  { id: 4, nome: "Tratamento Capilar", duracao: "40 min", preco: 80 }
]

const horarios = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00"
]

// Gerar próximos 30 dias
const gerarProximosDias = () => {
  const dias = []
  const hoje = new Date()
  for (let i = 0; i < 30; i++) {
    const data = new Date(hoje)
    data.setDate(hoje.getDate() + i)
    dias.push({
      data: data,
      diaSemana: data.toLocaleDateString('pt-BR', { weekday: 'short' }),
      dia: data.getDate(),
      mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
      completo: data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    })
  }
  return dias
}

// Funções de máscara
const formatarTelefone = (valor: string) => {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  if (numeros.length <= 2) return numeros
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`
}

const formatarCPF = (valor: string) => {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  if (numeros.length <= 3) return numeros
  if (numeros.length <= 6) return `${numeros.slice(0, 3)}.${numeros.slice(3)}`
  if (numeros.length <= 9) return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`
  return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9)}`
}

const formatarCEP = (valor: string) => {
  const numeros = valor.replace(/\D/g, '').slice(0, 8)
  if (numeros.length <= 5) return numeros
  return `${numeros.slice(0, 5)}-${numeros.slice(5)}`
}

const formatarPreco = (valor: string) => {
  const numeros = valor.replace(/\D/g, '')
  if (!numeros) return ""
  const numero = parseInt(numeros) / 100
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Função para abrir Google Maps
const abrirGoogleMaps = (endereco: string, lat?: number, lng?: number) => {
  let url = ""
  if (lat && lng) {
    url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
  } else {
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`
  }
  window.open(url, '_blank')
}

export default function BarbeariaFacil() {
  const [etapa, setEtapa] = useState<"inicial" | "cadastro-cliente" | "busca" | "profissional" | "horario" | "confirmacao" | "cadastro" | "cadastro-barbearia">("inicial")
  const [barbeariaId, setBarbeariaId] = useState<number | null>(null)
  const [profissionalId, setProfissionalId] = useState<number | null>(null)
  const [servicoId, setServicoId] = useState<number | null>(null)
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null)
  const [diaSelecionado, setDiaSelecionado] = useState<any>(gerarProximosDias()[0])
  const [busca, setBusca] = useState("")
  const [tipoCadastro, setTipoCadastro] = useState<"login" | "registro">("login")
  const [tipoUsuario, setTipoUsuario] = useState<"barbearia" | "cliente" | null>(null)
  
  // Estados para cadastro de barbearia
  const [etapaBarbearia, setEtapaBarbearia] = useState(1)
  const [dadosBarbearia, setDadosBarbearia] = useState({
    nome: "",
    telefone: "",
    email: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    descricao: "",
    fotos: [] as string[],
    barbeiros: [] as any[],
    servicos: [] as any[],
    horariosFuncionamento: {
      segunda: { inicio: "09:00", fim: "18:00", ativo: true },
      terca: { inicio: "09:00", fim: "18:00", ativo: true },
      quarta: { inicio: "09:00", fim: "18:00", ativo: true },
      quinta: { inicio: "09:00", fim: "18:00", ativo: true },
      sexta: { inicio: "09:00", fim: "18:00", ativo: true },
      sabado: { inicio: "09:00", fim: "14:00", ativo: true },
      domingo: { inicio: "00:00", fim: "00:00", ativo: false }
    }
  })
  const [barbeirosTemp, setBarbeirosTemp] = useState({ nome: "", especialidade: "", foto: "" })
  const [servicoTemp, setServicoTemp] = useState({ nome: "", duracao: "", preco: "" })

  // Estados para cadastro de cliente
  const [etapaCliente, setEtapaCliente] = useState(1)
  const [dadosCliente, setDadosCliente] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    idade: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    cidade: "",
    estado: "",
    senha: "",
    confirmarSenha: ""
  })

  // Estados de validação
  const [errosCliente, setErrosCliente] = useState<string[]>([])
  const [errosBarbearia, setErrosBarbearia] = useState<string[]>([])
  const [mostrarErros, setMostrarErros] = useState(false)

  const barbeariaAtual = barbearias.find(b => b.id === barbeariaId)
  const profissionalAtual = profissionais.find(p => p.id === profissionalId)
  const servicoAtual = servicos.find(s => s.id === servicoId)
  const diasDisponiveis = gerarProximosDias()

  const selecionarBarbearia = (id: number) => {
    setBarbeariaId(id)
    setEtapa("profissional")
  }

  const selecionarProfissionalEServico = (profId: number, servId: number) => {
    setProfissionalId(profId)
    setServicoId(servId)
    setEtapa("horario")
  }

  const selecionarHorario = (horario: string) => {
    setHorarioSelecionado(horario)
    setEtapa("confirmacao")
  }

  const confirmarAgendamento = () => {
    alert(`Agendamento confirmado para ${diaSelecionado.completo} às ${horarioSelecionado}! Você receberá lembretes 24h e 1h antes do horário.`)
    // Reset
    setEtapa("busca")
    setBarbeariaId(null)
    setProfissionalId(null)
    setServicoId(null)
    setHorarioSelecionado(null)
    setDiaSelecionado(gerarProximosDias()[0])
  }

  const voltarParaBusca = () => {
    setEtapa("busca")
    setBarbeariaId(null)
    setProfissionalId(null)
    setServicoId(null)
  }

  const voltarParaProfissional = () => {
    setEtapa("profissional")
    setHorarioSelecionado(null)
  }

  const voltarParaHorario = () => {
    setEtapa("horario")
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Login realizado com sucesso!")
    setEtapa("busca")
  }

  const iniciarCadastro = (tipo: "barbearia" | "cliente") => {
    setTipoUsuario(tipo)
    if (tipo === "barbearia") {
      setEtapa("cadastro-barbearia")
    } else {
      setEtapa("cadastro-cliente")
    }
  }

  const adicionarBarbeiro = () => {
    if (barbeirosTemp.nome && barbeirosTemp.especialidade) {
      setDadosBarbearia({
        ...dadosBarbearia,
        barbeiros: [...dadosBarbearia.barbeiros, { ...barbeirosTemp, id: Date.now() }]
      })
      setBarbeirosTemp({ nome: "", especialidade: "", foto: "" })
    }
  }

  const removerBarbeiro = (id: number) => {
    setDadosBarbearia({
      ...dadosBarbearia,
      barbeiros: dadosBarbearia.barbeiros.filter(b => b.id !== id)
    })
  }

  const adicionarServico = () => {
    if (servicoTemp.nome && servicoTemp.duracao && servicoTemp.preco) {
      setDadosBarbearia({
        ...dadosBarbearia,
        servicos: [...dadosBarbearia.servicos, { ...servicoTemp, id: Date.now() }]
      })
      setServicoTemp({ nome: "", duracao: "", preco: "" })
    }
  }

  const removerServico = (id: number) => {
    setDadosBarbearia({
      ...dadosBarbearia,
      servicos: dadosBarbearia.servicos.filter(s => s.id !== id)
    })
  }

  // Validação de campos obrigatórios - Cliente
  const validarEtapaCliente = (etapa: number): { valido: boolean; camposVazios: string[] } => {
    const camposVazios: string[] = []
    
    switch (etapa) {
      case 1:
        if (!dadosCliente.nome) camposVazios.push("nome")
        if (!dadosCliente.email) camposVazios.push("email")
        if (!dadosCliente.telefone || dadosCliente.telefone.replace(/\D/g, '').length < 11) camposVazios.push("telefone")
        if (!dadosCliente.cpf || dadosCliente.cpf.replace(/\D/g, '').length < 11) camposVazios.push("cpf")
        if (!dadosCliente.dataNascimento) camposVazios.push("dataNascimento")
        break
      case 2:
        if (!dadosCliente.cep || dadosCliente.cep.replace(/\D/g, '').length < 8) camposVazios.push("cep")
        if (!dadosCliente.endereco) camposVazios.push("endereco")
        if (!dadosCliente.numero) camposVazios.push("numero")
        if (!dadosCliente.cidade) camposVazios.push("cidade")
        if (!dadosCliente.estado) camposVazios.push("estado")
        break
      case 3:
        if (!dadosCliente.senha || dadosCliente.senha.length < 8) camposVazios.push("senha")
        if (!dadosCliente.confirmarSenha) camposVazios.push("confirmarSenha")
        if (dadosCliente.senha !== dadosCliente.confirmarSenha) camposVazios.push("senhasDiferentes")
        break
    }
    
    return { valido: camposVazios.length === 0, camposVazios }
  }

  // Validação de campos obrigatórios - Barbearia
  const validarEtapaBarbearia = (etapa: number): { valido: boolean; camposVazios: string[] } => {
    const camposVazios: string[] = []
    
    switch (etapa) {
      case 1:
        if (!dadosBarbearia.nome) camposVazios.push("nome")
        if (!dadosBarbearia.telefone || dadosBarbearia.telefone.replace(/\D/g, '').length < 11) camposVazios.push("telefone")
        if (!dadosBarbearia.email) camposVazios.push("email")
        break
      case 2:
        if (!dadosBarbearia.cep || dadosBarbearia.cep.replace(/\D/g, '').length < 8) camposVazios.push("cep")
        if (!dadosBarbearia.endereco) camposVazios.push("endereco")
        if (!dadosBarbearia.numero) camposVazios.push("numero")
        if (!dadosBarbearia.cidade) camposVazios.push("cidade")
        if (!dadosBarbearia.estado) camposVazios.push("estado")
        break
      case 3:
        // Fotos são opcionais
        break
      case 4:
        if (dadosBarbearia.barbeiros.length === 0) camposVazios.push("barbeiros")
        break
      case 5:
        if (dadosBarbearia.servicos.length === 0) camposVazios.push("servicos")
        break
    }
    
    return { valido: camposVazios.length === 0, camposVazios }
  }

  const avancarEtapaCliente = () => {
    const validacao = validarEtapaCliente(etapaCliente)
    
    if (!validacao.valido) {
      setErrosCliente(validacao.camposVazios)
      setMostrarErros(true)
      return
    }
    
    setErrosCliente([])
    setMostrarErros(false)
    setEtapaCliente(etapaCliente + 1)
  }

  const avancarEtapaBarbearia = () => {
    const validacao = validarEtapaBarbearia(etapaBarbearia)
    
    if (!validacao.valido) {
      setErrosBarbearia(validacao.camposVazios)
      setMostrarErros(true)
      return
    }
    
    setErrosBarbearia([])
    setMostrarErros(false)
    setEtapaBarbearia(etapaBarbearia + 1)
  }

  const finalizarCadastroCliente = () => {
    const validacao = validarEtapaCliente(3)
    
    if (!validacao.valido) {
      setErrosCliente(validacao.camposVazios)
      setMostrarErros(true)
      return
    }
    
    alert("Cadastro realizado com sucesso! Bem-vindo ao BarbeariaFácil!")
    setEtapa("busca")
    setEtapaCliente(1)
    setErrosCliente([])
    setMostrarErros(false)
    setDadosCliente({
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      dataNascimento: "",
      idade: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
      senha: "",
      confirmarSenha: ""
    })
  }

  const finalizarCadastroBarbearia = () => {
    const validacao = validarEtapaBarbearia(5)
    
    if (!validacao.valido) {
      setErrosBarbearia(validacao.camposVazios)
      setMostrarErros(true)
      return
    }
    
    alert("Cadastro de barbearia realizado com sucesso! Aguarde aprovação.")
    setEtapa("busca")
    setEtapaBarbearia(1)
    setErrosBarbearia([])
    setMostrarErros(false)
    setDadosBarbearia({
      nome: "",
      telefone: "",
      email: "",
      cep: "",
      endereco: "",
      numero: "",
      complemento: "",
      cidade: "",
      estado: "",
      descricao: "",
      fotos: [],
      barbeiros: [],
      servicos: [],
      horariosFuncionamento: {
        segunda: { inicio: "09:00", fim: "18:00", ativo: true },
        terca: { inicio: "09:00", fim: "18:00", ativo: true },
        quarta: { inicio: "09:00", fim: "18:00", ativo: true },
        quinta: { inicio: "09:00", fim: "18:00", ativo: true },
        sexta: { inicio: "09:00", fim: "18:00", ativo: true },
        sabado: { inicio: "09:00", fim: "14:00", ativo: true },
        domingo: { inicio: "00:00", fim: "00:00", ativo: false }
      }
    })
  }

  const voltarEtapaCliente = () => {
    setErrosCliente([])
    setMostrarErros(false)
    if (etapaCliente === 1) {
      setEtapa("inicial")
    } else {
      setEtapaCliente(etapaCliente - 1)
    }
  }

  const voltarEtapaBarbearia = () => {
    setErrosBarbearia([])
    setMostrarErros(false)
    if (etapaBarbearia === 1) {
      setEtapa("inicial")
    } else {
      setEtapaBarbearia(etapaBarbearia - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* TELA INICIAL - Inspirada no design fornecido */}
      {etapa === "inicial" && (
        <div className="min-h-screen flex flex-col lg:flex-row">
          {/* Lado Esquerdo - Apresentação */}
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
            <div className="max-w-2xl mx-auto w-full space-y-8">
              {/* Logo e Título */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-3 rounded-xl shadow-lg shadow-emerald-500/20">
                    <Scissors className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">BarbeariaFácil</h1>
                </div>
                
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Agende seu corte com apenas um clique
                </h2>
                
                <p className="text-xl text-slate-300">
                  A maneira mais fácil de encontrar e agendar serviços nas melhores barbearias da sua região.
                </p>
              </div>

              {/* Cards de Funcionalidades */}
              <div className="grid sm:grid-cols-2 gap-4 mt-12">
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-emerald-500/50 transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                      <Search className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Busca Inteligente</h3>
                      <p className="text-sm text-slate-400">Encontre barbearias próximas a você</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-emerald-500/50 transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                      <Calendar className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Agendamento Rápido</h3>
                      <p className="text-sm text-slate-400">Escolha dia e horário em segundos</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-emerald-500/50 transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                      <Star className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Avaliações Reais</h3>
                      <p className="text-sm text-slate-400">Veja opiniões de outros clientes</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:border-emerald-500/50 transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="bg-emerald-500/10 p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">Lembretes Automáticos</h3>
                      <p className="text-sm text-slate-400">Nunca mais perca um horário</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Lado Direito - Login/Cadastro */}
          <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-md space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-bold text-white">Bem-vindo!</h3>
                <p className="text-slate-400">Entre ou crie sua conta para começar</p>
              </div>

              {/* Formulário de Login */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6 space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-inicial" className="text-slate-200">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <Input
                          id="email-inicial"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="senha-inicial" className="text-slate-200">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <Input
                          id="senha-inicial"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
                    >
                      Entrar
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-800 text-slate-500">ou</span>
                    </div>
                  </div>

                  {/* Botões de Cadastro */}
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-slate-600 text-slate-900 hover:bg-slate-700 hover:border-emerald-500 hover:text-white"
                      onClick={() => iniciarCadastro("cliente")}
                    >
                      <User className="w-5 h-5 mr-2" />
                      Cadastrar como Cliente
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-slate-600 text-slate-900 hover:bg-slate-700 hover:border-emerald-500 hover:text-white"
                      onClick={() => iniciarCadastro("barbearia")}
                    >
                      <Building2 className="w-5 h-5 mr-2" />
                      Cadastrar Barbearia
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-xs text-slate-500">
                      Ao continuar, você concorda com nossos{" "}
                      <a href="#" className="text-emerald-400 hover:underline">Termos de Uso</a>
                      {" "}e{" "}
                      <a href="#" className="text-emerald-400 hover:underline">Política de Privacidade</a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Header - Apenas para outras etapas */}
      {etapa !== "inicial" && (
        <header className="border-b border-slate-800 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-lg shadow-lg shadow-emerald-500/20">
                  <Scissors className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">BarbeariaFácil</h1>
                  <p className="text-xs text-slate-400">Agende com um clique.</p>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Progress Indicator - Apenas para busca e agendamento */}
      {(etapa === "busca" || etapa === "profissional" || etapa === "horario" || etapa === "confirmacao") && (
        <div className="bg-slate-900/50 border-b border-slate-800">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className={`flex items-center gap-2 ${etapa === "busca" ? "text-emerald-400" : "text-slate-500"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${etapa === "busca" ? "bg-emerald-500 text-black" : "bg-slate-800"}`}>
                  1
                </div>
                <span className="hidden sm:inline">Buscar</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <div className={`flex items-center gap-2 ${etapa === "profissional" ? "text-emerald-400" : "text-slate-500"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${etapa === "profissional" ? "bg-emerald-500 text-black" : "bg-slate-800"}`}>
                  2
                </div>
                <span className="hidden sm:inline">Profissional</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <div className={`flex items-center gap-2 ${etapa === "horario" || etapa === "confirmacao" ? "text-emerald-400" : "text-slate-500"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${etapa === "horario" || etapa === "confirmacao" ? "bg-emerald-500 text-black" : "bg-slate-800"}`}>
                  3
                </div>
                <span className="hidden sm:inline">Horário</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* TELA DE ESCOLHA DE TIPO DE CADASTRO */}
        {etapa === "cadastro" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white mb-4"
              onClick={() => setEtapa("busca")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Bem-vindo!</h2>
              <p className="text-slate-400">Escolha como deseja continuar</p>
            </div>

            {/* Opção de Login */}
            <Card className="bg-slate-800 border-slate-700 mb-6">
              <CardHeader>
                <CardTitle className="text-white text-center">Já tem uma conta?</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login" className="text-slate-200">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input
                        id="email-login"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senha-login" className="text-slate-200">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input
                        id="senha-login"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
                  >
                    Entrar
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Opções de Cadastro */}
            <div className="text-center mb-4">
              <p className="text-slate-400">Ou crie uma nova conta:</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Cadastro de Cliente */}
              <Card 
                className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all cursor-pointer group"
                onClick={() => iniciarCadastro("cliente")}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Sou Cliente</h3>
                    <p className="text-slate-400">Quero agendar serviços em barbearias</p>
                  </div>
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                    Cadastrar como Cliente
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Cadastro de Barbearia */}
              <Card 
                className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all cursor-pointer group"
                onClick={() => iniciarCadastro("barbearia")}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                    <Building2 className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Tenho uma Barbearia</h3>
                    <p className="text-slate-400">Quero cadastrar minha barbearia na plataforma</p>
                  </div>
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                    Cadastrar Barbearia
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* CADASTRO DE CLIENTE - MULTI-ETAPAS */}
        {etapa === "cadastro-cliente" && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Etapa {etapaCliente} de 3</span>
                <span className="text-sm text-emerald-400">{Math.round((etapaCliente / 3) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300"
                  style={{ width: `${(etapaCliente / 3) * 100}%` }}
                />
              </div>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  {etapaCliente === 1 && "Dados Pessoais"}
                  {etapaCliente === 2 && "Endereço"}
                  {etapaCliente === 3 && "Senha de Acesso"}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {etapaCliente === 1 && "Informações básicas sobre você"}
                  {etapaCliente === 2 && "Onde você mora"}
                  {etapaCliente === 3 && "Crie uma senha segura"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mensagem de erro */}
                {mostrarErros && errosCliente.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-semibold mb-1">Por favor, preencha todos os campos obrigatórios</p>
                      <p className="text-sm text-red-300">Os campos em vermelho precisam ser preenchidos corretamente.</p>
                    </div>
                  </div>
                )}

                {/* ETAPA 1: Dados Pessoais */}
                {etapaCliente === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nome-cliente" className="text-slate-200">Nome Completo *</Label>
                      <Input
                        id="nome-cliente"
                        value={dadosCliente.nome}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, nome: e.target.value })}
                        placeholder="Seu nome completo"
                        className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                          mostrarErros && errosCliente.includes("nome") ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-cliente" className="text-slate-200">E-mail *</Label>
                        <Input
                          id="email-cliente"
                          type="email"
                          value={dadosCliente.email}
                          onChange={(e) => setDadosCliente({ ...dadosCliente, email: e.target.value })}
                          placeholder="seu@email.com"
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosCliente.includes("email") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefone-cliente" className="text-slate-200">Telefone *</Label>
                        <Input
                          id="telefone-cliente"
                          value={dadosCliente.telefone}
                          onChange={(e) => setDadosCliente({ ...dadosCliente, telefone: formatarTelefone(e.target.value) })}
                          placeholder="(11) 99999-9999"
                          maxLength={15}
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosCliente.includes("telefone") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cpf-cliente" className="text-slate-200">CPF *</Label>
                        <Input
                          id="cpf-cliente"
                          value={dadosCliente.cpf}
                          onChange={(e) => setDadosCliente({ ...dadosCliente, cpf: formatarCPF(e.target.value) })}
                          placeholder="000.000.000-00"
                          maxLength={14}
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosCliente.includes("cpf") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="data-nascimento" className="text-slate-200">Data de Nascimento *</Label>
                        <Input
                          id="data-nascimento"
                          type="date"
                          value={dadosCliente.dataNascimento}
                          onChange={(e) => {
                            const nascimento = new Date(e.target.value)
                            const hoje = new Date()
                            const idade = hoje.getFullYear() - nascimento.getFullYear()
                            setDadosCliente({ 
                              ...dadosCliente, 
                              dataNascimento: e.target.value,
                              idade: idade.toString()
                            })
                          }}
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosCliente.includes("dataNascimento") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ETAPA 2: Endereço */}
                {etapaCliente === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cep-cliente" className="text-slate-200">CEP *</Label>
                      <Input
                        id="cep-cliente"
                        value={dadosCliente.cep}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, cep: formatarCEP(e.target.value) })}
                        placeholder="00000-000"
                        maxLength={9}
                        className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                          mostrarErros && errosCliente.includes("cep") ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endereco-cliente" className="text-slate-200">Endereço *</Label>
                      <Input
                        id="endereco-cliente"
                        value={dadosCliente.endereco}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, endereco: e.target.value })}
                        placeholder="Rua, Avenida..."
                        className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                          mostrarErros && errosCliente.includes("endereco") ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numero-cliente" className="text-slate-200">Número *</Label>
                        <Input
                          id="numero-cliente"
                          value={dadosCliente.numero}
                          onChange={(e) => setDadosCliente({ ...dadosCliente, numero: e.target.value })}
                          placeholder="123"
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosCliente.includes("numero") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complemento-cliente" className="text-slate-200">Complemento</Label>
                        <Input
                          id="complemento-cliente"
                          value={dadosCliente.complemento}
                          onChange={(e) => setDadosCliente({ ...dadosCliente, complemento: e.target.value })}
                          placeholder="Apto, Bloco..."
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cidade-cliente" className="text-slate-200">Cidade *</Label>
                        <Input
                          id="cidade-cliente"
                          value={dadosCliente.cidade}
                          onChange={(e) => setDadosCliente({ ...dadosCliente, cidade: e.target.value })}
                          placeholder="São Paulo"
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosCliente.includes("cidade") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estado-cliente" className="text-slate-200">Estado *</Label>
                        <Input
                          id="estado-cliente"
                          value={dadosCliente.estado}
                          onChange={(e) => setDadosCliente({ ...dadosCliente, estado: e.target.value })}
                          placeholder="SP"
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosCliente.includes("estado") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ETAPA 3: Senha */}
                {etapaCliente === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="senha-cliente" className="text-slate-200">Senha *</Label>
                      <Input
                        id="senha-cliente"
                        type="password"
                        value={dadosCliente.senha}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, senha: e.target.value })}
                        placeholder="Mínimo 8 caracteres"
                        className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                          mostrarErros && errosCliente.includes("senha") ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmar-senha-cliente" className="text-slate-200">Confirmar Senha *</Label>
                      <Input
                        id="confirmar-senha-cliente"
                        type="password"
                        value={dadosCliente.confirmarSenha}
                        onChange={(e) => setDadosCliente({ ...dadosCliente, confirmarSenha: e.target.value })}
                        placeholder="Digite a senha novamente"
                        className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                          mostrarErros && (errosCliente.includes("confirmarSenha") || errosCliente.includes("senhasDiferentes")) ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                    </div>

                    {dadosCliente.senha && dadosCliente.confirmarSenha && dadosCliente.senha !== dadosCliente.confirmarSenha && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-sm text-red-400">
                          <strong>Atenção:</strong> As senhas não coincidem.
                        </p>
                      </div>
                    )}

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                      <p className="text-sm text-emerald-400">
                        <strong>Dica:</strong> Use uma senha forte com letras, números e caracteres especiais.
                      </p>
                    </div>
                  </>
                )}

                {/* Botões de Navegação */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={voltarEtapaCliente}
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>

                  {etapaCliente < 3 ? (
                    <Button
                      onClick={avancarEtapaCliente}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
                    >
                      Próxima Etapa
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={finalizarCadastroCliente}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Finalizar Cadastro
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CADASTRO DE BARBEARIA - MULTI-ETAPAS */}
        {etapa === "cadastro-barbearia" && (
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Etapa {etapaBarbearia} de 5</span>
                <span className="text-sm text-emerald-400">{Math.round((etapaBarbearia / 5) * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all duration-300"
                  style={{ width: `${(etapaBarbearia / 5) * 100}%` }}
                />
              </div>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-2xl">
                  {etapaBarbearia === 1 && "Informações Básicas"}
                  {etapaBarbearia === 2 && "Endereço"}
                  {etapaBarbearia === 3 && "Fotos da Barbearia"}
                  {etapaBarbearia === 4 && "Cadastro de Barbeiros"}
                  {etapaBarbearia === 5 && "Serviços e Preços"}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {etapaBarbearia === 1 && "Dados principais da sua barbearia"}
                  {etapaBarbearia === 2 && "Onde sua barbearia está localizada"}
                  {etapaBarbearia === 3 && "Adicione fotos do ambiente (opcional)"}
                  {etapaBarbearia === 4 && "Cadastre os profissionais que atuam"}
                  {etapaBarbearia === 5 && "Configure serviços, preços e horários"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mensagem de erro */}
                {mostrarErros && errosBarbearia.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 font-semibold mb-1">Por favor, preencha todos os campos obrigatórios</p>
                      <p className="text-sm text-red-300">Os campos em vermelho precisam ser preenchidos corretamente.</p>
                    </div>
                  </div>
                )}

                {/* ETAPA 1: Informações Básicas */}
                {etapaBarbearia === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nome-barbearia" className="text-slate-200">Nome da Barbearia *</Label>
                      <Input
                        id="nome-barbearia"
                        value={dadosBarbearia.nome}
                        onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, nome: e.target.value })}
                        placeholder="Ex: Barbearia Clássica"
                        className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                          mostrarErros && errosBarbearia.includes("nome") ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefone-barbearia" className="text-slate-200">Telefone *</Label>
                        <Input
                          id="telefone-barbearia"
                          value={dadosBarbearia.telefone}
                          onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, telefone: formatarTelefone(e.target.value) })}
                          placeholder="(11) 99999-9999"
                          maxLength={15}
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosBarbearia.includes("telefone") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email-barbearia" className="text-slate-200">E-mail *</Label>
                        <Input
                          id="email-barbearia"
                          type="email"
                          value={dadosBarbearia.email}
                          onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, email: e.target.value })}
                          placeholder="contato@barbearia.com"
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosBarbearia.includes("email") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="descricao-barbearia" className="text-slate-200">Descrição</Label>
                      <Textarea
                        id="descricao-barbearia"
                        value={dadosBarbearia.descricao}
                        onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, descricao: e.target.value })}
                        placeholder="Conte um pouco sobre sua barbearia..."
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 min-h-[100px]"
                      />
                    </div>
                  </>
                )}

                {/* ETAPA 2: Endereço */}
                {etapaBarbearia === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cep-barbearia" className="text-slate-200">CEP *</Label>
                      <Input
                        id="cep-barbearia"
                        value={dadosBarbearia.cep}
                        onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, cep: formatarCEP(e.target.value) })}
                        placeholder="00000-000"
                        maxLength={9}
                        className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                          mostrarErros && errosBarbearia.includes("cep") ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endereco-barbearia" className="text-slate-200">Endereço *</Label>
                      <Input
                        id="endereco-barbearia"
                        value={dadosBarbearia.endereco}
                        onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, endereco: e.target.value })}
                        placeholder="Rua, Avenida..."
                        className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                          mostrarErros && errosBarbearia.includes("endereco") ? "border-red-500 focus:border-red-500" : ""
                        }`}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numero-barbearia" className="text-slate-200">Número *</Label>
                        <Input
                          id="numero-barbearia"
                          value={dadosBarbearia.numero}
                          onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, numero: e.target.value })}
                          placeholder="123"
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosBarbearia.includes("numero") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="complemento-barbearia" className="text-slate-200">Complemento</Label>
                        <Input
                          id="complemento-barbearia"
                          value={dadosBarbearia.complemento}
                          onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, complemento: e.target.value })}
                          placeholder="Sala, Andar..."
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cidade-barbearia" className="text-slate-200">Cidade *</Label>
                        <Input
                          id="cidade-barbearia"
                          value={dadosBarbearia.cidade}
                          onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, cidade: e.target.value })}
                          placeholder="São Paulo"
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosBarbearia.includes("cidade") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="estado-barbearia" className="text-slate-200">Estado *</Label>
                        <Input
                          id="estado-barbearia"
                          value={dadosBarbearia.estado}
                          onChange={(e) => setDadosBarbearia({ ...dadosBarbearia, estado: e.target.value })}
                          placeholder="SP"
                          className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 ${
                            mostrarErros && errosBarbearia.includes("estado") ? "border-red-500 focus:border-red-500" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ETAPA 3: Fotos */}
                {etapaBarbearia === 3 && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 mb-2">Clique para adicionar fotos</p>
                      <p className="text-sm text-slate-600">PNG, JPG até 5MB</p>
                    </div>

                    {dadosBarbearia.fotos.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {dadosBarbearia.fotos.map((foto, index) => (
                          <div key={index} className="relative group">
                            <img src={foto} alt={`Foto ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                            <button
                              onClick={() => setDadosBarbearia({
                                ...dadosBarbearia,
                                fotos: dadosBarbearia.fotos.filter((_, i) => i !== index)
                              })}
                              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ETAPA 4: Barbeiros */}
                {etapaBarbearia === 4 && (
                  <div className="space-y-6">
                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        <Plus className="w-5 h-5 text-emerald-400" />
                        Adicionar Barbeiro
                      </h4>

                      <div className="space-y-3">
                        <Input
                          value={barbeirosTemp.nome}
                          onChange={(e) => setBarbeirosTemp({ ...barbeirosTemp, nome: e.target.value })}
                          placeholder="Nome do barbeiro *"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                        />

                        <Input
                          value={barbeirosTemp.especialidade}
                          onChange={(e) => setBarbeirosTemp({ ...barbeirosTemp, especialidade: e.target.value })}
                          placeholder="Especialidade (ex: Cortes Clássicos) *"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                        />

                        <Button
                          type="button"
                          onClick={adicionarBarbeiro}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                          disabled={!barbeirosTemp.nome || !barbeirosTemp.especialidade}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Barbeiro
                        </Button>
                      </div>
                    </div>

                    {dadosBarbearia.barbeiros.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Users className="w-5 h-5 text-emerald-400" />
                          Barbeiros Cadastrados ({dadosBarbearia.barbeiros.length})
                        </h4>

                        {dadosBarbearia.barbeiros.map((barbeiro) => (
                          <div key={barbeiro.id} className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg">
                            <div>
                              <p className="text-white font-semibold">{barbeiro.nome}</p>
                              <p className="text-sm text-slate-400">{barbeiro.especialidade}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removerBarbeiro(barbeiro.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {mostrarErros && errosBarbearia.includes("barbeiros") && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-sm text-red-400">
                          <strong>Atenção:</strong> Você precisa cadastrar pelo menos um barbeiro para finalizar.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ETAPA 5: Serviços e Preços */}
                {etapaBarbearia === 5 && (
                  <div className="space-y-6">
                    {/* Adicionar Serviço */}
                    <div className="bg-slate-700/50 p-4 rounded-lg space-y-4">
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        Adicionar Serviço
                      </h4>

                      <div className="space-y-3">
                        <Input
                          value={servicoTemp.nome}
                          onChange={(e) => setServicoTemp({ ...servicoTemp, nome: e.target.value })}
                          placeholder="Nome do serviço (ex: Corte de Cabelo) *"
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            value={servicoTemp.duracao}
                            onChange={(e) => setServicoTemp({ ...servicoTemp, duracao: e.target.value })}
                            placeholder="Duração (ex: 30 min) *"
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                          />

                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">R$</span>
                            <Input
                              value={servicoTemp.preco}
                              onChange={(e) => setServicoTemp({ ...servicoTemp, preco: formatarPreco(e.target.value) })}
                              placeholder="0,00"
                              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500"
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          onClick={adicionarServico}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                          disabled={!servicoTemp.nome || !servicoTemp.duracao || !servicoTemp.preco}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Serviço
                        </Button>
                      </div>
                    </div>

                    {/* Lista de Serviços */}
                    {dadosBarbearia.servicos.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-white font-semibold flex items-center gap-2">
                          <Scissors className="w-5 h-5 text-emerald-400" />
                          Serviços Cadastrados ({dadosBarbearia.servicos.length})
                        </h4>

                        {dadosBarbearia.servicos.map((servico) => (
                          <div key={servico.id} className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex-1">
                              <p className="text-white font-semibold">{servico.nome}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-sm text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {servico.duracao}
                                </span>
                                <span className="text-emerald-400 font-bold">R$ {servico.preco}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removerServico(servico.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Horários de Funcionamento */}
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-400" />
                        Horários de Funcionamento
                      </h4>

                      <div className="space-y-2">
                        {Object.entries(dadosBarbearia.horariosFuncionamento).map(([dia, horario]) => (
                          <div key={dia} className="flex items-center gap-3 bg-slate-700/50 p-3 rounded-lg">
                            <input
                              type="checkbox"
                              checked={horario.ativo}
                              onChange={(e) => setDadosBarbearia({
                                ...dadosBarbearia,
                                horariosFuncionamento: {
                                  ...dadosBarbearia.horariosFuncionamento,
                                  [dia]: { ...horario, ativo: e.target.checked }
                                }
                              })}
                              className="w-4 h-4 text-emerald-600 bg-slate-700 border-slate-600 rounded focus:ring-emerald-500"
                            />
                            <span className="text-white font-medium w-24 capitalize">{dia}</span>
                            {horario.ativo && (
                              <div className="flex items-center gap-2 flex-1">
                                <Input
                                  type="time"
                                  value={horario.inicio}
                                  onChange={(e) => setDadosBarbearia({
                                    ...dadosBarbearia,
                                    horariosFuncionamento: {
                                      ...dadosBarbearia.horariosFuncionamento,
                                      [dia]: { ...horario, inicio: e.target.value }
                                    }
                                  })}
                                  className="bg-slate-700 border-slate-600 text-white text-sm"
                                />
                                <span className="text-slate-400">às</span>
                                <Input
                                  type="time"
                                  value={horario.fim}
                                  onChange={(e) => setDadosBarbearia({
                                    ...dadosBarbearia,
                                    horariosFuncionamento: {
                                      ...dadosBarbearia.horariosFuncionamento,
                                      [dia]: { ...horario, fim: e.target.value }
                                    }
                                  })}
                                  className="bg-slate-700 border-slate-600 text-white text-sm"
                                />
                              </div>
                            )}
                            {!horario.ativo && (
                              <span className="text-slate-500 text-sm">Fechado</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {mostrarErros && errosBarbearia.includes("servicos") && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <p className="text-sm text-red-400">
                          <strong>Atenção:</strong> Você precisa cadastrar pelo menos um serviço para finalizar.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Botões de Navegação */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={voltarEtapaBarbearia}
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>

                  {etapaBarbearia < 5 ? (
                    <Button
                      onClick={avancarEtapaBarbearia}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
                    >
                      Próxima Etapa
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={finalizarCadastroBarbearia}
                      className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Finalizar Cadastro
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ETAPA 1: BUSCA DE BARBEARIAS */}
        {etapa === "busca" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Encontre sua barbearia</h2>
              <p className="text-slate-400">Escolha a barbearia mais próxima de você</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Buscar por nome ou localização..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-12 h-14 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-emerald-500"
              />
            </div>

            {/* Barbearias List */}
            <div className="grid gap-4 sm:gap-6">
              {barbearias.map((barbearia) => (
                <Card
                  key={barbearia.id}
                  className="bg-slate-800 border-slate-700 hover:border-emerald-500 transition-all cursor-pointer group overflow-hidden"
                  onClick={() => selecionarBarbearia(barbearia.id)}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto overflow-hidden">
                      <img
                        src={barbearia.imagem}
                        alt={barbearia.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{barbearia.nome}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                            <MapPin className="w-4 h-4" />
                            {barbearia.endereco}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-0 h-auto"
                            onClick={(e) => {
                              e.stopPropagation()
                              abrirGoogleMaps(barbearia.endereco, barbearia.latitude, barbearia.longitude)
                            }}
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Ver no Google Maps
                          </Button>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                          {barbearia.distancia}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                          <span className="text-white font-semibold">{barbearia.avaliacao}</span>
                          <span className="text-slate-500 text-sm">({barbearia.avaliacoes})</span>
                        </div>
                        <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white ml-auto shadow-lg shadow-emerald-500/20">
                          Selecionar
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ETAPA 2: SELEÇÃO DE PROFISSIONAL E SERVIÇO */}
        {etapa === "profissional" && (
          <div className="max-w-5xl mx-auto space-y-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white mb-4"
              onClick={voltarParaBusca}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para busca
            </Button>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Escolha o profissional e serviço</h2>
              <p className="text-slate-400">{barbeariaAtual?.nome}</p>
            </div>

            <div className="grid gap-6">
              {profissionais.map((profissional) => (
                <Card key={profissional.id} className="bg-slate-800 border-slate-700 overflow-hidden">
                  <CardHeader className="border-b border-slate-700">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16 border-2 border-emerald-500">
                        <AvatarImage src={profissional.foto} alt={profissional.nome} />
                        <AvatarFallback>{profissional.nome[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-white">{profissional.nome}</CardTitle>
                        <CardDescription className="text-slate-400">{profissional.especialidade}</CardDescription>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                          <span className="text-white font-semibold text-sm">{profissional.avaliacao}</span>
                          <span className="text-slate-500 text-sm">({profissional.avaliacoes})</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mt-3">{profissional.bio}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <h4 className="text-white font-semibold mb-4">Selecione o serviço:</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {servicos.map((servico) => (
                        <Button
                          key={servico.id}
                          variant="outline"
                          className="h-auto p-4 border-slate-600 bg-slate-700/50 hover:border-emerald-500 hover:bg-emerald-500/10 text-left justify-start flex-col items-start gap-2 transition-all"
                          onClick={() => selecionarProfissionalEServico(profissional.id, servico.id)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-white font-semibold">{servico.nome}</span>
                            <span className="text-emerald-400 font-bold text-lg">R$ {servico.preco}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Clock className="w-4 h-4" />
                            {servico.duracao}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ETAPA 3: SELEÇÃO DE DIA E HORÁRIO */}
        {etapa === "horario" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white mb-4"
              onClick={voltarParaProfissional}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para profissionais
            </Button>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Escolha o dia e horário</h2>
              <p className="text-slate-400">
                {profissionalAtual?.nome} - {servicoAtual?.nome}
              </p>
            </div>

            {/* Seleção de Dia */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Selecione o dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {diasDisponiveis.slice(0, 14).map((dia, index) => (
                    <button
                      key={index}
                      onClick={() => setDiaSelecionado(dia)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-lg border-2 transition-all ${
                        diaSelecionado.data.toDateString() === dia.data.toDateString()
                          ? "border-emerald-500 bg-emerald-500/20"
                          : "border-slate-600 bg-slate-700/50 hover:border-emerald-500/50"
                      }`}
                    >
                      <span className="text-xs text-slate-400 uppercase">{dia.diaSemana}</span>
                      <span className="text-2xl font-bold text-white my-1">{dia.dia}</span>
                      <span className="text-xs text-slate-400 uppercase">{dia.mes}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seleção de Horário */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  Horários disponíveis para {diaSelecionado.completo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {horarios.map((horario) => (
                    <Button
                      key={horario}
                      variant="outline"
                      className="h-14 border-slate-600 bg-slate-700/50 hover:border-emerald-500 hover:bg-emerald-500/20 text-white font-semibold text-base transition-all"
                      onClick={() => selecionarHorario(horario)}
                    >
                      {horario}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ETAPA 4: CONFIRMAÇÃO */}
        {etapa === "confirmacao" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white mb-4"
              onClick={voltarParaHorario}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para horários
            </Button>

            <div className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Confirme seu agendamento</h2>
              <p className="text-slate-400">Revise os detalhes antes de confirmar</p>
            </div>

            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 space-y-6">
                {/* Barbearia */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-700">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 mb-1">Barbearia</p>
                    <p className="text-white font-semibold">{barbeariaAtual?.nome}</p>
                    <p className="text-sm text-slate-400">{barbeariaAtual?.endereco}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 p-0 h-auto mt-1"
                      onClick={() => barbeariaAtual && abrirGoogleMaps(barbeariaAtual.endereco, barbeariaAtual.latitude, barbeariaAtual.longitude)}
                    >
                      <MapPin className="w-3 h-3 mr-1" />
                      Ver no Google Maps
                    </Button>
                  </div>
                </div>

                {/* Profissional */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-700">
                  <Avatar className="w-12 h-12 border-2 border-emerald-500">
                    <AvatarImage src={profissionalAtual?.foto} alt={profissionalAtual?.nome} />
                    <AvatarFallback>{profissionalAtual?.nome[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 mb-1">Profissional</p>
                    <p className="text-white font-semibold">{profissionalAtual?.nome}</p>
                    <p className="text-sm text-slate-400">{profissionalAtual?.especialidade}</p>
                  </div>
                </div>

                {/* Serviço */}
                <div className="flex items-start gap-4 pb-6 border-b border-slate-700">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Scissors className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 mb-1">Serviço</p>
                    <p className="text-white font-semibold">{servicoAtual?.nome}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-slate-400">{servicoAtual?.duracao}</span>
                      <span className="text-emerald-400 font-bold">R$ {servicoAtual?.preco}</span>
                    </div>
                  </div>
                </div>

                {/* Horário */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500 mb-1">Data e Horário</p>
                    <p className="text-white font-semibold">{diaSelecionado.completo}</p>
                    <p className="text-xl text-emerald-400 font-bold mt-1">{horarioSelecionado}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                onClick={() => setEtapa("busca")}
              >
                Cancelar
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/20"
                onClick={confirmarAgendamento}
              >
                <Check className="w-5 h-5 mr-2" />
                Confirmar Agendamento
              </Button>
            </div>

            <p className="text-center text-sm text-slate-500">
              Você receberá lembretes automáticos 24h e 1h antes do horário agendado
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      {etapa !== "inicial" && (
        <footer className="border-t border-slate-800 bg-black/50 mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-slate-500 text-sm">
              <p>© 2024 BarbeariaFácil - Agende com um clique.</p>
              <p className="mt-2">Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
