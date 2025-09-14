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

export default function AndreiDashboard() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ email: "", password: "", role: "DAEMON" });
  const [newReport, setNewReport] = useState({ 
    message: "", 
    anonymous: false, 
    userId: "" 
  });

  // Estados para filtros y edición
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    anonymous: "all",
    dateFrom: "",
    dateTo: "",
    selectedUser: ""
  });
  
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [editReportData, setEditReportData] = useState({
    message: "",
    anonymous: false,
    userId: ""
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUserData, setEditUserData] = useState({
    email: "",
    role: ""
  });

  // Estados para la vista
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports'>('overview');
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showCreateReportForm, setShowCreateReportForm] = useState(false);

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, reportsRes] = await Promise.all([
        api.get("/auth/allUsers", getAuthConfig()),
        api.get("/api/reports", getAuthConfig()),
      ]);
      
      const processedUsers = Array.isArray(usersRes.data) ? usersRes.data.map(user => ({
        id: user.id.toString(),
        email: user.email,
        role: user.role
      })) : [];
      
      const processedReports = Array.isArray(reportsRes.data) ? reportsRes.data.map(report => {
        const cleanReport = {
          id: report.id.toString(),
          message: report.message,
          createdAt: report.createdAt,
          anonymous: report.anonymous,
          userId: undefined
        };
        
        if (report.userId) {
          cleanReport.userId = report.userId.toString();
        } else if (report.user && report.user.id) {
          cleanReport.userId = report.user.id.toString();
        }
        
        return cleanReport;
      }) : [];
      
      setUsers(processedUsers);
      setReports(processedReports);
      setFilteredReports(processedReports);
      
    } catch (err: any) {
      console.error("Error cargando datos:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("Error de autorización. Por favor inicia sesión nuevamente.");
      } else {
        alert(`Error cargando datos: ${err.response?.data?.message || err.message}`);
      }
      setUsers([]);
      setReports([]);
      setFilteredReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros a los reportes
  useEffect(() => {
    let filtered = [...reports];

    // Filtro por búsqueda en mensaje
    if (filters.search) {
      filtered = filtered.filter(report => 
        report.message.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro por usuario específico
    if (filters.selectedUser) {
      filtered = filtered.filter(report => 
        report.userId === filters.selectedUser
      );
    }

    // Filtro por anonimato
    if (filters.anonymous !== "all") {
      const isAnonymous = filters.anonymous === "anonymous";
      filtered = filtered.filter(report => report.anonymous === isAnonymous);
    }

    // Filtro por fecha
    if (filters.dateFrom) {
      filtered = filtered.filter(report => 
        new Date(report.createdAt) >= new Date(filters.dateFrom)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(report => 
        new Date(report.createdAt) <= new Date(filters.dateTo + "T23:59:59")
      );
    }

    setFilteredReports(filtered);
  }, [reports, filters]);

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token]);

  const createUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert("Por favor completa email y contraseña");
      return;
    }

    try {
      await api.post("/auth/register", {
        email: newUser.email,
        password: newUser.password
      }, getAuthConfig());
      
      alert("Usuario creado exitosamente");
      setNewUser({ email: "", password: "", role: "DAEMON" });
      setShowCreateUserForm(false);
      await fetchData();
    } catch (err: any) {
      console.error("Error creando usuario:", err);
      alert(`Error creando usuario: ${err.response?.data?.message || err.message}`);
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    try {
      // El backend espera solo el string del rol sin comillas JSON
      await api.put(`/auth/update/${id}`, role, {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          'Content-Type': 'text/plain'
        }
      });
      
      alert(`Usuario actualizado a rol ${role}`);
      await fetchData();
    } catch (err: any) {
      console.error("Error actualizando usuario:", err);
      alert(`Error actualizando usuario: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
    
    try {
      await api.delete(`/auth/delete/${id}`, getAuthConfig());
      alert("Usuario eliminado");
      await fetchData();
    } catch (err: any) {
      console.error("Error eliminando usuario:", err);
      alert(`Error eliminando usuario: ${err.response?.data?.message || err.message}`);
    }
  };

  const createReport = async () => {
    if (!newReport.message) {
      alert("Por favor ingresa un mensaje para el reporte");
      return;
    }

    try {
      const reportData = {
        message: newReport.message,
        anonymous: newReport.anonymous,
        userId: newReport.anonymous ? null : (newReport.userId || null)
      };
      
      await api.post("/api/reports", reportData, getAuthConfig());
      
      alert("Reporte creado exitosamente");
      setNewReport({ message: "", anonymous: false, userId: "" });
      setShowCreateReportForm(false);
      await fetchData();
    } catch (err: any) {
      console.error("Error creando reporte:", err);
      alert(`Error creando reporte: ${err.response?.data?.message || err.message}`);
    }
  };

  const updateReport = async (id: string) => {
    try {
      const reportData = {
        message: editReportData.message,
        anonymous: editReportData.anonymous,
        userId: editReportData.anonymous ? null : (editReportData.userId || null)
      };
      
      await api.put(`/api/reports/${id}`, reportData, getAuthConfig());
      
      alert("Reporte actualizado exitosamente");
      setEditingReport(null);
      await fetchData();
    } catch (err: any) {
      console.error("Error actualizando reporte:", err);
      alert(`Error actualizando reporte: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteReport = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este reporte?")) return;
    
    try {
      await api.delete(`/api/reports/${id}`, getAuthConfig());
      alert("Reporte eliminado");
      await fetchData();
    } catch (err: any) {
      console.error("Error eliminando reporte:", err);
      alert(`Error eliminando reporte: ${err.response?.data?.message || err.message}`);
    }
  };

  const getReportsByUser = async (userId: string) => {
    try {
      const response = await api.get(`/api/reports/user/${userId}`, getAuthConfig());
      const userReports = response.data;
      setFilteredReports(userReports);
      setFilters(prev => ({ ...prev, selectedUser: userId }));
    } catch (err: any) {
      console.error("Error obteniendo reportes del usuario:", err);
      alert(`Error obteniendo reportes: ${err.response?.data?.message || err.message}`);
    }
  };

  const startEditingReport = (report: Report) => {
    setEditingReport(report);
    setEditReportData({
      message: report.message,
      anonymous: report.anonymous,
      userId: report.userId || ""
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      role: "",
      anonymous: "all",
      dateFrom: "",
      dateTo: "",
      selectedUser: ""
    });
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ANDREI': return 'bg-purple-600 text-white';
      case 'DAEMON': return 'bg-orange-600 text-white';
      case 'NETWORK_ADMIN': return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black text-white p-10 flex items-center justify-center">
        <p className="text-xl">Por favor inicia sesión para acceder al dashboard</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black text-white p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-xl">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-950 to-black text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
        Dashboard de Andrei
      </h1>

      {/* Navegación por pestañas */}
      <div className="mb-8">
        <nav className="flex space-x-4 bg-gray-800/50 p-2 rounded-xl">
          {[
            { key: 'overview', label: 'Resumen', icon: '📊' },
            { key: 'users', label: 'Usuarios', icon: '👥' },
            { key: 'reports', label: 'Reportes', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Pestaña de Resumen */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">{users.length}</div>
              <div className="text-blue-200">Total Usuarios</div>
            </div>
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">{reports.length}</div>
              <div className="text-green-200">Total Reportes</div>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">
                {reports.filter(r => r.anonymous).length}
              </div>
              <div className="text-purple-200">Reportes Anónimos</div>
            </div>
            <div className="bg-gradient-to-r from-orange-600 to-orange-800 p-6 rounded-xl text-center">
              <div className="text-3xl font-bold">
                {users.filter(u => u.role === 'ANDREI').length}
              </div>
              <div className="text-orange-200">Administradores</div>
            </div>
          </div>

          {/* Distribución por roles */}
          <div className="bg-gray-800/70 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Distribución por Roles</h3>
            <div className="space-y-2">
              {['ANDREI', 'DAEMON', 'NETWORK_ADMIN'].map(role => {
                const count = users.filter(u => u.role === role).length;
                const percentage = users.length > 0 ? (count / users.length * 100) : 0;
                return (
                  <div key={role} className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor(role)}`}>
                      {role}
                    </span>
                    <div className="flex-1 mx-4 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getRoleColor(role).split(' ')[0]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reportes recientes */}
          <div className="bg-gray-800/70 p-6 rounded-xl">
            <h3 className="text-xl font-semibold mb-4">Reportes Recientes</h3>
            <div className="space-y-3">
              {reports.slice(0, 5).map(report => {
                const user = users.find(u => u.id === report.userId);
                return (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm truncate">{report.message}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDate(report.createdAt)} • {report.anonymous ? "Anónimo" : user?.email || "Usuario desconocido"}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      report.anonymous ? 'bg-blue-600' : 'bg-purple-600'
                    }`}>
                      {report.anonymous ? "Anónimo" : "Público"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pestaña de Usuarios */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Controles de usuarios */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Gestión de Usuarios
              <span className="text-sm font-normal text-gray-400 ml-2">({users.length})</span>
            </h2>
            <button
              onClick={() => setShowCreateUserForm(!showCreateUserForm)}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showCreateUserForm ? "Cancelar" : "Crear Usuario"}
            </button>
          </div>

          {/* Formulario de crear usuario */}
          {showCreateUserForm && (
            <div className="bg-gray-800/70 p-6 rounded-xl">
              <h3 className="text-xl mb-4">Crear Nuevo Usuario</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="px-3 py-2 bg-gray-700 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="px-3 py-2 bg-gray-700 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={createUser}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  Crear Usuario
                </button>
              </div>
            </div>
          )}

          {/* Filtros de usuarios */}
          <div className="bg-gray-800/70 p-4 rounded-xl">
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="px-3 py-2 bg-gray-700 rounded text-white border border-gray-600"
              >
                <option value="">Todos los roles</option>
                <option value="ANDREI">ANDREI</option>
                <option value="DAEMON">DAEMON</option>
                <option value="NETWORK_ADMIN">NETWORK_ADMIN</option>
              </select>
              <button
                onClick={clearFilters}
                className="bg-gray-600 px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* Lista de usuarios */}
          <div className="bg-gray-800/70 p-6 rounded-xl">
            {users.filter(u => !filters.role || u.role === filters.role).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No hay usuarios que coincidan con los filtros.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="p-3">ID</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Rol</th>
                      <th className="p-3">Reportes</th>
                      <th className="p-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => !filters.role || u.role === filters.role)
                      .map((user) => {
                        const userReportsCount = reports.filter(r => r.userId === user.id).length;
                        return (
                          <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                            <td className="p-3 font-mono text-xs">{user.id.substring(0, 8)}...</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => getReportsByUser(user.id)}
                                className="text-blue-400 hover:text-blue-300 underline"
                              >
                                {userReportsCount} reportes
                              </button>
                            </td>
                            <td className="p-3">
                              <div className="flex gap-2">
                                <select
                                  value={user.role}
                                  onChange={(e) => updateUserRole(user.id, e.target.value)}
                                  className="bg-gray-700 px-2 py-1 rounded text-sm border border-gray-600"
                                >
                                  <option value="ANDREI">ANDREI</option>
                                  <option value="DAEMON">DAEMON</option>
                                  <option value="NETWORK_ADMIN">NETWORK_ADMIN</option>
                                </select>
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pestaña de Reportes */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Controles de reportes */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Gestión de Reportes
              <span className="text-sm font-normal text-gray-400 ml-2">({filteredReports.length})</span>
            </h2>
            <button
              onClick={() => setShowCreateReportForm(!showCreateReportForm)}
              className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {showCreateReportForm ? "Cancelar" : "Crear Reporte"}
            </button>
          </div>

          {/* Formulario de crear reporte */}
          {showCreateReportForm && (
            <div className="bg-gray-800/70 p-6 rounded-xl">
              <h3 className="text-xl mb-4">Crear Nuevo Reporte</h3>
              <div className="space-y-4">
                <textarea
                  placeholder="Descripción del reporte"
                  value={newReport.message}
                  onChange={(e) => setNewReport({ ...newReport, message: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white h-24 resize-none border border-gray-600 focus:border-green-500 focus:outline-none"
                />
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newReport.anonymous}
                      onChange={(e) => setNewReport({ 
                        ...newReport, 
                        anonymous: e.target.checked,
                        userId: e.target.checked ? "" : newReport.userId
                      })}
                      className="w-4 h-4"
                    />
                    Reporte Anónimo
                  </label>
                  {!newReport.anonymous && (
                    <select
                      value={newReport.userId}
                      onChange={(e) => setNewReport({ ...newReport, userId: e.target.value })}
                      className="px-3 py-2 bg-gray-700 rounded text-white border border-gray-600"
                    >
                      <option value="">Seleccionar Usuario (opcional)</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    onClick={createReport}
                    className="bg-green-600 px-6 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Crear Reporte
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filtros de reportes */}
          <div className="bg-gray-800/70 p-4 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Buscar en mensajes..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="px-3 py-2 bg-gray-700 rounded text-white border border-gray-600"
              />
              <select
                value={filters.anonymous}
                onChange={(e) => setFilters({ ...filters, anonymous: e.target.value })}
                className="px-3 py-2 bg-gray-700 rounded text-white border border-gray-600"
              >
                <option value="all">Todos</option>
                <option value="anonymous">Solo anónimos</option>
                <option value="public">Solo públicos</option>
              </select>
              <select
                value={filters.selectedUser}
                onChange={(e) => setFilters({ ...filters, selectedUser: e.target.value })}
                className="px-3 py-2 bg-gray-700 rounded text-white border border-gray-600"
              >
                <option value="">Todos los usuarios</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="px-3 py-2 bg-gray-700 rounded text-white border border-gray-600"
              />
              <button
                onClick={clearFilters}
                className="bg-gray-600 px-3 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* Lista de reportes */}
          <div className="bg-gray-800/70 p-6 rounded-xl">
            {filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No hay reportes que coincidan con los filtros.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => {
                  const reportUser = users.find(u => u.id === report.userId);
                  const isEditing = editingReport?.id === report.id;
                  
                  return (
                    <div
                      key={report.id}
                      className="border border-gray-700 p-4 rounded-lg bg-gray-800/50"
                    >
                      {isEditing ? (
                                                  <div className="space-y-4">
                          <textarea
                            value={editReportData.message}
                            onChange={(e) => setEditReportData({ ...editReportData, message: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 rounded text-white h-24 resize-none border border-gray-600"
                          />
                          <div className="flex gap-4 items-center">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editReportData.anonymous}
                                onChange={(e) => setEditReportData({ 
                                  ...editReportData, 
                                  anonymous: e.target.checked,
                                  userId: e.target.checked ? "" : editReportData.userId
                                })}
                                className="w-4 h-4"
                              />
                              Reporte Anónimo
                            </label>
                            {!editReportData.anonymous && (
                              <select
                                value={editReportData.userId}
                                onChange={(e) => setEditReportData({ ...editReportData, userId: e.target.value })}
                                className="px-3 py-2 bg-gray-700 rounded text-white border border-gray-600"
                              >
                                <option value="">Seleccionar Usuario (opcional)</option>
                                {users.map((user) => (
                                  <option key={user.id} value={user.id}>
                                    {user.email}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button
                              onClick={() => updateReport(report.id)}
                              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={() => setEditingReport(null)}
                              className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-lg mb-3 leading-relaxed">{report.message}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                🆔 ID: {report.id.substring(0, 8)}...
                              </span>
                              <span className="flex items-center gap-1">
                                📅 {formatDate(report.createdAt)}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                report.anonymous ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
                              }`}>
                                {report.anonymous ? "🔒 Anónimo" : "👤 Público"}
                              </span>
                              {!report.anonymous && reportUser && (
                                <span className="flex items-center gap-1">
                                  📧 <strong>{reportUser.email}</strong>
                                  <span className={`ml-2 px-2 py-1 rounded text-xs ${getRoleColor(reportUser.role)}`}>
                                    {reportUser.role}
                                  </span>
                                </span>
                              )}
                              {!report.anonymous && !reportUser && report.userId && (
                                <span className="flex items-center gap-1">
                                  ❓ Usuario ID: {report.userId.substring(0, 8)}... (eliminado)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => startEditingReport(report)}
                              className="bg-yellow-600 px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => deleteReport(report.id)}
                              className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de edición de usuario (si se implementa) */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full mx-4">
            <h3 className="text-xl mb-4">Editar Usuario</h3>
            <div className="space-y-4">
              <input
                type="email"
                value={editUserData.email}
                onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white border border-gray-600"
                placeholder="Email"
              />
              <select
                value={editUserData.role}
                onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white border border-gray-600"
              >
                <option value="ANDREI">ANDREI</option>
                <option value="DAEMON">DAEMON</option>
                <option value="NETWORK_ADMIN">NETWORK_ADMIN</option>
              </select>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    updateUserRole(editingUser.id, editUserData.role);
                    setEditingUser(null);
                  }}
                  className="flex-1 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer con información adicional */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Dashboard Administrativo • Última actualización: {new Date().toLocaleString('es-ES')}</p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="flex items-center gap-1">
            🔄 Auto-refresh: Desactivado
          </span>
          <span className="flex items-center gap-1">
            📊 Total registros: {users.length + reports.length}
          </span>
          <span className="flex items-center gap-1">
            🌐 API Status: Conectado
          </span>
        </div>
      </div>
    </div>
  );
}