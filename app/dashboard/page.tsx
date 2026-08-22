"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  LogOut,
  Copy,
  ExternalLink,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Award,
  Clock,
  CheckCircle2,
  Home,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  Bell,
  Plus,
  Lock,
  ArrowRight,
  ClipboardList,
  Edit2,
  History,
  Mail,
  MapPin,
  Calendar,
  XCircle,
  Check,
  Search,
  RefreshCw,
  GraduationCap,
  Sparkles,
  Trash2,
  FileSpreadsheet,
  Gavel,
  AlertTriangle,
  Scale,
  Maximize2,
} from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: "Abierta" | "Cerrada" | "Opción Múltiple";
  options: string[];
}

interface CustomForm {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface ResponseSubmission {
  id: number;
  form_id: number;
  user_id: string;
  username: string;
  avatar: string;
  answers: { questionId: string; questionText: string; answer: string }[];
  status: "Pendiente" | "Aprobada" | "Rechazada";
  submitted_at: string;
}

interface DBNotification {
  id: number;
  user_id: string;
  message: string;
  created_at: string;
}

interface Rule {
  id: string;
  title: string;
  excerpt: string;
  content: string;
}

interface RuleCategory {
  title: string;
  icon: "gavel" | "siren" | "book" | "shield" | "car" | "user" | "star" | "alert" | "scroll" | "badge" | "scale";
  rules: Rule[];
}

const phase1Questions = [
  { id: 1, category: "DATOS PERSONALES", question: "NOMBRE (REAL)" },
  { id: 2, category: "DATOS PERSONALES", question: "EDAD (REAL)" },
  { id: 3, category: "CONCEPTOS DE ROL", question: "¿Qué es el OOC y para qué se utiliza?" },
  { id: 4, category: "NORMATIVA DE ORGANIZACIONES", question: "Si eres miembro de una organización y secuestran a tu compañero, ¿puedes secuestrar a un compañero de la otra organización para igualar la situación? Antes de hacer cualquier acto o rol delictivo, ¿qué es lo primero que tienes que hacer?" },
  { id: 5, category: "ROBOS Y SITUACIONES", question: "Supongamos que una ganga te da el pare con el fin de robarte, a lo que 2 de los sujetos del coche de la ganga disparan a pincharte, te pinchan y provocan que te accidentes, después del accidente te dicen que te bajes pero tú omites lo que te piden y pasado 2 segundos te abaten dentro del vehículo, ¿estaría bien lo sucedido? Sí o no y por qué?" },
  { id: 6, category: "CONCEPTOS DE ROL", question: "¿A qué le llamarías un mal uso del OOC?" },
  { id: 7, category: "ACCIONES DELICTIVAS", question: "¿Cuál sería la manera correcta en que deben actuar los delincuentes si quieren secuestrar a un policía para un robo?" },
  { id: 8, category: "EVASIÓN DE ROL", question: "Durante una persecución policial llegas a un garaje sin salida y decides desconectarte del server para evitar ser capturado. ¿Qué normativa se está violando?" },
  { id: 9, category: "ENTORNO SEGURO", question: "Decides robar un vehículo frente a una estación de policía. ¿Qué normativa estás violando?" },
  { id: 10, category: "CONCEPTOS DE ROL", question: "Si hago una animación y mi amigo que está al lado me pregunta cómo hago eso, ¿qué procedes a hacer?" },
  { id: 11, category: "CONCEPTOS DE ROL", question: "¿Qué es el IC? Dame un buen ejemplo de cómo podemos usarlo correctamente" },
  { id: 12, category: "CONCEPTOS DE ROL", question: "¿Qué es una Invasión de Rol?" },
  { id: 13, category: "CONCEPTOS BÁSICOS", question: "¿Qué debes hacer si tu coche choca muy fuerte contra un muro dentro del juego?" },
  { id: 14, category: "CONCEPTOS BÁSICOS", question: "¿Está permitido hablar de temas de la vida real por el micrófono de tu personaje?" },
  { id: 15, category: "CONCEPTOS BÁSICOS", question: "Si alguien te apunta con una pistola, ¿puedes salir corriendo o debes valorar tu vida?" },
  { id: 16, category: "CONCEPTOS BÁSICOS", question: "¿Qué debes hacer si ves a otro jugador haciendo trampas o rompiendo las reglas?" },
  { id: 17, category: "CONCEPTOS BÁSICOS", question: "¿Para qué sirve el comando /me? Dame un ejemplo bien simple." },
  { id: 18, category: "CONCEPTOS BÁSICOS", question: "¿Para qué sirve el comando /do? Dame un ejemplo bien simple." },
  { id: 19, category: "CONCEPTOS BÁSICOS", question: "¿Puedes golpear o disparar a alguien sin tener un motivo o historia de rol?" },
  { id: 20, category: "CONCEPTOS BÁSICOS", question: "Si estás jugando y tienes que irte de tu computadora urgente, ¿qué es lo correcto?" },
  { id: 21, category: "CONCEPTOS BÁSICOS", question: "¿Puedes usar en el juego información que viste en un directo de Streamer?" },
  { id: 22, category: "CONCEPTOS BÁSICOS", question: "¿Qué debes hacer si un oficial de policía te pide que te detengas y levantes las manos?" },
  { id: 23, category: "CONCEPTOS BÁSICOS", question: "Si te roban todas tus cosas dentro del juego, ¿está permitido insultar al ladrón fuera de rol?" },
  { id: 24, category: "CONCEPTOS BÁSICOS", question: "¿Por qué debemos tratar a todos los jugadores con respeto y educación en la comunidad?" },
  { id: 25, category: "CONCEPTOS BÁSICOS", question: "¿Qué significa el entorno de la ciudad y por qué debemos respetarlo?" },
  { id: 26, category: "CONCEPTOS BÁSICOS", question: "¿Se permite molestar o hacer ruidos molestos por el chat de voz del juego?" },
  { id: 27, category: "CONCEPTOS BÁSICOS", question: "¿Qué debes hacer si tu personaje se cae de una altura y se lastima una pierna?" },
  { id: 28, category: "CONCEPTOS BÁSICOS", question: "Si tienes una discusión con otro jugador, ¿dónde debes resolverla de forma madura?" },
  { id: 29, category: "CONCEPTOS BÁSICOS", question: "¿Qué debes hacer si encuentras un truco o bug que te da dinero gratis en el servidor?" },
  { id: 30, category: "CONCEPTOS BÁSICOS", question: "Si tu personaje sufre una muerte definitiva (CK), ¿qué debes hacer con su nombre e historia?" }
];

export default function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [user, setUser] = useState<{ id: string; username: string; avatar: string | null; joinedAt: string; role?: string; roles?: string[] } | null>(null);
  const [daysInServer, setDaysInServer] = useState("1d");

  // Perfil sub-tabs
  const [profileSubTab, setProfileSubTab] = useState("info");

  const [isPhase1Completed, setIsPhase1Completed] = useState(false);
  useEffect(() => {
    if (user?.roles) {
      setIsPhase1Completed(user.roles.includes("1302808314626707517"));
    }
  }, [user]);
  const [isPhase2Completed, setIsPhase2Completed] = useState(false);
  const [isPhase1Started, setIsPhase1Started] = useState(false);
  const [phase1CurrentQuestionIdx, setPhase1CurrentQuestionIdx] = useState(0);
  const [phase1Answers, setPhase1Answers] = useState<Record<number, string>>({});
  const [isTestActive, setIsTestActive] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [phase1StartedAt, setPhase1StartedAt] = useState<string>("");
  const [abandonedApps, setAbandonedApps] = useState<any[]>([]);
  const [dailyAttemptsLimit, setDailyAttemptsLimit] = useState(2);
  const [attemptsLimitReached, setAttemptsLimitReached] = useState(false);
  const [attemptsCountdown, setAttemptsCountdown] = useState("");
  const isInitialLoad = useRef(true);

  // Estados del Formulario de Edición de Perfil
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState("jrsmile22");
  const [profileAge, setProfileAge] = useState("No especificado");
  const [profileCity, setProfileCity] = useState("No especificado");
  const [profileCountry, setProfileCountry] = useState("No especificado");
  const [profileBio, setProfileBio] = useState("No has agregado una biografía aún.");

