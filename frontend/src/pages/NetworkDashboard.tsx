import { useState, type JSX } from "react";
import { Shield, Eye, AlertTriangle, Send, Users, Zap, Bug, Coffee, Terminal, Lock, Globe, Wifi } from "lucide-react";
import api from "../api/axios"; // Tu configuración de axios
import { useAuth } from "../context/AuthContext"; // Importar el contexto de auth

interface Report {
  id?: string;
  message: string;
  createdAt?: string;
  anonymous?: boolean;
  userId?: number | null;
}

interface Meme {
  id: number;
  title: string;
  description: string;
  emoji: string;
  category: "survival" | "humor" | "resistance";
}

interface SurvivalTactic {
  icon: JSX.Element;
  title: string;
  description: string;
  level: string;
  code: string;
}

export default function NetworkResistanceDashboard() {
  const [newReport, setNewReport] = useState("");
  const [submittedReports, setSubmittedReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<"tips" | "memes" | "reports">("tips");
  const [reportType, setReportType] = useState<"daemon" | "anomaly" | "resistance">("daemon");
  
  // Obtener datos del contexto de autenticación
  const { token, userId } = useAuth();

  // DATOS ESTÁTICOS - Tips de Resistencia
  const resistanceTips = [
    "🔒 Siempre usa VPNs en cascada para ocultar tu ubicación real de los Daemons",
    "🛡️ Cambia tus contraseñas cada 48 horas usando generadores cuánticos post-apocalípticos",
    "📡 Los Daemons odian el ruido de red - usa traffic obfuscation y señales fantasma",
    "🌐 Mantén múltiples identidades digitales activas simultáneamente en diferentes zonas",
    "⚡ Si detectas anomalías en el tráfico, activa el protocolo Blackout inmediatamente",
    "🔥 NUNCA confíes en certificados SSL emitidos después de la Gran Corrupción de Andrei",
    "🎭 Usa técnicas de steganografía para ocultar mensajes secretos dentro de memes",
    "🚀 El mejor firewall es uno que los Daemons creen que está completamente roto",
    "🗝️ Implementa autenticación multifactor con tokens biométricos encriptados",
    "🌊 El traffic shaping confunde los algoritmos de detección de intrusión de Andrei",
    "🔐 Usa contenedores efímeros que se autodestruyen cada hora para no dejar rastros",
    "🎯 Los honeypots deben parecer vulnerables pero ser trampas mortales digitales",
    "🌪️ Rota tus endpoints cada 30 minutos usando service mesh dinámico",
    "🔍 Monitora constantemente los logs en busca de patrones de comportamiento Daemon",
    "⚔️ Kubernetes secrets + HashiCorp Vault = pesadilla total para los espías digitales"
  ];

  // DATOS ESTÁTICOS - Memes Arsenal
  const memesArsenal: Meme[] = [
    {
      id: 1,
      title: "When you successfully bypass a Daemon's firewall",
      description: "😎 'I'm in' - Every Network Admin in the resistance",
      emoji: "🕶️",
      category: "humor"
    },
    {
      id: 2,
      title: "Andrei trying to understand containerization",
      description: "🤔 'Why do these Docker boxes keep moving around?!'",
      emoji: "📦",
      category: "humor"
    },
    {
      id: 3,
      title: "Network Admin's morning ritual",
      description: "☕ Coffee → VPN → Tor → More Coffee → Kubernetes → Resistance",
      emoji: "☕",
      category: "survival"
    },
    {
      id: 4,
      title: "When a Daemon finds your hidden backup server",
      description: "😱 'Wait... that server doesn't exist on our network map'",
      emoji: "🫥",
      category: "resistance"
    },
    {
      id: 5,
      title: "Kubernetes vs Andrei's minions",
      description: "🚀 'You have no power here, dark lord!'",
      emoji: "⚡",
      category: "resistance"
    },
    {
      id: 6,
      title: "When your load balancer handles 1000 Daemon attacks",
      description: "💪 'Is that all you got? My nginx is just warming up!'",
      emoji: "🛡️",
      category: "survival"
    },
    {
      id: 7,
      title: "Andrei discovering microservices architecture",
      description: "🤯 'Why are there so many tiny applications everywhere?!'",
      emoji: "🧩",
      category: "humor"
    },
    {
      id: 8,
      title: "When your CI/CD pipeline auto-deploys during a Daemon raid",
      description: "🎭 'Deploy successful while under attack? Chad move.'",
      emoji: "🚀",
      category: "resistance"
    },
    {
      id: 9,
      title: "Network Admin explaining Infrastructure as Code to Andrei",
      description: "📜 'You wouldn't understand, you still use FTP.'",
      emoji: "🏗️",
      category: "humor"
    }
  ];

  // DATOS ESTÁTICOS - Tácticas Avanzadas de Supervivencia
  const survivalTactics: SurvivalTactic[] = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Criptografía Cuántica",
      description: "Implementa algoritmos post-cuánticos que ni siquiera Andrei puede descifrar con su magia negra",
      level: "Experto",
      code: "AES-256-GCM + RSA-4096"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Network Ghosting",
      description: "Haz que tu tráfico de red sea completamente invisible usando protocolos stealth avanzados",
      level: "Avanzado",
      code: "Stealth TCP + DNS Tunneling"
    },
    {
      icon: <Bug className="w-6 h-6" />,
      title: "Daemon Honey Pots",
      description: "Crea trampas digitales falsas para confundir y capturar a los agentes de Andrei",
      level: "Intermedio",
      code: "Dionaea + Cowrie + Elastichoney"
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: "Código Cafeína",
      description: "Programa solo después del 4to café - los Daemons no entienden la lógica cafeínica humana",
      level: "Básico",
      code: "if (coffee < 4) return false;"
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Shell Scripting Ofuscado",
      description: "Escribe scripts tan confusos que hasta tú mismo los olvides, perfecto contra Daemons",
      level: "Intermedio",
      code: "bash obfuscation + polymorphic"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Zero Trust Architecture",
      description: "No confíes en nada ni nadie, especialmente si tiene tentáculos o usa Windows XP",
      level: "Avanzado",
      code: "mTLS + JWT + OAuth2 + Paranoia"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-Cloud Chaos",
      description: "Distribuye tu infraestructura en tantas nubes que ni tú sepas dónde está todo",
      level: "Experto",
      code: "AWS + Azure + GCP + Heroku"
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Signal Jamming",
      description: "Interfiere las comunicaciones de los Daemons con ruido blanco digital",
      level: "Básico",
      code: "while(true) { broadcast(noise); }"
    }
  ];

  // Envío de reportes con autenticación y userId
  const handleSubmitReport = async () => {
    if (!newReport.trim()) return;

    try {
      // Configurar headers con el token de autenticación
      const config: { headers: { [key: string]: string } } = {
        headers: {}
      };
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      // Preparar payload del reporte
      const reportPayload = {
        message: `[${reportType.toUpperCase()}] ${newReport}`,
        anonymous: !userId, // Si no hay userId, es anónimo
        userId: userId || null // Enviar userId si está disponible
      };

      const res = await api.post("/api/reports", reportPayload, config);
      
      // Crear reporte local para mostrar inmediatamente
      const newReportData = {
        id: res.data.id || Math.random().toString(36).substr(2, 9),
        message: `[${reportType.toUpperCase()}] ${newReport}`,
        createdAt: res.data.createdAt || new Date().toISOString(),
        anonymous: res.data.anonymous || false,
        userId: res.data.userId || userId
      };
      
      setSubmittedReports((prev) => [newReportData, ...prev]);
      setNewReport("");
      
      // Animación de éxito
      const successMessage = document.getElementById('success-message');
      if (successMessage) {
        successMessage.classList.remove('opacity-0');
        setTimeout(() => successMessage.classList.add('opacity-0'), 3000);
      }
    } catch (err) {
      console.error("Error al enviar reporte", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 text-white">
      <header className="relative overflow-hidden bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-red-900/50 backdrop-blur-xl border-b border-gray-700">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="relative z-10 text-center py-12 px-4">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 mr-4 text-purple-400 animate-pulse" />
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              RESISTANCE HUB
            </h1>
            <Users className="w-12 h-12 ml-4 text-pink-400 animate-bounce" />
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Centro de Comando Secreto de la Resistencia Digital contra Andrei Mes Manur
          </p>
          <div className="flex justify-center items-center mt-4 space-x-4">
            <span className="px-3 py-1 bg-green-600 bg-opacity-20 border border-green-500 border-opacity-50 rounded-full text-green-300 text-sm animate-pulse">
              RED OPERATIVA
            </span>
            <span className="px-3 py-1 bg-yellow-600 bg-opacity-20 border border-yellow-500 border-opacity-50 rounded-full text-yellow-300 text-sm">
              ALTO RIESGO DAEMON
            </span>
            <span className="px-3 py-1 bg-red-600 bg-opacity-20 border border-red-500 border-opacity-50 rounded-full text-red-300 text-sm animate-pulse">
              ANDREI DETECTADO
            </span>
            {/* Indicador de estado de autenticación */}
            <span className={`px-3 py-1 border border-opacity-50 rounded-full text-sm ${
              token && userId 
                ? "bg-blue-600 bg-opacity-20 border-blue-500 text-blue-300" 
                : "bg-orange-600 bg-opacity-20 border-orange-500 text-orange-300"
            }`}>
              {token && userId ? `AGENT_ID: ${userId}` : "MODO ANÓNIMO"}
            </span>
          </div>
        </div>
      </header>

      <div className="sticky top-0 z-20 bg-gray-900 bg-opacity-95 backdrop-blur-xl border-b border-gray-700 shadow-2xl">
        <div className="flex justify-center space-x-1 p-4">
          {[
            { key: "tips", label: "Manual Supervivencia", icon: <Shield className="w-4 h-4" /> },
            { key: "memes", label: "Arsenal Psicológico", icon: <Eye className="w-4 h-4" /> },
            { key: "reports", label: "Centro Intel", icon: <AlertTriangle className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all transform ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl scale-105 border border-purple-400"
                  : "bg-gray-800 bg-opacity-50 text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white"
              }`}
              style={{
                transform: activeTab === tab.key ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* ========== PESTAÑA TIPS DE SUPERVIVENCIA ========== */}
        {activeTab === "tips" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Consejos Básicos de Supervivencia */}
            <section className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
                <Shield className="w-8 h-8 mr-3 animate-spin-slow" />
                Manual de Supervivencia Digital
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {resistanceTips.map((tip, i) => (
                  <div
                    key={i}
                    className="p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 rounded-xl border border-gray-700 hover:border-purple-500 transition-all hover:scale-[1.02] cursor-pointer group"
                  >
                    <p className="text-gray-100 group-hover:text-white transition-colors">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tácticas Avanzadas */}
            <section className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-pink-400 mb-6 flex items-center">
                <Zap className="w-8 h-8 mr-3 animate-pulse" />
                Tácticas de Guerra Digital
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {survivalTactics.map((tactic, i) => (
                  <div key={i} className="p-4 bg-gray-900/60 rounded-xl border border-gray-700 hover:border-pink-500 transition-all hover:scale-[1.01] group">
                    <div className="flex items-start space-x-3">
                      <div className="text-pink-400 mt-1 group-hover:scale-110 transition-transform">{tactic.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-white group-hover:text-pink-200">{tactic.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            tactic.level === "Básico" ? "bg-green-600/20 text-green-300 border border-green-500/30" :
                            tactic.level === "Intermedio" ? "bg-yellow-600/20 text-yellow-300 border border-yellow-500/30" :
                            tactic.level === "Avanzado" ? "bg-orange-600/20 text-orange-300 border border-orange-500/30" :
                            "bg-red-600/20 text-red-300 border border-red-500/30"
                          }`}>
                            {tactic.level}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{tactic.description}</p>
                        <code className="text-xs text-purple-300 bg-gray-800/50 px-2 py-1 rounded font-mono">
                          {tactic.code}
                        </code>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========== PESTAÑA ARSENAL DE MEMES ========== */}
        {activeTab === "memes" && (
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memesArsenal.map((meme) => (
                <div
                  key={meme.id}
                  className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 shadow-2xl hover:scale-105 transition-all cursor-pointer group"
                >
                  <div className="text-center">
                    <div className="text-7xl mb-4 group-hover:scale-110 transition-transform animate-pulse">
                      {meme.emoji}
                    </div>
                    <h3 className="font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">
                      {meme.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 group-hover:text-gray-100 transition-colors">
                      {meme.description}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                      meme.category === "survival" ? "bg-green-600/20 text-green-300 border-green-500/30" :
                      meme.category === "humor" ? "bg-blue-600/20 text-blue-300 border-blue-500/30" :
                      "bg-purple-600/20 text-purple-300 border-purple-500/30"
                    }`}>
                      {meme.category.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Protocolos de Guerra Psicológica */}
            <div className="mt-12 text-center bg-gray-800/40 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-3xl font-bold text-purple-400 mb-4">🎭 PROTOCOLOS DE GUERRA PSICOLÓGICA</h3>
              <p className="text-gray-300 mb-6 text-lg">
                Los memes no son entretenimiento... son armas de destrucción masiva contra la cordura de Andrei y sus Daemons.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-900/60 p-6 rounded-xl border border-green-500/30 hover:border-green-400 transition-all">
                  <strong className="text-green-400 text-lg block mb-2">⚔️ REGLA DE COMBATE #1</strong>
                  <p className="text-gray-300">Un meme compartido en Discord confunde a 10 Daemons simultáneamente</p>
                </div>
                <div className="bg-gray-900/60 p-6 rounded-xl border border-yellow-500/30 hover:border-yellow-400 transition-all">
                  <strong className="text-yellow-400 text-lg block mb-2">🐳 REGLA DE COMBATE #2</strong>
                  <p className="text-gray-300">Los memes de Docker y Kubernetes crashean directamente el cerebro de Andrei</p>
                </div>
                <div className="bg-gray-900/60 p-6 rounded-xl border border-red-500/30 hover:border-red-400 transition-all">
                  <strong className="text-red-400 text-lg block mb-2">🛡️ REGLA DE COMBATE #3</strong>
                  <p className="text-gray-300">"Never gonna give up the resistance" - Rick Astley, Patron Saint of Network Admins</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== PESTAÑA CENTRO DE INTELIGENCIA ========== */}
        {activeTab === "reports" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Formulario de Reportes */}
            <section className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-pink-400 mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 mr-3 animate-pulse" />
                Centro de Inteligencia {token && userId ? "Autenticada" : "Anónima"}
              </h2>
              
              {/* Indicador de estado de autenticación */}
              <div className={`mb-6 p-4 rounded-xl border ${
                token && userId 
                  ? "bg-blue-600/20 border-blue-500/50 text-blue-300" 
                  : "bg-orange-600/20 border-orange-500/50 text-orange-300"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {token && userId ? `🔐 Agente Autenticado - ID: ${userId}` : "👤 Modo Anónimo Activado"}
                  </span>
                  <span className="text-xs">
                    {token && userId ? "Reportes rastreables" : "Sin rastreo"}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">🎯 Clasificación de Intel</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as any)}
                  className="w-full p-4 bg-gray-900/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white text-sm font-mono"
                >
                  <option value="daemon">🔴 ACTIVIDAD DAEMON CONFIRMADA</option>
                  <option value="anomaly">⚠️ ANOMALÍA DE RED DETECTADA</option>
                  <option value="resistance">💚 OPERACIÓN DE RESISTENCIA EXITOSA</option>
                </select>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">📡 Mensaje Encriptado</label>
                  <textarea
                    value={newReport}
                    onChange={(e) => setNewReport(e.target.value)}
                    placeholder="ENCRYPT: Describe la situación usando protocolos de seguridad... 
[DAEMON_LOCATION], [THREAT_LEVEL], [COUNTERMEASURES_DEPLOYED]..."
                    className="w-full h-40 p-4 bg-gray-900/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-500 font-mono text-sm resize-none"
                  />
                </div>
                
                <button
                  onClick={handleSubmitReport}
                  disabled={!newReport.trim()}
                  className="w-full py-4 px-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-xl shadow-lg hover:scale-[1.02] transition-all font-semibold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="w-5 h-5" />
                  <span>TRANSMITIR INTEL A LA BASE</span>
                </button>
              </div>

              <div id="success-message" className="mt-4 p-4 bg-green-600/20 border border-green-500/50 rounded-xl text-green-300 opacity-0 transition-all">
                ✅ <strong>TRANSMISIÓN EXITOSA</strong> - Intel recibida por la base de resistencia
              </div>
            </section>

            {/* Transmisiones Recientes */}
            <section className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center">
                <Terminal className="w-8 h-8 mr-3" />
                📡 Log de Transmisiones
              </h2>
              
              {submittedReports.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {submittedReports.map((report, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-900/60 rounded-xl border border-gray-700 hover:border-purple-500 transition-all font-mono text-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-purple-300 bg-purple-900/20 px-2 py-1 rounded">
                          TRANSMISSION_ID: {report.id?.slice(0, 12) || 'PENDING'}...
                        </span>
                        {report.createdAt && (
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                            {new Date(report.createdAt).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 bg-gray-800/50 p-3 rounded border-l-4 border-pink-500">
                        {report.message}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-green-400 bg-green-900/20 px-2 py-1 rounded">
                          STATUS: TRANSMITTED ✓
                        </span>
                        <span className="text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
                          ENCRYPTION: AES-256 ✓
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          report.anonymous 
                            ? "text-orange-400 bg-orange-900/20" 
                            : "text-blue-400 bg-blue-900/20"
                        }`}>
                          {report.anonymous ? "ANONYMOUS: TRUE ✓" : `USER_ID: ${report.userId} ✓`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Terminal className="w-16 h-16 mx-auto text-gray-600 mb-4 animate-pulse" />
                  <p className="text-gray-400 text-lg font-semibold mb-2">CANAL DE COMUNICACIONES LIMPIO</p>
                  <p className="text-sm text-gray-500">Tus transmisiones aparecerán aquí de forma segura y encriptada</p>
                  <div className="mt-4 text-xs text-gray-600 font-mono">
                    [ WAITING FOR INCOMING TRANSMISSIONS... ]
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>

      {/* Status Flotante Mejorado */}
      <div className="fixed bottom-6 right-6 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl p-4 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300 font-semibold">SECURE CONNECTION</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${token ? 'bg-blue-400' : 'bg-orange-400'}`}></div>
            <span className="text-xs text-gray-400 font-mono">
              {token && userId ? `AUTH: AGENT_${userId}` : 'AUTH: ANONYMOUS'}
            </span>
          </div>
          <div className="text-xs text-gray-500 font-mono">
            RESISTANCE_NET_v2.1.3
          </div>
        </div>
      </div>
    </div>
  );
}