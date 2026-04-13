import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Sub-componentes
import LoginView from "../components/Auth/LoginView";
import RegisterView from "../components/Auth/RegisterView";
import TwoFactorView from "../components/Auth/TwoFactorView";

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // 'registro', 'login', o '2fa'
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);

  // ── Estados del formulario de registro ──
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── Estados del formulario de login ──
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  // ── Estados del 2FA ──
  const [twoFactorCode, setTwoFactorCode] = useState(["", "", "", "", "", ""]);
  const [required2FAMethod, setRequired2FAMethod] = useState("");
  const [available2FAMethods, setAvailable2FAMethods] = useState([]);

  // ────────────────────────────────────────────────
  // Handlers
  // ────────────────────────────────────────────────

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) return toast.error("El nombre es requerido");
    if (!isPasswordValid)
      return toast.error(
        "La contraseña no cumple con los requisitos de seguridad",
      );
    if (password !== confirmPassword)
      return toast.error("Las contraseñas no coinciden");
    try {
      const data = await authService.register(
        nombre,
        email,
        password,
        "comprador",
      );
      if (data.ok) {
        toast.success("¡Cuenta creada! Ya puedes iniciar sesión.");
        setView("login");
      } else {
        toast.error(data.mensaje || "Error al registrarse.");
      }
    } catch (error) {
      console.error("Error en register:", error);
      toast.error("Error al conectar con el servidor.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.login(loginEmail, loginPassword);

      if (data.ok && data.data?.token) {
        // Guardar JWT y actualizar contexto global
        login(data.data.token);

        const userRol = data.data.usuario?.rol;
        // Vendedor → panel admin; Comprador → inicio
        navigate(userRol === "vendedor" ? "/admin/dulce/nuevo" : "/");
      } else if (data.data?.requires2FA) {
        setRequired2FAMethod(data.data.requires2FA);
        setAvailable2FAMethods(data.data.methods || []);
        setView("2fa");
      } else {
        toast.error(data.mensaje || "Credenciales incorrectas.");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const data = await authService.forgotPassword(loginEmail);
        if (data.ok) {
          setShowForgot(false);
          resolve(data.mensaje);
        } else {
          reject(new Error(data.mensaje || "No pudimos enviar el enlace."));
        }
      } catch (error) {
        reject(new Error("Error al conectar con el servidor."));
      }
    });

    toast
      .promise(promise, {
        loading: "Enviando correo de recuperación...",
        success: (msg) => msg,
        error: (err) => err.message,
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOtpChange = (element, index) => {
    if (!/^[A-Z0-9]?$/i.test(element.value)) return;
    const newCode = [...twoFactorCode];
    newCode[index] = element.value.toUpperCase();
    setTwoFactorCode(newCode);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !twoFactorCode[index] &&
      e.target.previousSibling
    ) {
      e.target.previousSibling.focus();
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    const codeString = twoFactorCode.join("");
    if (codeString.length < 6) {
      toast.error("Por favor ingresa los 6 dígitos del código.");
      return;
    }
    setLoading(true);
    try {
      const data = await authService.verify2FA(loginEmail, codeString);
      if (data.ok && data.data?.token) {
        toast.success("Verificación exitosa.");
        login(data.data.token);
        navigate("/");
      } else {
        toast.error(data.mensaje || "Código Incorrecto o Expirado.");
      }
    } catch (error) {
      console.error("Error en 2FA:", error);
      toast.error("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailFallback = async () => {
    setLoading(true);

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await authService.sendEmail2FA(loginEmail, loginPassword);
        if (res.ok) {
          setRequired2FAMethod("email");
          resolve("Código enviado a tu correo exitosamente.");
        } else {
          reject(
            new Error(
              res.mensaje || "Error al solicitar el código por correo.",
            ),
          );
        }
      } catch (error) {
        reject(
          new Error("Error al contactar al servidor para enviar el correo."),
        );
      }
    });

    toast
      .promise(promise, {
        loading: "Enviando código a tu correo...",
        success: (msg) => msg,
        error: (err) => err.message,
      })
      .finally(() => setLoading(false));
  };

  // Helper para anchos del slide
  const slideMap = { login: "0%", registro: "-33.333%", "2fa": "-66.666%" };

  // Clases compartidas de inputs
  const inputCls =
    "rounded-xl bg-white/5 border border-white/20 px-4 py-3 text-white " +
    "placeholder-white/50 outline-none focus:border-[#FF006E] focus:bg-white/10 transition-all";

  const btnPrimary =
    "rounded-xl bg-gradient-to-r from-[#FF006E] to-[#FB5607] py-3 mt-2 " +
    "font-bold text-white shadow-[0_0_15px_rgba(255,0,110,0.4)] " +
    "hover:shadow-[0_0_25px_rgba(255,0,110,0.6)] hover:scale-[1.02] active:scale-95 transition-all";

  // ── Validaciones en tiempo real de la contraseña ──
  const passwordCriteria = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] px-4 overflow-hidden">
      <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        {/* Glow Effects */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF006E]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#FB5607]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header / Selector de Vistas (Oculto en 2FA) */}
        <AnimatePresence>
          {view !== "2fa" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex relative border-b border-white/10"
            >
              {["login", "registro"].map((v) => (
                <button
                  key={v}
                  className={`flex-1 py-4 text-center font-bold text-lg z-10 transition-colors capitalize ${
                    view === v
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                  onClick={() => setView(v)}
                >
                  {v === "login" ? "Iniciar Sesión" : "Registrarse"}
                </button>
              ))}
              <motion.div
                className="absolute bottom-0 h-1 bg-gradient-to-r from-[#FF006E] to-[#FB5607] rounded-full"
                initial={false}
                animate={{
                  left: view === "login" ? "0%" : "50%",
                  width: "50%",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zona de Formularios con Animación de Deslizamiento */}
        <div className="relative w-full h-[440px] overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-[300%] h-full flex"
            initial={false}
            animate={{ x: slideMap[view] }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <LoginView 
               view={view}
               loading={loading}
               showForgot={showForgot}
               setShowForgot={setShowForgot}
               loginEmail={loginEmail}
               setLoginEmail={setLoginEmail}
               loginPassword={loginPassword}
               setLoginPassword={setLoginPassword}
               handleLoginSubmit={handleLoginSubmit}
               handleForgotSubmit={handleForgotSubmit}
               inputCls={inputCls}
               btnPrimary={btnPrimary}
            />

            <RegisterView 
               view={view}
               nombre={nombre}
               setNombre={setNombre}
               email={email}
               setEmail={setEmail}
               password={password}
               setPassword={setPassword}
               confirmPassword={confirmPassword}
               setConfirmPassword={setConfirmPassword}
               handleRegisterSubmit={handleRegisterSubmit}
               passwordCriteria={passwordCriteria}
               inputCls={inputCls}
               btnPrimary={btnPrimary}
            />

            <TwoFactorView 
               view={view}
               loading={loading}
               required2FAMethod={required2FAMethod}
               available2FAMethods={available2FAMethods}
               twoFactorCode={twoFactorCode}
               handleOtpChange={handleOtpChange}
               handleOtpKeyDown={handleOtpKeyDown}
               handle2FASubmit={handle2FASubmit}
               handleSendEmailFallback={handleSendEmailFallback}
               setView={setView}
               setTwoFactorCode={setTwoFactorCode}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