  // Temporales de edición para poder cancelar
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editBio, setEditBio] = useState("");

  // Errores de Validación
  const [formErrors, setFormErrors] = useState<{ name?: string; age?: string; city?: string; country?: string; bio?: string }>({});

  // DB States
  const [customForms, setCustomForms] = useState<CustomForm[]>([]);
  const [dbResponses, setDbResponses] = useState<ResponseSubmission[]>([]);
  const [dbNotifications, setDbNotifications] = useState<DBNotification[]>([]);
  const [isSubmittingPhase1, setIsSubmittingPhase1] = useState(false);

  // Filtros de aplicaciones y normativas
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("Todas");

  // Filtros específicos de normativas
  const [rulesSearchQuery, setRulesSearchQuery] = useState("");
  const [rulesFilterCategory, setRulesFilterCategory] = useState("Todas");
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  // Estado para gestión de formularios (editar/eliminar)
  const [formToDelete, setFormToDelete] = useState<CustomForm | null>(null);
  const [formToEdit, setFormToEdit] = useState<CustomForm | null>(null);
  const [editFormTitle, setEditFormTitle] = useState("");
  const [editFormDesc, setEditFormDesc] = useState("");
  const [editFormQuestions, setEditFormQuestions] = useState<Question[]>([]);

  // Form Creator state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [creatorQuestions, setCreatorQuestions] = useState<Question[]>([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState<Question["type"]>("Abierta");
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>([]);
  const [newOptionVal, setNewOptionVal] = useState("");

  // Rellenar formulario active modal / state
  const [activeFormToFill, setActiveFormToFill] = useState<CustomForm | null>(null);
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});

  // Ver respuesta seleccionada modal / state
  const [selectedResponse, setSelectedResponse] = useState<ResponseSubmission | null>(null);
  const [reviewerComment, setReviewerComment] = useState("");

  // Panel de notificaciones (Bell)
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);

  // Contadores históricos persistentes (no se pierden al eliminar formulario)
  const [historicApproved, setHistoricApproved] = useState(0);
  const [historicRejected, setHistoricRejected] = useState(0);

  const serverIp = "play.axrp.es:22003";

  // Verificación de ID de usuario especial o Rol ID administrador
  const hasAdminPermissions =
    user?.id === "1272239331020374229" ||
    user?.roles?.includes("1387893494378664107") ||
    user?.role === "Administrador" ||
    user?.role === "Creador";

  // ── NORMATIVAS COMPLETAS (fuente: normas.txt – 11 secciones, 181 normativas) ──
  const rulesCategories: RuleCategory[] = [
    {
      title: "01 · Normativas de Abogados",
      icon: "gavel",
      rules: [
        {
          id: "AB-03",
          title: "Clasificación de Delitos y Penalizaciones",
          excerpt: "Artículo 1: Delitos públicos – 90% del pago solicitado. Artículo 2: Delitos estatales – Multa RD$ y 1-2 meses de cárcel. Artículo 3: Delitos privados – 100% del pago...",
          content: "Artículo 1 — Delitos públicos\nCasos simples como demandas, daños y perjuicios entre ciudadanos tendrán una penalización de 90% del pago solicitado en la demanda de ser culpable.\n\nArtículo 2 — Delitos estatales\nCasos que afecten a la policía u entidad del gobierno tendrán una penalización de: Multa de RD$ y 1-2 meses de cárcel.\n\nArtículo 3 — Delitos privados\nDaño a propiedad privada: 100% del pago solicitado en la demanda de ser culpable.\n\nArtículo 4 — Delitos de vandalismo\nRobo a tiendas, civiles, más de 5 fichas delictivas: 2 meses de cárcel y una multa de RD$.\n\nArtículo 5 — Delitos de terrorismo\nCasos que atenten contra la nación o persona de alto perfil (ministros, jueces, presidentes): A discusión."
        },
        {
          id: "AB-02",
          title: "Guía de Procedimientos Judiciales",
          excerpt: "Artículo 1: ¿Qué hacer en un juicio? El juez recibe pruebas, no se aceptan el mismo día. Artículo 2: Documentos policiales. Artículo 3: Ceremonia judicial...",
          content: "Artículo 1 — ¿Qué hacer en un juicio? (Juez)\n1. Recibir las pruebas por parte de los dos abogados de las partes.\n2. No se aceptarán pruebas el mismo día del juicio.\n3. Buscar jurados para que participen en el juicio (si se requieren).\n4. Pautar la fecha del juicio.\n5. Realizar el juicio manteniendo el orden.\n6. Escuchar los argumentos de los abogados.\n7. Exigir al jurado que dictamine por votación su veredicto.\n8. Asegurar que el proceso no dure más de 40 minutos.\n9. Cerrar el juicio con el veredicto.\n\n(Fiscal)\n1. Proporcionar todas las pruebas al Juez.\n2. Acompañar en el proceso a la hora de realizar el juicio.\n3. No intervenir a menos que el juez se lo solicite.\n\nArtículo 2 — Documentación policial\nJuez: Tomar la solicitud, evaluar pruebas, crear el documento formal (arresto, allanamiento, incautación) y entregarlo. Velar que los operativos ocurran en un máximo de 2 semanas.\nFiscal: Tomar solicitud de oficial de alto rango, verificar pruebas, redactar el documento y participar en el operativo.\n\nArtículo 3 — Ceremonia Judicial\n1. Apertura del juicio.\n2. Presentación de partes involucradas.\n3. Presentación de argumentos y pruebas.\n4. Testificación de testigos.\n5. Palabras finales de abogados.\n6. Votación del jurado.\n7. Dictamen del veredicto y cierre."
        },
        {
          id: "AB-01",
          title: "Requisitos de Abogados y Funciones de cada Cargo",
          excerpt: "Requisitos generales: No poseer antecedentes delictivos, conocimiento de normativas, actitud imparcial. Jerarquía: Juez → Fiscal → Abogado → Asistente Legal...",
          content: "FISCALÍA ACCIÓN X RP — Requisitos Generales\n• No poseer antecedentes delictivos activos ni pertenecer a ninguna organización delictiva.\n• Conocimiento básico de las normativas del servidor, normativa policial y código penal.\n• Actitud respetuosa, imparcial y profesional en todo momento.\n• Capacidad para mantener el rol bajo presión y en situaciones de conflicto.\n• No pertenecer a bandas, carteles o organizaciones delictivas mientras ejerza el cargo, a menos que sea aprobado por la administración vía Tickets.\n• No tener favoritismo ni divulgar información de ninguna organización.\n\nJerarquía\n- Juez: Máxima autoridad / procesos penales y judiciales.\n- Fiscal: Supervisión de investigaciones y acusaciones.\n- Abogado: Asistencia y procesos legales avanzados.\n- Asistente Legal: Asistencia y documentación legal.\n\nFunciones del Juez\n• Dirigir y aprobar los procesos penales.\n• Evaluar pruebas y dictar el fallo según la ley.\n• Emitir órdenes judiciales (arrestos, allanamientos, embargos).\n• Autorizar grilletes y arrestos directos.\n\nFunciones del Fiscal\n• Participar en investigaciones de la policía.\n• Presentar pruebas ante el juez.\n• Solicitar y procesar órdenes judiciales.\n• Crear y dar seguimiento a expedientes de alto nivel.\n• Negociar acuerdos con abogados."
        }
      ]
    },
    {
      title: "02 · Reglas del Servidor: ACCIÓN X RP",
      icon: "siren",
      rules: [
        {
          id: "REG 01",
          title: "Autoridad y Aplicación de las Normas",
          excerpt: "Artículo 1: Las normas son elaboradas por el equipo administrativo. Artículo 3: Todo usuario, al ingresar, acepta y se obliga a cumplir las normativas. Artículo 4: El desconocimiento no libra de sanciones...",
          content: "Artículo 1. La presente normativa ha sido elaborada y promulgada por el equipo administrativo del servidor.\nArtículo 2. El equipo administrativo se reserva el derecho de modificar, ampliar o remover estas normas en cualquier momento, sin previo aviso.\nArtículo 3. Todo usuario, al ingresar al servidor, acepta y se obliga a cumplir las presentes normativas en su totalidad.\nArtículo 4. El desconocimiento de estas normas no libra a nadie de su cumplimiento ni de las sanciones que correspondan.\n\nEJEMPLO CORRECTO: Un usuario reporta un vacío legal en una normativa. La administración decide cómo proceder basándose en el sentido común y el bienestar del servidor, y el usuario acata la decisión aunque no esté escrita textualmente.\nEJEMPLO INCORRECTO: Un usuario argumenta que no pueden sancionarlo porque en el párrafo 3 no dice explícitamente esa palabra exacta, ignorando que la administración tiene la facultad de interpretar la intención de la norma.\n\nCONSEJO: Revisa periódicamente los canales informativos de Discord. La normativa puede ser modificada en cualquier momento; es tu responsabilidad mantenerte actualizado."
        },
        {
          id: "REG 02",
          title: "Resolución de Conflictos",
          excerpt: "Artículo 1: En situaciones no especificadas, el equipo administrativo aplicará su criterio. Artículo 2: Los objetivos son garantizar el correcto desarrollo del roleplay...",
          content: "Artículo 1. En situaciones no especificadas en las normativas, el equipo administrativo aplicará su criterio y experiencia para resolver el conflicto.\nArtículo 2. Las decisiones administrativas tendrán como objetivos principales:\n• Garantizar el correcto desarrollo del roleplay.\n• Minimizar daños o malentendidos.\n• Actuar con objetividad e imparcialidad."
        },
        {
          id: "REG 03",
          title: "Evidencia y Grabación",
          excerpt: "Grabación obligatoria en roles de alto impacto: robos, tiroteos, detenciones. Reportes sin pruebas gráficas claras serán rechazados automáticamente...",
          content: "Responsabilidad del Jugador: Es responsabilidad de cada usuario tener un respaldo gráfico de sus interacciones importantes.\n\n1. Grabación Obligatoria en roles de alto impacto:\n- Robos y atracos.\n- Tiroteos y conflictos de bandas.\n- Detenciones policiales y juicios.\n\n2. Rechazo de Reportes: Cualquier reporte sin pruebas gráficas claras (video o capturas) será rechazado automáticamente (\"Sin pruebas no hay sanción\").\n\nEJEMPLO CORRECTO: Usar Medal o Shadowplay para guardar los últimos 5 minutos de un rol donde te hicieron VDM.\nEJEMPLO CORRECTO: Presentar un clip de video completo y sin cortes donde se ve todo el contexto.\nEJEMPLO INCORRECTO: Abrir un ticket diciendo \"el ID 45 me mató gratis, créanme\" sin video.\nEJEMPLO INCORRECTO: Subir un video de 3 segundos editado donde solo se ve el disparo, sin el contexto previo.\n\nCONSEJO: Configura tu PC para grabar siempre en segundo plano (Replay Buffer)."
        },
        {
          id: "REG 04",
          title: "Nombres de Usuario",
          excerpt: "Artículo 1: El nombre debe ser claro, legible y coherente. Artículo 3: Prohibidos nombres ofensivos, de trampas o con intención de trollear. Artículo 4: Nombres troll = expulsión inmediata...",
          content: "Artículo 1. Todo nombre de usuario deberá ser claro, legible y coherente.\nArtículo 2. Se prohíben nombres generados al azar, con abreviaciones excesivas, caracteres especiales innecesarios o de carácter decorativo.\nArtículo 3. Queda prohibido el uso de nombres ofensivos, provocadores, inapropiados, que hagan referencia a trampas, cheats o con intención de \"trollear\".\nArtículo 4. El uso de nombres troll será sancionado con la expulsión inmediata del servidor, sin previo aviso.\n\nEJEMPLO CORRECTO: El usuario se llama \"Randy\" en MTA:SA. En Discord, su apodo en el servidor es también \"Randy\", y en el juego figura igual.\nEJEMPLO INCORRECTO: Llamarse \"JuanPerez\" en MTA:SA pero tener el nombre \"ElDestructor\" en Discord."
        },
        {
          id: "REG 05",
          title: "Coincidencia de Nombres en Plataformas",
          excerpt: "Artículo 1: El nombre de usuario en Discord y MTA:SA deberá coincidir en todas las plataformas...",
          content: "Artículo 1. El nombre de usuario en Discord y MTA:SA deberá coincidir en todas las plataformas.\nArtículo 2. El incumplimiento de esta norma podrá conllevar sanciones administrativas.\n\nCONSEJO: Esto es esencial para que los sistemas automáticos (Whitelist y Logs) funcionen correctamente. Si cambias tu nombre en MTA:SA, actualízalo inmediatamente en Discord."
        },
        {
          id: "REG 06",
          title: "Abandono del Servidor",
          excerpt: "Artículo 1: Quien abandone el servidor de Discord deberá reiniciar el proceso de Whitelist desde cero, incluyendo revisión de historia del personaje y nueva entrevista...",
          content: "Artículo 1. Quien abandone el servidor de Discord deberá reiniciar el proceso de Whitelist desde cero, incluyendo:\n• Revisión o reenvío de la historia del personaje.\n• Nueva entrevista de Whitelist.\nArtículo 2. Se recomienda reflexionar antes de abandonar el servidor para no perder acceso a los roles de Whitelist."
        },
        {
          id: "REG 08",
          title: "Programas Externos",
          excerpt: "Artículo 1: Prohibido cualquier programa o mod externo al cliente de MTA:SA, salvo grabación o efectos visuales. Artículo 3: Prohibido jugar con resoluciones estiradas (4:3 o 5:4)...",
          content: "Artículo 1. Queda prohibido el uso de cualquier programa o mod externo al cliente de MTA:SA, salvo aquellos destinados a grabación o efectos visuales sin alterar jugabilidad.\nArtículo 2. Está prohibido el uso de skins modificados o personajes alterados de forma no autorizada, siendo sancionable con expulsión permanente.\nArtículo 3. Queda prohibido jugar con resoluciones estiradas (4:3 o 5:4).\nArtículo 4. El uso de programas como ReShade para alterar la resolución será sancionado; está prohibido en su totalidad, ni siquiera para las miras, ya que el servidor trae su propia mira modificable."
        },
        {
          id: "REG 09",
          title: "Bugs y el Dupeo",
          excerpt: "Artículo 1: Aprovecharse de bugs o glitches conlleva expulsión permanente. Artículo 3: El dupeo de objetos, armas o dinero está prohibido y se sanciona con expulsión inmediata...",
          content: "Artículo 1. Aprovecharse de bugs, glitches o exploits conllevará expulsión permanente.\nArtículo 2. Los bugs deberán reportarse inmediatamente al staff.\nArtículo 3. El dupeo (multiplicación de ítems) de objetos, armas, dinero o similares está prohibido y se sancionará con expulsión inmediata.\nArtículo 4. Quien conozca un caso de dupeo y no lo reporte será sancionado de igual forma."
        },
        {
          id: "REG 10",
          title: "Donaciones",
          excerpt: "El servidor es gratuito. Las donaciones son voluntarias y no otorgan ventajas competitivas (No Pay to Win). Donar no convierte al usuario en administrador ni le da inmunidad...",
          content: "El servidor es totalmente gratuito. Las donaciones existen únicamente para ayudar a sostener y mejorar el servidor.\n\nArtículo 1 — Carácter voluntario: Las donaciones son 100% voluntarias. Nadie está obligado a donar para jugar.\nArtículo 2 — No Pay to Win: Las donaciones no otorgan ventajas competitivas ni influyen en el desarrollo del rol. Solo podrán otorgarse recompensas estéticas.\nArtículo 3 — Donar no es comprar: Las donaciones no son una transacción comercial, sino un apoyo económico al proyecto.\nArtículo 4 — Prohibición de comercio: Está terminantemente prohibido vender, intercambiar o transferir objetos o beneficios obtenidos por donación.\nArtículo 5 — Donar no otorga autoridad: Donar no convierte al usuario en dueño, administrador ni autoridad. Todos los jugadores están sujetos a las mismas normas."
        },
        {
          id: "REG 11",
          title: "Multicuentas",
          excerpt: "Artículo 1: Se prohíbe el uso de multicuentas. Artículo 2: Prohibido tener múltiples cuentas con whitelist activa. Artículo 3: Sanción = expulsión permanente de todas las cuentas relacionadas...",
          content: "Artículo 1. Se prohíbe el uso de multicuentas.\nArtículo 2. Está prohibido tener múltiples cuentas con whitelist activa.\nArtículo 3. La sanción por incumplimiento será expulsión permanente de todas las cuentas relacionadas.\n\nEJEMPLO CORRECTO: Tienes una única cuenta de Steam y Discord vinculada al servidor y juegas con tus personajes siempre desde esa misma cuenta.\nEJEMPLO CORRECTO: Si compartes IP con un hermano, notificas a la administración mediante ticket para que sepan que son dos personas físicas distintas.\nEJEMPLO INCORRECTO: Tu cuenta principal fue baneada temporalmente y creas otra cuenta para entrar mientras tanto. (Ban permanente en ambas).\nEJEMPLO INCORRECTO: Crear una cuenta secundaria para usarla como \"almacén\" o para pasar dinero a tu cuenta principal."
        },
        {
          id: "REG 12",
          title: "Reportes y Apelaciones",
          excerpt: "Artículo 1: Los reportes deberán presentarse con pruebas gráficas o grabaciones claras. Artículo 4: Tres sanciones iguales conllevarán sanción más severa...",
          content: "Artículo 1. Los reportes deberán presentarse con pruebas gráficas o grabaciones claras.\nArtículo 2. Reportes sin contexto completo serán rechazados.\nArtículo 3. Generar apelaciones sin pruebas o con pruebas inválidas será sancionable.\nArtículo 4. Tres sanciones iguales conllevarán sanción administrativa más severa.\nArtículo 5. El staff podrá sancionar sin previo aviso una vez confirmado un reporte.\nArtículo 6. Toda apelación deberá realizarse por ticket, revisado por Asuntos Internos en un plazo máximo de cinco días.\nArtículo 7. No se tolerará falta de respeto hacia el staff en el proceso de apelación.\nArtículo 8. Esta normativa podrá actualizarse y es responsabilidad del usuario mantenerse informado.\n\nCONSEJO IMPORTANTE: Si decides apelar un reporte, se te retirará la WL mientras se esté revisando tu caso (máximo 5 días)."
        },
        {
          id: "REG 13",
          title: "Segundo Personaje (Slot 2)",
          excerpt: "Artículo 1: El segundo slot permite desarrollar un rol alterno. Artículo 2: Los personajes de distintos slots no podrán tener relación alguna entre sí. Artículo 5: Prohibido el traspaso de dinero o bienes entre slots...",
          content: "Artículo 1. El segundo slot permite desarrollar un rol alterno, aprobado mediante ficha de personaje por el equipo de whitelist.\nArtículo 2. Los personajes de distintos slots no podrán tener relación alguna entre sí.\nArtículo 3. Si el personaje principal pertenece a la policía, el segundo no podrá estar vinculado a actividades criminales, y viceversa.\nArtículo 4. Está prohibido intervenir en roles que beneficien a otro personaje propio.\nArtículo 5. Está prohibido el traspaso de dinero o bienes entre slots.\nArtículo 6. El segundo slot deberá interpretarse como un personaje nuevo en la ciudad.\nArtículo 7. Está prohibido crear personajes con aspecto de niños, adolescentes, animales, desnudos o fuera de la coherencia del rol.\n\nCONSEJO: Piensa en tus personajes como dos personas que viven en universos paralelos: no se conocen, no son \"primos\" y no pueden ayudarse entre sí."
        },
        {
          id: "REG 15",
          title: "Autoridad Administrativa en Vivo",
          excerpt: "La decisión del administrador que está observando la escena en tiempo real prevalece sobre la normativa escrita. Si no estás de acuerdo, obedece en el momento y reclama después vía ticket...",
          content: "Jerarquía de Decisión: En situaciones de rol en vivo donde interviene un administrador:\n\n- Prevalencia: La decisión o instrucción dada por el administrador que está observando la escena en tiempo real prevalece sobre la normativa escrita o la interpretación de los usuarios.\n- El objetivo es resolver conflictos al momento para no detener el rol de todos los presentes.\n- Si el usuario no está de acuerdo, debe obedecer en el momento y reclamar después vía ticket, NUNCA discutir en medio de la escena.\n\nEJEMPLO CORRECTO: Un admin dice \"Cancelen este rol, hubo un bug\". Todos dejan de disparar y se van.\nEJEMPLO INCORRECTO: Ponerse a discutir con el admin en medio de la plaza citando el reglamento.\nEJEMPLO INCORRECTO: Desconectarse porque no te gustó la decisión del admin.\n\nCONSEJO: Discutir con un admin en medio de un rol suele acabar peor que el propio error de rol. Obedece, calla y luego abre ticket con pruebas."
        },
        {
          id: "REG 16",
          title: "Plazos de Reporte (48 Horas)",
          excerpt: "Los reportes deben presentarse en un máximo de 48 horas después de ocurrido el hecho. Pasado este tiempo, el reporte se considerará extemporáneo y será cerrado sin revisión...",
          content: "Plazo Máximo: Los reportes deben presentarse en un máximo de 48 horas después de ocurrido el hecho.\nPasado este tiempo, el reporte se considerará extemporáneo y será cerrado sin revisión, salvo casos excepcionales de corrupción masiva o hacks detectados tardíamente.\n\nEJEMPLO CORRECTO: Te roban mal el lunes a las 18:00 y subes el reporte el martes a las 10:00 (dentro del plazo).\nEJEMPLO INCORRECTO: Reportar hoy que alguien te insultó hace 2 semanas porque ahora te cae mal.\nEJEMPLO INCORRECTO: Esperar 3 días para subir el video porque \"se te olvidó\".\n\nCONSEJO: No reportes \"en caliente\". Tómate un rato para calmarte, revisa el video y súbelo. Pero no dejes pasar más de dos días."
        },
        {
          id: "REG 18",
          title: "Fases de Muerte – Fase 1: Herido",
          excerpt: "Duración: 1 minuto. Durante esta fase el personaje puede arrastrarse, hablar, usar radio y responder llamadas. SOLO puedes irte con María si no estás en rol activo...",
          content: "FASE 1: HERIDO (Duración: 1 minuto)\nDurante esta fase el personaje puede:\n- Arrastrarse\n- Hablar\n- Usar radio\n- Responder llamadas\n\nDespués de 1 minuto aparecerá la opción de irse con María ($300).\n\nSOLO puedes irte con María si se cumplen TODAS estas condiciones:\n- No estás en rol activo.\n- No hay personas en la zona interactuando contigo.\n- No existe conflicto abierto relacionado contigo.\n- No estás siendo buscado, retenido o vigilado.\n- No estás involucrado en rol agresivo reciente (aunque estén a distancia).\n\nEl rol termina ÚNICAMENTE cuando:\n- Todos los involucrados abandonan la zona.\n- No existe intención de continuar la escena.\n- Han pasado mínimo 2 minutos sin interacción.\n\n- Si te vas con María → PK obligatorio.\n- Si EMS te levanta → Puedes recordar el rol."
        },
        {
          id: "REG 19",
          title: "Fases de Muerte – Fase 2: Desangrándote",
          excerpt: "Puedes hablar pero NO puedes usar radio ni responder llamadas. Está TERMINANTEMENTE PROHIBIDO irte con María si hay rol activo o hay personas en la zona...",
          content: "FASE 2: DESANGRÁNDOTE\n- Puedes hablar.\n- NO puedes usar radio.\n- NO puedes responder llamadas.\n- NO puedes interactuar.\n\nEstá TERMINANTEMENTE PROHIBIDO irte con María si:\n- Hay rol activo.\n- Hay personas en la zona.\n- Existe posibilidad real de que te auxilien.\n- Estás bajo custodia o intervención policial.\n- Debes esperar el cierre completo del rol.\n\n- Si te vas con María → PK obligatorio sin discusión.\n- Si EMS te levanta → Puedes recordar el rol parcialmente."
        },
        {
          id: "REG 20",
          title: "Fases de Muerte – Fase 3: Inconsciente",
          excerpt: "Personaje totalmente inconsciente. No hay comunicación ni interacción. Puedes irte con María si no hay nadie en la zona. El EMS no puede ayudarte en esta fase...",
          content: "FASE 3: INCONSCIENTE\n- Personaje totalmente inconsciente.\n- No hay comunicación ni interacción.\n\nPuedes irte con María si:\n- No hay nadie en la zona.\n- Debes quedarte en la zona para no desaparecer en la cara de alguien.\n- No te puede ayudar EMS ni nadie puede llevarte a médico chino porque el rol terminó para ti.\n\nCASO ESPECIAL: Si estás detenido con un policía y estás recibiendo atención médica y tienes pocos segundos de haber pasado a esta fase:\n- El rol continúa hasta que el procedimiento termine.\n- No puedes usar la fase para evadir arresto, investigación o consecuencias.\n- Pero si el EMS llegó cuando ya estabas inconsciente, es tarde: el rol acabó.\n\nEn este estado el personaje no recuerda nada del rol anterior → 100% PK."
        },
        {
          id: "REG 21",
          title: "Zonas del Servidor – Zona Segura",
          excerpt: "La Zona Segura es un espacio de neutralidad absoluta donde queda prohibida cualquier acción que pueda generar tensión, intimidación, presión o conflicto, directa o indirectamente...",
          content: "ZONA SEGURA\nEspacio de neutralidad absoluta donde queda prohibida cualquier acción que pueda generar tensión, intimidación, presión o conflicto.\n\nProhibición total de Rol Agresivo. Se considera Rol Agresivo cualquier conducta que implique, sugiera o prepare:\n- Violencia física\n- Amenaza directa o indirecta\n- Intimidación, coacción, extorsión\n- Presión psicológica\n- Seguimiento con intención hostil\n- Mostrar armas aunque no se usen\n- Insinuar represalias\n\nProhibiciones específicas en Zona Segura:\n- Discutir con tono hostil.\n- Sacar información para usarse en roles agresivos.\n- Amenazar, seguir o vigilar con intención sospechosa.\n- Esperar \"afuera\" con intención conflictiva.\n\nCONSEJO: Las zonas seguras llevan ese nombre por una razón. Hay lugar y momento para todo."
        },
        {
          id: "REG 22",
          title: "Zonas del Servidor – Zona Vigilada",
          excerpt: "La Zona Vigilada es un área monitoreada donde se permite tensión narrativa controlada, pero se prohíbe cualquier acto delictivo o violento. Aquí se permite presión verbal...",
          content: "ZONA VIGILADA\nÁrea monitoreada donde se permite tensión narrativa controlada, pero se prohíbe cualquier acto delictivo o violento.\n\nProhibiciones absolutas en Zona Vigilada:\n- Secuestrar o intentar secuestrar.\n- Robar o intentar robar.\n- Agredir físicamente.\n- Disparar o blandir armas.\n- Retener contra voluntad.\n- Bloquear físicamente el paso.\n- Forzar subida a vehículos.\n\nNo importa si \"es rápido\" o \"solo fue un segundo\". Está prohibido.\n\nConductas permitidas (con límites):\n- Discutir, advertir, amenazar verbalmente, presionar verbalmente.\n- Intentar obtener información mediante diálogo intenso.\nSiempre que no haya contacto físico ni se limite la movilidad, y se permita la salida real de la situación.\n\nCONSEJO: En zonas vigiladas puedes ser un poco más agresivos verbalmente, pero siempre con control."
        },
        {
          id: "REG 23",
          title: "Cláusula Anti-Abuso (Zonas)",
          excerpt: "Artículo 1: Cualquier intento de aprovechar vacíos interpretativos será sancionado. Artículo 3: La administración tiene la última palabra en interpretación...",
          content: "Artículo 1: Cualquier intento de aprovechar vacíos interpretativos será sancionado.\nArtículo 2: La norma se interpreta bajo el principio de protección del entorno.\nArtículo 3: La administración tiene la última palabra en interpretación.\nArtículo 4: El desconocimiento no exime de sanción.\nArtículo 5: Las zonas no son excusa para provocar reacciones fuera de ellas.\n\nPRINCIPIO GENERAL: Si la escena genera miedo, coacción, sensación de amenaza o restricción de libertad:\n- En Zona Segura → Sanción inmediata.\n- En Zona Vigilada → Sanción si existe delito o limitación física."
        },
        {
          id: "REG 24",
          title: "Uso de Artículos",
          excerpt: "Artículo 1: Si recibes un ítem de un administrador para ejercer un rol específico, debes reportarlo y devolverlo al finalizar. Artículo 2: Usarlo para beneficio personal es sancionable...",
          content: "Artículo 1: En caso de recibir un ítem por parte de un administrador o fue entregado para ejercer un rol específico, debes reportarlo y devolverlo al finalizar dicho rol.\nArtículo 2: Si no entregas dicho ítem y lo usas para beneficio personal, serás sancionado.\n\nCONSEJO: Si te lo entregaron para un rol, devuélvelo."
        },
        {
          id: "REG 25",
          title: "Depuración de Sanciones por Inactividad",
          excerpt: "Para que una sanción sea eliminada, el usuario deberá cumplir con un mínimo de 30 días de actividad continua y participativa dentro del servidor...",
          content: "Objetivo: Fomentar la actividad constante dentro de la ciudad y evitar el abuso del sistema de sanciones.\n\n1. Requisito de actividad obligatoria: Mínimo de 30 días de actividad continua dentro del servidor.\n2. Definición de actividad válida: Solo se considera actividad válida el tiempo roleando de manera activa y participativa. NO cuenta permanecer AFK, conectarse sin interactuar, o actividad mínima para evadir esta normativa.\n3. Control y verificación: El equipo administrativo evaluará tanto el tiempo como la calidad del rol.\n4. Restricción por inactividad: Si un usuario no cumple con el requisito, sus sanciones no serán eliminadas, sin excepción.\n5. Objetivo de la normativa: Evitar que usuarios dejen de rolear intencionalmente esperando que sus sanciones desaparezcan."
        },
        {
          id: "REG 27",
          title: "Reinicio del Servidor",
          excerpt: "Artículo 1: Está prohibido realizar roles agresivos al momento de que lance el anuncio de reinicio. Artículo 2: Si ya estás en un rol agresivo, debes detenerlo hasta que se reinicie...",
          content: "Artículo 1: Esta prohibido realizar roles agresivos al momento de que lance el anuncio de reinicio del servidor.\nArtículo 2: Si ya estás en un rol agresivo al momento del mensaje de reinicio, debes detenerlo hasta que se reinicie y luego continuarlo cuando todos los involucrados entren. De ser necesario, pedir ayuda a un administrador vía /report.\nArtículo 3: El incumplimiento de esta normativa llevará sanciones administrativas."
        }
      ]
    },
    {
      title: "03 · Conceptos Básicos de Roleplay",
      icon: "book",
      rules: [
        {
          id: "CON 1",
          title: "IC & OOC",
          excerpt: "IC (In Character): Todo lo que pertenece al personaje dentro del juego. OOC (Out of Character): Todo lo externo al juego. Está prohibido utilizar lenguaje OOC dentro del juego...",
          content: "IC (In Character): Todo lo que pertenece al personaje: pensamientos, decisiones, conocimientos y acciones dentro del juego.\nOOC (Out of Character): Todo lo externo al juego: Discord, vida real, chats, streams, problemas personales.\n\nEstá terminantemente prohibido utilizar lenguaje OOC dentro del juego (ej: decir \"músculo\", \"error de matrix\", \"estoy en la nube\").\n\nEJEMPLO CORRECTO: Un personaje es amenazado con un arma. Aunque el jugador no tenga miedo en la vida real, su personaje reacciona con pánico, levanta las manos y obedece, valorando su vida.\nEJEMPLO CORRECTO: Si necesitas avisar de un problema técnico, escribes por el chat OOC (/b), pero nunca lo dices por voz mientras tu personaje está hablando.\nEJEMPLO INCORRECTO: Decir \"me duele el músculo E\" o \"Tengo un error de matrix\" dentro del juego.\nEJEMPLO INCORRECTO: Estar en una negociación y empezar a hablar por voz sobre el partido de fútbol de tu casa.\n\nCONSEJO: Tu personaje no eres tú. Tiene su propia vida y límites. Los problemas OOC no se rolan."
        },
        {
          id: "CON 2",
          title: "Metagaming (MG)",
          excerpt: "Uso de información obtenida fuera del rol (Discord, Streams, WhatsApp) para beneficiar o afectar a un personaje dentro del juego. Estrictamente prohibido...",
          content: "Se considera Metagaming (MG) el uso de información obtenida fuera del rol para beneficiar o afectar a un personaje dentro del juego.\n\nQueda estrictamente prohibido:\n- Utilizar información de streams, Discord, chats OOC para tomar decisiones dentro del rol.\n- Localizar o identificar a un personaje mediante información obtenida fuera del entorno del rol.\n- Aprovechar errores técnicos, bugs o mecánicas del sistema sin justificación roleada.\n- Reconocer a un jugador enmascarado por su voz, ropa, peinado, complexión física o estilo de caminar.\n- Los tatuajes y marcas visibles SOLO pueden servir como punto de inicio de una investigación.\n\nEJEMPLO CORRECTO: Tu mejor amigo se acerca con máscara completa. Aunque reconoces su voz, tu personaje actúa como si fuera un desconocido.\nEJEMPLO INCORRECTO: Ver en kick dónde está la policía y tomar otra ruta basándote en el video.\nEJEMPLO INCORRECTO: Decir \"¡Eh Juan, sé que eres tú, reconozco tus zapatos!\" cuando lleva máscara completa."
        },
        {
          id: "CON 3",
          title: "Powergaming (PG)",
          excerpt: "Consiste en realizar acciones que serían imposibles en la vida real o forzar una situación de rol sin dar oportunidad de respuesta a la contraparte...",
          content: "Consiste en realizar acciones que serían imposibles en la vida real o forzar una situación de rol sin dar oportunidad de respuesta a la contraparte.\n\nNota: En ACCIÓN X RP se permite un PG \"ligero\" (ej: conducción arcade) siempre que se mantenga una lógica interna y no se fuerce rol a terceros."
        },
        {
          id: "CON 4",
          title: "NVVPJ – No Valorar la Vida del Personaje",
          excerpt: "Todo jugador debe priorizar la supervivencia de su personaje ante amenazas reales. Está prohibido insultar, provocar o resistirse cuando se está encañonado o en clara desventaja...",
          content: "Todo jugador debe priorizar la supervivencia de su personaje ante amenazas reales.\nNo mostrar miedo ni respeto por situaciones de riesgo real está prohibido.\nEstá prohibido insultar, provocar o resistirse cuando se está encañonado o en clara desventaja sin motivo válido.\n\nEJEMPLO CORRECTO: Tres pandilleros armados te rodean y te apuntan a la cabeza. Levantas las manos y colaboras para que no te disparen.\nEJEMPLO CORRECTO: Eres policía solo y te encuentras con cuatro criminales armados. Te retiras, pides refuerzos y esperas ayuda.\nEJEMPLO INCORRECTO: Tienes a dos personas apuntándote a la cara a un metro de distancia. Sacas tu arma e intentas matarlos a ambos.\nEJEMPLO INCORRECTO: Estás secuestrado, atado a una silla y con un cuchillo en la garganta y le dices \"córtame si tienes huevos\".\n\nCONSEJO: Recuerda que el dinero y los objetos se recuperan, la vida no. Entregar tus pertenencias en un robo no es perder el rol, es continuar la historia."
        },
        {
          id: "CON 5",
          title: "Deathmatch (DM) y Vehicle Deathmatch (VDM)",
          excerpt: "DM: Atacar o matar a otro jugador sin una razón de rol válida o historia previa. VDM: Utilizar un vehículo como arma para atropellar o dañar a otros jugadores sin justificación...",
          content: "DM (Deathmatch): Atacar o matar a otro jugador sin una razón de rol válida o historia previa.\nVDM (Vehicle Deathmatch): Utilizar un vehículo como arma para atropellar o dañar a otros jugadores sin justificación.\n\nEJEMPLO CORRECTO: Tienes un accidente de tráfico con otro jugador. Se bajan, discuten y la situación escala hasta una pelea a puños. (Hay interacción previa).\nEJEMPLO INCORRECTO: Ver a un jugador parado en una gasolinera y dispararle desde lejos sin haberle dicho una palabra ni tener ningún motivo de rol.\nEJEMPLO INCORRECTO: Entrar a toda velocidad en una zona y atropellar deliberadamente a un grupo de personas.\n\nREGLA DE ORO: \"No hables con las balas\". Siempre debe haber una interacción verbal o historia previa antes de la agresión física."
        },
        {
          id: "CON 6",
          title: "RK – Revenge Kill",
          excerpt: "Vengarte luego de morir regresando a la escena. Estrictamente prohibido. Morir corta la historia de esa escena...",
          content: "Consiste en vengarte luego de morir regresando a la escena donde te eliminaron para atacar a quien te mató.\n\nEJEMPLO CORRECTO: Olvidas el conflicto tras tu muerte.\nEJEMPLO INCORRECTO: Volver armado a matar al que te mató.\n\nCONSEJO: Morir corta la historia de esa escena. El RK no solo está prohibido sino que arruina la experiencia de todos."
        },
        {
          id: "CON 7",
          title: "PK – Player Kill",
          excerpt: "Muerte parcial del personaje: olvido de los últimos eventos del rol. No puedes buscar venganza usando la memoria completa de lo ocurrido antes de morir...",
          content: "Muerte parcial del personaje: el jugador olvida los últimos eventos relacionados con esa muerte específica.\n\nEJEMPLO CORRECTO: No recuerdas quién te disparó.\nEJEMPLO INCORRECTO: Buscar venganza con memoria completa de lo que pasó antes de morir.\n\nCONSEJO: Respeta siempre el alcance del PK."
        },
        {
          id: "CON 8",
          title: "CK – Character Kill",
          excerpt: "Muerte definitiva del personaje. Al aplicarse un CK, el personaje desaparece para siempre y debes crear uno completamente nuevo sin relación con el anterior...",
          content: "Muerte definitiva del personaje. Al aplicarse un CK, el personaje desaparece para siempre.\n\nEJEMPLO CORRECTO: Creas un nuevo personaje sin relación con el anterior.\nEJEMPLO INCORRECTO: Volver con la misma historia, nombre o trasfondo del personaje muerto.\n\nCONSEJO: Un CK se respeta, no se negocia."
        },
        {
          id: "CON 9",
          title: "Forzar Rol",
          excerpt: "Ocurre cuando decides o impones acciones, estados físicos o consecuencias sobre otro personaje sin darle la posibilidad de reaccionar o decidir dentro de la lógica del rol...",
          content: "Forzar rol ocurre cuando decides o impones acciones, estados físicos o consecuencias sobre otro personaje, sin darle la posibilidad de reaccionar, defenderse o decidir dentro de la lógica del rol.\n\nTú describes lo que intentas hacer.\nEl otro jugador decide cómo reacciona, siempre respetando la lógica y las normas.\n\nForzar rol rompe la libertad narrativa, convierte el rol en un guion unilateral y elimina el factor humano.\n\nPRINCIPIO CLAVE: Nadie puede decidir por tu personaje excepto tú. Ni su estado físico, ni sus emociones, ni sus acciones."
        },
        {
          id: "CON 10",
          title: "Evasión de Rol",
          excerpt: "Se considera evasión: desconectarse o permanecer AFK durante un rol activo, utilizar la excusa de inactividad para desaparecer de un conflicto, caer al vacío en persecución...",
          content: "Se considera evasión y será sancionado:\n- Desconectarse o permanecer AFK (+10 minutos) durante un rol activo.\n- Utilizar la excusa de \"inactividad\" para desaparecer de un conflicto.\n- Caer al vacío en persecución y no enviar un entorno (/911) tras reaparecer.\n\nEJEMPLO CORRECTO: Estás siendo detenido y se te cierra el juego. Entras de nuevo lo más rápido posible y escribes por OOC para retomar el rol.\nEJEMPLO INCORRECTO: Te acaban de abatir en un tiroteo y para no perder tus armas presionas ALT+F4 y te desconectas.\nEJEMPLO INCORRECTO: Te apuntan para robarte y finges no estar en el PC durante 15 minutos.\n\nCONSEJO: Si tienes una emergencia real, avísalo por /b o /ooc antes de desconectarte si es posible."
        },
        {
          id: "CON 11",
          title: "Fair Play en Roleplay",
          excerpt: "Interpretar tu personaje de forma honesta, coherente y respetuosa, priorizando la historia y la experiencia colectiva por encima de ganar, vengarte o lucirte...",
          content: "Interpretar tu personaje de forma honesta, coherente y respetuosa, priorizando la historia y la experiencia colectiva por encima de ganar, vengarte o lucirte.\n\nPrincipios:\n- No buscar ventaja fuera del rol: nada de abusar de mecánicas, bugs o vacíos de normativa.\n- Aceptar consecuencias: si te agarraron, te agarraron.\n- Respetar la reacción del otro: tú propones acciones, el otro decide cómo reacciona.\n- Pensar como tu personaje, no como jugador: cero información externa, cero mentalidad de videojuego.\n- Cuidar la escena: el objetivo es que el rol sea creíble, no \"ganar\".\n\nEJEMPLO CORRECTO: Aceptar un robo bien roleado aunque te perjudique.\nEJEMPLO INCORRECTO: Forzar una huida imposible porque \"tengo skill\".\n\nCONSEJO: Fair play es hacer lo correcto para el rol, incluso cuando te conviene hacer trampa."
        }
      ]
    },
    {
      title: "04 · Normativas Delictivas",
      icon: "alert",
      rules: [
        {
          id: "DEL 29.1",
          title: "Secuestro entre Organizaciones",
          excerpt: "Normativa que regula los secuestros entre organizaciones delictivas. Solo puede ejecutarse bajo condiciones específicas de tensión entre bandas aprobadas...",
          content: "El secuestro entre organizaciones está regulado y solo puede ejecutarse bajo condiciones específicas de tensión y conflicto entre bandas que hayan sido previamente declaradas enemigas. Requiere rol previo y contexto narrativo establecido."
        },
        {
          id: "DEL 44",
          title: "Uso de Armamento Policial",
          excerpt: "Normativa sobre la obtención y uso de armamento policial por parte de organizaciones delictivas. Solo es posible con rol elaborado y bajo condiciones específicas...",
          content: "El uso de armamento policial por parte de delincuentes está sujeto a una normativa estricta. Solo es posible su obtención mediante rol elaborado (asalto a oficial, corrupción policial con supervisión de staff) y su uso debe ser justificado dentro del contexto del rol."
        },
        {
          id: "DEL 45",
          title: "Uso de Helicóptero como Método de Huida",
          excerpt: "Está regulado el uso de helicópteros como método de escape en situaciones delictivas. Requiere rol previo justificado y no puede usarse como ventaja arbitraria...",
          content: "El uso de helicópteros como método de huida en situaciones delictivas está regulado. Requiere:\n- Rol previo justificado (piloto en la organización, planificación previa).\n- No puede usarse como ventaja arbitraria sin narrativa.\n- El uso indiscriminado será sancionado por la administración."
        },
        {
          id: "DEL 46",
          title: "Normativa Oficial – CK entre Organizaciones",
          excerpt: "El Character Kill entre organizaciones está estrictamente regulado. Solo puede solicitarse bajo condiciones específicas de conflicto declarado entre bandas con aprobación del staff...",
          content: "El CK (Character Kill) entre organizaciones está estrictamente regulado:\n\n- Solo puede solicitarse bajo condiciones específicas de conflicto declarado entre bandas.\n- Debe contar con aprobación del staff y evidencia del contexto narrativo que lo justifica.\n- Los líderes de ambas organizaciones deben estar informados.\n- El proceso requiere un ticket formal ante la administración con toda la documentación del conflicto."
        },
        {
          id: "DEL 47",
          title: "Reingreso a Organizaciones",
          excerpt: "Normativa que regula el reingreso de un personaje a una organización delictiva tras haber salido de ella. Aplican restricciones temporales y de narrativa...",
          content: "El reingreso a organizaciones delictivas está sujeto a:\n- Restricciones temporales (mínimo de tiempo fuera de la organización antes de poder reingresar).\n- Justificación narrativa coherente dentro del rol.\n- Aprobación del líder de la organización y, en ciertos casos, del staff.\n- No se permite el reingreso inmediato tras una expulsión por traición u otro conflicto serio."
        }
      ]
    },
    {
      title: "05 · Guía Policial",
      icon: "shield",
      rules: [
        {
          id: "PC-11",
          title: "Regla Vehículos Impound",
          excerpt: "Normativa sobre el impound de vehículos. Los vehículos decomisados deben seguir un protocolo específico de documentación, registro y notificación al propietario...",
          content: "Los vehículos decomisados deben seguir el siguiente protocolo:\n1. Documentar el motivo del impound con fotografías o evidencia de rol.\n2. Registrar el vehículo y sus propietarios en el sistema policial.\n3. Notificar al propietario mediante los canales de comunicación establecidos.\n4. El vehículo no puede ser liberado sin el proceso formal correspondiente.\n5. Los plazos de retención están determinados por la gravedad de la infracción."
        },
        {
          id: "PC-15",
          title: "Cacheo",
          excerpt: "Protocolo oficial de cacheo policial. El cacheo debe realizarse con previo aviso, respetando los límites establecidos en la normativa general de cacheo...",
          content: "El cacheo debe realizarse siguiendo el protocolo oficial:\n1. Aviso previo al individuo a cachear con la orden correspondiente.\n2. El individuo debe cooperar o puede ser detenido por obstrucción.\n3. El cacheo policial tiene alcances más amplios que el cacheo civil.\n4. Se debe documentar lo encontrado en el reporte correspondiente.\n5. Se aplican los límites de la normativa general de cacheo (GEN 1, GEN 02, GEN 03)."
        },
        {
          id: "PC-19",
          title: "Guía de Armamento Policial",
          excerpt: "Guía oficial sobre los tipos de armamento autorizados para cada rango policial. El uso fuera del protocolo establecido puede conllevar sanciones internas y administrativas...",
          content: "El armamento policial está asignado por rango y situación:\n- Patrulleros: Arma reglamentaria estándar.\n- Agentes de élite: Arsenal extendido (solo bajo órdenes y situaciones específicas).\n- Uso de armamento de alto calibre: Solo autorizado en situaciones de emergencia extrema o declaración de alerta máxima.\n\nEl uso fuera del protocolo establecido puede conllevar sanciones internas y administrativas."
        },
        {
          id: "PC-21",
          title: "Código Robert",
          excerpt: "Protocolo de emergencia policial. El Código Robert es activado ante situaciones de extrema urgencia que requieren respuesta máxima de todas las unidades disponibles...",
          content: "El Código Robert es el protocolo de emergencia máxima policial:\n- Se activa cuando hay una amenaza de alto riesgo para la vida de agentes o civiles.\n- Todas las unidades disponibles deben responder de inmediato.\n- Se establece un perímetro de seguridad y se cortan vías de escape.\n- El mando superior toma el control total de la operación.\n- Se coordina con EMS para atención médica inmediata."
        },
        {
          id: "PC-23",
          title: "CK a Organizaciones",
          excerpt: "Protocolo policial para la ejecución de Character Kill a miembros de organizaciones delictivas. Requiere evidencia sólida, aprobación del staff y coordinación con fiscalía...",
          content: "La policía puede solicitar un CK a miembros de organizaciones bajo las siguientes condiciones:\n1. Evidencia sólida y documentada del historial delictivo.\n2. Aprobación formal del staff mediante ticket.\n3. Coordinación obligatoria con la fiscalía del servidor.\n4. El proceso requiere un juicio formal o una operación de alto riesgo aprobada.\n5. No puede ejecutarse arbitrariamente sin el proceso establecido."
        }
      ]
    },
    {
      title: "06 · Normativas Generales: ACCIÓN X RP",
      icon: "scroll",
      rules: [
        {
          id: "GEN 1",
          title: "Normas de Cacheo y Límites de Curación",
          excerpt: "Normativa general que establece los límites del cacheo entre civiles y los límites de curación en situaciones de rol. Aplica a todos los roles...",
          content: "Normas generales de cacheo:\n- El cacheo entre civiles tiene límites más estrictos que el policial.\n- No se puede cachear a alguien sin un contexto de rol que lo justifique.\n- El cacheo forzado sin arma apuntada es Powergaming.\n\nLímites de curación:\n- La curación en medio de un tiroteo activo no está permitida.\n- Solo EMS puede curar en zonas de conflicto activo.\n- Los ítems de curación tienen un tiempo de aplicación roleado."
        },
        {
          id: "GEN 02",
          title: "Cacheo Delincuente",
          excerpt: "Normativa específica sobre cómo un delincuente puede cachear a otro jugador. Requiere superioridad armada, contexto de rol y no puede realizarse en zonas seguras...",
          content: "Para que un delincuente pueda cachear a otro jugador:\n1. Debe tener superioridad armada (arma apuntando o contexto de amenaza establecido).\n2. Debe existir contexto de rol que justifique la acción (robo, extorsión, etc.).\n3. No puede realizarse en zonas seguras o vigiladas (ver REG 21 y REG 22).\n4. El cacheado debe poder reaccionar de forma lógica antes de que se ejecute."
        },
        {
          id: "GEN 03",
          title: "Cacheo Policial",
          excerpt: "Normativa específica sobre el cacheo policial. La policía tiene más autoridad para realizar cacheos pero debe seguir el protocolo establecido en las normativas policiales...",
          content: "El cacheo policial tiene mayor alcance que el civil pero debe seguir el protocolo:\n1. Debe existir motivo justificado (sospecha, denuncia, situación de riesgo).\n2. El agente debe identificarse como policía antes de proceder.\n3. El cacheado tiene derecho a conocer el motivo del cacheo.\n4. Lo encontrado debe documentarse en el reporte oficial correspondiente.\n5. Ver también: PC-15 para el protocolo completo."
        },
        {
          id: "GEN 07",
          title: "Respeto y Convivencia",
          excerpt: "Artículo 1: Todo insulto, falta de respeto o actitud tóxica será evaluada por la administración, con sanciones que van desde advertencias hasta expulsión definitiva...",
          content: "Artículo 1. Todo insulto, falta de respeto o actitud tóxica será evaluada por la administración, con sanciones que podrán ir desde advertencias hasta expulsión definitiva."
        },
        {
          id: "REG 26",
          title: "Patadas en Motos o Vehículos de 2 Ruedas",
          excerpt: "Normativa específica sobre las patadas a conductores de motos o vehículos de dos ruedas. Solo permitido bajo condiciones específicas de rol con contexto previo...",
          content: "Las patadas a conductores de motos o vehículos de dos ruedas:\n- Solo están permitidas bajo condiciones específicas de rol con contexto previo establecido.\n- No puede usarse como mecánica de griefing o sin justificación narrativa.\n- El conductor tumbado debe poder rolear las consecuencias del accidente.\n- El uso abusivo de esta mecánica será sancionado."
        },
        {
          id: "GEN 32",
          title: "Normativas del Rol de Embarazo",
          excerpt: "Normativa que regula el rol de embarazo dentro del servidor. Establece los tiempos, limitaciones de acción y el desarrollo narrativo esperado para este tipo de rol...",
          content: "El rol de embarazo está regulado para garantizar coherencia narrativa:\n- Duración mínima del rol: establecida por el staff según el contexto.\n- Durante el embarazo, la participación en roles agresivos está limitada.\n- El personaje embarazado no puede participar en tiroteos, persecuciones o actividades de riesgo extremo.\n- Debe ser informado al staff mediante ticket para su seguimiento.\n- El parto requiere la participación de EMS o personal médico del servidor."
        }
      ]
    },
    {
      title: "07 · Naturaleza del Roleplay",
      icon: "star",
      rules: [
        {
          id: "NAT 01",
          title: "Naturalidad de Roleplay",
          excerpt: "El roleplay debe ser natural y coherente con el contexto del servidor. Las acciones del personaje deben tener sentido dentro de la narrativa establecida...",
          content: "El roleplay debe ser natural y coherente con el contexto del servidor. Las acciones del personaje deben tener sentido dentro de la narrativa establecida.\n\nPrincipios de naturalidad:\n- Las reacciones deben ser proporcionales al contexto.\n- El personaje debe actuar según su historia y personalidad.\n- Evitar situaciones absurdas o sin sentido narrativo.\n- El rol debe fluir de forma orgánica sin forzar situaciones."
        },
        {
          id: "NAT 2",
          title: "Interpretación Coherente",
          excerpt: "El personaje debe ser interpretado de manera coherente con su historia y contexto. Los cambios bruscos de personalidad sin justificación narrativa están mal vistos...",
          content: "La interpretación coherente implica:\n- Mantener la personalidad del personaje de forma consistente.\n- Los cambios de comportamiento deben tener justificación narrativa.\n- El pasado del personaje influye en sus decisiones presentes.\n- Las contradicciones flagrantes de carácter rompen la inmersión del rol."
        },
        {
          id: "NAT 3",
          title: "Disposición Final",
          excerpt: "El roleplay debe tener un cierre narrativo apropiado. Las situaciones no deben quedar indefinidamente abiertas sin resolución...",
          content: "La disposición final en el roleplay implica:\n- Toda situación de rol debe tener un cierre apropiado.\n- No se deben dejar conflictos abiertos indefinidamente sin resolución.\n- En caso de que el rol deba pausarse, todas las partes deben acordar cómo y cuándo retomarlo.\n- El staff puede intervenir para cerrar situaciones que queden irresolutas por un período prolongado."
        }
      ]
    },
    {
      title: "08 · Roleplay General",
      icon: "user",
      rules: [
        {
          id: "RP-001",
          title: "Valorar la Vida (NVL)",
          excerpt: "Todo jugador debe valorar la vida de su personaje en todo momento. Las situaciones de riesgo extremo deben manejarse con precaución y sentido común...",
          content: "Todo jugador debe valorar la vida de su personaje en todo momento.\n\nPrincipios:\n- Ante amenazas reales y superiores, el personaje debe priorizar su supervivencia.\n- No se puede actuar de forma heroica o suicida sin justificación narrativa.\n- El dinero y los objetos siempre son menos importantes que la vida del personaje.\n- Ver también: CON 4 (NVVPJ) para detalles completos."
        },
        {
          id: "RP-002",
          title: "Metagaming",
          excerpt: "Uso de información obtenida fuera del rol para beneficiar al personaje dentro del juego. Ver también CON 2 para una descripción completa...",
          content: "El metagaming en contexto de Roleplay General implica:\n- No usar información de streams, Discord o chats externos para tomar decisiones IC.\n- No identificar personajes por información OOC.\n- Mantener la separación completa entre lo que sabe el jugador y lo que sabe el personaje.\n\nVer también: CON 2 (Metagaming) para la normativa completa y ejemplos."
        },
        {
          id: "RP-003",
          title: "Powergaming",
          excerpt: "Realizar acciones imposibles en la vida real o forzar situaciones sin dar oportunidad de respuesta. Ver también CON 3 para una descripción completa...",
          content: "El powergaming en contexto de Roleplay General implica:\n- Realizar acciones físicamente imposibles sin justificación.\n- Forzar resultados en situaciones de rol sin respetar la respuesta de la contraparte.\n- Usar mecánicas del juego de forma irreal para obtener ventaja.\n\nVer también: CON 3 (Powergaming) para la normativa completa."
        }
      ]
    },
    {
      title: "09 · Conducta y Respeto",
      icon: "badge",
      rules: [
        {
          id: "CR-001",
          title: "Respeto General",
          excerpt: "Se exige un nivel mínimo de respeto hacia todos los jugadores, tanto IC como OOC. El irrespeto, el acoso y la toxicidad serán sancionados por la administración...",
          content: "Se exige un nivel mínimo de respeto hacia todos los jugadores, tanto dentro del juego (IC) como fuera de él (OOC).\n\nComportamientos sancionables:\n- Insultos graves o acoso hacia otros jugadores.\n- Discriminación por género, origen, orientación o cualquier otra característica.\n- Actitud tóxica persistente que afecte el ambiente del servidor.\n- Falta de respeto hacia el staff durante procesos administrativos.\n\nLas sanciones van desde advertencias hasta expulsión definitiva dependiendo de la gravedad."
        },
        {
          id: "CR-002",
          title: "Spam y Flood",
          excerpt: "Está prohibido el spam o flood en cualquier canal de comunicación del servidor, tanto en el juego como en Discord. Incluye mensajes repetitivos, señales de radio abusivas...",
          content: "Está prohibido el spam o flood en cualquier canal de comunicación:\n\n- En el juego: Mensajes repetitivos en chat local, global o radio.\n- En Discord: Spam en canales del servidor.\n- Señales de radio abusivas o interferencias intencionales.\n- Sonidos o efectos de audio repetitivos con intención de molestar.\n\nLas sanciones varían según la gravedad y la reincidencia."
        }
      ]
    },
    {
      title: "10 · Combate y Conflictos",
      icon: "alert",
      rules: [
        {
          id: "CC-001",
          title: "Random Deathmatch (RDM) – IMPORTANTE",
          excerpt: "Está prohibido atacar o matar a otros jugadores sin una razón roleplay válida. Toda agresión debe tener un contexto y desarrollo previo establecido...",
          content: "Está PROHIBIDO atacar o matar a otros jugadores sin una razón roleplay válida.\n\nToda agresión debe tener:\n1. Un contexto previo establecido (historia, conflicto, razón narrativa).\n2. Interacción verbal previa cuando sea posible en el contexto.\n3. Proporcionalidad con la situación (la respuesta armada debe estar justificada).\n\nEl RDM es una de las infracciones más graves del servidor y puede conllevar sanciones severas.\n\nEJEMPLO INCORRECTO: Ver a un jugador desconocido en la calle y dispararle sin ningún motivo.\nEJEMPLO INCORRECTO: Matar a alguien porque \"tenía buenas armas\" sin interacción previa."
        },
        {
          id: "CC-002",
          title: "Combat Log",
          excerpt: "Está prohibido desconectarse durante una situación de roleplay activa, especialmente durante combates, persecuciones o mientras estás esposado o detenido...",
          content: "Está PROHIBIDO desconectarse durante una situación de roleplay activa, especialmente durante:\n- Combates o tiroteos.\n- Persecuciones policiales o de bandas.\n- Mientras estás esposado o detenido.\n- Durante cualquier interacción de rol que no haya concluido.\n\nEl Combat Log es considerado evasión de rol y será sancionado con la misma severidad.\n\nSi tu juego se cierra accidentalmente (crash), debes volver lo más rápido posible y comunicarlo por OOC."
        }
      ]
    },
    {
      title: "11 · Vehículos y Conducción",
      icon: "car",
      rules: [
        {
          id: "VC-001",
          title: "Vehicle Deathmatch (VDM)",
          excerpt: "Está prohibido usar vehículos como arma para atropellar intencionalmente a otros jugadores sin razón roleplay. El VDM incluye cualquier uso deliberado del vehículo como arma...",
          content: "Está PROHIBIDO usar vehículos como arma para atropellar intencionalmente a otros jugadores sin razón roleplay.\n\nEl VDM incluye:\n- Atropellar deliberadamente a peatones sin contexto de rol.\n- Usar el vehículo para golpear o empujar a otros vehículos en combate sin justificación.\n- Usar el vehículo para interrumpir situaciones de rol sin narrativa que lo justifique.\n\nNo cuenta como VDM:\n- Accidentes genuinos de tráfico con rol posterior.\n- Situaciones de huida donde el atropello no fue intencional.\n\nEJEMPLO INCORRECTO: Entrar a una zona y atropellar deliberadamente a un grupo de personas."
        },
        {
          id: "VC-002",
          title: "Conducción Realista",
          excerpt: "Debes conducir de manera realista. No puedes subir montañas con vehículos normales, conducir a velocidades excesivas constantemente o realizar maniobras imposibles...",
          content: "Debes conducir de manera realista dentro de las posibilidades del juego:\n\n- No puedes subir montañas con vehículos normales (civiles).\n- No puedes conducir a velocidades excesivas constantemente sin perder el control.\n- No puedes realizar maniobras físicamente imposibles para evitar consecuencias.\n- Los choques y daños al vehículo deben ser roleados de forma proporcional.\n- El uso de vehículos fuera de sus capacidades reales (ej: sedan en caminos de montaña) es Powergaming vehicular.\n\nNota: Se permite cierto nivel de \"arcade\" en la conducción para no hacer el juego imposible, pero debe mantenerse dentro de la lógica."
        }
      ]
    }
  ];

  // Lista de Aplicaciones vacía por defecto
  const applications: any[] = [];

  // Número de aplicaciones con estado "Pendiente" o "Cambios Solicitados" para notificaciones del sidebar
  const appCountInSidebar = dbResponses.filter(r => r.status === "Pendiente").length;

  // Carga de datos iniciales
  const loadDatabaseData = async (userIdStr?: string) => {
    try {
      const formsRes = await fetch("/api/forms");
      if (formsRes.ok) {
        setCustomForms(await formsRes.json());
      }

      const responsesRes = await fetch("/api/responses");
      if (responsesRes.ok) {
        const resData = await responsesRes.json();
        setDbResponses(resData);
        if (userIdStr) {
          const isP1Approved = resData.some((r: any) => r.user_id === userIdStr && r.form_id === 999999 && r.status === "Aprobada");
          setIsPhase1Completed(isP1Approved);
        }
      }

      if (userIdStr) {
        const notifRes = await fetch(`/api/notifications?userId=${userIdStr}`);
        if (notifRes.ok) {
          setDbNotifications(await notifRes.json());
        }
      }
    } catch (err) {
      console.error("Error loading db data:", err);
    }
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return undefined;
    };

    // Cargar perfil guardado desde localStorage
    const savedName = localStorage.getItem("profile_name");
    const savedAge = localStorage.getItem("profile_age");
    const savedCity = localStorage.getItem("profile_city");
    const savedCountry = localStorage.getItem("profile_country");
    const savedBio = localStorage.getItem("profile_bio");

    if (savedName) setProfileName(savedName);
    if (savedAge) setProfileAge(savedAge);
    if (savedCity) setProfileCity(savedCity);
    if (savedCountry) setProfileCountry(savedCountry);
    if (savedBio) setProfileBio(savedBio);

    // Cargar contadores históricos
    const savedApproved = localStorage.getItem("historic_approved");
    const savedRejected = localStorage.getItem("historic_rejected");
    if (savedApproved) setHistoricApproved(parseInt(savedApproved) || 0);
    if (savedRejected) setHistoricRejected(parseInt(savedRejected) || 0);
    const userCookie = getCookie("discord_user");
    let currentUserId = "";
    if (userCookie) {
      try {
        const decoded = JSON.parse(decodeURIComponent(userCookie));
        setUser(decoded);
        currentUserId = decoded.id;
        if (decoded.username && !savedName) {
          setProfileName(decoded.username);
        }

        if (decoded.joinedAt) {
          const joinedDate = new Date(decoded.joinedAt);
          const diffTime = Math.abs(new Date().getTime() - joinedDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysInServer(`${diffDays} días`);
        }
      } catch (e) {
        console.error("Failed to parse user cookie:", e);
      }
    }
    // Cargar progreso de fase 1 desde la base de datos (SQLite)
    const loadPhase1Progress = async (uid: string) => {
      try {
        const res = await fetch(`/api/phase1-progress?userId=${uid}`);
        if (res.ok) {
          const data = await res.json();
          setIsPhase1Completed(data.is_completed || false);
          setIsPhase1Started(data.is_started || false);
          setIsTestActive(data.is_active || false);
          setPhase1CurrentQuestionIdx(data.current_question_idx || 0);
          setPhase1Answers(data.answers || {});
          setPhase1StartedAt(data.started_at || "");
          setAbandonedApps(data.abandoned_apps || []);
          setIsPhase2Completed(data.is_phase2_completed || false);
          setDailyAttemptsLimit(data.daily_attempts_limit !== undefined ? data.daily_attempts_limit : 2);
        }
      } catch (e) {
        console.error("Error loading progress from DB:", e);
      } finally {
        isInitialLoad.current = false;
      }
    };

    if (currentUserId) {
      loadPhase1Progress(currentUserId);
    } else {
      isInitialLoad.current = false;
    }

    loadDatabaseData(currentUserId);
  }, []);

  // Sincronizador de base de datos para la Fase 1
  useEffect(() => {
    if (isInitialLoad.current || !user?.id) return;

    const timer = setTimeout(() => {
      fetch("/api/phase1-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          isCompleted: isPhase1Completed,
          isStarted: isPhase1Started,
          isActive: isTestActive,
          currentQuestionIdx: phase1CurrentQuestionIdx,
          answers: phase1Answers,
          startedAt: phase1StartedAt,
          abandonedApps: abandonedApps
        })
      }).catch(e => console.error("Error saving progress to SQLite:", e));
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [isPhase1Completed, isPhase1Started, isTestActive, phase1CurrentQuestionIdx, phase1Answers, phase1StartedAt, abandonedApps, user?.id]);

  // Hook de intervalo para calcular y mostrar el cooldown de intentos de la Whitelist Fase 1
  useEffect(() => {
    const updateLimit = () => {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentAbandoned = abandonedApps.filter(app => {
        try {
          const appDate = new Date(app.abandonedAt);
          return appDate > oneDayAgo;
        } catch (e) {
          return false;
        }
      });

      // Si ha cambiado la lista por expiración de 24 horas, limpiarla de la base de datos
      if (recentAbandoned.length !== abandonedApps.length) {
        setAbandonedApps(recentAbandoned);
        return; // Detener ejecución para esperar el nuevo ciclo con el estado actualizado
      }

      const isLimit = recentAbandoned.length >= dailyAttemptsLimit;
      setAttemptsLimitReached(isLimit);

      if (isLimit) {
        // Ordenar intentos cronológicamente (más antiguo primero)
        const sorted = [...recentAbandoned].sort((a, b) => new Date(a.abandonedAt).getTime() - new Date(b.abandonedAt).getTime());
        const oldestAttemptDate = new Date(sorted[0].abandonedAt);
        const nextAvailableDate = new Date(oldestAttemptDate.getTime() + 24 * 60 * 60 * 1000);
        const diffMs = nextAvailableDate.getTime() - now.getTime();

        if (diffMs > 0) {
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          setAttemptsCountdown(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setAttemptsCountdown("0h 0m 0s");
          setAttemptsLimitReached(false);
        }
      }
    };

    updateLimit();
    const interval = setInterval(updateLimit, 1000);
    return () => clearInterval(interval);
  }, [abandonedApps]);

  const handleLogout = () => {
    window.location.href = "/auth/signin";
  };

  const calculateCompletion = () => {
    let percentage = 0;
    if (user) percentage += 25; // Discord conectado
    if (user?.username) percentage += 25; // Username configurado
    if (isPhase1Completed) percentage += 50;
    return percentage;
  };

  // Formateador de fecha en español
  const formatJoinedDate = (isoString?: string) => {
    if (!isoString) return "19 de agosto de 2026";
    const date = new Date(isoString);
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  // Activa el modo edición cargando los valores actuales
  const startEditing = () => {
    setEditName(profileName);
    setEditAge(profileAge === "No especificado" ? "" : profileAge);
    setEditCity(profileCity === "No especificado" ? "" : profileCity);
    setEditCountry(profileCountry === "No especificado" ? "" : profileCountry);
    setEditBio(profileBio === "No has agregado una biografía aún." ? "" : profileBio);
    setFormErrors({});
    setIsEditing(true);
  };

  // Cancela la edición y limpia estados temporales
  const cancelEditing = () => {
    setIsEditing(false);
    setFormErrors({});
  };

  // Guarda los cambios previa validación
  const saveProfile = () => {
    const errors: typeof formErrors = {};

    // Validación Nombre
    if (!editName.trim()) {
      errors.name = "El nombre es obligatorio.";
    } else if (editName.length > 25) {
      errors.name = "El nombre no debe superar los 25 caracteres.";
    }

    // Validación Edad
    if (editAge.trim()) {
      const parsedAge = parseInt(editAge);
      if (isNaN(parsedAge) || parsedAge < 13 || parsedAge > 99) {
        errors.age = "La edad debe ser un número entre 13 y 99 años.";
      }
    }

    // Validación Ciudad
    if (editCity.trim() && editCity.length > 30) {
      errors.city = "La ciudad no debe superar los 30 caracteres.";
    }

    // Validación País
    if (editCountry.trim() && editCountry.length > 30) {
      errors.country = "El país no debe superar los 30 caracteres.";
    }

    // Validación Biografía
    if (editBio.trim() && editBio.length > 250) {
      errors.bio = "La biografía no debe superar los 250 caracteres.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Guardar
    setProfileName(editName);
    setProfileAge(editAge.trim() ? editAge : "No especificado");
    setProfileCity(editCity.trim() ? editCity : "No especificado");
    setProfileCountry(editCountry.trim() ? editCountry : "No especificado");
    setProfileBio(editBio.trim() ? editBio : "No has agregado una biografía aún.");

    localStorage.setItem("profile_name", editName);
    localStorage.setItem("profile_age", editAge.trim() ? editAge : "No especificado");
    localStorage.setItem("profile_city", editCity.trim() ? editCity : "No especificado");
    localStorage.setItem("profile_country", editCountry.trim() ? editCountry : "No especificado");
    localStorage.setItem("profile_bio", editBio.trim() ? editBio : "No has agregado una biografía aún.");

    setIsEditing(false);
    setFormErrors({});
  };

  // Creación de una pregunta en el creador
  const addCreatorQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newQ: Question = {
      id: "q-" + Date.now(),
      text: newQuestionText,
      type: newQuestionType,
      options: newQuestionType !== "Abierta" ? [...newQuestionOptions] : [],
    };
    setCreatorQuestions([...creatorQuestions, newQ]);
    setNewQuestionText("");
    setNewQuestionOptions([]);
    setNewOptionVal("");
  };

  const addOptionToCreatorQuestion = () => {
    if (!newOptionVal.trim()) return;
    setNewQuestionOptions([...newQuestionOptions, newOptionVal.trim()]);
    setNewOptionVal("");
  };

  const removeCreatorQuestion = (id: string) => {
    setCreatorQuestions(creatorQuestions.filter((q) => q.id !== id));
  };

  // Guardar/Publicar Formulario
  const publishCustomForm = async () => {
    if (!formTitle.trim() || creatorQuestions.length === 0) return;
    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDesc,
          questions: creatorQuestions,
        }),
      });
      if (res.ok) {
        setFormTitle("");
        setFormDesc("");
        setCreatorQuestions([]);
        setActiveTab("dashboard");
        loadDatabaseData(user?.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar formulario
  const deleteForm = async (formId: number) => {
    try {
      const res = await fetch("/api/forms", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: formId }),
      });
      if (res.ok) {
        setFormToDelete(null);
        if (activeTab === `results-${formId}`) setActiveTab("dashboard");
        loadDatabaseData(user?.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Abrir modal de edición de formulario
  const openEditForm = (form: CustomForm) => {
    setFormToEdit(form);
    setEditFormTitle(form.title);
    setEditFormDesc(form.description);
    setEditFormQuestions([...form.questions]);
  };

  // Guardar edición de formulario
  const saveEditForm = async () => {
    if (!formToEdit || !editFormTitle.trim() || editFormQuestions.length === 0) return;
    try {
      const res = await fetch("/api/forms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: formToEdit.id,
          title: editFormTitle,
          description: editFormDesc,
          questions: editFormQuestions,
        }),
      });
      if (res.ok) {
        setFormToEdit(null);
        loadDatabaseData(user?.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar pregunta del formulario en edición
  const removeEditQuestion = (qId: string) => {
    setEditFormQuestions(editFormQuestions.filter((q) => q.id !== qId));
  };


  const submitFormAnswers = async () => {
    if (!activeFormToFill || !user) return;

    const preparedAnswers = activeFormToFill.questions.map((q) => ({
      questionId: q.id,
      questionText: q.text,
      answer: formAnswers[q.id] || "No respondido",
    }));

    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: activeFormToFill.id,
          userId: user.id,
          username: user.username,
          avatar: user.avatar || "",
          answers: preparedAnswers,
        }),
      });
      if (res.ok) {
        setActiveFormToFill(null);
        setFormAnswers({});
        setActiveTab("applications");
        loadDatabaseData(user.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Aceptar o rechazar una solicitud
  const reviewSubmissionStatus = async (status: "Aprobada" | "Rechazada") => {
    if (!selectedResponse) return;

    if (status === "Rechazada" && !reviewerComment.trim()) {
      alert("Por favor, escribe el motivo del rechazo en el cuadro de texto antes de rechazar.");
      return;
    }

    try {
      const res = await fetch("/api/responses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responseId: selectedResponse.id,
          status,
          message: reviewerComment,
        }),
      });
      if (res.ok) {
        // Actualizar contadores históricos persistentes
        if (status === "Aprobada") {
          const newVal = historicApproved + 1;
          setHistoricApproved(newVal);
          localStorage.setItem("historic_approved", String(newVal));
        } else {
          const newVal = historicRejected + 1;
          setHistoricRejected(newVal);
          localStorage.setItem("historic_rejected", String(newVal));
        }
        // Eliminar la respuesta de la lista activa en memoria (sin esperar reload)
        setDbResponses((prev) => prev.filter((r) => r.id !== selectedResponse.id));
        setSelectedResponse(null);
        setReviewerComment("");
        // Recargar en background para mantener sincronía
        loadDatabaseData(user?.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar notificación individual
  const deleteNotification = async (notifId: number) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notifId }),
      });
      if (res.ok) {
        setDbNotifications((prev) => prev.filter((n) => n.id !== notifId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar todas las notificaciones del usuario
  const deleteAllNotifications = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        setDbNotifications([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtrado y búsqueda de respuestas
  const filteredSubmissions = (formId: number) => {
    return dbResponses.filter((resp) => {
      if (resp.form_id !== formId) return false;
      const matchesSearch = resp.username.toLowerCase().includes(searchQuery.toLowerCase()) || resp.user_id.includes(searchQuery);
      if (filterType === "Todas") return matchesSearch;
      if (filterType === "Pendientes") return resp.status === "Pendiente" && matchesSearch;
      if (filterType === "Aprobadas") return resp.status === "Aprobada" && matchesSearch;
      if (filterType === "Rechazadas") return resp.status === "Rechazada" && matchesSearch;
      return matchesSearch;
    });
  };

  return (
    <div
      className="h-screen w-screen bg-[#07070a] text-white font-sans flex overflow-hidden select-none"
      style={{
        background:
          "radial-gradient(circle at 10% 10%, rgba(247, 107, 138, 0.04) 0%, transparent 45%), radial-gradient(circle at 90% 90%, rgba(138, 43, 226, 0.04) 0%, transparent 45%), linear-gradient(135deg, #07070a 0%, #0c0814 50%, #050508 100%)",
      }}
    >
      {/* ── SIDEBAR BARRA LATERAL ── */}
      <aside
        className={`relative z-20 h-full border-r border-white/5 bg-[#090612]/90 backdrop-blur-3xl transition-all duration-300 flex flex-col justify-between shrink-0 ${isCollapsed ? "w-20" : "w-66"
          }`}
      >
        {/* Flecha para ocultar/mostrar */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full border border-white/10 bg-[#0c0814] text-gray-400 hover:text-white flex items-center justify-center cursor-pointer active:scale-90 hover:border-brand/40 hover:bg-[#140f24] transition-all"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Zona Superior */}
        <div className="flex flex-col gap-5 p-4 overflow-y-auto custom-scrollbar flex-1">
          {/* Header del Sidebar */}
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : "px-2 py-1"}`}>
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-wide leading-none bg-gradient-to-r from-brand to-brand-soft bg-clip-text text-transparent">
                  ACCIÓN X RP
                </span>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase mt-1">
                  Panel v1.0
                </span>
              </div>
            )}
          </div>

          {/* Información de Discord */}
          <div
            className={`rounded-xl border border-white/5 bg-white/[0.02] p-3 flex items-center gap-3 relative overflow-hidden ${isCollapsed ? "justify-center" : "px-3"
              }`}
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`}
                    alt={user?.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#090612] animate-pulse" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">
                  {profileName}
                </span>
                <span className="text-[9px] text-emerald-400 font-extrabold uppercase mt-0.5 tracking-wider truncate">
                  {user?.role || "Whitelist"}
                </span>
              </div>
            )}
          </div>

          <div className="h-px bg-white/5" />

          {/* Menú Principal */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "dashboard"
                ? "bg-brand/10 border border-brand/20 text-brand"
                : "border border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]"
                } ${isCollapsed ? "justify-center" : ""}`}
            >
              <Home className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "profile"
                ? "bg-brand/10 border border-brand/20 text-brand"
                : "border border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]"
                } ${isCollapsed ? "justify-center" : ""}`}
            >
              <User className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Mi Perfil</span>}
            </button>

            <button
              onClick={() => setActiveTab("applications")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border ${activeTab === "applications"
                ? "bg-brand/10 border-brand/20 text-brand"
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]"
                } ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 shrink-0" />
                {!isCollapsed && <span>Aplicaciones</span>}
              </div>
              {!isCollapsed && appCountInSidebar > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-brand text-white">
                  {appCountInSidebar}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("rules")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === "rules"
                ? "bg-brand/10 border border-brand/20 text-brand"
                : "border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]"
                } ${isCollapsed ? "justify-center" : ""}`}
            >
              <BookOpen className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Normativa</span>}
            </button>

            {/* PESTAÑAS DE RESULTADOS DINÁMICAS */}
            {hasAdminPermissions && customForms.length > 0 && (
              <>
                <div className="h-px bg-white/5 my-2" />
                <div className="text-[9px] font-black uppercase text-gray-500 tracking-wider px-3 mb-1">
                  {!isCollapsed && "Resultados de Formularios"}
                </div>
                {customForms.map((form) => {
                  const pendingCount = dbResponses.filter(r => r.form_id === form.id && r.status === "Pendiente").length;
                  return (
                    <div key={form.id} className="group relative flex items-center gap-1">
                      <button
                        onClick={() => setActiveTab(`results-${form.id}`)}
                        className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${activeTab === `results-${form.id}`
                          ? "bg-violet-500/10 border-violet-500/20 text-violet-400"
                          : "border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]"
                          } ${isCollapsed ? "justify-center" : ""}`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileSpreadsheet className="w-4.5 h-4.5 text-violet-400 shrink-0" />
                          {!isCollapsed && <span className="truncate">Resultados #{form.id}</span>}
                        </div>
                        {!isCollapsed && pendingCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-violet-600 text-white text-[9px] font-black">
                            {pendingCount}
                          </span>
                        )}
                      </button>
                      {/* Botones Editar / Eliminar – solo si no está colapsado */}
                      {!isCollapsed && (
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditForm(form); }}
                            className="p-1.5 rounded-lg hover:bg-violet-500/10 text-gray-500 hover:text-violet-400 transition-colors cursor-pointer"
                            title="Editar formulario"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setFormToDelete(form); }}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Eliminar formulario"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </nav>
        </div>

        {/* Zona Inferior */}
        <div className="p-4 flex flex-col gap-1">
          <div className="h-px bg-white/5 my-1" />

          {/* Cerrar Sesión */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 ${isCollapsed ? "justify-center" : ""
              }`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-black/10">

        {/* ── TOP NAV BAR ── */}
        <header className="border-b border-white/5 bg-black/20 px-8 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              {activeTab === "dashboard" ? "Dashboard" : activeTab === "profile" ? "Mi Perfil" : activeTab === "create_form" ? "Crear Formulario" : activeTab === "rules" ? "Normativas" : activeTab === "whitelist_phase1" ? "Whitelist Fase 1" : activeTab.startsWith("results-") ? "Revisión de Respuestas" : "Sección"}
            </h1>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Botón de Notificaciones con panel desplegable */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
                className="relative w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {dbNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[9px] font-black flex items-center justify-center border-2 border-[#07070a]">
                    {dbNotifications.length > 9 ? "9+" : dbNotifications.length}
                  </span>
                )}
              </button>

              {/* Panel desplegable */}
              <AnimatePresence>
                {showNotificationsPanel && (
                  <>
                    {/* Overlay para cerrar al hacer click fuera */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowNotificationsPanel(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-12 z-50 w-[340px] rounded-2xl border border-white/10 bg-[#0e0b1a] shadow-2xl shadow-black/80 overflow-hidden"
                    >
                      {/* Header del panel */}
                      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-brand" />
                          <span className="text-sm font-black text-white uppercase tracking-wider">
                            Notificaciones
                          </span>
                          {dbNotifications.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-brand/20 border border-brand/30 text-brand text-[9px] font-black">
                              {dbNotifications.length}
                            </span>
                          )}
                        </div>
                        {dbNotifications.length > 0 && (
                          <button
                            onClick={deleteAllNotifications}
                            className="text-[10px] text-gray-500 hover:text-red-400 font-bold uppercase tracking-wide transition-colors cursor-pointer"
                          >
                            Borrar todas
                          </button>
                        )}
                      </div>

                      {/* Lista de notificaciones */}
                      <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
                        {dbNotifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-6">
                            <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/8 flex items-center justify-center">
                              <Bell className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">No tienes notificaciones</p>
                              <p className="text-xs text-gray-500 mt-1">Te avisaremos cuando haya novedades</p>
                            </div>
                          </div>
                        ) : (
                          <div className="divide-y divide-white/[0.04]">
                            {dbNotifications.map((n) => (
                              <div
                                key={n.id}
                                className="group flex items-start gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors"
                              >
                                {/* Ícono y mensaje — clickeable para ir a aplicaciones */}
                                <button
                                  onClick={() => {
                                    setActiveTab("applications");
                                    setShowNotificationsPanel(false);
                                  }}
                                  className="flex items-start gap-3 flex-1 text-left cursor-pointer"
                                >
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${n.message.includes("APROBADA")
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : n.message.includes("RECHAZADA")
                                      ? "bg-red-500/15 text-red-400"
                                      : "bg-violet-500/15 text-violet-400"
                                    }`}>
                                    {n.message.includes("APROBADA") ? (
                                      <CheckCircle2 className="w-4 h-4" />
                                    ) : n.message.includes("RECHAZADA") ? (
                                      <XCircle className="w-4 h-4" />
                                    ) : (
                                      <Sparkles className="w-4 h-4" />
                                    )}
                                  </div>
                                  <div className="space-y-1 min-w-0">
                                    <p className="text-xs font-semibold text-gray-200 leading-snug">
                                      {n.message}
                                    </p>
                                    <span className="text-[10px] text-gray-600 font-medium">
                                      {n.created_at}
                                    </span>
                                  </div>
                                </button>

                                {/* Botón X para borrar */}
                                <button
                                  onClick={() => deleteNotification(n.id)}
                                  className="shrink-0 w-6 h-6 rounded-lg bg-white/[0.03] hover:bg-red-500/15 text-gray-600 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 mt-1"
                                  title="Eliminar notificación"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer del panel */}
                      {dbNotifications.length > 0 && (
                        <div className="px-5 py-3 border-t border-white/5 bg-white/[0.01]">
                          <button
                            onClick={() => {
                              setActiveTab("applications");
                              setShowNotificationsPanel(false);
                            }}
                            className="w-full flex items-center justify-center gap-2 text-xs text-brand hover:text-brand-soft font-bold uppercase tracking-wider transition-colors cursor-pointer py-1"
                          >
                            Ver todas mis aplicaciones
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setActiveTab("new_application")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-deep text-white text-sm font-black transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand/20"
            >
              <Plus className="w-4 h-4" />
              Nueva Aplicación
            </button>
          </div>
        </header>

        {/* ── CONTENEDOR CON SCROLL INTERNO ── */}
        <div className="flex-1 min-h-0 overflow-y-auto p-8 custom-scrollbar">

          {/* ── A: VISTA DEL DASHBOARD PRINCIPAL ── */}
          {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 max-w-[1600px] w-full mx-auto">
              <div className="xl:col-span-2 space-y-8">

                {/* Tarjeta de Bienvenida */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
                  <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                        {user?.avatar ? (
                          <img
                            src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                            alt={user?.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0c0814]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <h2 className="text-xl font-black text-white">
                          Bienvenido, {profileName}
                        </h2>
                        <span className="text-[10px] font-extrabold uppercase bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-md text-brand">
                          {user?.role || "Usuario"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        @{user?.username || "jrsmile22"} &bull; {daysInServer} en el servidor
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setActiveTab("profile")} className="w-10 h-10 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                      <User className="w-4 h-4" />
                    </button>
                    <button onClick={() => setActiveTab("applications")} className="w-10 h-10 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] hover:border-white/15 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                      <FileText className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progreso de Whitelist */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6 backdrop-blur-md">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-brand" />
                    <h3 className="text-base font-black text-white uppercase tracking-wider">
                      Progreso de Whitelist
                    </h3>
                  </div>

                  <div>
                    {/* Fase 1 */}
                    <div className="rounded-xl border border-white/5 bg-black/20 p-5 flex flex-col justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">Whitelist Fase 1</span>
                            <span className="text-[9px] font-extrabold uppercase bg-brand/10 border border-brand/20 px-2 py-0.5 rounded text-brand">
                              Cuestionario de Normativas
                            </span>
                          </div>
                          {(() => {
                            const hasPhase1Approved = dbResponses.some(r => r.user_id === user?.id && r.form_id === 999999 && r.status === "Aprobada");
                            let badgeClass = "bg-white/5 border border-white/10 text-gray-500";
                            let badgeText = "Pendiente";

                            if (isPhase1Completed) {
                              badgeClass = "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400";
                              badgeText = "Completado";
                            } else if (hasPhase1Approved) {
                              badgeClass = "bg-violet-500/10 border border-violet-500/25 text-violet-400";
                              badgeText = "Falta Fase 2";
                            } else if (dbResponses.some(r => r.user_id === user?.id && r.form_id === 999999 && r.status === "Pendiente")) {
                              badgeClass = "bg-amber-500/15 border border-amber-500/30 text-amber-400";
                              badgeText = "En revisión";
                            } else if (attemptsLimitReached) {
                              badgeClass = "bg-red-500/10 border border-red-500/25 text-red-400";
                              badgeText = "Bloqueado";
                            } else if (isPhase1Started) {
                              badgeClass = "bg-amber-500/15 border border-amber-500/30 text-amber-400";
                              badgeText = "En proceso";
                            }

                            return (
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${badgeClass}`}>
                                {badgeText}
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Responde correctamente el cuestionario interactivo de 30 preguntas sobre las normativas del servidor para postularte.
                        </p>
                      </div>

                      {(() => {
                        const hasWhitelistRole = user?.roles?.includes("1302807933821915178") || false;
                        const hasPhase1Approved = dbResponses.some(r => r.user_id === user?.id && r.form_id === 999999 && r.status === "Aprobada");
                        const isPending = dbResponses.some(r => r.user_id === user?.id && r.form_id === 999999 && r.status === "Pendiente");
                        const isBtnDisabled = isPhase1Completed || !hasWhitelistRole || hasPhase1Approved;
                        return (
                          <button
                            disabled={isBtnDisabled}
                            onClick={() => {
                              if (!isPhase1Completed && hasWhitelistRole && !hasPhase1Approved) {
                                setActiveTab("whitelist_phase1");
                              }
                            }}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] ${isPhase1Completed
                              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-not-allowed"
                              : hasPhase1Approved
                                ? "bg-violet-500/10 border border-violet-500/20 text-violet-400 cursor-not-allowed"
                                : !hasWhitelistRole
                                  ? "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                                  : isPending
                                    ? "bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/15 cursor-pointer"
                                    : attemptsLimitReached
                                      ? "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 cursor-pointer animate-pulse"
                                      : "bg-brand hover:bg-brand-deep text-white shadow-lg shadow-brand/10 cursor-pointer"
                              }`}
                          >
                            {isPhase1Completed
                              ? "Whitelist Completada"
                              : hasPhase1Approved
                                ? "Falta realizar Fase 2"
                                : !hasWhitelistRole
                                  ? "Sin Permiso (Rol Requerido)"
                                  : isPending
                                    ? "En revisión"
                                    : attemptsLimitReached
                                      ? "Intento Bloqueado"
                                      : isPhase1Started
                                        ? "Continuar Cuestionario"
                                        : "Iniciar Cuestionario"}
                            {!isPhase1Completed && hasWhitelistRole && !hasPhase1Approved && <ArrowRight className="w-4 h-4" />}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>



              </div>

              {/* COLUMNA DERECHA */}
              <div className="space-y-8">

                {/* Completado de Perfil */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">
                      Completado de Perfil
                    </h3>
                    <span className="text-2xl font-black text-brand tracking-tight">
                      {calculateCompletion()}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full transition-all duration-500"
                      style={{ width: `${calculateCompletion()}%` }}
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                      <span className="text-white font-medium">Discord conectado</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                      <span className="text-white font-medium">Nombre de usuario configurado</span>
                    </div>
                    <div className={`flex items-center gap-3 text-xs transition-colors ${isPhase1Completed ? "text-white" : "text-gray-500"}`}>
                      {isPhase1Completed ? (
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center shrink-0" />
                      )}
                      <span>Whitelist Aprobada</span>
                    </div>
                  </div>
                </div>



                {/* Formularios */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-brand" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Formularios
                      </h3>
                    </div>
                    <button onClick={() => setActiveTab("new_application")} className="text-[10px] text-brand hover:text-brand-soft font-bold uppercase tracking-wider transition-colors cursor-pointer">
                      Ver todos
                    </button>
                  </div>

                  {customForms.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-black/10 py-8 flex flex-col items-center justify-center gap-2 text-center">
                      <ClipboardList className="w-8 h-8 text-gray-600" />
                      <p className="text-xs font-bold text-gray-500">No hay formularios disponibles</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                      {customForms.slice(0, 3).map((form) => (
                        <button
                          key={form.id}
                          onClick={() => setActiveTab("new_application")}
                          className="w-full rounded-xl border border-white/5 bg-black/20 p-4 flex items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4 text-violet-400" />
                            </div>
                            <div className="text-left min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{form.title}</h4>
                              <p className="text-[10px] text-gray-500 truncate mt-0.5">
                                {form.description || `${form.questions.length} preguntas`}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-brand group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                      {customForms.length > 3 && (
                        <button
                          onClick={() => setActiveTab("new_application")}
                          className="w-full text-center text-[10px] text-gray-500 hover:text-brand font-bold uppercase tracking-wider py-2 transition-colors cursor-pointer"
                        >
                          Ver {customForms.length - 3} más &rsaquo;
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ── B: VISTA DE LA PESTAÑA PERFIL ── */}
          {activeTab === "profile" && (
            <div className="space-y-8 max-w-[1200px] w-full mx-auto pb-8">

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                      {user?.avatar ? (
                        <img
                          src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`}
                          alt={user?.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0c0814] animate-pulse" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h2 className="text-2xl font-black text-white">
                        {profileName}
                      </h2>
                      <span className="text-[10px] font-extrabold uppercase bg-brand/10 border border-brand/20 px-2.5 py-0.5 rounded-md text-brand">
                        {user?.role || "Usuario"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 justify-center sm:justify-start">
                      <span>@{user?.username || "jrsmile22"}</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-violet-400" />
                        {daysInServer} en el servidor
                      </span>
                      <span className="flex items-center gap-1.5 text-[#5865F2]">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.03c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.03A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                        </svg>
                        Conectado
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {isPhase1Completed ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4" />
                      Whitelist Aprobada
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 text-gray-500 text-xs font-black uppercase tracking-wider">
                      <Lock className="w-3.5 h-3.5" />
                      Sin Whitelist
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => setProfileSubTab("info")}
                    className={`pb-3 text-sm font-black uppercase tracking-wider relative transition-colors cursor-pointer ${profileSubTab === "info" ? "text-brand" : "text-gray-500 hover:text-gray-300"
                      }`}
                  >
                    Información
                    {profileSubTab === "info" && (
                      <motion.div
                        layoutId="activeSubTabLine"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                      />
                    )}
                  </button>

                  <button
                    onClick={() => setProfileSubTab("history")}
                    className={`pb-3 text-sm font-black uppercase tracking-wider relative transition-colors cursor-pointer ${profileSubTab === "history" ? "text-brand" : "text-gray-500 hover:text-gray-300"
                      }`}
                  >
                    Historia del Personaje
                    {profileSubTab === "history" && (
                      <motion.div
                        layoutId="activeSubTabLine"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                      />
                    )}
                  </button>
                </div>

                {profileSubTab === "info" && (
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={cancelEditing}
                          className="flex items-center gap-1 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={saveProfile}
                          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand hover:bg-brand-deep text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand/25"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Guardar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={startEditing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Editar Perfil
                      </button>
                    )}
                  </div>
                )}
              </div>

              {profileSubTab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
                  <div className="md:col-span-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <User className="w-4.5 h-4.5 text-brand" />
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Información Personal
                      </h3>
                    </div>

                    <div className="space-y-4 text-sm">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                              Nombre
                            </label>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className={`w-full mt-1.5 px-4 py-2.5 rounded-xl bg-black/40 border text-white text-sm font-bold placeholder:text-gray-600 focus:outline-none transition-all ${formErrors.name ? "border-red-500 focus:border-red-500/80" : "border-white/10 focus:border-brand/50"
                                }`}
                            />
                            {formErrors.name && (
                              <p className="text-[10px] text-red-500 font-bold mt-1">{formErrors.name}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                                Edad
                              </label>
                              <input
                                type="text"
                                value={editAge}
                                onChange={(e) => setEditAge(e.target.value)}
                                className={`w-full mt-1.5 px-4 py-2.5 rounded-xl bg-black/40 border text-white text-sm font-bold placeholder:text-gray-600 focus:outline-none transition-all ${formErrors.age ? "border-red-500 focus:border-red-500/80" : "border-white/10 focus:border-brand/50"
                                  }`}
                              />
                              {formErrors.age && (
                                <p className="text-[10px] text-red-500 font-bold mt-1">{formErrors.age}</p>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                                  Ciudad
                                </label>
                                <input
                                  type="text"
                                  value={editCity}
                                  onChange={(e) => setEditCity(e.target.value)}
                                  className={`w-full mt-1.5 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-brand/50 transition-all ${formErrors.city ? "border-red-500" : ""
                                    }`}
                                />
                                {formErrors.city && (
                                  <p className="text-[10px] text-red-500 font-bold mt-1">{formErrors.city}</p>
                                )}
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                                  País
                                </label>
                                <input
                                  type="text"
                                  value={editCountry}
                                  onChange={(e) => setEditCountry(e.target.value)}
                                  className={`w-full mt-1.5 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-brand/50 transition-all ${formErrors.country ? "border-red-500" : ""
                                    }`}
                                />
                                {formErrors.country && (
                                  <p className="text-[10px] text-red-500 font-bold mt-1">{formErrors.country}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 border-b border-white/5">
                            <div>
                              <span className="text-[10px] text-gray-500 font-extrabold uppercase">
                                Nombre
                              </span>
                              <p className="font-bold text-white mt-1">
                                {profileName}
                              </p>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 font-extrabold uppercase">
                                Nombre de usuario
                              </span>
                              <p className="font-bold text-white mt-1">
                                @{user?.username || "jrsmile22"} <span className="text-[10px] text-gray-500 font-normal">(Discord)</span>
                              </p>
                            </div>
                          </div>

                          <div className="py-3 border-b border-white/5">
                            <span className="text-[10px] text-gray-500 font-extrabold uppercase">
                              Correo Electrónico
                            </span>
                            <p className="font-bold text-white mt-1 flex items-center gap-2">
                              <Mail className="w-4 h-4 text-brand" />
                              {user?.username ? `${user.username.toLowerCase()}@gmail.com` : "juniorfacebook212@gmail.com"}
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
                            <div>
                              <span className="text-[10px] text-gray-500 font-extrabold uppercase">
                                Edad
                              </span>
                              <p className={`font-bold mt-1 ${profileAge === "No especificado" ? "text-gray-500" : "text-white"}`}>
                                {profileAge}
                              </p>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-500 font-extrabold uppercase">
                                Ubicación
                              </span>
                              <p className={`font-bold mt-1 flex items-center gap-1.5 ${profileCity === "No especificado" ? "text-gray-500" : "text-white"}`}>
                                <MapPin className="w-4 h-4 text-violet-400" />
                                {profileCity !== "No especificado" && profileCountry !== "No especificado"
                                  ? `${profileCity}, ${profileCountry}`
                                  : profileCity !== "No especificado"
                                    ? profileCity
                                    : profileCountry !== "No especificado"
                                      ? profileCountry
                                      : "No especificado"}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5 backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <Copy className="w-4.5 h-4.5 text-brand" />
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">
                          Cuentas Vinculadas
                        </h3>
                      </div>

                      <div className="rounded-xl border border-white/5 bg-[#5865F2]/10 p-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white">Discord</h4>
                            <p className="text-[10px] text-gray-400 truncate mt-0.5">
                              ID: {user?.id || "1272239331020374229"}
                            </p>
                          </div>
                        </div>
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                          ✓
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs py-2 border-t border-white/5 mt-2">
                        <span className="text-gray-400 flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-brand" />
                          Miembro desde
                        </span>
                        <span className="font-semibold text-white">
                          {formatJoinedDate(user?.joinedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {profileSubTab === "history" && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center flex flex-col items-center justify-center gap-6 backdrop-blur-md min-h-[350px]">
                  <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-gray-400 shadow-inner">
                    <Lock className="w-8 h-8" />
                  </div>

                  <div className="space-y-3 max-w-lg">
                    <h3 className="text-xl font-black text-white">
                      Historia del Personaje Bloqueada
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Para crear la historia de tu personaje, primero debes aprobar la{" "}
                      <span className="text-brand font-bold">Whitelist Fase 1</span>.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand hover:bg-brand-deep text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand/25 mt-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Ir a Whitelist Fase 1
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <FileText className="w-4.5 h-4.5 text-brand" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    Biografía
                  </h3>
                </div>

                {isEditing ? (
                  <div>
                    <textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      rows={3}
                      className={`w-full px-4 py-2.5 rounded-xl bg-black/40 border text-white text-xs font-medium placeholder:text-gray-600 focus:outline-none focus:border-brand/50 resize-none transition-all ${formErrors.bio ? "border-red-500 focus:border-red-500/80" : "border-white/10"
                        }`}
                    />
                    {formErrors.bio && (
                      <p className="text-[10px] text-red-500 font-bold mt-1">{formErrors.bio}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {profileBio}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── C: VISTA DE APLICACIONES ENVIADAS POR EL USUARIO ── */}
          {activeTab === "applications" && (
            <div className="space-y-8 max-w-[1200px] w-full mx-auto pb-8">

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                  <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">Mis Aplicaciones</h2>
                    <p className="text-xs text-gray-400">Gestiona y revisa tus solicitudes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => loadDatabaseData(user?.id)} className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveTab("new_application")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-deep text-white text-sm font-black transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand/20"
                  >
                    <Plus className="w-4 h-4" />
                    Nueva Aplicación
                  </button>
                </div>
              </div>

              {/* Contadores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.01] p-5 flex items-center justify-between backdrop-blur-md">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Total</span>
                    <p className="text-xs text-gray-400 font-bold">Solicitudes</p>
                  </div>
                  <span className="text-3xl font-black text-white">
                    {dbResponses.filter(r => r.user_id === user?.id).length + (isPhase1Started && !isPhase1Completed ? 1 : 0)}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.01] p-5 flex items-center justify-between backdrop-blur-md">
                  <div className="space-y-1">
                    <span className="text-[10px] text-amber-500 font-extrabold uppercase">Pendientes</span>
                    <p className="text-xs text-gray-400 font-bold">En revisión</p>
                  </div>
                  <span className="text-3xl font-black text-amber-500">
                    {dbResponses.filter(r => r.user_id === user?.id && r.status === "Pendiente").length + (isPhase1Started && !isPhase1Completed ? 1 : 0)}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.01] p-5 flex items-center justify-between backdrop-blur-md">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase">Aprobadas</span>
                    <p className="text-xs text-gray-400 font-bold">Listas para el rol</p>
                  </div>
                  <span className="text-3xl font-black text-emerald-400">
                    {dbResponses.filter(r => r.user_id === user?.id && r.status === "Aprobada").length}
                  </span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.01] p-5 flex items-center justify-between backdrop-blur-md">
                  <div className="space-y-1">
                    <span className="text-[10px] text-red-500 font-extrabold uppercase">Rechazadas</span>
                    <p className="text-xs text-gray-400 font-bold">Rechazadas</p>
                  </div>
                  <span className="text-3xl font-black text-red-500">
                    {dbResponses.filter(r => r.user_id === user?.id && r.status === "Rechazada").length}
                  </span>
                </div>
              </div>

              {/* Lista */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isPhase1Started && !isPhase1Completed && (
                  <div className="rounded-2xl border border-amber-500/20 bg-white/[0.02] p-5 flex flex-col justify-between gap-4 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-amber-500/[0.01] pointer-events-none" />
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-amber-400" />
                          <h4 className="text-sm font-black text-white truncate">
                            Whitelist Fase 1
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded text-[9px] font-black uppercase bg-amber-500/10 border border-amber-500/25 text-amber-400 animate-pulse">
                          Pendiente
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono block">En proceso de realización</span>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-500/80" />
                      <span>Estado: <strong className="text-amber-400 font-bold">En proceso</strong></span>
                    </div>
                  </div>
                )}
                {(dbResponses.filter(r => r.user_id === user?.id).length > 0 || (isPhase1Started && !isPhase1Completed) || abandonedApps.length > 0) ? (
                  <>
                    {/* Render client-side abandoned apps first */}
                    {abandonedApps.map((app) => (
                      <div
                        key={app.id}
                        className="rounded-2xl border border-red-500/20 bg-white/[0.02] p-5 flex flex-col justify-between gap-4 backdrop-blur-md relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-red-500/[0.01] pointer-events-none" />
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-5 h-5 text-red-400" />
                              <h4 className="text-sm font-black text-white truncate">
                                {app.title}
                              </h4>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-red-500/10 border border-red-500/25 text-red-400">
                              {app.status}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-500 font-mono block">ID Envío: #{app.id}</span>

                          <div className="text-[10px] text-gray-400 space-y-1 bg-black/20 p-2.5 rounded-lg border border-white/5">
                            <div>Iniciado: <span className="text-white font-semibold">{new Date(app.startedAt).toLocaleString("es-ES")}</span></div>
                            <div>Abandonado: <span className="text-white font-semibold">{new Date(app.abandonedAt).toLocaleString("es-ES")}</span></div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3.5 h-3.5 text-red-400/80" />
                          <span>Intento cancelado</span>
                        </div>
                      </div>
                    ))}

                    {/* Render database applications */}
                    {dbResponses.filter(r => r.user_id === user?.id).map((resp) => {
                      const formDetails = customForms.find((f) => f.id === resp.form_id);
                      return (
                        <div
                          key={resp.id}
                          className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between gap-4 backdrop-blur-md"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-brand" />
                                <h4 className="text-sm font-black text-white truncate">
                                  {resp.form_id === 999999 ? "Whitelist Fase 1" : (formDetails?.title || "Formulario Personalizado")}
                                </h4>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${resp.status === "Aprobada"
                                ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
                                : resp.status === "Pendiente"
                                  ? "bg-amber-500/10 border border-amber-500/25 text-amber-400"
                                  : "bg-red-500/10 border border-red-500/25 text-red-500"
                                }`}>
                                {resp.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono block">ID Envío: #{resp.id}</span>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-xs text-gray-400">
                            <Calendar className="w-3.5 h-3.5 text-violet-400" />
                            <span>Enviado: <strong>{resp.submitted_at}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="col-span-full py-12 text-center border border-dashed border-white/10 bg-black/10 rounded-2xl flex flex-col items-center justify-center gap-2">
                    <ClipboardList className="w-12 h-12 text-gray-600" />
                    <p className="text-sm font-bold text-white">No has realizado ninguna solicitud aún</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── D: CREAR O SOLICITAR NUEVA APLICACIÓN ── */}
          {activeTab === "new_application" && (
            <div className="space-y-8 max-w-[1200px] w-full mx-auto pb-8">

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                  <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider">Nueva Aplicación</h2>
                    <p className="text-xs text-gray-400">Selecciona el formulario que deseas completar</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {hasAdminPermissions && (
                    <button
                      onClick={() => setActiveTab("create_form")}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-lg shadow-violet-500/25"
                    >
                      <Plus className="w-4 h-4" />
                      Crear Formulario de Aplicación
                    </button>
                  )}
                  <button onClick={() => loadDatabaseData(user?.id)} className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contadores */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.01] p-5 flex items-center justify-between backdrop-blur-md">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-extrabold uppercase">Formularios</span>
                    <p className="text-xs text-gray-400 font-bold">Totales del sistema</p>
                  </div>
                  <span className="text-3xl font-black text-white">{customForms.length + 1}</span>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.01] p-5 flex items-center justify-between backdrop-blur-md">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase">Disponibles</span>
                    <p className="text-xs text-gray-400 font-bold">Listos para rellenar</p>
                  </div>
                  <span className="text-3xl font-black text-emerald-400">{customForms.length + 1}</span>
                </div>
              </div>

              {/* Sub-barra */}
              <div className="flex flex-wrap items-center gap-6 px-6 py-4 rounded-xl border border-white/5 bg-white/[0.01] text-xs text-gray-400 backdrop-blur-md">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand" />
                  Whitelist: <strong>{isPhase1Completed ? "Aprobada" : "No tienes"}</strong>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-violet-400" />
                  Días en el servidor: <strong>{daysInServer}</strong>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Aplicaciones activas: <strong>0</strong>
                </span>
              </div>

              {/* Formularios del Sistema */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-brand shrink-0" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Formularios del Sistema</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Whitelist Fase 1 */}
                  {!isPhase1Completed ? (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6 flex flex-col justify-between backdrop-blur-md">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-white truncate">Whitelist Fase 1</h4>
                              <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">whitelist-phase-1</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-brand/20 border border-brand/35 text-brand rounded">
                            Nuevo
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed font-bold">
                          Formulario de conocimiento de normativas con 30 preguntas...
                        </p>

                        <div className="rounded-xl border border-brand/15 bg-brand/5 p-4 text-center space-y-1">
                          <span className="text-[10px] text-brand font-black uppercase tracking-wider flex items-center justify-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            30 Preguntas con IA
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                            <div className="text-lg font-black text-white">30</div>
                            <div className="text-[8px] text-gray-500 uppercase font-bold tracking-wide mt-0.5">Preguntas</div>
                          </div>
                          <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                            <div className="text-lg font-black text-brand">IA</div>
                            <div className="text-[8px] text-gray-500 uppercase font-bold tracking-wide mt-0.5">Generadas</div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveTab("whitelist_phase1")}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand hover:bg-brand-deep text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-brand/20"
                      >
                        Comenzar
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-6 flex flex-col justify-between backdrop-blur-md text-center min-h-[310px]">
                      <div className="space-y-4 my-auto py-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                          <CheckCircle2 className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-sm font-black text-white uppercase tracking-wider">Whitelist Completada</h4>
                          <p className="text-xs text-gray-400 max-w-[240px] mx-auto leading-relaxed">
                            Has aprobado el cuestionario de normativas de la Fase 1. La Fase 2 está desbloqueada en tu Dashboard.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Formularios del Staff — solo visibles con whitelist aprobada */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Formularios del Staff</h3>
                  {!isPhase1Completed && (
                    <span className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-extrabold uppercase tracking-wider">
                      <Lock className="w-2.5 h-2.5" />
                      Requiere Whitelist
                    </span>
                  )}
                </div>

                {!isPhase1Completed ? (
                  /* Bloqueado — no tiene whitelist aprobada */
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 py-12 flex flex-col items-center justify-center gap-4 text-center backdrop-blur-sm px-6">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-sm font-black text-white">Acceso restringido</p>
                      <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                        Necesitas tener la <span className="text-amber-400 font-bold">Whitelist aprobada</span> para acceder a los formularios creados por el staff.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("new_application")}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand hover:bg-brand-deep text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-brand/10"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      Completar Whitelist primero
                    </button>
                  </div>
                ) : customForms.length === 0 ? (
                  /* Tiene whitelist pero no hay formularios aún */
                  <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 py-12 flex flex-col items-center justify-center gap-3 text-center backdrop-blur-sm">
                    <ClipboardList className="w-12 h-12 text-gray-600" />
                    <p className="text-sm font-bold text-white">No hay formularios disponibles aún</p>
                    <p className="text-xs text-gray-500">El staff publicará formularios próximamente.</p>
                  </div>
                ) : (
                  /* Tiene whitelist y hay formularios */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customForms.map((form) => (
                      <div key={form.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6 flex flex-col justify-between backdrop-blur-md">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-sm font-black text-white truncate">{form.title}</h4>
                                <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">form-id-{form.id}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-gray-400 leading-relaxed">
                            {form.description || "Sin descripción proporcionada."}
                          </p>

                          <div className="rounded-xl border border-white/5 bg-black/20 p-4 text-center">
                            <div className="text-xl font-black text-white">{form.questions.length}</div>
                            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wide mt-1">
                              Preguntas Totales
                            </div>
                          </div>
                        </div>

                        {(() => {
                          const userResponse = dbResponses.find(r => r.user_id === user?.id && r.form_id === form.id);
                          const isCompleted = userResponse && (userResponse.status === "Aprobada" || userResponse.status === "Pendiente");
                          if (isCompleted) {
                            return (
                              <button
                                disabled
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border cursor-not-allowed ${
                                  userResponse.status === "Aprobada"
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                    : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                }`}
                              >
                                {userResponse.status === "Aprobada" ? "Aprobada - Completada" : "En Revisión - Completada"}
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            );
                          }
                          return (
                            <button
                              onClick={() => {
                                setActiveFormToFill(form);
                                setFormAnswers({});
                              }}
                              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-violet-500/20"
                            >
                              Comenzar Solicitud
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── WHITELIST FASE 1: Formulario de Normativas ── */}
          {/* ── WHITELIST FASE 1: Formulario de Normativas Interactiva ── */}
          {activeTab === "whitelist_phase1" && (() => {
            const currentQuestion = phase1Questions[phase1CurrentQuestionIdx];
            const answeredCount = Object.keys(phase1Answers).filter(k => (phase1Answers[Number(k)] || "").trim().length > 0).length;
            const progressPercent = Math.round((answeredCount / 30) * 100);
            const isMinMet = answeredCount === 30;

            const hasPendingPhase1 = dbResponses.some(r => r.user_id === user?.id && r.form_id === 999999 && r.status === "Pendiente");

            if (hasPendingPhase1) {
              return (
                <div className="max-w-[480px] w-full mx-auto py-12 select-none animate-fade-in">
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-amber-500/[0.01] pointer-events-none" />

                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mx-auto">
                      <Clock className="w-8 h-8 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white uppercase tracking-wider">Solicitud en Revisión</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                        Ya has enviado un cuestionario de Whitelist Fase 1. Nuestro equipo de administración está revisando tus respuestas. Por favor, espera a que se resuelva tu solicitud.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
                    >
                      Volver al Dashboard
                    </button>
                  </div>
                </div>
              );
            }

            // Si ha superado el límite de intentos, bloquear el acceso
            if (attemptsLimitReached) {
              return (
                <div className="max-w-[500px] w-full mx-auto pb-12 space-y-6 animate-fade-in select-none">
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest">
                      <Lock className="w-3.5 h-3.5 animate-pulse" />
                      Acceso Bloqueado
                    </span>
                  </div>

                  <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center space-y-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/[0.01] pointer-events-none" />

                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 mx-auto">
                      <Clock className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white uppercase tracking-wider">Límite de intentos alcanzado</h3>
                      <p className="text-xs text-gray-400 leading-relaxed font-semibold">
                        Has agotado tus {dailyAttemptsLimit} intentos permitidos para hoy. Por favor, espera a que se restablezca tu límite de intentos.
                      </p>
                    </div>

                    <div className="rounded-xl bg-black/40 border border-white/5 p-4 space-y-1.5">
                      <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider block">Siguiente intento disponible en</span>
                      <span className="text-2xl font-mono font-black text-red-400 tracking-wider block">{attemptsCountdown}</span>
                    </div>

                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
                    >
                      Volver al Dashboard
                    </button>
                  </div>
                </div>
              );
            }

            // Si el test no está activo (pantalla de prewhitelist / instrucciones o resumen de progreso)
            if (!isTestActive) {
              return (
                <div className="max-w-[720px] w-full mx-auto pb-12 space-y-6 animate-fade-in select-none">

                  {/* Badge superior */}
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-brand text-xs font-black uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5" />
                      Whitelist Fase 1
                    </span>
                  </div>

                  {/* Título */}
                  <div className="text-center space-y-2">
                    <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      Formulario de{" "}
                      <span className="bg-gradient-to-r from-brand to-brand-soft bg-clip-text text-transparent">
                        Normativas
                      </span>
                    </h2>
                    <p className="text-sm text-gray-400">
                      Demuestra tu conocimiento de las reglas del servidor
                    </p>
                  </div>

                  {isPhase1Started ? (
                    /* CUADRO AMARILLO: Formulario en progreso */
                    <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 md:p-8 space-y-6 backdrop-blur-md relative overflow-hidden">
                      {/* Fondo decorativo amarillo */}
                      <div className="absolute inset-0 bg-amber-500/[0.02] pointer-events-none" />

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                          <AlertTriangle className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-black text-white uppercase tracking-wider">¿Tienes un formulario en progreso?</h3>
                          <p className="text-xs text-gray-300 leading-relaxed font-semibold">
                            Has respondido <span className="text-amber-400 font-extrabold">{answeredCount}</span> de <span className="text-white font-extrabold">30</span> preguntas.
                          </p>
                        </div>
                      </div>

                      {/* Progreso */}
                      <div className="space-y-2 bg-black/20 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-gray-400">Avance Guardado</span>
                          <span className="text-amber-400">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Botones de acción del progreso */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                          onClick={() => setIsTestActive(true)}
                          className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-amber-500/15"
                        >
                          Continuar con el formulario
                          <ArrowRight className="w-4 h-4 text-black" />
                        </button>
                        <button
                          onClick={() => setIsCancelModalOpen(true)}
                          className="px-6 py-4 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Tarjeta normal de instrucciones */
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md p-6 space-y-5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0">
                          <span className="w-2 h-2 rounded-full bg-brand" />
                        </span>
                        <h3 className="text-base font-black text-white uppercase tracking-wider">
                          Instrucciones
                        </h3>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            n: 1,
                            title: "30 preguntas de opción múltiple",
                            desc: "Basadas en las normativas del servidor",
                          },
                          {
                            n: 2,
                            title: "Sin límite de tiempo",
                            desc: "Tómate el tiempo que necesites para responder",
                          },
                          {
                            n: 3,
                            title: "Puedes navegar entre preguntas",
                            desc: "Responde en el orden que prefieras y revisa antes de enviar",
                          },
                          {
                            n: 4,
                            title: "Guardado automático de progreso",
                            desc: "Si sales del formulario, tu avance se guarda y puedes continuar después",
                          },
                        ].map((item) => (
                          <div key={item.n} className="flex items-start gap-4">
                            <span className="w-7 h-7 rounded-full bg-brand/15 border border-brand/25 text-brand text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                              {item.n}
                            </span>
                            <div>
                              <p className="text-sm font-black text-white">{item.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="h-px bg-white/5 my-2" />

                      {/* Recomendación */}
                      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 flex items-start gap-3">
                        <BookOpen className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-300 leading-relaxed">
                          <span className="text-white font-bold">Recomendación:</span> Antes de comenzar, te sugerimos revisar las{" "}
                          <button
                            onClick={() => setActiveTab("rules")}
                            className="text-brand hover:text-brand-soft font-bold underline underline-offset-2 transition-colors cursor-pointer"
                          >
                            normativas del servidor
                          </button>{" "}
                          para asegurarte de estar preparado.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsPhase1Started(true);
                          setPhase1StartedAt(new Date().toISOString());
                          setIsTestActive(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand hover:bg-brand-deep text-white font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-brand/20"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5" />
                        Comenzar Cuestionario
                      </button>
                    </div>
                  )}

                  {/* Nota inferior */}
                  <p className="text-center text-xs text-gray-600">
                    Las respuestas no se muestran al finalizar.
                  </p>
                </div>
              );
            }

            // Vista del Cuestionario Activo (DISEÑO PREMIUM SIN SCROLL DE PÁGINA EN DESKTOP)
            return (
              <div className="max-w-[1200px] w-full mx-auto min-h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] flex flex-col justify-between select-none animate-fade-in pb-4 gap-4">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-black text-white uppercase tracking-wider">
                      Whitelist Fase 1
                    </h2>
                    <span className="text-[9px] text-brand font-black uppercase bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
                      Pregunta {phase1CurrentQuestionIdx + 1} de 30
                    </span>
                  </div>

                  {/* Botón Salir (Guarda el progreso automáticamente) */}
                  <button
                    onClick={() => {
                      setIsTestActive(false);
                      setActiveTab("dashboard");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Salir y Guardar
                  </button>
                </div>

                {/* Progress track */}
                <div className="space-y-1 py-2 shrink-0">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-gray-500">{answeredCount} de 30 respondidas</span>
                    <span className="text-brand">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand to-brand-soft rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Main grid layout - Ocupa el espacio central restante */}
                <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 py-2 overflow-y-auto lg:overflow-y-visible">

                  {/* Left Column: Cuestionario */}
                  <div className="lg:col-span-2 flex flex-col justify-between min-h-0 gap-4">
                    <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between gap-4 backdrop-blur-md relative overflow-hidden min-h-[350px] lg:min-h-0">

                      {/* Área de Pregunta - Con Scroll en caso de pantallas muy pequeñas */}
                      <div className="overflow-y-auto custom-scrollbar space-y-4 pr-1 shrink-0">
                        <span className="inline-block text-[8px] font-black uppercase tracking-widest text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
                          {currentQuestion.category}
                        </span>
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-bold uppercase block">Pregunta {phase1CurrentQuestionIdx + 1} de 30</span>
                          <h3 className="text-base font-extrabold text-white leading-snug">
                            {currentQuestion.question}
                          </h3>
                        </div>
                      </div>

                      {/* Textarea para respuesta abierta */}
                      <div className="flex-1 flex flex-col gap-2 py-1 pr-1">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Tu respuesta:</label>
                        <textarea
                          value={phase1Answers[currentQuestion.id] || ""}
                          onChange={(e) => {
                            setPhase1Answers({
                              ...phase1Answers,
                              [currentQuestion.id]: e.target.value
                            });
                          }}
                          placeholder="Escribe tu respuesta de forma clara y detallada..."
                          className="w-full flex-1 min-h-[160px] px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold placeholder:text-gray-600 focus:outline-none focus:border-brand/50 resize-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Nav Buttons */}
                    <div className="flex items-center justify-between pt-3 shrink-0">
                      <button
                        disabled={phase1CurrentQuestionIdx === 0}
                        onClick={() => setPhase1CurrentQuestionIdx(phase1CurrentQuestionIdx - 1)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed text-gray-400 hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        &lsaquo; Anterior
                      </button>

                      <button
                        disabled={phase1CurrentQuestionIdx === 29}
                        onClick={() => setPhase1CurrentQuestionIdx(phase1CurrentQuestionIdx + 1)}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-deep disabled:opacity-30 disabled:cursor-not-allowed text-white text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-brand/20"
                      >
                        Siguiente &rsaquo;
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Navegacion */}
                  <div className="flex flex-col min-h-[300px] lg:min-h-0">
                    <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between gap-4 backdrop-blur-md min-h-[250px] lg:min-h-0">
                      <div className="shrink-0">
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">
                          Navegación ({answeredCount}/30)
                        </h4>
                        <p className="text-[9px] text-gray-500 font-medium mt-0.5">Haz clic en cualquier número para ir a la pregunta.</p>
                      </div>

                      {/* Number Grid - Compacto */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 py-1 min-h-0">
                        <div className="grid grid-cols-5 gap-2">
                          {phase1Questions.map((q, idx) => {
                            const isCurrent = phase1CurrentQuestionIdx === idx;
                            const isAnswered = (phase1Answers[q.id] || "").trim().length > 0;
                            return (
                              <button
                                key={q.id}
                                onClick={() => setPhase1CurrentQuestionIdx(idx)}
                                className={`aspect-square w-full rounded-lg border text-[10px] font-black flex items-center justify-center transition-all cursor-pointer ${isCurrent
                                  ? "bg-brand/15 border-brand text-brand shadow-md shadow-brand/10 ring-1 ring-brand"
                                  : isAnswered
                                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                    : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                                  }`}
                              >
                                {idx + 1}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 pt-3 border-t border-white/5 text-[9px] font-bold uppercase tracking-wider text-gray-500 shrink-0">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-sm bg-brand/20 border border-brand" />
                          <span>Actual</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-sm bg-emerald-500/10 border border-emerald-500/20" />
                          <span>Respondida</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-sm bg-amber-500/10 border border-amber-500/20" />
                          <span>Pendiente</span>
                        </div>
                      </div>

                      {/* Submit Section */}
                      <div className="pt-2 shrink-0">
                        {isMinMet ? (
                          <button
                            disabled={isSubmittingPhase1}
                            onClick={async () => {
                              if (isSubmittingPhase1) return;
                              setIsSubmittingPhase1(true);
                              try {
                                const res = await fetch("/api/phase1-submit", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    userId: user?.id,
                                    username: user?.username,
                                    avatar: user?.avatar,
                                    answers: phase1Answers
                                  })
                                });
                                if (res.ok) {
                                  // Limpiar progreso activo de la Fase 1 en SQLite (conservando el historial de cancelados)
                                  await fetch("/api/phase1-progress", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      userId: user?.id,
                                      isCompleted: false,
                                      isStarted: false,
                                      isActive: false,
                                      currentQuestionIdx: 0,
                                      answers: {},
                                      startedAt: "",
                                      abandonedApps: abandonedApps
                                    })
                                  });

                                  setPhase1Answers({});
                                  setPhase1CurrentQuestionIdx(0);
                                  setIsPhase1Started(false);
                                  setIsTestActive(false);
                                  setPhase1StartedAt("");

                                  await loadDatabaseData(user?.id);
                                  setActiveTab("applications");
                                } else {
                                  const errData = await res.json().catch(() => ({}));
                                  alert("Error al enviar el cuestionario: " + (errData.error || "Por favor intenta de nuevo."));
                                }
                              } catch (e) {
                                console.error("Error submitting phase 1:", e);
                              } finally {
                                setIsSubmittingPhase1(false);
                              }
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {isSubmittingPhase1 ? "Enviando..." : "Enviar Cuestionario"}
                          </button>
                        ) : (
                          <div className="w-full p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400 space-y-1.5 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-[10px] font-black uppercase">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Faltan respuestas
                            </div>
                            <p className="text-[9px] text-gray-500 font-medium leading-relaxed">
                              Responde las 30 preguntas obligatorias para poder enviar. ({answeredCount}/30).
                            </p>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>

                </div>

              </div>
            );
          })()}

          {/* ── E: VISTA DE CREACIÓN DE FORMULARIO ── */}
          {activeTab === "create_form" && (
            <div className="space-y-8 max-w-[900px] w-full mx-auto pb-8">

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-6 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Plus className="w-6 h-6 text-brand" />
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">
                    Crear Nuevo Formulario de Solicitud
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Título */}
                  <div>
                    <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                      Título del Formulario
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Ej: Formulario de EMS, Solicitud Banda..."
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-brand/50 transition-all"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                      Descripción del Formulario
                    </label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Escribe una breve introducción o requisitos para rellenar este formulario..."
                      rows={3}
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold placeholder:text-gray-600 focus:outline-none focus:border-brand/50 resize-none transition-all"
                    />
                  </div>

                  <div className="h-px bg-white/5 my-4" />

                  {/* Agregar Preguntas */}
                  <div className="space-y-4 bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                    <h4 className="text-xs font-black text-brand uppercase tracking-wider">
                      Agregar Pregunta al Formulario
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[9px] text-gray-400 font-bold uppercase">Pregunta</label>
                        <input
                          type="text"
                          value={newQuestionText}
                          onChange={(e) => setNewQuestionText(e.target.value)}
                          placeholder="¿Qué deseas preguntar?"
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-brand/40"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] text-gray-400 font-bold uppercase">Tipo de respuesta</label>
                          <select
                            value={newQuestionType}
                            onChange={(e) => setNewQuestionType(e.target.value as Question["type"])}
                            className="w-full mt-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-brand/40"
                          >
                            <option value="Abierta">Pregunta Abierta (Texto libre)</option>
                            <option value="Cerrada">Pregunta Cerrada (Sí / No)</option>
                            <option value="Opción Múltiple">Opción Múltiple (Selección)</option>
                          </select>
                        </div>

                        {newQuestionType === "Opción Múltiple" && (
                          <div>
                            <label className="text-[9px] text-gray-400 font-bold uppercase">Añadir Opción</label>
                            <div className="flex gap-2 mt-1">
                              <input
                                type="text"
                                value={newOptionVal}
                                onChange={(e) => setNewOptionVal(e.target.value)}
                                placeholder="Opción..."
                                className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-brand/40"
                              />
                              <button
                                onClick={addOptionToCreatorQuestion}
                                className="px-3 rounded-lg bg-brand hover:bg-brand-deep text-white text-xs font-bold cursor-pointer"
                              >
                                Añadir
                              </button>
                            </div>
                            {newQuestionOptions.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {newQuestionOptions.map((opt, i) => (
                                  <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-300 font-medium">
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={addCreatorQuestion}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Insertar Pregunta
                      </button>
                    </div>
                  </div>

                  {/* Listado de Preguntas Agregadas */}
                  {creatorQuestions.length > 0 && (
                    <div className="space-y-3 mt-6">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        Preguntas en el Formulario ({creatorQuestions.length})
                      </h4>

                      <div className="space-y-2.5">
                        {creatorQuestions.map((q, index) => (
                          <div key={q.id} className="rounded-xl border border-white/5 bg-black/30 p-4 flex items-center justify-between gap-4">
                            <div className="space-y-1 min-w-0">
                              <span className="text-[9px] text-brand font-black uppercase">
                                Pregunta {index + 1} &bull; {q.type}
                              </span>
                              <p className="text-xs font-bold text-white truncate">{q.text}</p>
                              {q.options.length > 0 && (
                                <p className="text-[9px] text-gray-500 truncate">
                                  Opciones: {q.options.join(", ")}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => removeCreatorQuestion(q.id)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acciones de Publicación */}
                  <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      disabled={creatorQuestions.length === 0 || !formTitle.trim()}
                      onClick={publishCustomForm}
                      className={`flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${creatorQuestions.length === 0 || !formTitle.trim()
                        ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5"
                        : "bg-brand hover:bg-brand-deep text-white shadow-lg shadow-brand/25"
                        }`}
                    >
                      Crear Formulario
                    </button>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ── F: VISTA DE REVISIÓN DE RESULTADOS DE FORMULARIO ── */}
          {activeTab.startsWith("results-") && (
            <div className="space-y-8 max-w-[1200px] w-full mx-auto pb-8">
              {(() => {
                const targetFormId = parseInt(activeTab.split("-")[1]);
                const form = customForms.find((f) => f.id === targetFormId);
                const submissions = filteredSubmissions(targetFormId);
                if (!form) return <p>Formulario no encontrado</p>;

                return (
                  <>
                    {/* Header */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
                      <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
                          <FileSpreadsheet className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-xl font-black text-white uppercase tracking-wider">
                            Resultados: {form.title}
                          </h2>
                          <p className="text-xs text-gray-400">
                            Revisa y decide el estado de las solicitudes hechas por usuarios.
                          </p>
                          {form.description && (
                            <p className="text-[10px] text-gray-500 max-w-[500px] leading-relaxed pt-1">
                              <strong>Detalle:</strong> {form.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => openEditForm(form)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 text-xs font-bold uppercase tracking-wide transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Editar
                        </button>
                        <button
                          onClick={() => setFormToDelete(form)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-bold uppercase tracking-wide transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar
                        </button>
                        <button onClick={() => loadDatabaseData(user?.id)} className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4 backdrop-blur-md">
                      <div className="flex-1 relative flex items-center">
                        <Search className="absolute left-4 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Buscar usuario o ID de Discord..."
                          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-medium placeholder:text-gray-600 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all"
                        />
                      </div>

                      <div className="relative shrink-0 min-w-[200px]">
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-black appearance-none focus:outline-none focus:border-brand/40 transition-all cursor-pointer"
                        >
                          <option value="Todas">Todas</option>
                          <option value="Pendientes">Pendientes</option>
                          <option value="Aprobadas">Aprobadas</option>
                          <option value="Rechazadas">Rechazadas</option>
                        </select>
                        <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>

                    {/* Listado de entregas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {submissions.length > 0 ? (
                        submissions.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => setSelectedResponse(sub)}
                            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between gap-4 hover:bg-white/[0.04] hover:border-white/15 transition-all backdrop-blur-md cursor-pointer group"
                          >
                            <div className="space-y-4">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                                    {sub.avatar ? (
                                      <img
                                        src={`https://cdn.discordapp.com/avatars/${sub.user_id}/${sub.avatar}.png`}
                                        alt={sub.username}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <User className="w-5 h-5 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-black text-white truncate group-hover:text-violet-400 transition-colors">
                                      {sub.username}
                                    </h4>
                                    <span className="text-[9px] text-gray-500 font-mono block">
                                      ID: {sub.user_id}
                                    </span>
                                  </div>
                                </div>

                                <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase ${sub.status === "Aprobada"
                                  ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
                                  : sub.status === "Pendiente"
                                    ? "bg-amber-500/10 border border-amber-500/25 text-amber-400 animate-pulse"
                                    : "bg-red-500/10 border border-red-500/25 text-red-500"
                                  }`}>
                                  {sub.status}
                                </span>
                              </div>

                              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                                  {sub.submitted_at}
                                </span>
                                <span className="text-brand font-bold">Ver respuestas &rsaquo;</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full py-16 text-center border border-dashed border-white/10 bg-black/10 rounded-2xl flex flex-col items-center justify-center gap-2">
                          <ClipboardList className="w-12 h-12 text-gray-600" />
                          <p className="text-sm font-bold text-white">No hay entregas registradas aún</p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* ── G: VISTA DE NORMATIVAS (DISEÑO IDÉNTICO ADAPTADO) ── */}
          {activeTab === "rules" && (
            <div className="space-y-8 max-w-[1200px] w-full mx-auto pb-8 animate-fade-in">

              {/* 1. Header Card de Normativas (Sin exportación a PDF) */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden backdrop-blur-md">
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                  <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shrink-0">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2 justify-center sm:justify-start">
                      Normativas del Servidor
                      <span className="text-[10px] font-extrabold uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">
                        Sistema Activo
                      </span>
                    </h2>
                    <p className="text-xs text-gray-400">
                      181 reglas disponibles para el juego limpio
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Filtros y Búsqueda */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-white/[0.01] border border-white/5 rounded-2xl p-4 backdrop-blur-md">
                {/* Caja de Búsqueda */}
                <div className="flex-1 relative flex items-center">
                  <Search className="absolute left-4 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={rulesSearchQuery}
                    onChange={(e) => setRulesSearchQuery(e.target.value)}
                    placeholder="Buscar normativas..."
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-medium placeholder:text-gray-600 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/40 transition-all"
                  />
                </div>

                {/* Select de Categoría */}
                <div className="relative shrink-0 min-w-[260px]">
                  <select
                    value={rulesFilterCategory}
                    onChange={(e) => setRulesFilterCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-black appearance-none focus:outline-none focus:border-brand/40 transition-all cursor-pointer"
                  >
                    <option value="Todas">Todas las categorías</option>
                    {rulesCategories.map((cat) => (
                      <option key={cat.title} value={cat.title}>{cat.title}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" />
                </div>
              </div>

              {/* 3. Secciones agrupadas por categoría */}
              <div className="space-y-10">
                {rulesCategories.map((category) => {
                  // Filtrar las reglas en base a la búsqueda y categoría seleccionada
                  if (rulesFilterCategory !== "Todas" && rulesFilterCategory !== category.title) {
                    return null;
                  }

                  const matchedRules = category.rules.filter((rule) => {
                    const term = rulesSearchQuery.toLowerCase();
                    return (
                      rule.id.toLowerCase().includes(term) ||
                      rule.title.toLowerCase().includes(term) ||
                      rule.excerpt.toLowerCase().includes(term) ||
                      rule.content.toLowerCase().includes(term)
                    );
                  });

                  if (matchedRules.length === 0) return null;

                  return (
                    <div key={category.title} className="space-y-5">
                      {/* Cabecera de Categoría */}
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                            {category.icon === "gavel" ? <Gavel className="w-5 h-5" /> :
                              category.icon === "book" ? <BookOpen className="w-5 h-5" /> :
                                category.icon === "shield" ? <Scale className="w-5 h-5" /> :
                                  category.icon === "car" ? <ArrowRight className="w-5 h-5" /> :
                                    category.icon === "user" ? <User className="w-5 h-5" /> :
                                      category.icon === "star" ? <Sparkles className="w-5 h-5" /> :
                                        category.icon === "scroll" ? <FileText className="w-5 h-5" /> :
                                          category.icon === "badge" ? <Check className="w-5 h-5" /> :
                                            <AlertTriangle className="w-5 h-5" />}
                          </div>
                          <h3 className="text-base font-black text-white uppercase tracking-wider">
                            {category.title}
                          </h3>
                        </div>
                        <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 text-xs font-bold">
                          {matchedRules.length} reglas
                        </span>
                      </div>

                      {/* Cuadrícula de Reglas */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {matchedRules.map((rule) => (
                          <div
                            key={rule.id}
                            onClick={() => setSelectedRule(rule)}
                            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col justify-between gap-4 hover:bg-white/[0.04] hover:border-brand/30 transition-all backdrop-blur-md cursor-pointer relative overflow-hidden group min-h-[160px]"
                          >
                            <div className="space-y-3">
                              <span className="text-[10px] text-brand font-black tracking-wider uppercase bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
                                {rule.id}
                              </span>
                              <h4 className="text-sm font-black text-white leading-snug group-hover:text-brand transition-colors">
                                {rule.title}
                              </h4>
                              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed font-medium">
                                {rule.excerpt}
                              </p>
                            </div>

                            <div className="flex justify-end text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-2 group-hover:text-white transition-colors">
                              Leer más &rsaquo;
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* ── MODAL: VER DETALLE DE NORMATIVA (DISEÑO PREMIUM) ── */}
      <AnimatePresence>
        {selectedRule && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedRule(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="w-full max-w-[680px] rounded-3xl border border-white/10 bg-gradient-to-b from-[#100d1e] to-[#0a0812] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] overflow-hidden max-h-[88vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header de Modal */}
              <div className="relative px-7 pt-7 pb-5 border-b border-white/5 bg-white/[0.01] shrink-0">
                {/* Decoración de fondo */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, rgba(247,107,138,1) 0%, transparent 50%)" }} />
                <div className="relative flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-black uppercase tracking-widest text-brand bg-brand/15 border border-brand/30 px-3 py-1 rounded-lg">
                        {selectedRule.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                        Normativa Oficial
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white leading-tight pr-8">
                      {selectedRule.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedRule(null)}
                    className="shrink-0 mt-1 w-8 h-8 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cuerpo del Modal */}
              <div className="overflow-y-auto custom-scrollbar px-7 py-6 flex-1 space-y-4">
                {/* Descripción breve */}
                <div className="rounded-xl bg-brand/5 border border-brand/15 p-4">
                  <p className="text-xs text-gray-300 leading-relaxed font-medium italic">
                    {selectedRule.excerpt}
                  </p>
                </div>

                {/* Divisor */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">Contenido completo</span>
                  <div className="h-px flex-1 bg-white/5" />
                </div>

                {/* Contenido completo */}
                <div className="text-sm text-gray-200 leading-[1.9] font-medium whitespace-pre-line space-y-1">
                  {selectedRule.content.split("\n").map((line, i) => {
                    if (line.trim() === "") return <div key={i} className="h-3" />;
                    // Detectar líneas con patrones especiales
                    const isArticle = /^Artículo|^FASE|^ZONA|^PRINCIPIO|^Jerarqu|^FISCAL|^PROHIB|^CORRECTO|^INCORRECTO|^CONSEJO/i.test(line.trim());
                    const isBullet = line.trim().startsWith("-") || line.trim().startsWith("•") || line.trim().match(/^\d+\./);
                    const isWarning = /PROHIBIDO|TERMINANTEMENTE|SANCIÓN|BAN|EXPULSIÓN|INCORRECTO/i.test(line);
                    const isCorrect = /^CORRECTO/i.test(line.trim());
                    const isIncorrect = /^INCORRECTO/i.test(line.trim());
                    const isTip = /^CONSEJO/i.test(line.trim());

                    if (isCorrect) return (
                      <div key={i} className="flex items-start gap-2 text-emerald-300 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2 text-xs">
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" /> <span>{line.replace(/^CORRECTO[: ]*/i, "")}</span>
                      </div>
                    );
                    if (isIncorrect) return (
                      <div key={i} className="flex items-start gap-2 text-red-300 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2 text-xs">
                        <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> <span>{line.replace(/^INCORRECTO[: ]*/i, "")}</span>
                      </div>
                    );
                    if (isTip) return (
                      <div key={i} className="flex items-start gap-2 text-amber-300 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2 text-xs mt-2">
                        <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" /> <span>{line.replace(/^CONSEJO[: ]*/i, "")}</span>
                      </div>
                    );
                    if (isArticle && !isBullet) return (
                      <p key={i} className="text-brand font-black text-xs uppercase tracking-wide mt-3 first:mt-0">{line}</p>
                    );
                    return <p key={i} className={`text-sm leading-relaxed ${isWarning ? "text-orange-300 font-bold" : "text-gray-300 font-medium"}`}>{line}</p>;
                  })}
                </div>
              </div>

              {/* Footer del Modal */}
              <div className="px-7 py-5 border-t border-white/5 shrink-0 flex items-center justify-between bg-white/[0.005]">
                <span className="text-[10px] text-gray-600 font-medium">ACCIÓN X RP · Normativas 21 AGO 2026</span>
                <button
                  onClick={() => setSelectedRule(null)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: CONFIRMAR ELIMINACIÓN DE FORMULARIO ── */}
      <AnimatePresence>
        {formToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="w-full max-w-[440px] rounded-2xl border border-red-500/20 bg-[#100d1e] p-7 space-y-6 shadow-2xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">Eliminar Formulario</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    ¿Estás seguro de que quieres eliminar el formulario <span className="text-white font-bold">"{formToDelete.title}"</span>? Esta acción eliminará también todas las respuestas asociadas y no se puede deshacer.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
                <button
                  onClick={() => setFormToDelete(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => deleteForm(formToDelete.id)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/20"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: CONFIRMAR CANCELACIÓN DE FORMULARIO ── */}
      <AnimatePresence>
        {isCancelModalOpen && (() => {
          const answeredCount = Object.keys(phase1Answers).length;
          return (
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="w-full max-w-[460px] rounded-2xl border border-red-500/20 bg-[#100d1e] p-7 space-y-6 shadow-2xl"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-black text-white uppercase tracking-wider text-left">Cancelar formulario</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-semibold text-left">
                      Esta acción no se puede deshacer. ¿Estás seguro que deseas cancelar tu formulario en progreso?
                    </p>
                    <div className="rounded-lg bg-black/40 border border-white/5 p-3 text-xs text-gray-300 text-left">
                      Progreso actual: <strong className="text-white">{answeredCount}</strong> de <strong className="text-white">30</strong> preguntas respondidas.
                    </div>
                    <div className="text-[11px] text-red-400/90 leading-relaxed bg-red-500/5 border border-red-500/10 rounded-lg p-3 font-medium text-left">
                      <span className="font-extrabold uppercase text-[10px] block mb-1">Nota importante:</span>
                      Tu progreso se perderá y esto contará como un intento abandonado. Podrás iniciar un nuevo formulario si aún tienes intentos disponibles hoy.
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                  <button
                    onClick={() => setIsCancelModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    onClick={() => {
                      const newAbandoned = {
                        id: "AB-" + Math.floor(Math.random() * 9000 + 1000),
                        title: "Whitelist Fase 1",
                        status: "Abandonada",
                        startedAt: phase1StartedAt || new Date().toISOString(),
                        abandonedAt: new Date().toISOString()
                      };
                      setAbandonedApps([newAbandoned, ...abandonedApps]);

                      setPhase1Answers({});
                      setPhase1CurrentQuestionIdx(0);
                      setIsPhase1Started(false);
                      setIsTestActive(false);
                      setPhase1StartedAt("");
                      setIsCancelModalOpen(false);
                      setActiveTab("applications"); // Mandarlo a la pestaña de aplicaciones para ver su estado
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-red-600/20"
                  >
                    Sí, cancelar formulario
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* ── MODAL: EDITAR FORMULARIO ── */}
      <AnimatePresence>
        {formToEdit && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="w-full max-w-[600px] rounded-2xl border border-white/10 bg-[#100d1e] overflow-hidden max-h-[88vh] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/5 shrink-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                    <Edit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Editar Formulario</h3>
                    <p className="text-[10px] text-gray-500 font-medium">Los cambios afectarán a futuros envíos.</p>
                  </div>
                </div>
                <button
                  onClick={() => setFormToEdit(null)}
                  className="w-8 h-8 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto custom-scrollbar px-6 py-5 flex-1 space-y-4">
                <div>
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">Título del Formulario</label>
                  <input
                    type="text"
                    value={editFormTitle}
                    onChange={(e) => setEditFormTitle(e.target.value)}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-brand/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">Descripción</label>
                  <textarea
                    value={editFormDesc}
                    onChange={(e) => setEditFormDesc(e.target.value)}
                    rows={2}
                    className="w-full mt-1.5 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold placeholder:text-gray-600 focus:outline-none focus:border-brand/50 resize-none transition-all"
                  />
                </div>

                <div className="h-px bg-white/5" />

                <div>
                  <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide mb-3">
                    Preguntas del Formulario ({editFormQuestions.length})
                  </h4>
                  <div className="space-y-2">
                    {editFormQuestions.map((q, idx) => (
                      <div key={q.id} className="flex items-center justify-between gap-3 bg-black/20 border border-white/5 rounded-xl px-4 py-3">
                        <div className="space-y-0.5 min-w-0">
                          <span className="text-[9px] text-violet-400 font-black uppercase">Pregunta {idx + 1} · {q.type}</span>
                          <p className="text-xs text-white font-bold truncate">{q.text}</p>
                          {q.options.length > 0 && <p className="text-[9px] text-gray-500 truncate">Opciones: {q.options.join(", ")}</p>}
                        </div>
                        <button
                          onClick={() => removeEditQuestion(q.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {editFormQuestions.length === 0 && (
                      <p className="text-xs text-gray-600 text-center py-4">No hay preguntas. Agrega al menos una para guardar.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-white/5 shrink-0 flex items-center justify-end gap-3">
                <button
                  onClick={() => setFormToEdit(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveEditForm}
                  disabled={!editFormTitle.trim() || editFormQuestions.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-deep disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-brand/20"
                >
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: RELLENAR SOLICITUD ── */}

      <AnimatePresence>
        {activeFormToFill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[650px] rounded-2xl border border-white/10 bg-[#0e0a1a] p-6 space-y-6 overflow-hidden max-h-[90vh] flex flex-col justify-between shadow-2xl"
            >
              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-6 flex-1">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-wider">
                    {activeFormToFill.title}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {activeFormToFill.description || "Completa todos los campos obligatorios."}
                  </p>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-5">
                  {activeFormToFill.questions.map((q, idx) => (
                    <div key={q.id} className="space-y-2">
                      <label className="text-xs font-bold text-white block">
                        Pregunta {idx + 1}: {q.text}
                      </label>

                      {q.type === "Abierta" && (
                        <textarea
                          rows={2}
                          value={formAnswers[q.id] || ""}
                          onChange={(e) => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                          placeholder="Escribe tu respuesta aquí..."
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold placeholder:text-gray-600 focus:outline-none focus:border-brand/50 resize-none transition-all"
                        />
                      )}

                      {q.type === "Cerrada" && (
                        <div className="flex gap-4">
                          {["Sí", "No"].map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={formAnswers[q.id] === opt}
                                onChange={(e) => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                                className="accent-brand"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === "Opción Múltiple" && (
                        <div className="flex flex-col gap-2">
                          {q.options.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={formAnswers[q.id] === opt}
                                onChange={(e) => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                                className="accent-brand"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/5">
                <button
                  onClick={() => setActiveFormToFill(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  onClick={submitFormAnswers}
                  className="px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-deep text-white font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer shadow-lg shadow-brand/20"
                >
                  Enviar Respuestas
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: VER RESPUESTAS Y REVISAR SOLICITUD ── */}
      <AnimatePresence>
        {selectedResponse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-[650px] rounded-2xl border border-white/10 bg-[#0e0a1a] p-6 space-y-6 overflow-hidden max-h-[90vh] flex flex-col justify-between shadow-2xl"
            >
              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-6 flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                    {selectedResponse.avatar ? (
                      <img
                        src={`https://cdn.discordapp.com/avatars/${selectedResponse.user_id}/${selectedResponse.avatar}.png`}
                        alt={selectedResponse.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase leading-none">
                      Solicitud de {selectedResponse.username}
                    </h3>
                    <span className="text-[9px] text-gray-500 font-mono block mt-1">
                      ID Usuario: {selectedResponse.user_id} &bull; Enviado el {selectedResponse.submitted_at}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-4">
                  {selectedResponse.answers.map((ans, idx) => (
                    <div key={idx} className="rounded-xl border border-white/5 bg-black/40 p-4 space-y-2">
                      <span className="text-[10px] text-brand font-black uppercase">
                        Pregunta {idx + 1}
                      </span>
                      <p className="text-xs font-bold text-white">{ans.questionText}</p>
                      <p className="text-xs text-gray-300 bg-white/[0.02] border border-white/5 p-2 rounded-lg font-medium leading-relaxed">
                        {ans.answer}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide">
                    Notas o Motivos (Opcional / Enviado por Privado)
                  </label>
                  <textarea
                    rows={2}
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    placeholder="Escribe el motivo del rechazo o notas de aprobación para el usuario..."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold placeholder:text-gray-600 focus:outline-none focus:border-brand/50 resize-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-6 border-t border-white/5">
                <button
                  onClick={() => {
                    setSelectedResponse(null);
                    setReviewerComment("");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cerrar
                </button>

                {selectedResponse.status === "Pendiente" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => reviewSubmissionStatus("Rechazada")}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </button>
                    <button
                      onClick={() => reviewSubmissionStatus("Aprobada")}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Aceptar
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
