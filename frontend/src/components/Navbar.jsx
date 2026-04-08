import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";
import toast from "react-hot-toast";
import { customConfirm } from "../utils/customConfirm";
import logoTraficandy from '../assets/logo.png';
import { useCart } from '../context/CartContext'

const ROL_BADGE = {
  vendedor: { label: "Vendedor", cls: "bg-[#FF006E]/20 text-[#FF006E] border-[#FF006E]/40", icon: "🏪" },
  comprador: { label: "Comprador", cls: "bg-[#8338EC]/20 text-[#a87eff] border-[#8338EC]/40", icon: "🛍️" },
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isLoggedIn, isVendedor, usuario, logout } = useAuth();
  const { carrito } = useCart();

  const NAV_LINKS = [
    { to: '/', label: 'Inicio' },
    { to: '/catalogo', label: 'Catálogo' },
    ...(carrito.length > 0
      ? [{ to: '/checkout', label: `Checkout 🛒 (${carrito.length})` }]
      : [])
  ];
  
  // Estados para 2FA
  const [isEmail2FAEnabled, setIsEmail2FAEnabled] = useState(false);
  const [isApp2FAEnabled, setIsApp2FAEnabled] = useState(false);
  const [showSecurityMenu, setShowSecurityMenu] = useState(false);
  const [qrModal, setQrModal] = useState({ open: false, secret: "", qrImage: "", code: "", backupCodes: [], loading: false });

  // Cargar estado inicial
  useEffect(() => {
    if (isLoggedIn) {
      authService.me().then((res) => {
        if (res.ok && res.data?.usuario) {
          setIsEmail2FAEnabled(res.data.usuario.twoFactorEmail || false);
          setIsApp2FAEnabled(res.data.usuario.twoFactorApp || false);
        }
      }).catch(console.error);
    }
  }, [isLoggedIn]);

  const handleToggleEmail2FA = async () => {
    try {
      const res = await authService.toggleEmail2FA();
      if (res.ok) {
        setIsEmail2FAEnabled(res.data.twoFactorEmail);
        toast.success(`2FA de correo ${res.data.twoFactorEmail ? 'activado' : 'desactivado'}`);
      }
    } catch {
      toast.error("Error al cambiar 2FA Correo.");
    }
  };

  const handleToggleApp2FA = async () => {
    if (isApp2FAEnabled) {
      const isConfirmed = await customConfirm(
        "¿Seguro que deseas desactivar la App Autenticadora permanentemente?", 
        "Desactivar 2FA"
      );
      if (isConfirmed) {
        try {
          const res = await authService.disableApp2FA();
          if (res.ok) {
            setIsApp2FAEnabled(false);
            toast.success("App Autenticadora desactivada");
          }
        } catch {
          toast.error("Error al desactivar App.");
        }
      }
    } else {
      try {
        const res = await authService.setupApp2FA();
        if (res.ok && res.data) {
          setQrModal({ open: true, secret: res.data.secret, qrImage: res.data.qrImage, code: "", backupCodes: res.data.backupCodes || [], loading: false });
        }
      } catch {
        toast.error("Error al iniciar setup de App.");
      }
    }
  };

  const handleConfirmApp = async (e) => {
    e.preventDefault();
    setQrModal(prev => ({ ...prev, loading: true }));
    try {
      const res = await authService.confirmApp2FA(qrModal.code);
      if (res.ok) {
        setIsApp2FAEnabled(true);
        setQrModal({ open: false, secret: "", qrImage: "", code: "", backupCodes: [], loading: false });
        toast.success("App Autenticadora activada exitosamente.");
        setShowSecurityMenu(false);
      } else {
        toast.error(res.mensaje || "Código incorrecto");
        setQrModal(prev => ({ ...prev, loading: false }));
      }
    } catch {
      toast.error("Error verificando código.");
      setQrModal(prev => ({ ...prev, loading: false }));
    }
  };

  const handleLogout = async () => {
    const isConfirmed = await customConfirm(
      "¿Estás seguro que deseas salir de tu cuenta?",
      "CERRAR SESIÓN"
    );
    if (isConfirmed) {
      logout();
      setMenuOpen(false);
      toast.success("Has cerrado sesión exitosamente.");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false) }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const linkBase = "relative font-semibold text-sm tracking-wide transition-all duration-300 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-current after:transition-all after:duration-300 hover:after:w-full";
  const linkDesktop = (path) => isActive(path) ? `${linkBase} text-[#FF006E]` : `${linkBase} text-white/90 hover:text-[#FFD60A]`;
  const linkMobile = (path) => `block w-full rounded-xl px-4 py-3 font-semibold text-sm transition-all duration-200 ` + (isActive(path) ? "bg-[#FF006E]/20 text-[#FF006E] border border-[#FF006E]/40" : "text-white/90 hover:bg-white/10 hover:text-[#FFD60A]");

  const navBg = scrolled ? "bg-[#111]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/30" : "bg-transparent";
  const badge = usuario?.rol ? ROL_BADGE[usuario.rol] : null;

  const vendedorLinks = isVendedor ? [
  { to: "/admin/dulces", label: "🛠️ Editar Dulce" },
  { to: "/admin/dulce/nuevo", label: "➕ Nuevo Dulce" }
] : [];
  const allNavLinks = [...NAV_LINKS, ...vendedorLinks];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${navBg}`}>
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#FF006E] via-[#FB5607] to-[#8338EC]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="group flex items-center gap-2 select-none">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF006E] to-[#FB5607] shadow-md transition-transform group-hover:rotate-12 group-hover:scale-110 overflow-hidden">
                <img src={logoTraficandy} alt="TraffiCandy" className="w-full h-full object-cover" />
              </span>
              <span className="text-xl font-black text-white tracking-tight">Trafi<span className="text-[#FFD60A]">Candy</span></span>
            </Link>

            <ul className="hidden md:flex items-center gap-8">
              {allNavLinks.map(({ to, label }) => (<li key={to}><Link to={to} className={linkDesktop(to)}>{label}</Link></li>))}
            </ul>

            <div className="hidden md:flex items-center gap-3 relative">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  {badge && <span className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold ${badge.cls}`}>{badge.icon} {badge.label}</span>}
                  <div className="text-right">
                    <p className="text-white text-xs font-bold leading-none truncate max-w-[120px]">{usuario?.nombre || usuario?.email?.split("@")[0]}</p>
                    <p className="text-white/40 text-[10px] truncate max-w-[120px]">{usuario?.email}</p>
                  </div>

                  <div className="relative">
                    <button onClick={() => setShowSecurityMenu(!showSecurityMenu)} title="Seguridad" className={`flex justify-center items-center h-8 w-8 rounded-full border transition-all ${isEmail2FAEnabled || isApp2FAEnabled ? "border-green-500/40 bg-green-500/20 text-green-400" : "border-white/20 bg-white/5 text-white/50"} hover:scale-105 active:scale-95`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </button>
                    
                    {/* Security Dropdown Desktop */}
                    {showSecurityMenu && (
                      <div className="absolute right-0 top-10 w-56 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl p-3 z-50 animate-fade-in">
                        <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Seguridad 2FA</h4>
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-white text-sm group-hover:text-[#FFD60A] transition-colors">📧 Correo</span>
                            <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${isEmail2FAEnabled ? "bg-[#FF006E]" : "bg-white/20"}`} onClick={(e) => { e.preventDefault(); handleToggleEmail2FA(); }}>
                              <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${isEmail2FAEnabled ? "translate-x-5" : ""}`} />
                            </div>
                          </label>
                          <label className="flex items-center justify-between cursor-pointer group">
                            <span className="text-white text-sm group-hover:text-[#FFD60A] transition-colors">📱 App (TOTP)</span>
                            <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${isApp2FAEnabled ? "bg-green-500" : "bg-white/20"}`} onClick={(e) => { e.preventDefault(); handleToggleApp2FA(); }}>
                              <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${isApp2FAEnabled ? "translate-x-5" : ""}`} />
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <button onClick={handleLogout} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-bold text-white/80 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 transition-all hover:scale-105 active:scale-95">Salir</button>
                </div>
              ) : (
                <Link to="/login" className="rounded-full bg-gradient-to-r from-[#FF006E] to-[#FB5607] px-5 py-2 text-sm font-bold text-white shadow-md transition-all hover:scale-105 hover:shadow-[#FF006E]/50 active:scale-95">Empezar ahora</Link>
              )}
            </div>

            {/* Hamburguesa móvil */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col items-center justify-center h-10 w-10 text-white rounded-lg hover:bg-white/10 gap-[5px]">
              <span className={`block h-[2px] w-6 bg-current transition-all ${menuOpen && "translate-y-[7px] rotate-45"}`} />
              <span className={`block h-[2px] w-6 bg-current transition-all ${menuOpen && "opacity-0"}`} />
              <span className={`block h-[2px] w-6 bg-current transition-all ${menuOpen && "-translate-y-[7px] -rotate-45"}`} />
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="mx-4 mb-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3 shadow-xl">
            <ul className="flex flex-col gap-1">
              {allNavLinks.map(({ to, label }) => (<li key={to}><Link to={to} className={linkMobile(to)}>{label}</Link></li>))}
            </ul>
            <div className="mt-3 border-t border-white/10 pt-3">
              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5">
                    {badge && <span className={`px-2 py-0.5 rounded-full border text-xs font-bold ${badge.cls}`}>{badge.icon} {badge.label}</span>}
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-bold truncate">{usuario?.nombre || usuario?.email?.split("@")[0]}</p>
                      <p className="text-white/40 text-xs truncate">{usuario?.email}</p>
                    </div>
                  </div>

                  {/* Mobile Security Checklist */}
                  <div className="bg-white/5 rounded-xl p-3 border border-white/10 mt-1">
                    <h4 className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Seguridad 2FA</h4>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-white text-sm">📧 Correo</span>
                        <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${isEmail2FAEnabled ? "bg-[#FF006E]" : "bg-white/20"}`} onClick={(e) => { e.preventDefault(); handleToggleEmail2FA(); }}>
                          <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${isEmail2FAEnabled ? "translate-x-5" : ""}`} />
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-white text-sm">📱 App (TOTP)</span>
                        <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${isApp2FAEnabled ? "bg-green-500" : "bg-white/20"}`} onClick={(e) => { e.preventDefault(); handleToggleApp2FA(); }}>
                          <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${isApp2FAEnabled ? "translate-x-5" : ""}`} />
                        </div>
                      </label>
                    </div>
                  </div>

                  <button onClick={handleLogout} className="block w-full rounded-xl border border-red-500/30 bg-red-500/10 py-3 text-center text-sm font-bold text-red-400 mt-2">Cerrar Sesión</button>
                </div>
              ) : (
                <Link to="/login" className="block w-full rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3 text-center text-sm font-bold text-white">Empezar ahora 🚀</Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* QR Modal para App Auth */}
      {qrModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#1A1A1A] p-6 shadow-2xl relative my-8">
            <button onClick={() => setQrModal({ open: false, secret: "", qrImage: "", code: "", backupCodes: [], loading: false })} className="absolute top-4 right-4 text-white/40 hover:text-white">✕</button>
            <h2 className="text-xl font-black text-white text-center mb-2">Configurar Autenticador</h2>
            <p className="text-xs text-white/60 text-center mb-4 leading-relaxed">
              Escanea el código QR con Google Authenticator o Authy.
            </p>
            <div className="bg-white p-2 rounded-xl w-3/4 mx-auto mb-4 border-4 border-[#FF006E]/20">
              <img src={qrModal.qrImage} alt="QR Code" className="w-full h-auto rounded-lg" />
            </div>
            <p className="text-[10px] text-white/40 text-center mb-1 uppercase font-bold tracking-wider">O usa esta clave secreta:</p>
            <p className="text-sm font-mono text-[#FFD60A] text-center bg-black/40 py-2 px-2 rounded-lg mb-4 break-all">{qrModal.secret}</p>
            
            {qrModal.backupCodes && qrModal.backupCodes.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-4">
                <h3 className="text-red-400 text-[10px] font-black uppercase mb-2">⚠️ Códigos de Respaldo</h3>
                <p className="text-white/60 text-[10px] leading-tight mb-2">Cópialos y guárdalos en un lugar seguro. Solo se mostrarán una vez.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {qrModal.backupCodes.map(c => (
                    <span key={c} className="bg-black/50 text-white font-mono text-xs px-2 py-1 rounded border border-white/10 select-all">{c}</span>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleConfirmApp}>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={qrModal.code}
                onChange={(e) => setQrModal(prev => ({ ...prev, code: e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase() }))}
                className="w-full text-center tracking-[0.5em] text-2xl font-black text-white outline-none rounded-xl border border-white/10 bg-white/5 py-3 mb-4 placeholder-white/20 focus:border-[#FF006E] focus:bg-white/10"
                required
              />
              <button disabled={qrModal.code.length !== 6 || qrModal.loading} className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-400 py-3 font-bold text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all">
                {qrModal.loading ? "Verificando..." : "Confirmar y Activar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
