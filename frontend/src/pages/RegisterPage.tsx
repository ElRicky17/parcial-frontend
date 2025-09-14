import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", { 
        email, 
        password 
      });
      console.log("Usuario registrado:", res.data);
      alert("¡Registro exitoso! Bienvenido al caos. Ahora puedes iniciar sesión.");
      navigate("/login");
    } catch (err: any) {
      console.error("Error en registro:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al registrarse. El email podría estar ya en uso.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-red-950 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-700/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-700/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-yellow-700/20 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-red-800/25 rounded-full mix-blend-multiply filter blur-3xl opacity-18 animate-pulse delay-700"></div>
        
        {/* Additional dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-red-900/60 to-black/90"></div>
      </div>

      {/* Floating Code Fragments */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-orange-300/20 text-xs font-mono animate-pulse select-none"
            style={{
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 90 + 5}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {["daemon", "recruit", "chaos", "empire", "victim", "resistance", "hypnosis"][Math.floor(Math.random() * 7)]}
          </div>
        ))}
      </div>

      {/* Main Register Container */}
      <div className="relative w-full max-w-lg z-20">
        {/* Subtle Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-yellow-600/20 rounded-3xl blur-lg opacity-60"></div>
        
        {/* Register Card */}
        <div className="relative bg-gray-800/95 backdrop-blur-xl border border-gray-700/30 rounded-3xl p-10 shadow-2xl">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Logo/Icon - Daemon Recruitment Symbol */}
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform rotate-45 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
              <svg className="w-12 h-12 text-gray-900 transform -rotate-45 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-2 tracking-wider">
              ÚNETE AL CAOS
            </h1>
            <p className="text-gray-200 text-sm font-light tracking-wide mb-2">
              Conviértete en un Daemon de Andrei
            </p>
            <p className="text-orange-300 text-xs italic">
              "Los administradores de red serán mis víctimas"
            </p>
            <div className="w-20 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-700/50 rounded-2xl p-4 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block uppercase tracking-widest">
                Email del Daemon
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <svg className="w-5 h-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="daemon@chaos.empire"
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/80 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 focus:bg-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-orange-500/0 to-yellow-500/0 group-focus-within:from-red-500/10 group-focus-within:via-orange-500/10 group-focus-within:to-yellow-500/10 rounded-2xl pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block uppercase tracking-widest">
                Contraseña del Caos
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <svg className="w-5 h-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/80 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 focus:bg-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-orange-500/0 to-yellow-500/0 group-focus-within:from-red-500/10 group-focus-within:via-orange-500/10 group-focus-within:to-yellow-500/10 rounded-2xl pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 block uppercase tracking-widest">
                Confirmar Poder Oscuro
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <svg className="w-5 h-5 text-gray-500 group-focus-within:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  type="password"
                  placeholder="••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-900/80 border border-gray-600/50 rounded-2xl text-white placeholder-gray-500 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all duration-300 focus:bg-gray-900"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-orange-500/0 to-yellow-500/0 group-focus-within:from-red-500/10 group-focus-within:via-orange-500/10 group-focus-within:to-yellow-500/10 rounded-2xl pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            {/* Role Info */}
            <div className="bg-gray-900/50 border border-orange-700/30 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-orange-300 text-sm font-semibold">Rol asignado: DAEMON</p>
                  <p className="text-gray-400 text-xs">Agente de captura en el imperio de Andrei</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 text-white font-bold rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none text-base tracking-wide relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3 relative z-10">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>INVOCANDO DAEMON...</span>
                </div>
              ) : (
                <span className="relative z-10">CONVERTIRSE EN DAEMON</span>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-200 text-sm mb-4">
              ¿Ya formas parte del imperio?
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-transparent border-2 border-gray-600/50 hover:border-orange-500/70 text-gray-300 hover:text-orange-400 font-medium rounded-xl transition-all duration-300 hover:bg-orange-500/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm tracking-wide group"
            >
              <svg className="w-4 h-4 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>ACCEDER AL IMPERIO</span>
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center space-y-2">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-auto"></div>
            <p className="text-xs text-gray-200 italic font-light tracking-wider">
              "Los daemons son mis ojos y mis manos"
            </p>
            <p className="text-xs text-gray-200 font-mono">
              - Andrei Mes Manur, Warlock Recruiter
            </p>
          </div>
        </div>

        {/* Side Accent Lines */}
        <div className="absolute -left-1 top-1/4 w-0.5 h-1/2 bg-gradient-to-b from-transparent via-orange-500 to-transparent opacity-60"></div>
        <div className="absolute -right-1 top-1/4 w-0.5 h-1/2 bg-gradient-to-b from-transparent via-red-500 to-transparent opacity-60"></div>
      </div>

      {/* Corner Network Icons */}
      <div className="absolute top-8 left-8 text-red-500/20 transform rotate-12 z-30">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <div className="absolute bottom-8 right-8 text-orange-500/20 transform -rotate-12 z-30">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
        </svg>
      </div>
    </div>
  );
}