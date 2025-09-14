import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Report {
  id: string;
  message: string;
  createdAt: string;
  anonymous: boolean;
  userId?: string;
}

export default function DaemonDashboard() {
  const { userId, token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    totalVictims: 0,
    networkAdmins: 0,
    myReports: 0,
    totalReports: 0
  });
  
  // Estados para formularios
  const [newVictim, setNewVictim] = useState({ email: "", password: "" });
  const [newReport, setNewReport] = useState({ 
    message: "", 
    anonymous: false 
  });
  const [assignAction, setAssignAction] = useState({ 
    daemonId: "", 
    action: "" 
  });

  // Estado para UI
  const [activeSection, setActiveSection] = useState<'victims' | 'reports' | 'assign'>('victims');
  const [loading, setLoading] = useState(true);

  // Configuración de headers con token
  const getAuthConfig = () => {
    if (!token) return {};
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Cargar usuarios y reportes
      const [usersRes, reportsRes] = await Promise.all([
        api.get("/auth/allUsers", getAuthConfig()),
        api.get("/api/reports", getAuthConfig()),
      ]);

      const processedUsers = Array.isArray(usersRes.data) ? usersRes.data.map(user => ({
        id: user.id.toString(),
        email: user.email,
        role: user.role
      })) : [];

      const processedReports = Array.isArray(reportsRes.data) ? reportsRes.data.map(report => ({
        id: report.id.toString(),
        message: report.message,
        createdAt: report.createdAt,
        anonymous: report.anonymous,
        userId: report.userId?.toString() || undefined
      })) : [];

      setUsers(processedUsers);
      setReports(processedReports);

      // Filtrar mis reportes
      const userReports = processedReports.filter(report => report.userId === userId);
      setMyReports(userReports);

      // Calcular estadísticas
      const networkAdmins = processedUsers.filter(u => u.role === 'NETWORK_ADMIN').length;
      setStats({
        totalVictims: networkAdmins,
        networkAdmins: networkAdmins,
        myReports: userReports.length,
        totalReports: processedReports.length
      });

    } catch (err: any) {
      console.error("Error cargando datos:", err);
      alert(`Error cargando datos: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Registrar nueva víctima (NETWORK_ADMIN)
  const handleRegisterVictim = async () => {
    if (!newVictim.email || !newVictim.password) {
      alert("Por favor completa email y contraseña");
      return;
    }

    try {
      await api.post("/api/daemon/register", {
        email: newVictim.email,
        password: newVictim.password
      }, getAuthConfig());
      
      alert("Víctima capturada exitosamente!");
      setNewVictim({ email: "", password: "" });
      await fetchAllData(); // Recargar datos
    } catch (err: any) {
      console.error("Error registrando víctima:", err);
      alert(`Error al registrar la víctima: ${err.response?.data?.message || err.message}`);
    }
  };

  // Enviar nuevo reporte
  const handleSubmitReport = async () => {
    if (!newReport.message.trim()) {
      alert("Por favor ingresa un mensaje para el reporte");
      return;
    }

    try {
      const reportData = {
        message: newReport.message,
        anonymous: newReport.anonymous,
        userId: newReport.anonymous ? null : userId
      };
      
      await api.post("/api/reports", reportData, getAuthConfig());
      
      alert("Reporte enviado exitosamente");
      setNewReport({ message: "", anonymous: false });
      await fetchAllData(); // Recargar datos
    } catch (err: any) {
      console.error("Error enviando reporte:", err);
      alert(`Error al enviar reporte: ${err.response?.data?.message || err.message}`);
    }
  };

  // Asignar recompensa/castigo
  const handleAssignAction = async () => {
    if (!assignAction.daemonId || !assignAction.action) {
      alert("Por favor completa daemon ID y acción");
      return;
    }

    try {
      const response = await api.post(
        `/api/daemon/assign/${assignAction.daemonId}`,
        null,
        {
          ...getAuthConfig(),
          params: { action: assignAction.action }
        }
      );
      
      alert(`Acción asignada: ${response.data}`);
      setAssignAction({ daemonId: "", action: "" });
    } catch (err: any) {
      console.error("Error asignando acción:", err);
      alert(`Error al asignar acción: ${err.response?.data?.message || err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-xl">Cargando panel de control...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black text-white p-6 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse -top-20 -left-20"></div>
        <div className="absolute w-[30rem] h-[30rem] bg-orange-600/20 rounded-full blur-3xl animate-pulse delay-700 bottom-0 right-0"></div>
      </div>

      {/* Header */}
      <header className="relative text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-wider bg-gradient-to-r from-red-500 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
          Daemon Control Panel
        </h1>
        <p className="text-gray-400 mt-2 italic">"Caos, fuego y control absoluto"</p>
      </header>

      {/* Estadísticas principales */}
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-xl text-center">
          <div className="text-3xl font-bold">{stats.totalVictims}</div>
          <div className="text-red-200">Víctimas Capturadas</div>
        </div>
        <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-6 rounded-xl text-center">
          <div className="text-3xl font-bold">{stats.networkAdmins}</div>
          <div className="text-orange-200">Network Admins</div>
        </div>
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 p-6 rounded-xl text-center">
          <div className="text-3xl font-bold">{stats.myReports}</div>
          <div className="text-yellow-200">Mis Reportes</div>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 rounded-xl text-center">
          <div className="text-3xl font-bold">{stats.totalReports}</div>
          <div className="text-purple-200">Total Sistema</div>
        </div>
      </div>

      {/* Navegación */}
      <div className="relative mb-8">
        <nav className="flex space-x-4 bg-gray-900/80 p-2 rounded-xl backdrop-blur-xl">
          {[
            { key: 'victims', label: 'Capturar Víctimas', icon: '🧑‍💻' },
            { key: 'reports', label: 'Mis Reportes', icon: '📜' },
            { key: 'assign', label: 'Asignar Acciones', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeSection === tab.key
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Sección: Capturar Víctimas */}
      {activeSection === 'victims' && (
        <div className="relative space-y-6">
          <div className="bg-gray-900/80 border border-orange-600/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-orange-400 mb-6">Capturar Nueva Víctima</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  value={newVictim.email}
                  onChange={(e) => setNewVictim({ ...newVictim, email: e.target.value })}
                  placeholder="Email de la víctima"
                  className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                />
                <input
                  type="password"
                  value={newVictim.password}
                  onChange={(e) => setNewVictim({ ...newVictim, password: e.target.value })}
                  placeholder="Contraseña"
                  className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-white"
                />
              </div>
              <button
                onClick={handleRegisterVictim}
                className="w-full py-3 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 rounded-xl font-bold hover:scale-[1.02] transition-all"
              >
                Capturar Víctima
              </button>
            </div>
          </div>

          {/* Lista de víctimas capturadas */}
          <div className="bg-gray-900/80 border border-red-600/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-bold text-red-400 mb-4">Víctimas Capturadas ({stats.networkAdmins})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {users.filter(u => u.role === 'NETWORK_ADMIN').map(victim => (
                <div key={victim.id} className="flex justify-between items-center p-3 bg-gray-800/60 rounded-xl border border-gray-700">
                  <div>
                    <span className="font-medium">{victim.email}</span>
                    <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      NETWORK_ADMIN
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">ID: {victim.id.substring(0, 8)}...</span>
                </div>
              ))}
              {users.filter(u => u.role === 'NETWORK_ADMIN').length === 0 && (
                <p className="text-gray-400 text-center py-4">Aún no has capturado víctimas</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sección: Mis Reportes */}
      {activeSection === 'reports' && (
        <div className="relative space-y-6">
          <div className="bg-gray-900/80 border border-yellow-600/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">Enviar Nuevo Reporte</h2>
            <div className="space-y-4">
              <textarea
                value={newReport.message}
                onChange={(e) => setNewReport({ ...newReport, message: e.target.value })}
                placeholder="Escribe tu reporte del inframundo..."
                className="w-full h-32 px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white resize-none"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={newReport.anonymous}
                    onChange={(e) => setNewReport({ ...newReport, anonymous: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Enviar como anónimo</span>
                </label>
                <button
                  onClick={handleSubmitReport}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-xl font-bold hover:scale-[1.02] transition-all"
                >
                  Enviar Reporte
                </button>
              </div>
            </div>
          </div>

          {/* Lista de mis reportes */}
          <div className="bg-gray-900/80 border border-yellow-600/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">Mis Reportes ({myReports.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {myReports.map(report => (
                <div key={report.id} className="p-4 bg-gray-800/60 rounded-xl border border-gray-700">
                  <p className="text-white mb-2">{report.message}</p>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>{formatDate(report.createdAt)}</span>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded ${
                        report.anonymous ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                      }`}>
                        {report.anonymous ? "Anónimo" : "Público"}
                      </span>
                      <span>ID: {report.id.substring(0, 8)}...</span>
                    </div>
                  </div>
                </div>
              ))}
              {myReports.length === 0 && (
                <p className="text-gray-400 text-center py-8">Aún no tienes reportes</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sección: Asignar Acciones */}
      {activeSection === 'assign' && (
        <div className="relative space-y-6">
          <div className="bg-gray-900/80 border border-purple-600/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Asignar Recompensa/Castigo</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={assignAction.daemonId}
                  onChange={(e) => setAssignAction({ ...assignAction, daemonId: e.target.value })}
                  className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                >
                  <option value="">Seleccionar Daemon</option>
                  {users.filter(u => u.role === 'DAEMON').map(daemon => (
                    <option key={daemon.id} value={daemon.id}>
                      {daemon.email}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={assignAction.action}
                  onChange={(e) => setAssignAction({ ...assignAction, action: e.target.value })}
                  placeholder="Acción (ej: recompensa, castigo)"
                  className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                />
              </div>
              <button
                onClick={handleAssignAction}
                className="w-full py-3 bg-gradient-to-r from-purple-600 via-red-600 to-pink-600 rounded-xl font-bold hover:scale-[1.02] transition-all"
              >
                Asignar Acción
              </button>
            </div>
          </div>

          {/* Lista de daemons disponibles */}
          <div className="bg-gray-900/80 border border-purple-600/40 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
            <h3 className="text-xl font-bold text-purple-400 mb-4">Daemons Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.filter(u => u.role === 'DAEMON').map(daemon => (
                <div key={daemon.id} className="p-3 bg-gray-800/60 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{daemon.email}</span>
                    <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">
                      DAEMON
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">ID: {daemon.id.substring(0, 8)}...</span>
                </div>
              ))}
              {users.filter(u => u.role === 'DAEMON').length === 0 && (
                <p className="text-gray-400 text-center py-4 md:col-span-2">No hay otros daemons disponibles</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer con información adicional */}
      <div className="relative mt-12 text-center text-gray-500 text-sm">
        <p>Daemon Control Panel • Última actualización: {new Date().toLocaleString('es-ES')}</p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="flex items-center gap-1">
            Estado: Conectado
          </span>
          <span className="flex items-center gap-1">
            Total registros: {users.length + reports.length}
          </span>
          <span className="flex items-center gap-1">
            Mi ID: {userId?.toString().substring(0, 8)}...
          </span>
        </div>
      </div>
    </div>
  );
}