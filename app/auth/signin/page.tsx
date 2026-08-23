"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Users,
  ShieldCheck,
  Gem,
  Sparkles,
  Shield,
  ChevronRight,
  Lock,
  TrendingUp,
  Activity,
  ChevronDown,
  Gavel,
  Skull,
  X,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Comunidad activa",
    desc: "Miles de jugadores conectados en todo momento",
    gradient: "from-pink-500/20 to-rose-600/20",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
  },
  {
    icon: ShieldCheck,
    title: "Sistema de whitelist",
    desc: "Acceso controlado y seguro para todos",
    gradient: "from-violet-500/20 to-purple-600/20",
    border: "border-violet-500/30",
    iconColor: "text-violet-400",
  },
  {
    icon: Gem,
    title: "Productos de calidad",
    desc: "Contenido premium y cuidado al detalle",
    gradient: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    icon: Sparkles,
    title: "Scripts exclusivos",
    desc: "Nunca antes vistos en GTA San Andreas roleplay",
    gradient: "from-amber-500/20 to-orange-600/20",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
];

// Contador animado individual
function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count}</span>;
}



function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

const DISCORD_URL = "https://discord.gg/hPEdGeHagM";

export default function SignInPage() {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSystemsModalOpen, setIsSystemsModalOpen] = useState(false);
  const [loginState, setLoginState] = useState<'idle' | 'checking' | 'error_not_in_guild' | 'error_no_role'>('idle');
  const [activeUsers, setActiveUsers] = useState(0);
  const [approvedWhitelists, setApprovedWhitelists] = useState(0);
  const [checkingStep, setCheckingStep] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error === "not_in_guild") {
      setLoginState("error_not_in_guild");
    } else if (error === "no_role") {
      setLoginState("error_no_role");
    }

    const fetchCounts = () => {
      fetch("/api/discord/members")
        .then((res) => res.json())
        .then((data) => {
          if (data.memberCount) setActiveUsers(data.memberCount);
          if (data.approvedCount !== undefined) setApprovedWhitelists(data.approvedCount);
        })
        .catch((err) => console.error("Error fetching Discord stats:", err));
    };

    fetchCounts();

    // Actualiza automáticamente cada 30 segundos si alguien entra o sale
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDiscordLogin = () => {
    setLoginState('checking');
    setCheckingStep(1); // Paso 1: Checando si estás en el server...
    
    setTimeout(() => {
      setCheckingStep(2); // Paso 2: Verificando tus roles...
      setTimeout(() => {
        setCheckingStep(3); // Paso 3: Redirigiendo a autorizar...
        setTimeout(() => {
          window.location.href = "/api/auth/discord/login";
        }, 800);
      }, 950);
    }, 950);
  };

  const dynamicStats = [
    {
      value: activeUsers,
      suffix: "",
      label: "Usuarios en Discord",
      icon: Users,
      color: "text-brand",
      bgColor: "from-brand/20 to-brand-deep/10",
    },
    {
      value: approvedWhitelists + 100,
      suffix: "",
      label: "Whitelists aprobadas",
      icon: ShieldCheck,
      color: "text-violet-400",
      bgColor: "from-violet-500/20 to-purple-600/10",
    },
  ];

  return (
    <div
      className="min-h-screen relative overflow-hidden bg-[#07070a]"
      style={{
        background:
          "radial-gradient(circle at 10% 10%, rgba(247, 107, 138, 0.12) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(138, 43, 226, 0.1) 0%, transparent 45%), linear-gradient(135deg, #07070a 0%, #0c0814 50%, #050508 100%)",
      }}
    >
      {/* Imagen de fondo con overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15 pointer-events-none"
        style={{
          backgroundImage: "url('/fondo.png')",
        }}
      />

      {/* Partículas decorativas */}
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] rounded-full bg-brand/15 blur-[140px] animate-float" />
      <div className="absolute bottom-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-brand-deep/15 blur-[140px] animate-float-delayed" />
      <div className="absolute top-2/3 left-1/3 w-72 h-72 rounded-full bg-violet-600/8 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-8 lg:px-20 py-12 lg:py-6 grid lg:grid-cols-2 gap-16 lg:gap-32 items-center min-h-screen">
        {/* ── LADO IZQUIERDO ── */}
        <motion.div
          initial={{ opacity: 0, x: -600 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 95,
            damping: 12,
            mass: 1.1,
            bounce: 0.4,
            duration: 1.2,
          }}
          className="flex flex-col gap-8 lg:gap-10"
        >
          {/* Logo / Título principal */}
          <div className="flex flex-col items-center lg:items-start gap-4">
            <motion.h1 
              animate={{ 
                rotateX: [8, -8, 8],
                rotateY: [-10, 10, -10]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                perspective: 1000,
                transformStyle: "preserve-3d",
              }}
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-center lg:text-left leading-none whitespace-nowrap cursor-default select-none pb-6"
            >
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-white inline-block"
                style={{
                  textShadow: "1px 1px 0px #e4e4e7, 2px 2px 0px #d4d4d8, 3px 3px 0px #a1a1aa, 4px 4px 0px #71717a, 5px 5px 0px #52525b, 6px 6px 0px #3f3f46, 7px 7px 0px #27272a, 8px 8px 16px rgba(0,0,0,0.8)",
                  transform: "translateZ(40px)"
                }}
              >
                ACCIÓN
              </motion.span>
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2
                }}
                className="relative inline-block mx-3"
                style={{ transform: "translateZ(80px)" }}
              >
                <span 
                  className="bg-gradient-to-r from-brand via-brand-soft to-brand-pale bg-clip-text text-transparent inline-block"
                  style={{
                    textShadow: "1px 1px 0px #f76b8a, 2px 2px 0px #fa8ba2, 3px 3px 0px #d94f6f, 4px 4px 0px #b83d5a, 5px 5px 0px #942f47, 6px 6px 0px #702032, 7px 7px 0px #501321, 8px 8px 16px rgba(0,0,0,0.8)"
                  }}
                >
                  X
                </span>
                <span
                  className="absolute inset-0 bg-gradient-to-r from-brand to-brand-soft opacity-40 blur-xl"
                  aria-hidden
                />
              </motion.span>
              <motion.span 
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4
                }}
                className="bg-gradient-to-r from-brand to-brand-soft bg-clip-text text-transparent inline-block"
                style={{
                  textShadow: "1px 1px 0px #f76b8a, 2px 2px 0px #fa8ba2, 3px 3px 0px #d94f6f, 4px 4px 0px #b83d5a, 5px 5px 0px #942f47, 6px 6px 0px #702032, 7px 7px 0px #501321, 8px 8px 16px rgba(0,0,0,0.8)",
                  transform: "translateZ(40px)"
                }}
              >
                RP
              </motion.span>
            </motion.h1>

            <p className="text-gray-400 leading-relaxed max-w-xl text-center lg:text-left text-base sm:text-lg">
              La comunidad de roleplay más inmersiva de habla hispana en{" "}
              <span className="text-white font-semibold">MTA San Andrés</span>.
              Vive una experiencia única.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
                className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 hover:bg-white/[0.06] hover:scale-[1.02] transition-all duration-200 cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center shrink-0"
                  >
                    <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {f.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 leading-snug">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats dinámicas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="grid grid-cols-2 gap-4 w-full"
          >
            {dynamicStats.map((s, i) => (
              <div
                key={s.label}
                className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md"
              >
                <div className="w-9 h-9 rounded-lg bg-black/30 flex items-center justify-center shrink-0">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div
                    className={`text-2xl font-black ${s.color} tabular-nums`}
                  >
                    <AnimatedCounter target={s.value} />
                    {s.suffix}
                  </div>
                  <div className="text-gray-400 text-xs uppercase tracking-wide">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── LADO DERECHO: CARD LOGIN ── */}
        <motion.div
          initial={{ opacity: 0, x: 600 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            type: "spring",
            stiffness: 95,
            damping: 12,
            mass: 1.1,
            bounce: 0.4,
            duration: 1.2,
          }}
          className="w-full max-w-md mx-auto lg:ml-auto lg:mr-0"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-3xl shadow-2xl shadow-black/70 p-8 sm:p-10 relative overflow-hidden">
            {/* Glow decorativo interior */}
            <div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(247,107,138,0.12), transparent 50%), radial-gradient(500px 300px at 110% -10%, rgba(247,107,138,0.10), transparent)",
              }}
            />
            {/* Línea superior de acento */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />

            <div className="relative z-10">
              {loginState === "idle" && (
                <>
                  {/* Header de la card */}
                  <div className="flex flex-col items-center text-center gap-3 mb-8">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-brand/30 blur-2xl scale-150" />
                      <motion.img
                        src="/logo.png"
                        alt="ACCIÓN X RP"
                        animate={{ 
                          y: [0, -6, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="relative w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl"
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-black text-white tracking-tight">
                        Iniciar sesión
                      </h1>
                      <p className="text-sm text-gray-400 mt-1">
                        Usa tu cuenta de Discord para acceder
                      </p>
                    </div>
                  </div>

                  {/* Botón Discord */}
                  <button
                    onClick={handleDiscordLogin}
                    className="group w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-base transition-all shadow-xl shadow-[#5865F2]/40 hover:shadow-[#5865F2]/60 active:scale-[0.98] hover:scale-[1.01] cursor-pointer"
                  >
                    <DiscordIcon />
                    Continuar con Discord
                    <ChevronRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Divisor — Información */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-medium">
                      Información
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  {/* Info items */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-black/20 px-4 py-3">
                      <Lock className="w-4 h-4 text-brand shrink-0" />
                      <span className="text-sm text-gray-300">
                        Conexión segura cifrada con Discord OAuth2
                      </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-black/20 px-4 py-3">
                      <Shield className="w-4 h-4 text-violet-400 shrink-0" />
                      <span className="text-sm text-gray-300">
                        No almacenamos tu contraseña de Discord
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <p className="text-sm text-gray-400 text-center mt-6">
                    ¿Primera vez?{" "}
                    <a
                      href={DISCORD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:text-brand-soft transition-colors font-semibold inline-flex items-center gap-1"
                    >
                      Paso a paso <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-3 leading-relaxed">
                    Al continuar aceptas nuestros{" "}
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white underline underline-offset-2 transition-colors"
                    >
                      términos de servicio
                    </a>{" "}
                    y{" "}
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white underline underline-offset-2 transition-colors"
                    >
                      políticas de privacidad
                    </a>
                    .
                  </p>

                </>
              )}

              {loginState === "checking" && (
                <div className="flex flex-col items-center justify-center py-6 text-center select-none">
                  {/* Título arriba */}
                  <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6">
                    Verificando Cuenta
                  </h3>

                  {/* Carga y Logo en el medio */}
                  <div className="relative flex items-center justify-center w-24 h-24 my-4">
                    {/* Círculo de carga */}
                    <div className="absolute inset-0 rounded-full border-4 border-t-brand border-white/5 animate-spin" />
                    
                    {/* Logo de Discord girando sobre su propio eje */}
                    <motion.div
                      animate={{ rotateY: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                      className="text-[#5865F2]"
                    >
                      <DiscordIcon />
                    </motion.div>
                  </div>

                  {/* Estado abajo */}
                  <div className="space-y-3.5 w-full max-w-[280px] text-left border-t border-white/5 pt-6 mt-6">
                    {/* Paso 1 */}
                    <div className={`flex items-center gap-3 text-xs transition-all duration-300 ${checkingStep >= 1 ? 'text-white' : 'text-gray-600'}`}>
                      {checkingStep > 1 ? (
                        <span className="text-emerald-400 font-extrabold text-sm shrink-0">✓</span>
                      ) : checkingStep === 1 ? (
                        <span className="w-2 h-2 rounded-full bg-brand animate-pulse shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-800 shrink-0" />
                      )}
                      <span className={checkingStep === 1 ? 'font-black tracking-wide text-brand' : 'font-medium'}>
                        Checando si estás en el server...
                      </span>
                    </div>

                    {/* Paso 2 */}
                    <div className={`flex items-center gap-3 text-xs transition-all duration-300 ${checkingStep >= 2 ? 'text-white' : 'text-gray-600'}`}>
                      {checkingStep > 2 ? (
                        <span className="text-emerald-400 font-extrabold text-sm shrink-0">✓</span>
                      ) : checkingStep === 2 ? (
                        <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-800 shrink-0" />
                      )}
                      <span className={checkingStep === 2 ? 'font-black tracking-wide text-violet-400' : 'font-medium'}>
                        Verificando tus roles...
                      </span>
                    </div>

                    {/* Paso 3 */}
                    <div className={`flex items-center gap-3 text-xs transition-all duration-300 ${checkingStep >= 3 ? 'text-white' : 'text-gray-600'}`}>
                      {checkingStep === 3 ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-800 shrink-0" />
                      )}
                      <span className={checkingStep === 3 ? 'font-black tracking-wide text-emerald-400 animate-pulse' : 'font-medium'}>
                        Entrando (solo dale a autorizar)...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {loginState === "error_not_in_guild" && (
                <div className="flex flex-col items-center justify-center text-center gap-6 py-4">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                    <X className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                      No estás en el Discord
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Para poder ingresar a la whitelist, debes ser miembro de nuestro servidor oficial de Discord.
                    </p>
                  </div>
                  <div className="w-full space-y-3">
                    <a
                      href={DISCORD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-sm uppercase tracking-wide transition-all active:scale-95 text-center cursor-pointer"
                    >
                      <DiscordIcon />
                      Unirse al Discord
                    </a>
                    <button
                      onClick={() => setLoginState("idle")}
                      className="w-full py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-bold text-sm uppercase tracking-wide transition-all active:scale-95 cursor-pointer"
                    >
                      Volver a intentar
                    </button>
                  </div>
                </div>
              )}

              {loginState === "error_no_role" && (
                <div className="flex flex-col items-center justify-center text-center gap-6 py-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                    <Shield className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                      Falta Rol de Whitelist
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Tu cuenta de Discord no tiene el rol{" "}
                      <code className="text-brand bg-black/40 px-1.5 py-0.5 rounded text-[11px] font-mono select-all">
                        1302807933821915178
                      </code>
                      . Debes solicitarlo abriendo un ticket de whitelist en nuestro servidor.
                    </p>
                  </div>
                  <div className="w-full space-y-3">
                    <a
                      href={DISCORD_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white font-bold text-sm uppercase tracking-wide transition-all active:scale-95 text-center cursor-pointer"
                    >
                      <DiscordIcon />
                      Abrir Ticket en Discord
                    </a>
                    <button
                      onClick={() => setLoginState("idle")}
                      className="w-full py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white font-bold text-sm uppercase tracking-wide transition-all active:scale-95 cursor-pointer"
                    >
                      Volver a intentar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </motion.div>

        {/* Indicador de scroll */}
        <div 
          className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center justify-center gap-1 animate-bounce cursor-pointer select-none"
          onClick={() => {
            document.getElementById("normativas")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="text-[10px] uppercase tracking-widest font-extrabold text-gray-500 hover:text-white transition-colors">
            Más detalles
          </span>
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {/* ── SECCIÓN DE NORMATIVAS ── */}
      <div 
        id="normativas" 
        className="relative z-10 mx-auto max-w-7xl px-8 lg:px-16 py-28"
      >
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            Información
          </h2>
          <p className="text-gray-400 max-w-md text-sm md:text-base">
            Conoce los detalles clave sobre nosotros, nuestro servidor y la comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Sobre Nosotros */}
          <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-300 flex flex-col justify-between aspect-[3/4] p-8">
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase tracking-wider">Sobre Nosotros</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
                Somos un servidor de MTA San Andrés enfocado en ofrecer un rol serio, inmersivo y de alta calidad para toda la comunidad.
              </p>
            </div>
            
            <div className="relative z-10 w-full">
              <button 
                onClick={() => setIsAboutModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-black/60 group-hover:bg-brand group-hover:border-brand text-white font-bold text-sm tracking-wide uppercase transition-all backdrop-blur-md active:scale-95 cursor-pointer"
              >
                Saber más
              </button>
            </div>
          </div>

          {/* Card 2: Características */}
          <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-300 flex flex-col justify-between aspect-[3/4] p-8">
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase tracking-wider">Sistemas Únicos</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
                Desarrollamos scripts interactivos, mapeos personalizados y optimizaciones exclusivas para un rendimiento óptimo.
              </p>
            </div>
            
            <div className="relative z-10 w-full">
              <button 
                onClick={() => setIsSystemsModalOpen(true)}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-black/60 group-hover:bg-brand group-hover:border-brand text-white font-bold text-sm tracking-wide uppercase transition-all backdrop-blur-md active:scale-95 cursor-pointer"
              >
                Ver detalles
              </button>
            </div>
          </div>

          {/* Card 3: Comunidad */}
          <div className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-brand/40 hover:shadow-2xl hover:shadow-brand/10 transition-all duration-300 flex flex-col justify-between aspect-[3/4] p-8">
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand group-hover:scale-110 transition-transform duration-300">
                <DiscordIcon />
              </div>
              <h3 className="text-xl font-extrabold text-white uppercase tracking-wider">Discord Oficial</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-[240px]">
                Únete a nuestra plataforma principal para estar al tanto de novedades, recibir soporte y realizar tu whitelist.
              </p>
            </div>
            
            <div className="relative z-10 w-full">
              <a 
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-black/60 group-hover:bg-brand group-hover:border-brand text-white font-bold text-sm tracking-wide uppercase transition-all backdrop-blur-md active:scale-95 cursor-pointer text-center"
              >
                Ir a Discord
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer centrado */}
      <div className="w-full py-12 text-center border-t border-white/5 bg-[#030305] relative z-10">
        <p className="text-xs text-gray-600">
          &copy; 2026 ACCIÓN X RP &bull; Todos los derechos reservados
        </p>
      </div>
      {/* Modal Sobre Nosotros */}
      {isAboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop con blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsAboutModalOpen(false)}
          />

          {/* Contenido del Modal */}
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c0814]/90 p-6 md:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden select-none">
            {/* Glow decorativo */}
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand/10 blur-[80px]" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-600/10 blur-[80px]" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-6 h-6 text-brand" />
                  Sobre Nosotros
                </h3>
                <button 
                  onClick={() => setIsAboutModalOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido */}
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {/* La Comunidad */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="text-base font-extrabold text-brand uppercase tracking-wider mb-2">La Comunidad</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    ACCIÓN X RP nació con el firme propósito de unir a los entusiastas del rol en MTA San Andrés. Creemos en una comunidad sana, colaborativa y apasionada, donde la interpretación seria, el respeto mutuo y la diversión de calidad sean los pilares de cada día.
                  </p>
                </div>

                {/* El Servidor */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="text-base font-extrabold text-violet-400 uppercase tracking-wider mb-2">El Servidor</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Desarrollado desde cero con tecnologías y scripts optimizados de alto rendimiento. Nuestra misión es mantener una jugabilidad fluida y dinámica, con una economía balanceada y realista, facciones detalladamente reguladas y actualizaciones constantes basadas en el feedback de los jugadores.
                  </p>
                </div>

                {/* El Equipo */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="text-base font-extrabold text-emerald-400 uppercase tracking-wider mb-2">El Equipo Administrativo</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Nuestro staff está compuesto por personas dedicadas, experimentadas e imparciales. Nos encargamos de brindar soporte continuo, moderar con justicia y asegurar un ambiente libre de toxicidad para que tu única preocupación sea disfrutar del rol.
                  </p>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setIsAboutModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-deep text-white font-bold text-sm uppercase tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand/25"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sistemas Únicos */}
      {isSystemsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop con blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsSystemsModalOpen(false)}
          />

          {/* Contenido del Modal */}
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c0814]/90 p-6 md:p-8 shadow-2xl backdrop-blur-2xl overflow-hidden select-none">
            {/* Glow decorativo */}
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-brand/10 blur-[80px]" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-600/10 blur-[80px]" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <h3 className="text-2xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-brand" />
                  Sistemas Únicos
                </h3>
                <button 
                  onClick={() => setIsSystemsModalOpen(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido */}
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-sm text-gray-400 leading-relaxed italic text-center px-4">
                  "Nuestros sistemas han sido creados desde cero y refinados constantemente con un único objetivo: garantizar el mejor rol serio y la máxima comodidad para todos los ciudadanos."
                </p>

                {/* Optimización */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="text-base font-extrabold text-brand uppercase tracking-wider mb-2">Comodidad y Fluidez</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Sabemos lo molesto que es tener bajos FPS. Por eso, todas nuestras interfaces de usuario (UI), sistemas de inventario y HUDs están programados meticulosamente en código limpio para asegurar un rendimiento óptimo y una latencia mínima al circular por la ciudad.
                  </p>
                </div>

                {/* Rol Serio */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="text-base font-extrabold text-violet-400 uppercase tracking-wider mb-2">Sistemas de Rol Avanzados</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Desde concesionarias realistas con pruebas de vehículos, hasta sistemas de trabajo interactivos, economías controladas al centavo y sistemas de inventario con peso real. Todo está configurado para que los jugadores puedan enfocarse en lo que de verdad importa: la interpretación profunda de sus personajes.
                  </p>
                </div>

                {/* Facciones e Inmersión */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                  <h4 className="text-base font-extrabold text-emerald-400 uppercase tracking-wider mb-2">Inmersión Faccionaria</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Sistemas avanzados para la LSPD (central de radio interactiva, base de datos criminal), SAMD (sistema de camillas funcionales y tratamientos médicos realistas), y herramientas estratégicas para facciones delictivas (robos estructurados, contrabando y control de zonas).
                  </p>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => setIsSystemsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-deep text-white font-bold text-sm uppercase tracking-wide transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand/25"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
