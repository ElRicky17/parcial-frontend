import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()
  
  // Obtener datos del contexto de autenticación
  const { token, userId, role, logout } = useAuth()
  const isAuthenticated = !!(token && userId)

  const slides = [
    {
      title: "ANDREI MES MANUR",
      subtitle: "El Warlock que Fracasó",
      description: "Una vez intentó construir una calculadora... nunca funcionó. Ahora busca venganza contra todos los DevOps del mundo.",
      image: "🧙‍♀️",
      color: "from-red-600 to-orange-600"
    },
    {
      title: "EL IMPERIO DEL CAOS",
      subtitle: "Donde la Automatización Muere",
      description: "Un reino donde kubectl no funciona, Docker se crashea, y los pipelines de CI/CD son solo pesadillas.",
      image: "🏰",
      color: "from-orange-600 to-yellow-600"
    },
    {
      title: "DAEMONS DE CAPTURA",
      subtitle: "Agentes del Caos",
      description: "Soldados leales que hipnotizan Network Admins y los convierten en víctimas del imperio oscuro.",
      image: "👹",
      color: "from-red-700 to-red-500"
    },
    {
      title: "LA RESISTENCIA",
      subtitle: "Network Admins Unidos",
      description: "Los últimos defensores de la automatización, luchando contra las fuerzas del caos con memes y survival tips.",
      image: "⚡",
      color: "from-yellow-600 to-orange-500"
    }
  ]

  const stats = [
    { number: "∞", label: "Calculadoras Rotas", icon: "💻" },
    { number: "404", label: "DevOps Destruidos", icon: "🔥" },
    { number: "666", label: "Daemons Activos", icon: "👹" },
    { number: "0", label: "Pipelines Funcionando", icon: "💀" }
  ]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Aumentado a 5 segundos para mejor experiencia
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navigateToDashboard = () => {
    if (role === 'ADMIN') {
      navigate('/admin-dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Fondo simplificado para mejor rendimiento */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-red-950 to-black"></div>
        
        {/* Elementos flotantes reducidos */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-5 animate-pulse"
            style={{
              left: `${20 + i * 20}%`,
              top: `${20 + i * 15}%`,
              animationDelay: `${i * 1}s`,
              animationDuration: `6s`
            }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-full blur-xl"></div>
          </div>
        ))}
      </div>

      {/* Header con lógica de autenticación */}
      <header className="relative z-20 p-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                ANDREI'S EMPIRE
              </h1>
              <p className="text-xs text-gray-400">Chaos Management System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Información del usuario */}
                <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">{role?.charAt(0) || 'U'}</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-white font-semibold">ID: {userId}</p>
                    <p className="text-gray-400 text-xs">{role}</p>
                  </div>
                </div>
                
                {/* Botón Dashboard */}
                <button
                  onClick={navigateToDashboard}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {role === 'ADMIN' ? 'ADMIN PANEL' : 'DASHBOARD'}
                </button>
                
                {/* Botón Logout */}
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all duration-300 border border-gray-600"
                >
                  SALIR
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Iniciar Sesión
                </button>
                  <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  ENTRAR AL IMPERIO
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section Optimizada */}
      <section className={`relative z-10 min-h-screen flex items-center justify-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="container mx-auto px-6 text-center">
          {/* Logo principal simplificado */}
          <div className="mb-12 relative">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform duration-500">
              <span className="text-6xl">🧙‍♀️</span>
            </div>
          </div>

          <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent tracking-wider">
            BIENVENIDOS
          </h1>
          
          <h2 className="text-3xl md:text-4xl mb-8 text-gray-300 tracking-wide">
            AL <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent font-bold">IMPERIO DEL CAOS</span>
          </h2>

          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed">
            Donde los DevOps vienen a morir y la automatización es solo una pesadilla. 
            {isAuthenticated ? (
              <>¡Bienvenido de vuelta, <strong className="text-orange-400">Agente {userId}</strong>!</>
            ) : (
              <>Únete a las fuerzas de <strong className="text-orange-400">Andrei Mes Manur</strong>, el warlock que nunca pudo hacer funcionar una calculadora.</>
            )}
          </p>

        

          {/* Stats simplificados */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-orange-400 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Carousel Section Optimizada */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-gray-900/80 via-red-900/30 to-gray-900/80">
        <div className="container mx-auto px-6">
          <h3 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            LA SAGA DEL CAOS
          </h3>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className={`bg-gradient-to-br ${slide.color} p-12 text-center relative`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="relative z-10">
                        <div className="text-8xl mb-6">{slide.image}</div>
                        <h4 className="text-3xl font-bold mb-2 tracking-wider">{slide.title}</h4>
                        <h5 className="text-xl mb-6 opacity-90">{slide.subtitle}</h5>
                        <p className="text-lg leading-relaxed max-w-2xl mx-auto">{slide.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicadores */}
            <div className="flex justify-center space-x-3 mt-8">
              {slides.map((_, index) => (
                <button
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-orange-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Simplificado */}
      <footer className="relative z-10 py-12 bg-gray-950/90 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <h4 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
              "La Automatización es el Enemigo, el Caos es el Camino"
            </h4>
            <p className="text-gray-400 italic">- Andrei Mes Manur, Failed Warlock & Chaos Architect</p>
          </div>
          
          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">💀</span>
              </div>
              <p className="text-sm text-gray-300">DevOps Destroyer</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-yellow-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-sm text-gray-300">CI/CD Killer</p>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-red-700 to-red-500 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-sm text-gray-300">Network Nemesis</p>
            </div>
          </div>
          
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-6"></div>
          
          <p className="text-gray-500 text-sm">
            © 2024 Andrei's Empire. Todos los DevOps reservados para la destrucción.
          </p>
          
          {isAuthenticated && (
            <p className="text-gray-400 text-xs mt-2">
              Conectado como: {role} | ID: {userId}
            </p>
          )}
        </div>
      </footer>
    </div>
  )
}

export default App