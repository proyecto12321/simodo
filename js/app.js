// ============================================================
// Sistema de Gestión Institucional — I.E. JEC Simón Bolívar
// ============================================================

const LOGIN_ROLES = new Set(['direccion', 'subdireccion', 'soporte']);
const COORD_PREFIX = 'coordinador_';

// Insignia institucional y avatar por defecto, incrustados como Data URI (base64).
// Esto es intencional: cuando el sistema se abre con doble clic (protocolo file://),
// cada archivo local se trata como un origen distinto y el navegador puede "manchar"
// (taint) el <canvas> al dibujar imágenes locales referenciadas por ruta de archivo,
// lo que hace fallar silenciosamente la generación de PDF (html2canvas/toDataURL).
// Usar Data URIs evita ese problema por completo, sin depender de un servidor.
const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnRyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNhNTNhNTQiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1NSUiIHN0b3AtY29sb3I9IiM4MDAwMjAiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNGQwMDEzIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJyaW5nRyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmMGQ5YTgiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjYzlhMDVhIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPHBhdGggaWQ9ImFyY1RvcCIgZD0iTSAyNiAxMDggQSA3NCA3NCAwIDAgMSAxNzQgMTA4Ii8+CiAgICA8cGF0aCBpZD0iYXJjQm90dG9tIiBkPSJNIDQwIDE0OCBBIDY2IDY2IDAgMCAwIDE2MCAxNDgiLz4KICA8L2RlZnM+CgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTciIGZpbGw9InVybCgjYmdHKSIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTciIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNyaW5nRykiIHN0cm9rZS13aWR0aD0iNCIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iODYiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNyaW5nRykiIHN0cm9rZS13aWR0aD0iMS41IiBvcGFjaXR5PSIwLjc1Ii8+CgogIDwhLS0gTGF1cmVsIGJyYW5jaCAtIGxlZnQgLS0+CiAgPGcgZmlsbD0idXJsKCNyaW5nRykiIG9wYWNpdHk9IjAuOTUiPgogICAgPGVsbGlwc2UgY3g9IjQyIiBjeT0iMTUwIiByeD0iOSIgcnk9IjQuMiIgdHJhbnNmb3JtPSJyb3RhdGUoLTM1IDQyIDE1MCkiLz4KICAgIDxlbGxpcHNlIGN4PSIzNiIgY3k9IjEzOSIgcng9IjkiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKC01MCAzNiAxMzkpIi8+CiAgICA8ZWxsaXBzZSBjeD0iMzIiIGN5PSIxMjYiIHJ4PSI5IiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgtNjUgMzIgMTI2KSIvPgogICAgPGVsbGlwc2UgY3g9IjMwIiBjeT0iMTEyIiByeD0iOSIgcnk9IjQuMiIgdHJhbnNmb3JtPSJyb3RhdGUoLTgwIDMwIDExMikiLz4KICAgIDxlbGxpcHNlIGN4PSIzMSIgY3k9Ijk4IiAgcng9IjkiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKC05NSAzMSA5OCkiLz4KICAgIDxwYXRoIGQ9Ik00NiAxNTggUTMwIDEzMCAzMyA5MiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ1cmwoI3JpbmdHKSIgc3Ryb2tlLXdpZHRoPSIyLjIiLz4KICA8L2c+CiAgPCEtLSBMYXVyZWwgYnJhbmNoIC0gcmlnaHQgKG1pcnJvcmVkKSAtLT4KICA8ZyBmaWxsPSJ1cmwoI3JpbmdHKSIgb3BhY2l0eT0iMC45NSI+CiAgICA8ZWxsaXBzZSBjeD0iMTU4IiBjeT0iMTUwIiByeD0iOSIgcnk9IjQuMiIgdHJhbnNmb3JtPSJyb3RhdGUoMzUgMTU4IDE1MCkiLz4KICAgIDxlbGxpcHNlIGN4PSIxNjQiIGN5PSIxMzkiIHJ4PSI5IiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSg1MCAxNjQgMTM5KSIvPgogICAgPGVsbGlwc2UgY3g9IjE2OCIgY3k9IjEyNiIgcng9IjkiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDY1IDE2OCAxMjYpIi8+CiAgICA8ZWxsaXBzZSBjeD0iMTcwIiBjeT0iMTEyIiByeD0iOSIgcnk9IjQuMiIgdHJhbnNmb3JtPSJyb3RhdGUoODAgMTcwIDExMikiLz4KICAgIDxlbGxpcHNlIGN4PSIxNjkiIGN5PSI5OCIgIHJ4PSI5IiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSg5NSAxNjkgOTgpIi8+CiAgICA8cGF0aCBkPSJNMTU0IDE1OCBRMTcwIDEzMCAxNjcgOTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0idXJsKCNyaW5nRykiIHN0cm9rZS13aWR0aD0iMi4yIi8+CiAgPC9nPgoKICA8IS0tIEFyY2hlZCBpbnN0aXR1dGlvbiB0ZXh0IC0tPgogIDx0ZXh0IGZvbnQtZmFtaWx5PSInSW50ZXIgVGlnaHQnLCdJbnRlcicsLWFwcGxlLXN5c3RlbSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmb250LXdlaWdodD0iODAwIiBmaWxsPSIjZmZmZmZmIiBsZXR0ZXItc3BhY2luZz0iMi41Ij4KICAgIDx0ZXh0UGF0aCBocmVmPSIjYXJjVG9wIiBzdGFydE9mZnNldD0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JLkUuIEpFQzwvdGV4dFBhdGg+CiAgPC90ZXh0PgogIDx0ZXh0IGZvbnQtZmFtaWx5PSInSW50ZXIgVGlnaHQnLCdJbnRlcicsLWFwcGxlLXN5c3RlbSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjExLjUiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiNmNWU2YzgiIGxldHRlci1zcGFjaW5nPSIxLjQiPgogICAgPHRleHRQYXRoIGhyZWY9IiNhcmNCb3R0b20iIHN0YXJ0T2Zmc2V0PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNJTcOTTiBCT0zDjVZBUjwvdGV4dFBhdGg+CiAgPC90ZXh0PgoKICA8IS0tIE9wZW4gYm9vayAtLT4KICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMDAsMTEyKSI+CiAgICA8cGF0aCBkPSJNLTM0LC0xMCBRLTM0LC0yNCAtMywtMTkgTC0zLDIyIFEtMzQsMTggLTM0LDMgWiIgZmlsbD0iI2ZmZmZmZiIvPgogICAgPHBhdGggZD0iTTM0LC0xMCBRMzQsLTI0IDMsLTE5IEwzLDIyIFEzNCwxOCAzNCwzIFoiIGZpbGw9IiNmZmZmZmYiLz4KICAgIDxwYXRoIGQ9Ik0tMjgsLTEzIFEtMjgsLTE5IC02LC0xNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzlhMDVhIiBzdHJva2Utd2lkdGg9IjEuNCIgb3BhY2l0eT0iMC43Ii8+CiAgICA8cGF0aCBkPSJNLTI4LC02IFEtMjgsLTExIC02LC04IiBmaWxsPSJub25lIiBzdHJva2U9IiNjOWEwNWEiIHN0cm9rZS13aWR0aD0iMS40IiBvcGFjaXR5PSIwLjciLz4KICAgIDxwYXRoIGQ9Ik0yOCwtMTMgUTI4LC0xOSA2LC0xNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzlhMDVhIiBzdHJva2Utd2lkdGg9IjEuNCIgb3BhY2l0eT0iMC43Ii8+CiAgICA8cGF0aCBkPSJNMjgsLTYgUTI4LC0xMSA2LC04IiBmaWxsPSJub25lIiBzdHJva2U9IiNjOWEwNWEiIHN0cm9rZS13aWR0aD0iMS40IiBvcGFjaXR5PSIwLjciLz4KICAgIDxsaW5lIHgxPSIwIiB5MT0iLTE5LjUiIHgyPSIwIiB5Mj0iMjIiIHN0cm9rZT0iI2M5YTA1YSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPC9nPgoKICA8IS0tIFN0YXIgYWJvdmUgdGhlIGJvb2sgLS0+CiAgPHBhdGggZmlsbD0idXJsKCNyaW5nRykiIGQ9Ik0xMDAsNTAgTDEwNC41LDYxLjUgMTE3LDYyLjUgMTA3LjUsNzAuNSAxMTAuNSw4Mi41IDEwMCw3NS41IDg5LjUsODIuNSA5Mi41LDcwLjUgODMsNjIuNSA5NS41LDYxLjUgWiIvPgoKICA8IS0tIFllYXIgLS0+CiAgPHRleHQgeD0iMTAwIiB5PSIxNzYiIGZvbnQtZmFtaWx5PSInSW50ZXIgVGlnaHQnLCdJbnRlcicsLWFwcGxlLXN5c3RlbSxzYW5zLXNlcmlmIiBmb250LXNpemU9IjExIiBmb250LXdlaWdodD0iNzAwIiBmaWxsPSIjZjVlNmM4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBsZXR0ZXItc3BhY2luZz0iMSI+MjAyNjwvdGV4dD4KPC9zdmc+Cg==';
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImF2QmciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRURFQUVDIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0RDRDdEQSIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIyMiIgZmlsbD0idXJsKCNhdkJnKSIvPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iMzkiIHI9IjE3IiBmaWxsPSIjQjlCMkI2Ii8+CiAgPHBhdGggZD0iTTE2IDkwIFE1MCA2MCA4NCA5MCBMODQgMTAwIEwxNiAxMDAgWiIgZmlsbD0iI0I5QjJCNiIvPgo8L3N2Zz4K';


const App = {
    currentUser: null,
    personal: [],
    config: {},
    evaluaciones: [],
    evaluacionesFormulario1: [], // {id, evaluadorDni, evaluadoDni, respuestas:[{pregunta,respuesta}], fecha}
    evaluacionesFormulario2: [], // {id, evaluadorDni, evaluadoDni, grupos:[{nombre,items:[{pregunta,estado,observacion}]}], fecha}
    plantillas: {},     // { rolDestino: {nombreArchivo, criterios:[{nombre,max}], fecha, subidoPor} }
    fotos: {},          // { dni: base64 }
    cuentas: {},         // { dni: {activo:bool, contrasena:string} } overrides
    logoInstitucional: null,
    currentTemplateParsed: null,
    charts: {},
    
    // Formulario 1: Preguntas de autoevaluación (12 preguntas abiertas)
    preguntasFormulario1: [
        "Maestro(a) ¿Cómo se sintió en el desarrollo de su sesión?",
        "¿Qué situaciones hicieron que us. se sienta así?",
        "¿Cuál era el propósito de su sesión?",
        "¿Crée ud. que logró el propósito?",
        "¿Qué estrategias aplicadas le ayudaron a lograr el propósito?",
        "¿Cuáles cree ud. que tendría que reformular?",
        "¿Considera ud. maestro(a) que, según las necesidades de los estudiantes, tuvo que reajustar lo planificado?",
        "Mestro(a) según la rúbrica 2, las actividades planteadas deben desarrollar la creatividad, razonamiento y el pensamiento crítico ¿Puede ud. mencionar en qué momento movilizó esas capacidades?",
        "Maestro(a), la rúbrica 3 nos indica que se debe retroalimentar a los estudiantes ¿En qué momento lo hizo?¿Cómo lo hizo?",
        "¿Considera ud. que el uso de materiales es importante para el logro del propósito de aprendizaje?",
        "¿Cómo ha evaluado ud. el logro de los aprendizajes?¿Crée que los criterios aplicados son apropiados?",
        "¿Qué información le permite recoger?"
    ],
    
    // Formulario 2: Rúbrica con grupos y estados (inicio/proceso/logrado)
    gruposFormulario2: [
        {
            nombre: "Planificación Curricular",
            items: [
                "Diseña la planificación curricular incorporando la caracterización del aula obtenida de la evaluación diagnóstica, las necesidades de aprendizaje y las características de los estudiantes.",
                "Formula las unidades didácticas en coherencia con el propósito de aprendizaje y alineados a las competencias y enfoques del área.",
                "Elabora la planificación curricular incorporando criterios de evaluación coherentes con los estándares de aprendizaje y las necesidades de aprendizaje.",
                "Organiza la unidad didáctica a partir de una situación significativa contextualizada, coherente con el diagnóstico, planteando un reto o desafío y promoviendo la movilización de competencias del CNEB.",
                "Diseña unidad didáctica manteniendo la secuencia de sesiones/actividades coherentes con la situación significativa, orientada al desarrollo progresivo de competencias y a la obtención de evidencias de aprendizaje.",
                "Diseña la unidad didáctica considerando los instrumentos y criterios de evaluación, de forma clara y pertinente en relación con los aprendizajes esperados.",
                "Elabora la sesión de aprendizaje en coherencia entre propósitos, criterios de evaluación, evidencias e instrumentos, alineado con la unidad didáctica.",
                "Prevé las adaptaciones curriculares en la sesión de aprendizaje para estudiantes con NEE (niveles de apoyo, materiales y exigencia diferenciada).",
                "Considera estrategias diferenciadas para atender las necesidades de acuerdos a los diversos niveles de aprendizajes identificados de los estudiantes.",
                "Prevé en la sesión de aprendizaje el uso pertinente de materiales, recursos educativos y textos proporcionados por el Ministerio de Educación del Perú y otras fuentes."
            ]
        },
        {
            nombre: "Aprendizaje constructivo",
            items: [
                "Comunica de manera clara y precisa el propósito de aprendizaje y los criterios de evaluación.",
                "Las actividades elaboradas en la sesión son desafiantes para el desarrollo de los aprendizajes.",
                "Promueve a través de actividades, el razonamiento, la creatividad de estrategias activas.",
                "Desarrollada las actividades que promueven el pensamiento crítico de manera sostenida.",
                "Promueve el trabajo colaborativo que permite interacción activa a través de roles, metas y responsabilidades compartidas entre estudiantes.",
                "Formula preguntas y repreguntas a los estudiantes de manera adecuadas que puedan guiar a responder con creatividad, razonamiento.",
                "Brinda retroalimentación a los estudiantes, en las oportunidades que son requeridos respetando las necesidades, intereses y ritmos de aprendizaje.",
                "Practica la escucha activa y considera las manifestaciones y perspectivas de los estudiantes considerando la interculturalidad e inclusiva."
            ]
        },
        {
            nombre: "Evaluación formativa",
            items: [
                "Promueve activamente la participación de los estudiantes y valora el error como una oportunidad para el aprendizaje y la reflexión.",
                "Realiza una observación oportuna y sistemática de los avances y dificultades de los estudiantes durante el proceso de aprendizaje.",
                "Revisa evidencias del proceso y logros de aprendizaje de los estudiantes en función del propósito establecido.",
                "Brinda retroalimentación oportuna, pertinente y reflexiva, considerando las necesidades de aprendizaje de los estudiantes."
            ]
        },
        {
            nombre: "Uso de materiales educativos",
            items: [
                "Adapta y contextualiza los recursos y materiales educativos considerando las características socioculturales y las necesidades de aprendizaje de los estudiantes.",
                "Utiliza recursos y materiales educativos que promueven la construcción activa del aprendizaje y favorece la retroalimentación mediante el diálogo y la interacción entre los estudiantes."
            ]
        }
    ],

    // Campos de cierre del Formulario 2: van como texto abierto (no como rúbrica
    // de inicio/proceso/logrado), porque son comentarios cualitativos del evaluador.
    camposConclusionFormulario2: [
        { id: 'observaciones', label: 'Observaciones y sugerencias', placeholder: 'Escribe tus observaciones y sugerencias de manera abierta...' },
        { id: 'compromisos', label: 'Compromisos', placeholder: 'Escribe los compromisos acordados de manera abierta...' }
    ],

    // ------------------------------------------------------------------
    // INIT
    // ------------------------------------------------------------------
    init() {
        this.loadEmbeddedData();
        this.loadLocalOverrides();
        this.applyTheme(localStorage.getItem('sgi_theme') || 'light');
        this.bindGlobalEvents();
        this.restoreSession();
        this.intentarCargarInsigniaPersonalizada();
    },

    loadEmbeddedData() {
        try {
            this.personal = JSON.parse(document.getElementById('personal-data-script').textContent);
        } catch (e) { this.personal = []; console.error('Error cargando personal.json', e); }
        try {
            this.config = JSON.parse(document.getElementById('config-data-script').textContent);
        } catch (e) { this.config = {}; console.error('Error cargando config.json', e); }

        document.getElementById('institution-name').textContent = this.config.nombre_institucion || 'Institución Educativa';
        document.getElementById('login-institution-name').textContent = this.config.nombre_institucion || '';
        document.getElementById('header-anio').textContent = this.config.anio || '';
        document.title = 'Sistema de Gestión — ' + (this.config.nombre_institucion || '');
    },

    loadLocalOverrides() {
        this.evaluaciones = this.storageGet('sgi_evaluaciones', []);
        this.evaluacionesFormulario1 = this.storageGet('sgi_evaluaciones_formulario1', []);
        this.evaluacionesFormulario2 = this.storageGet('sgi_evaluaciones_formulario2', []);
        this.plantillas = this.storageGet('sgi_plantillas', {});
        this.fotos = this.storageGet('sgi_fotos', {});
        this.cuentas = this.storageGet('sgi_cuentas', {});
        this.ultimasConexiones = this.storageGet('sgi_ultimas_conexiones', {});
        this.logoInstitucional = this.storageGet('sgi_logo', null);
        if (this.logoInstitucional) {
            document.getElementById('institution-logo').src = this.logoInstitucional;
            document.getElementById('login-logo-img').src = this.logoInstitucional;
        }
    },

    // Registra la fecha y hora en que una persona inició sesión, para que
    // Dirección y Subdirección puedan ver "última conexión" en el Directorio.
    // Importante: como el sistema no usa servidor, esto se guarda en el
    // navegador/computadora donde la persona inició sesión. Si cada quien usa
    // su propio dispositivo, este registro solo se ve reflejado en el
    // dispositivo donde ocurrió el ingreso.
    registrarConexion(dni) {
        this.ultimasConexiones = this.ultimasConexiones || {};
        this.ultimasConexiones[dni] = new Date().toISOString();
        this.storageSet('sgi_ultimas_conexiones', this.ultimasConexiones);
    },

    // ------------------------------------------------------------------
    // INSIGNIA PERSONALIZADA DESDE CARPETA (assets/images/insignia/foto1.*)
    // ------------------------------------------------------------------
    // Si Soporte Técnico no subió un logo manualmente, el sistema busca
    // SIEMPRE (en cada apertura) una imagen llamada "foto1" dentro de
    // assets/images/insignia/ (probando extensiones comunes) y la usa como
    // insignia institucional en todo el sistema, incluidos los reportes en
    // PDF. Se revisa en cada carga -para que si reemplazas el archivo por
    // una foto distinta, el cambio se refleje solo- salvo que Soporte Técnico
    // haya subido un logo manualmente desde el panel (ese sí tiene prioridad
    // y no se sobrescribe).
    //
    // Para que la MISMA insignia se use también en el PDF sin errores, la
    // convertimos a Data URI (base64) antes de usarla. Si el navegador no
    // permite leerla como base64 (puede pasar en algunos navegadores al
    // abrir el sistema con doble clic), se mantiene la insignia anterior o
    // la predeterminada, para garantizar que la exportación a PDF nunca falle.
    async intentarCargarInsigniaPersonalizada() {
        const origen = this.storageGet('sgi_logo_origen', null);
        if (origen === 'manual') return; // Soporte Técnico subió un logo a propósito: no lo tocamos

        const carpeta = 'assets/images/insignia/';
        const extensiones = ['png', 'jpg', 'jpeg', 'webp', 'svg'];
        for (const ext of extensiones) {
            const dataUrl = await this.convertirImagenLocalABase64(carpeta + 'foto1.' + ext);
            if (dataUrl) {
                this.logoInstitucional = dataUrl;
                this.storageSet('sgi_logo', dataUrl);
                this.storageSet('sgi_logo_origen', 'carpeta');
                document.getElementById('institution-logo').src = dataUrl;
                document.getElementById('login-logo-img').src = dataUrl;
                return;
            }
        }
        // No se encontró foto1 con ninguna extensión: si antes había una insignia
        // detectada desde la carpeta (y luego se borró el archivo), volvemos al
        // logo predeterminado en vez de dejar una imagen "fantasma" en caché.
        if (origen === 'carpeta') {
            this.logoInstitucional = null;
            localStorage.removeItem('sgi_logo');
            localStorage.removeItem('sgi_logo_origen');
            document.getElementById('institution-logo').src = DEFAULT_LOGO;
            document.getElementById('login-logo-img').src = DEFAULT_LOGO;
        }
    },

    convertirImagenLocalABase64(ruta) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth || 200;
                    canvas.height = img.naturalHeight || 200;
                    canvas.getContext('2d').drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                } catch (e) {
                    resolve(null); // imagen encontrada pero no se pudo leer como base64
                }
            };
            img.onerror = () => resolve(null); // la imagen no existe con esa extensión
            img.src = ruta;
        });
    },

    storageGet(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) { return fallback; }
    },
    storageSet(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); }
        catch (e) { console.error('No se pudo guardar', key, e); }
    },

    // ------------------------------------------------------------------
    // UTILIDADES DE DOMINIO
    // ------------------------------------------------------------------
    esCoordinador(rol) { return rol && rol.startsWith(COORD_PREFIX); },
    puedeIniciarSesion(rol) { return LOGIN_ROLES.has(rol) || this.esCoordinador(rol); },

    // cuenta activa (por defecto true, con override de soporte)
    estaActivo(persona) {
        const ov = this.cuentas[persona.dni];
        if (ov && typeof ov.activo === 'boolean') return ov.activo;
        return persona.activo !== false;
    },
    contrasenaDe(persona) {
        const ov = this.cuentas[persona.dni];
        if (ov && ov.contrasena) return ov.contrasena;
        return persona.contrasena;
    },

    fotoDe(persona) {
        return this.fotos[persona.dni] || DEFAULT_AVATAR;
    },

    labelRol(rol) {
        const map = {
            direccion: 'Directora', subdireccion: 'Subdirectora', soporte: 'Soporte Técnico',
            docente: 'Docente', administrativo: 'Personal Administrativo'
        };
        if (map[rol]) return map[rol];
        if (this.esCoordinador(rol)) {
            const area = (this.config.area_labels || {})[rol];
            return 'Coordinador(a)' + (area ? ' — ' + area : '');
        }
        return rol;
    },

    // A quién puede evaluar el usuario actual
    personalEvaluable(rol) {
        rol = rol || this.currentUser.rol;
        if (rol === 'direccion') {
            // Director evalúa a todos excepto a sí mismo y soporte
            return this.personal.filter(p => p.rol !== 'direccion' && p.rol !== 'soporte' && p.dni !== this.currentUser.dni);
        }
        if (rol === 'subdireccion') {
            // Subdirectora evalúa a coordinadores y docentes
            return this.personal.filter(p => this.esCoordinador(p.rol) || p.rol === 'docente');
        }
        if (this.esCoordinador(rol)) {
            // Coordinadores evalúan a docentes de su área (comparación exacta por código de área,
            // ya normalizado en personal.json como area_codigo, para evitar falsos positivos por
            // coincidencias parciales de texto — p.ej. "RELIGIOSA" no debe confundirse con "RELIGION").
            const codigos = (this.config.coordination_areas || {})[rol] || [];
            return this.personal.filter(p => p.rol === 'docente' && this.areaCoincide(p.area_codigo, codigos));
        }
        return [];
    },

    // Códigos legibles de área (deben coincidir con los area_codigo calculados en personal.json
    // y con los códigos usados en config.json > coordination_areas)
    AREA_LABELS: {
        CCSS: 'Ciencias Sociales', DPCC: 'DPCC', RELIGION: 'Religión',
        CYT: 'Ciencia y Tecnología', EPT: 'Educación para el Trabajo',
        MATEMATICA: 'Matemática', ED_FISICA: 'Educación Física',
        COMUNICACION: 'Comunicación', ARTE: 'Arte y Cultura', INGLES: 'Inglés',
        TUTORIA: 'Tutoría', CONVIVENCIA: 'Convivencia', PSICOLOGIA: 'Psicología'
    },

    areaCoincide(areaCodigo, codigos) {
        if (!areaCodigo || !codigos || !codigos.length) return false;
        return codigos.includes(areaCodigo);
    },

    // ------------------------------------------------------------------
    // FILTROS AGRUPADOS (Directora / Subdirectora)
    // ------------------------------------------------------------------
    filtros: {},

    gruposDisponibles(rol) {
        if (rol === 'direccion') return [
            { key: 'todos', label: 'Todos', icon: 'fa-users' },
            { key: 'subdireccion', label: 'Subdirección', icon: 'fa-user-shield' },
            { key: 'coordinadores', label: 'Coordinadores', icon: 'fa-user-tie' },
            { key: 'docentes', label: 'Docentes', icon: 'fa-chalkboard-user' },
            { key: 'administrativo', label: 'Administrativos', icon: 'fa-briefcase' },
        ];
        if (rol === 'subdireccion') return [
            { key: 'todos', label: 'Todos', icon: 'fa-users' },
            { key: 'coordinadores', label: 'Coordinadores', icon: 'fa-user-tie' },
            { key: 'docentes', label: 'Docentes', icon: 'fa-chalkboard-user' },
        ];
        return [];
    },

    cumpleGrupo(p, grupo) {
        switch (grupo) {
            case 'subdireccion': return p.rol === 'subdireccion';
            case 'coordinadores': return this.esCoordinador(p.rol);
            case 'docentes': return p.rol === 'docente';
            case 'administrativo': return p.rol === 'administrativo';
            default: return true;
        }
    },

    estadoFiltro(viewKey) {
        this.filtros[viewKey] = this.filtros[viewKey] || { grupo: 'todos', area: '' };
        return this.filtros[viewKey];
    },

    setFiltroGrupo(viewKey, grupo) {
        this.filtros[viewKey] = { grupo, area: '' };
        this.goTab(this.currentTab);
    },

    setFiltroArea(viewKey, area) {
        const estado = this.estadoFiltro(viewKey);
        estado.area = area;
        this.goTab(this.currentTab);
    },

    // Devuelve el HTML de la barra de filtros (chips de grupo + selector de área si aplica).
    // "listaBase" es el conjunto de personas sobre el que se calculan las áreas disponibles.
    renderFiltroBarra(viewKey, listaBase) {
        const grupos = this.gruposDisponibles(this.currentUser.rol);
        if (!grupos.length) return '';
        const estado = this.estadoFiltro(viewKey);
        const chips = grupos.map(g => `
            <button class="filtro-chip ${estado.grupo === g.key ? 'active' : ''}" onclick="App.setFiltroGrupo('${viewKey}','${g.key}')">
                <i class="fas ${g.icon}"></i> ${g.label}
            </button>`).join('');

        let areaSelect = '';
        if (estado.grupo === 'docentes') {
            const codigos = [...new Set(listaBase.filter(p => p.rol === 'docente' && p.area_codigo).map(p => p.area_codigo))]
                .sort((a, b) => (this.AREA_LABELS[a] || a).localeCompare(this.AREA_LABELS[b] || b));
            if (codigos.length > 1) {
                const opts = codigos.map(c => `<option value="${c}" ${estado.area === c ? 'selected' : ''}>${this.AREA_LABELS[c] || c}</option>`).join('');
                areaSelect = `<select class="form-control filtro-area-select" onchange="App.setFiltroArea('${viewKey}', this.value)">
                    <option value="">Todas las áreas</option>${opts}
                </select>`;
            }
        }
        return `<div class="filtro-bar">${chips}${areaSelect}</div>`;
    },

    aplicarFiltro(viewKey, lista) {
        const grupos = this.gruposDisponibles(this.currentUser.rol);
        if (!grupos.length) return lista;
        const estado = this.estadoFiltro(viewKey);
        let out = lista.filter(p => this.cumpleGrupo(p, estado.grupo));
        if (estado.grupo === 'docentes' && estado.area) out = out.filter(p => p.area_codigo === estado.area);
        return out;
    },

    // criterios de evaluación aplicables al rol evaluador (plantilla subida o default)
    criteriosPara(rolEvaluador) {
        const plantilla = this.plantillas[rolEvaluador];
        if (plantilla && plantilla.criterios && plantilla.criterios.length) {
            return this.normalizarCriterios(plantilla.criterios);
        }
        return this.normalizarCriterios(this.config.criterios_default || [
            { nombre: 'Desempeño General', max: 100 }
        ]);
    },

    normalizarCriterios(lista) {
        // Reescala para que la suma de "max" sea siempre 100
        const total = lista.reduce((s, c) => s + (Number(c.max) || 0), 0) || 1;
        return lista.map((c, i) => ({
            id: c.id || ('c' + i),
            nombre: c.nombre,
            max: Math.round((Number(c.max) || 0) / total * 100)
        }));
    },

    escalaPara(puntaje) {
        const escala = this.config.escala_calificacion || [];
        return escala.find(e => puntaje >= e.min && puntaje <= e.max) || { label: '—', color: '#999' };
    },

    yaEvaluado(evaluadorDni, evaluadoDni) {
        return this.evaluaciones.find(e => e.evaluadorDni === evaluadorDni && e.evaluadoDni === evaluadoDni);
    },
    
    yaEvaluadoFormulario1(evaluadorDni, evaluadoDni) {
        return this.evaluacionesFormulario1.find(e => e.evaluadorDni === evaluadorDni && e.evaluadoDni === evaluadoDni);
    },
    
    yaEvaluadoFormulario2(evaluadorDni, evaluadoDni) {
        return this.evaluacionesFormulario2.find(e => e.evaluadorDni === evaluadorDni && e.evaluadoDni === evaluadoDni);
    },

    // Un registro se considera "completado" cuando existe y fue guardado con
    // "Guardar y finalizar" (con todos los campos obligatorios llenos).
    // Los registros antiguos sin estadoRegistro se tratan como completados
    // por compatibilidad con evaluaciones guardadas antes de esta función.
    esRegistroCompletado(registro) {
        return !!registro && (registro.estadoRegistro === 'completado' || !registro.estadoRegistro);
    },

    estaCompletadoFormulario1(evaluadorDni, evaluadoDni) {
        return this.esRegistroCompletado(this.yaEvaluadoFormulario1(evaluadorDni, evaluadoDni));
    },

    estaCompletadoFormulario2(evaluadorDni, evaluadoDni) {
        return this.esRegistroCompletado(this.yaEvaluadoFormulario2(evaluadorDni, evaluadoDni));
    },

    // ------------------------------------------------------------------
    // AUTENTICACIÓN
    // ------------------------------------------------------------------
    restoreSession() {
        const dni = sessionStorage.getItem('sgi_session_dni');
        if (dni) {
            const user = this.personal.find(p => p.dni === dni);
            if (user) { this.currentUser = user; this.showApp(); return; }
        }
        this.showLogin();
    },

    normalizeText(s) {
        return (s || '').trim().toUpperCase().replace(/\s+/g, ' ');
    },

    login(usuario, contrasena) {
        const u = this.normalizeText(usuario);
        const p = (contrasena || '').trim();

        // Soporte técnico: credenciales fijas (no tiene DNI real de personal)
        const soporte = this.personal.find(x => x.rol === 'soporte');
        if (soporte && u === 'SOPORTE' && p === 'soporte123') {
            this.currentUser = soporte;
            this.registrarConexion(soporte.dni);
            this.showApp();
            return true;
        }
        return 'Usuario o contraseña incorrectos.';
    },

    // Acceso simplificado: solo el DNI. Como la contraseña de cada persona
    // siempre es su propio DNI (así se define en personal.json y así la
    // restablece Soporte Técnico), el DNI funciona como identificador y
    // contraseña a la vez, sin necesidad de escribir el nombre de usuario.
    loginPorDni(dni) {
        const d = (dni || '').trim();
        if (!d) return 'Ingresa tu número de DNI.';

        const candidato = this.personal.find(x =>
            this.puedeIniciarSesion(x.rol) &&
            x.rol !== 'soporte' &&
            x.dni === d
        );

        if (!candidato) return 'No encontramos una cuenta con ese DNI.';
        if (!this.estaActivo(candidato)) return 'Esta cuenta está desactivada. Contacta a Soporte Técnico.';
        if (this.contrasenaDe(candidato) !== d) return 'DNI incorrecto.';

        this.currentUser = candidato;
        this.registrarConexion(candidato.dni);
        this.showApp();
        return true;
    },

    showLogin() {
        document.getElementById('main-header').style.display = 'none';
        document.getElementById('main-content').style.display = 'none';
        document.getElementById('login-screen').style.display = 'flex';
    },

    showApp() {
        sessionStorage.setItem('sgi_session_dni', this.currentUser.dni);
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-header').style.display = 'block';
        document.getElementById('main-content').style.display = 'block';
        document.getElementById('current-user-name').textContent = this.primerNombreApellido(this.currentUser);
        document.getElementById('user-name-display').textContent = this.currentUser.nombre_completo;
        document.getElementById('user-role-display').textContent = this.labelRol(this.currentUser.rol);
        document.getElementById('user-avatar').src = this.fotoDe(this.currentUser);
        this.renderSidebar();
        this.goTab(this.defaultTab());
    },

    primerNombreApellido(p) {
        if (p.usuario) return p.usuario;
        return p.nombre_completo;
    },

    logout() {
        sessionStorage.removeItem('sgi_session_dni');
        this.currentUser = null;
        this.showLogin();
        document.getElementById('login-form').reset();
    },

    // ------------------------------------------------------------------
    // NAVEGACIÓN
    // ------------------------------------------------------------------
    tabsPara(rol) {
        const tabs = [{ id: 'dashboard', label: 'Panel', icon: 'fa-gauge-high' }];
        if (rol === 'direccion' || rol === 'subdireccion' || this.esCoordinador(rol)) {
            tabs.push({ id: 'evaluar-form1', label: 'Formulario 1', icon: 'fa-pen-to-square' });
            tabs.push({ id: 'evaluar-form2', label: 'Formulario 2', icon: 'fa-clipboard-list' });
            tabs.push({ id: 'reportes', label: 'Reportes', icon: 'fa-chart-column' });
        }
        if (rol === 'direccion') {
            tabs.push({ id: 'supervision', label: 'Supervisión', icon: 'fa-magnifying-glass-chart' });
        }
        if (rol === 'direccion' || rol === 'subdireccion') {
            tabs.push({ id: 'personal', label: 'Directorio', icon: 'fa-address-book' });
        }
        if (rol === 'soporte') {
            tabs.push({ id: 'soporte-cuentas', label: 'Cuentas', icon: 'fa-users-gear' });
            tabs.push({ id: 'soporte-formularios', label: 'Formularios', icon: 'fa-file-arrow-up' });
            tabs.push({ id: 'soporte-config', label: 'Institución', icon: 'fa-building' });
            tabs.push({ id: 'soporte-sistema', label: 'Sistema', icon: 'fa-gears' });
        }
        return tabs;
    },

    defaultTab() { return 'dashboard'; },

    renderSidebar() {
        const tabs = this.tabsPara(this.currentUser.rol);
        const html = tabs.map(t => `
            <button class="nav-tab" data-tab="${t.id}"><i class="fas ${t.icon}"></i> ${t.label}</button>
        `).join('');
        document.getElementById('sidebar').innerHTML = html;
        document.getElementById('nav-tabs-mobile').innerHTML = html;
        this.bindTabClicks();
    },

    bindTabClicks() {
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => this.goTab(btn.dataset.tab));
        });
    },

    goTab(tabId) {
        this.currentTab = tabId;
        document.querySelectorAll('[data-tab]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        const map = {
            dashboard: () => this.renderDashboard(),
            'evaluar-form1': () => this.renderEvaluarFormulario1(),
            'evaluar-form2': () => this.renderEvaluarFormulario2(),
            reportes: () => this.renderReportes(),
            supervision: () => this.renderSupervision(),
            personal: () => this.renderDirectorio(),
            'soporte-cuentas': () => this.renderSoporteCuentas(),
            'soporte-formularios': () => this.renderSoporteFormularios(),
            'soporte-config': () => this.renderSoporteConfig(),
            'soporte-sistema': () => this.renderSoporteSistema(),
        };
        (map[tabId] || map.dashboard)();
    },

    // ------------------------------------------------------------------
    // DASHBOARD
    // ------------------------------------------------------------------
    renderDashboard() {
        const rol = this.currentUser.rol;
        let evaluables = [];
        let statsHtml = '';
        let bodyHtml = '';

        if (rol === 'soporte') {
            const total = this.personal.length;
            const activos = this.personal.filter(p => this.estaActivo(p)).length;
            const conLogin = this.personal.filter(p => this.puedeIniciarSesion(p.rol)).length;
            statsHtml = this.statCards([
                ['fa-users', total, 'Registros en el sistema'],
                ['fa-user-check', activos, 'Cuentas activas'],
                ['fa-right-to-bracket', conLogin, 'Con acceso al sistema'],
                ['fa-file-arrow-up', Object.keys(this.plantillas).length, 'Formularios cargados'],
            ]);
            bodyHtml = `<div class="card"><div class="card-header"><span class="card-title"><i class="fas fa-circle-info"></i> Bienvenido, Soporte Técnico</span></div>
                <p class="text-muted">Desde aquí puedes gestionar cuentas de usuario, restablecer contraseñas, subir los formularios de evaluación y realizar mantenimiento del sistema. Usa el menú lateral para comenzar.</p></div>`;
            document.getElementById('tab-content').innerHTML = this.dashboardSaludo() + statsHtml + bodyHtml;
            return;
        }

        evaluables = this.personalEvaluable(rol);
        const completadosForm1 = evaluables.filter(p => this.estaCompletadoFormulario1(this.currentUser.dni, p.dni));
        const completadosForm2 = evaluables.filter(p => this.estaCompletadoFormulario2(this.currentUser.dni, p.dni));
        const borradorForm1 = evaluables.filter(p => this.yaEvaluadoFormulario1(this.currentUser.dni, p.dni) && !this.estaCompletadoFormulario1(this.currentUser.dni, p.dni));
        const borradorForm2 = evaluables.filter(p => this.yaEvaluadoFormulario2(this.currentUser.dni, p.dni) && !this.estaCompletadoFormulario2(this.currentUser.dni, p.dni));
        const pendientesForm1 = evaluables.length - completadosForm1.length;
        const pendientesForm2 = evaluables.length - completadosForm2.length;
        const pctForm1 = evaluables.length ? Math.round((completadosForm1.length / evaluables.length) * 100) : 0;
        const pctForm2 = evaluables.length ? Math.round((completadosForm2.length / evaluables.length) * 100) : 0;

        statsHtml = this.statCards([
            ['fa-users', evaluables.length, 'Personal a tu cargo'],
            ['fa-pen-to-square', completadosForm1.length, 'Formulario 1 finalizados'],
            ['fa-clipboard-list', completadosForm2.length, 'Formulario 2 finalizados'],
            ['fa-hourglass-half', pendientesForm1 + pendientesForm2, 'Total pendientes'],
        ]);

        const progresoHtml = evaluables.length ? `
            <div class="card">
                <div class="card-header"><span class="card-title"><i class="fas fa-chart-simple"></i> Progreso de evaluación</span></div>
                ${this.progressRow('Formulario 1', pctForm1, completadosForm1.length, evaluables.length, borradorForm1.length)}
                ${this.progressRow('Formulario 2', pctForm2, completadosForm2.length, evaluables.length, borradorForm2.length)}
            </div>` : '';

        let alertHtml = '';
        if (pendientesForm1 > 0 || pendientesForm2 > 0) {
            const faltanForm1 = evaluables.filter(p => !this.estaCompletadoFormulario1(this.currentUser.dni, p.dni));
            const faltanForm2 = evaluables.filter(p => !this.estaCompletadoFormulario2(this.currentUser.dni, p.dni));
            const chip = (p, formularioAbierto) => `<span class="pendiente-chip">${p.nombre_completo}${formularioAbierto ? ' <em>(borrador)</em>' : ''}</span>`;
            const listaChips = (lista, borradorLista) => {
                const borradorDnis = new Set(borradorLista.map(p => p.dni));
                const visibles = lista.slice(0, 8);
                const resto = lista.length - visibles.length;
                return visibles.map(p => chip(p, borradorDnis.has(p.dni))).join('') + (resto > 0 ? `<span class="pendiente-chip pendiente-chip-mas">+${resto} más</span>` : '');
            };
            alertHtml = `<div class="card">
                <div class="card-header"><span class="card-title"><i class="fas fa-triangle-exclamation" style="color:#E0A82E;"></i> Quién falta por evaluar</span></div>
                ${faltanForm1.length ? `<div style="margin-bottom:14px;"><strong>Formulario 1</strong> (${faltanForm1.length})<div class="pendiente-chips">${listaChips(faltanForm1, borradorForm1)}</div></div>` : ''}
                ${faltanForm2.length ? `<div><strong>Formulario 2</strong> (${faltanForm2.length})<div class="pendiente-chips">${listaChips(faltanForm2, borradorForm2)}</div></div>` : ''}
            </div>`;
        } else if (evaluables.length > 0) {
            alertHtml = `<div class="alert alert-success"><i class="fas fa-circle-check"></i> ¡Has completado todas las evaluaciones!</div>`;
        }

        let chartsHtml = '';
        if (rol === 'direccion') {
            chartsHtml = `<div class="grid-2">
                <div class="chart-container"><h4 style="margin-bottom:14px;">Evaluación por área</h4><canvas id="chart-areas"></canvas></div>
                <div class="chart-container"><h4 style="margin-bottom:14px;">Distribución del personal</h4><canvas id="chart-roles"></canvas></div>
            </div>`;
        } else if (completadosForm1.length > 0 || completadosForm2.length > 0) {
            chartsHtml = `<div class="grid-2">
                <div class="chart-container"><h4 style="margin-bottom:14px;">Formulario 1</h4><canvas id="chart-form1"></canvas></div>
                <div class="chart-container"><h4 style="margin-bottom:14px;">Formulario 2</h4><canvas id="chart-form2"></canvas></div>
            </div>`;
        }

        document.getElementById('tab-content').innerHTML = this.dashboardSaludo() + statsHtml + progresoHtml + alertHtml + chartsHtml;

        if (rol === 'direccion') {
            this.pintarChartAreas();
            this.pintarChartRoles();
        } else if (completadosForm1.length > 0 || completadosForm2.length > 0) {
            this.pintarChartFormularios(completadosForm1.length, pendientesForm1, completadosForm2.length, pendientesForm2);
        }
    },

    dashboardSaludo() {
        const hora = new Date().getHours();
        const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches';
        const nombre = (this.currentUser.nombre_completo || '').split(' ').slice(0, 2).join(' ');
        const fecha = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
        return `<div class="dashboard-saludo">
            <div>
                <h2>${saludo}, ${nombre}</h2>
                <p style="text-transform:capitalize;">${fecha} · ${this.labelRol(this.currentUser.rol)}</p>
            </div>
        </div>`;
    },

    progressRow(label, pct, completados, total, borradores) {
        const color = pct >= 80 ? '#2FA84F' : pct >= 40 ? 'var(--guinda)' : '#E0A82E';
        return `<div class="progreso-row">
            <div class="progreso-row-top">
                <span>${label}</span>
                <span>${completados}/${total} · ${pct}%${borradores ? ` · <span class="text-muted">${borradores} en borrador</span>` : ''}</span>
            </div>
            <div class="progreso-bar-track"><div class="progreso-bar-fill" style="width:${pct}%;background:${color};"></div></div>
        </div>`;
    },

    pintarChartFormularios(ev1, pen1, ev2, pen2) {
        const canvas1 = document.getElementById('chart-form1');
        const canvas2 = document.getElementById('chart-form2');
        if (!canvas1 || !canvas2) return;
        const c = this.brandColors();
        
        this.destroyChart('form1');
        this.charts.form1 = new Chart(canvas1, {
            type: 'doughnut',
            data: { labels: ['Completadas', 'Pendientes'], datasets: [{ data: [ev1, pen1], backgroundColor: ['#800020', '#E0A82E'] }] },
            options: { responsive: true, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { color: c.text } } } }
        });
        
        this.destroyChart('form2');
        this.charts.form2 = new Chart(canvas2, {
            type: 'doughnut',
            data: { labels: ['Completadas', 'Pendientes'], datasets: [{ data: [ev2, pen2], backgroundColor: ['#3E8ED0', '#E0A82E'] }] },
            options: { responsive: true, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { color: c.text } } } }
        });
    },

    statCards(items) {
        return `<div class="dashboard-stats fade-in">` + items.map(([icon, num, label], i) => `
            <div class="stat-card ${i === 0 ? '' : 'alt'}">
                <div class="stat-icon"><i class="fas ${icon}"></i></div>
                <div class="stat-number">${num}</div>
                <div class="stat-label">${label}</div>
            </div>`).join('') + `</div>`;
    },

    destroyChart(id) { if (this.charts[id]) { this.charts[id].destroy(); delete this.charts[id]; } },

    brandColors() {
        const dark = document.body.classList.contains('dark-mode');
        return { text: dark ? '#A6A6AC' : '#6E6E73', grid: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' };
    },

    pintarChartAreas() {
        const canvas = document.getElementById('chart-areas');
        if (!canvas) return;
        const areas = Object.keys(this.config.coordination_areas || {});
        const labels = areas.map(a => (this.config.area_labels || {})[a] || a);
        const evaluados = [], pendientes = [];
        areas.forEach(rolCoord => {
            const coordinador = this.personal.find(p => p.rol === rolCoord);
            const docentes = this.personal.filter(p => p.rol === 'docente' &&
                this.areaCoincide(p.area_codigo, (this.config.coordination_areas[rolCoord] || [])));
            const ev = coordinador ? docentes.filter(d => this.yaEvaluado(coordinador.dni, d.dni)).length : 0;
            evaluados.push(ev);
            pendientes.push(docentes.length - ev);
        });
        const c = this.brandColors();
        this.destroyChart('areas');
        this.charts.areas = new Chart(canvas, {
            type: 'bar',
            data: { labels, datasets: [
                { label: 'Evaluados', data: evaluados, backgroundColor: '#800020', borderRadius: 8 },
                { label: 'Pendientes', data: pendientes, backgroundColor: '#E0A82E', borderRadius: 8 },
            ]},
            options: { responsive: true, plugins: { legend: { labels: { color: c.text } } },
                scales: { x: { stacked: true, ticks: { color: c.text }, grid: { display: false } },
                          y: { stacked: true, ticks: { color: c.text }, grid: { color: c.grid } } } }
        });
    },

    pintarChartRoles() {
        const canvas = document.getElementById('chart-roles');
        if (!canvas) return;
        const grupos = { Docentes: 0, Administrativos: 0, Coordinadores: 0, Dirección: 0 };
        this.personal.forEach(p => {
            if (p.rol === 'docente') grupos.Docentes++;
            else if (p.rol === 'administrativo') grupos.Administrativos++;
            else if (this.esCoordinador(p.rol)) grupos.Coordinadores++;
            else if (p.rol === 'direccion' || p.rol === 'subdireccion') grupos['Dirección']++;
        });
        const c = this.brandColors();
        this.destroyChart('roles');
        this.charts.roles = new Chart(canvas, {
            type: 'doughnut',
            data: { labels: Object.keys(grupos), datasets: [{ data: Object.values(grupos),
                backgroundColor: ['#800020', '#A0293D', '#C9808F', '#3E8ED0'] }] },
            options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: c.text } } } }
        });
    },

    pintarChartProgreso(evaluados, pendientes) {
        const canvas = document.getElementById('chart-progreso');
        if (!canvas) return;
        const c = this.brandColors();
        this.destroyChart('progreso');
        this.charts.progreso = new Chart(canvas, {
            type: 'doughnut',
            data: { labels: ['Evaluados', 'Pendientes'], datasets: [{ data: [evaluados, pendientes], backgroundColor: ['#800020', '#E0A82E'] }] },
            options: { responsive: true, cutout: '68%', plugins: { legend: { position: 'bottom', labels: { color: c.text } } } }
        });
    },

    // ------------------------------------------------------------------
    // EVALUAR FORMULARIO 1 (Autoevaluación - 12 preguntas abiertas)
    // ------------------------------------------------------------------
    renderEvaluarFormulario1() {
        const base = this.personalEvaluable();
        const evaluables = this.aplicarFiltro('evalForm1', base);
        const container = document.getElementById('tab-content');
        const filtroHtml = this.renderFiltroBarra('evalForm1', base);
        if (!base.length) {
            container.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>No tienes personal asignado para evaluar.</p></div>`;
            return;
        }
        if (!evaluables.length) {
            container.innerHTML = `<div class="card"><div class="card-header"><span class="card-title"><i class="fas fa-pen-to-square"></i> Formulario 1</span></div>${filtroHtml}
                <div class="empty-state"><i class="fas fa-filter-circle-xmark"></i><p>No hay personas que coincidan con este filtro.</p></div></div>`;
            return;
        }
        const rows = evaluables.map(p => {
            const ev = this.yaEvaluadoFormulario1(this.currentUser.dni, p.dni);
            const completado = this.esRegistroCompletado(ev);
            const badge = completado
                ? `<span class="badge badge-success"><i class="fas fa-check"></i> Completado</span>`
                : ev
                    ? `<span class="badge badge-info"><i class="fas fa-pen"></i> Borrador</span>`
                    : `<span class="badge badge-warning"><i class="fas fa-clock"></i> Pendiente</span>`;
            return `<div class="persona-card">
                <img class="persona-avatar-sm" src="${this.fotoDe(p)}" alt="">
                <div class="persona-info">
                    <h4>${p.nombre_completo}</h4>
                    <p>${p.cargo || ''}${p.area ? ' · ' + p.area : ''}</p>
                </div>
                ${badge}
                <div class="persona-actions">
                    <button class="btn btn-secondary btn-sm" onclick="App.abrirFormulario1('${p.dni}')"><i class="fas fa-${ev ? 'pen' : 'pen-to-square'}"></i> ${ev ? 'Editar' : 'Evaluar'}</button>
                </div>
            </div>`;
        }).join('');
        container.innerHTML = `<div class="card"><div class="card-header">
            <span class="card-title"><i class="fas fa-pen-to-square"></i> Formulario 1</span>
            <span class="card-subtitle">${evaluables.length} persona(s) · 12 preguntas abiertas</span>
            </div>${filtroHtml}<p class="text-muted" style="margin-bottom:16px;">Este formulario permite al docente reflexionar sobre su práctica pedagógica mediante preguntas abiertas.</p>${rows}</div>`;
    },

    abrirFormulario1(dni) {
        const persona = this.personal.find(p => p.dni === dni);
        if (!persona) return;
        const existente = this.yaEvaluadoFormulario1(this.currentUser.dni, dni);

        document.getElementById('form1-title').textContent = 'Formulario 1 · ' + persona.nombre_completo;
        const cont = document.getElementById('form1-preguntas');
        cont.innerHTML = this.preguntasFormulario1.map((pregunta, idx) => {
            const valorPrevio = existente ? (existente.respuestas[idx]?.respuesta || '') : '';
            return `<div class="form-group">
                <label>${idx + 1}. ${pregunta}</label>
                <textarea class="form-control" id="f1-pregunta-${idx}" rows="3" placeholder="Escribe tu respuesta...">${valorPrevio}</textarea>
            </div>`;
        }).join('');

        document.getElementById('form1-form').dataset.dni = dni;
        document.getElementById('form1-error').style.display = 'none';
        this.openModal('form1-modal');
    },

    guardarFormulario1(dni, finalizar) {
        const persona = this.personal.find(p => p.dni === dni);
        const respuestas = this.preguntasFormulario1.map((pregunta, idx) => ({
            pregunta,
            respuesta: document.getElementById('f1-pregunta-' + idx).value.trim()
        }));

        const errBox = document.getElementById('form1-error');
        if (finalizar) {
            const faltantes = respuestas.filter(r => !r.respuesta).length;
            if (faltantes > 0) {
                errBox.textContent = `Faltan ${faltantes} pregunta(s) por responder. No se puede finalizar con campos en blanco — puedes usar "Guardar borrador" para continuar después.`;
                errBox.style.display = 'flex';
                return;
            }
        }
        errBox.style.display = 'none';

        const existenteIdx = this.evaluacionesFormulario1.findIndex(e => e.evaluadorDni === this.currentUser.dni && e.evaluadoDni === dni);
        const registro = {
            id: existenteIdx >= 0 ? this.evaluacionesFormulario1[existenteIdx].id : 'f1_' + Date.now(),
            evaluadorDni: this.currentUser.dni,
            evaluadorNombre: this.currentUser.nombre_completo,
            evaluadorRol: this.currentUser.rol,
            evaluadoDni: dni,
            evaluadoNombre: persona.nombre_completo,
            evaluadoCargo: persona.cargo,
            evaluadoArea: persona.area,
            respuestas,
            estadoRegistro: finalizar ? 'completado' : 'borrador',
            fecha: new Date().toISOString(),
        };
        if (existenteIdx >= 0) this.evaluacionesFormulario1[existenteIdx] = registro;
        else this.evaluacionesFormulario1.push(registro);

        this.storageSet('sgi_evaluaciones_formulario1', this.evaluacionesFormulario1);
        this.closeModal('form1-modal');
        this.showToast(finalizar ? 'Formulario 1 finalizado y guardado' : 'Borrador guardado, puedes continuar después', 'success');
        this.goTab(this.currentTab);
    },

    // ------------------------------------------------------------------
    // EVALUAR FORMULARIO 2 (Rúbrica con grupos y estados)
    // ------------------------------------------------------------------
    renderEvaluarFormulario2() {
        const base = this.personalEvaluable();
        const evaluables = this.aplicarFiltro('evalForm2', base);
        const container = document.getElementById('tab-content');
        const filtroHtml = this.renderFiltroBarra('evalForm2', base);
        if (!base.length) {
            container.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>No tienes personal asignado para evaluar.</p></div>`;
            return;
        }
        if (!evaluables.length) {
            container.innerHTML = `<div class="card"><div class="card-header"><span class="card-title"><i class="fas fa-clipboard-list"></i> Formulario 2</span></div>${filtroHtml}
                <div class="empty-state"><i class="fas fa-filter-circle-xmark"></i><p>No hay personas que coincidan con este filtro.</p></div></div>`;
            return;
        }
        const rows = evaluables.map(p => {
            const ev = this.yaEvaluadoFormulario2(this.currentUser.dni, p.dni);
            const completado = this.esRegistroCompletado(ev);
            const badge = completado
                ? `<span class="badge badge-success"><i class="fas fa-check"></i> Completado</span>`
                : ev
                    ? `<span class="badge badge-info"><i class="fas fa-pen"></i> Borrador</span>`
                    : `<span class="badge badge-warning"><i class="fas fa-clock"></i> Pendiente</span>`;
            return `<div class="persona-card">
                <img class="persona-avatar-sm" src="${this.fotoDe(p)}" alt="">
                <div class="persona-info">
                    <h4>${p.nombre_completo}</h4>
                    <p>${p.cargo || ''}${p.area ? ' · ' + p.area : ''}</p>
                </div>
                ${badge}
                <div class="persona-actions">
                    <button class="btn btn-secondary btn-sm" onclick="App.abrirFormulario2('${p.dni}')"><i class="fas fa-${ev ? 'pen' : 'clipboard-list'}"></i> ${ev ? 'Editar' : 'Evaluar'}</button>
                </div>
            </div>`;
        }).join('');
        container.innerHTML = `<div class="card"><div class="card-header">
            <span class="card-title"><i class="fas fa-clipboard-list"></i> Formulario 2</span>
            <span class="card-subtitle">${evaluables.length} persona(s) · ${this.gruposFormulario2.length} grupos</span>
            </div>${filtroHtml}<p class="text-muted" style="margin-bottom:16px;">Evaluación mediante rúbrica organizada por dimensiones: Inicio, Proceso, Logrado.</p>${rows}</div>`;
    },

    abrirFormulario2(dni) {
        const persona = this.personal.find(p => p.dni === dni);
        if (!persona) return;
        const existente = this.yaEvaluadoFormulario2(this.currentUser.dni, dni);

        document.getElementById('form2-title').textContent = 'Formulario 2 · ' + persona.nombre_completo;
        const cont = document.getElementById('form2-grupos');
        cont.innerHTML = this.gruposFormulario2.map((grupo, gIdx) => {
            const itemsHtml = grupo.items.map((item, iIdx) => {
                const valorPrevio = existente ? (existente.grupos[gIdx]?.items[iIdx] || {}) : {};
                return `<div class="rubric-item">
                    <div class="rubric-question">${iIdx + 1}. ${item}</div>
                    <div class="rubric-states">
                        <label class="state-option"><input type="radio" name="f2-g${gIdx}-i${iIdx}" value="inicio" ${valorPrevio.estado === 'inicio' ? 'checked' : ''}> <span class="state-badge state-inicio">Inicio</span></label>
                        <label class="state-option"><input type="radio" name="f2-g${gIdx}-i${iIdx}" value="proceso" ${valorPrevio.estado === 'proceso' ? 'checked' : ''}> <span class="state-badge state-proceso">Proceso</span></label>
                        <label class="state-option"><input type="radio" name="f2-g${gIdx}-i${iIdx}" value="logrado" ${valorPrevio.estado === 'logrado' ? 'checked' : ''}> <span class="state-badge state-logrado">Logrado</span></label>
                    </div>
                    <input type="text" class="form-control" id="f2-g${gIdx}-i${iIdx}-obs" placeholder="Observación (obligatoria para finalizar)" value="${valorPrevio.observacion || ''}">
                </div>`;
            }).join('');
            return `<div class="rubric-group">
                <h4 class="rubric-group-title">${grupo.nombre}</h4>
                ${itemsHtml}
            </div>`;
        }).join('');

        // Conclusiones de manera abierta (no son parte de la rúbrica de estados)
        const conclusionesPrevias = existente?.conclusiones || {};
        const conclusionesHtml = `
            <div class="rubric-group" style="margin-top:24px;">
                <h4 class="rubric-group-title"><i class="fas fa-comment-dots"></i> Conclusiones</h4>
                ${this.camposConclusionFormulario2.map(campo => `
                    <div class="form-group">
                        <label>${campo.label}</label>
                        <textarea class="form-control" id="f2-conclusion-${campo.id}" rows="3" placeholder="${campo.placeholder}">${conclusionesPrevias[campo.id] || ''}</textarea>
                    </div>
                `).join('')}
            </div>
        `;
        cont.innerHTML += conclusionesHtml;

        // Agregar campos de observación para docentes
        let observacionesHtml = '';
        if (persona.rol === 'docente') {
            const obsPrevias = existente?.observacionesJerarquicas || {};
            observacionesHtml = `
                <div class="rubric-group" style="margin-top:32px;padding:20px;background:var(--bg-secondary);border-radius:12px;">
                    <h4 class="rubric-group-title" style="color:var(--guinda);"><i class="fas fa-clipboard-user"></i> Observaciones Jerárquicas</h4>
                    <div class="form-group">
                        <label><i class="fas fa-user-tie"></i> Observación del Coordinador</label>
                        <textarea class="form-control" id="f2-obs-coordinador" rows="3" placeholder="Observaciones del coordinador de área...">${obsPrevias.coordinador || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-user-shield"></i> Observación de la Subdirectora</label>
                        <select class="form-control" id="f2-obs-subdirectora-filtro" style="margin-bottom:8px;">
                            <option value="">Todas las áreas</option>
                            <option value="CCSS" ${obsPrevias.subdirectoraFiltro === 'CCSS' ? 'selected' : ''}>Ciencias Sociales</option>
                            <option value="CYT" ${obsPrevias.subdirectoraFiltro === 'CYT' ? 'selected' : ''}>Ciencia y Tecnología</option>
                            <option value="MATEMATICA" ${obsPrevias.subdirectoraFiltro === 'MATEMATICA' ? 'selected' : ''}>Matemática</option>
                            <option value="COMUNICACION" ${obsPrevias.subdirectoraFiltro === 'COMUNICACION' ? 'selected' : ''}>Comunicación</option>
                            <option value="INGLES" ${obsPrevias.subdirectoraFiltro === 'INGLES' ? 'selected' : ''}>Inglés</option>
                            <option value="EPT" ${obsPrevias.subdirectoraFiltro === 'EPT' ? 'selected' : ''}>Educación para el Trabajo</option>
                            <option value="ARTE" ${obsPrevias.subdirectoraFiltro === 'ARTE' ? 'selected' : ''}>Arte y Cultura</option>
                            <option value="EDUCACION_FISICA" ${obsPrevias.subdirectoraFiltro === 'EDUCACION_FISICA' ? 'selected' : ''}>Educación Física</option>
                            <option value="DPCC" ${obsPrevias.subdirectoraFiltro === 'DPCC' ? 'selected' : ''}>DPCC</option>
                            <option value="EDUCACION_RELIGIOSA" ${obsPrevias.subdirectoraFiltro === 'EDUCACION_RELIGIOSA' ? 'selected' : ''}>Educación Religiosa</option>
                        </select>
                        <textarea class="form-control" id="f2-obs-subdirectora" rows="3" placeholder="Observaciones de la subdirectora...">${obsPrevias.subdirectora || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label><i class="fas fa-user-crown"></i> Observación de la Directora</label>
                        <select class="form-control" id="f2-obs-directora-filtro" style="margin-bottom:8px;">
                            <option value="">Todas las áreas</option>
                            <option value="CCSS" ${obsPrevias.directoraFiltro === 'CCSS' ? 'selected' : ''}>Ciencias Sociales</option>
                            <option value="CYT" ${obsPrevias.directoraFiltro === 'CYT' ? 'selected' : ''}>Ciencia y Tecnología</option>
                            <option value="MATEMATICA" ${obsPrevias.directoraFiltro === 'MATEMATICA' ? 'selected' : ''}>Matemática</option>
                            <option value="COMUNICACION" ${obsPrevias.directoraFiltro === 'COMUNICACION' ? 'selected' : ''}>Comunicación</option>
                            <option value="INGLES" ${obsPrevias.directoraFiltro === 'INGLES' ? 'selected' : ''}>Inglés</option>
                            <option value="EPT" ${obsPrevias.directoraFiltro === 'EPT' ? 'selected' : ''}>Educación para el Trabajo</option>
                            <option value="ARTE" ${obsPrevias.directoraFiltro === 'ARTE' ? 'selected' : ''}>Arte y Cultura</option>
                            <option value="EDUCACION_FISICA" ${obsPrevias.directoraFiltro === 'EDUCACION_FISICA' ? 'selected' : ''}>Educación Física</option>
                            <option value="DPCC" ${obsPrevias.directoraFiltro === 'DPCC' ? 'selected' : ''}>DPCC</option>
                            <option value="EDUCACION_RELIGIOSA" ${obsPrevias.directoraFiltro === 'EDUCACION_RELIGIOSA' ? 'selected' : ''}>Educación Religiosa</option>
                        </select>
                        <textarea class="form-control" id="f2-obs-directora" rows="3" placeholder="Observaciones de la directora...">${obsPrevias.directora || ''}</textarea>
                    </div>
                </div>
            `;
        }
        cont.innerHTML += observacionesHtml;

        document.getElementById('form2-form').dataset.dni = dni;
        document.getElementById('form2-error').style.display = 'none';
        this.openModal('form2-modal');
    },

    guardarFormulario2(dni, finalizar) {
        const persona = this.personal.find(p => p.dni === dni);
        const grupos = this.gruposFormulario2.map((grupo, gIdx) => ({
            nombre: grupo.nombre,
            items: grupo.items.map((item, iIdx) => {
                const selected = document.querySelector(`input[name="f2-g${gIdx}-i${iIdx}"]:checked`);
                return {
                    pregunta: item,
                    estado: selected ? selected.value : '',
                    observacion: document.getElementById(`f2-g${gIdx}-i${iIdx}-obs`).value.trim()
                };
            })
        }));
        const conclusiones = this.camposConclusionFormulario2.reduce((acc, campo) => {
            const el = document.getElementById(`f2-conclusion-${campo.id}`);
            acc[campo.id] = el ? el.value.trim() : '';
            return acc;
        }, {});

        const errBox = document.getElementById('form2-error');
        if (finalizar) {
            const itemsSinEstado = grupos.reduce((s, g) => s + g.items.filter(i => !i.estado).length, 0);
            const itemsSinObservacion = grupos.reduce((s, g) => s + g.items.filter(i => !i.observacion).length, 0);
            const conclusionesVacias = this.camposConclusionFormulario2.filter(c => !conclusiones[c.id]);
            if (itemsSinEstado > 0 || itemsSinObservacion > 0 || conclusionesVacias.length > 0) {
                const partes = [];
                if (itemsSinEstado > 0) partes.push(`${itemsSinEstado} criterio(s) sin marcar Inicio/Proceso/Logrado`);
                if (itemsSinObservacion > 0) partes.push(`${itemsSinObservacion} observación(es) en blanco`);
                if (conclusionesVacias.length > 0) partes.push(`${conclusionesVacias.map(c => c.label).join(' y ')} sin completar`);
                errBox.textContent = `No se puede finalizar: ${partes.join('; ')}. Usa "Guardar borrador" si necesitas continuar después.`;
                errBox.style.display = 'flex';
                return;
            }
        }
        errBox.style.display = 'none';

        const registro = {
            id: 'f2_' + Date.now(),
            evaluadorDni: this.currentUser.dni,
            evaluadorNombre: this.currentUser.nombre_completo,
            evaluadorRol: this.currentUser.rol,
            evaluadoDni: dni,
            evaluadoNombre: persona.nombre_completo,
            evaluadoCargo: persona.cargo,
            evaluadoArea: persona.area,
            grupos,
            conclusiones,
            estadoRegistro: finalizar ? 'completado' : 'borrador',
            fecha: new Date().toISOString(),
        };

        // Agregar observaciones jerárquicas si es docente
        if (persona.rol === 'docente') {
            registro.observacionesJerarquicas = {
                coordinador: document.getElementById('f2-obs-coordinador')?.value.trim() || '',
                coordinadorFiltro: persona.area || '',
                subdirectora: document.getElementById('f2-obs-subdirectora')?.value.trim() || '',
                subdirectoraFiltro: document.getElementById('f2-obs-subdirectora-filtro')?.value || '',
                directora: document.getElementById('f2-obs-directora')?.value.trim() || '',
                directoraFiltro: document.getElementById('f2-obs-directora-filtro')?.value || ''
            };
        }

        const existenteIdx = this.evaluacionesFormulario2.findIndex(e => e.evaluadorDni === this.currentUser.dni && e.evaluadoDni === dni);
        if (existenteIdx >= 0) {
            registro.id = this.evaluacionesFormulario2[existenteIdx].id;
            this.evaluacionesFormulario2[existenteIdx] = registro;
        } else {
            this.evaluacionesFormulario2.push(registro);
        }

        this.storageSet('sgi_evaluaciones_formulario2', this.evaluacionesFormulario2);
        this.closeModal('form2-modal');
        this.showToast(finalizar ? 'Formulario 2 finalizado y guardado' : 'Borrador guardado, puedes continuar después', 'success');
        this.goTab(this.currentTab);
    },

    abrirEvaluacion(dni) {
        const persona = this.personal.find(p => p.dni === dni);
        if (!persona) return;
        const criterios = this.criteriosPara(this.currentUser.rol);
        const existente = this.yaEvaluado(this.currentUser.dni, dni);

        document.getElementById('evaluation-title').textContent = 'Evaluación · ' + persona.nombre_completo;
        const cont = document.getElementById('evaluation-criterios');
        cont.innerHTML = criterios.map(c => {
            const valorPrevio = existente ? (existente.criterios.find(x => x.id === c.id)?.puntaje ?? Math.round(c.max * 0.7)) : Math.round(c.max * 0.7);
            return `<div class="criterio-row">
                <div class="criterio-head">
                    <span class="criterio-nombre">${c.nombre}</span>
                    <span class="criterio-valor" id="val-${c.id}">${valorPrevio}/${c.max}</span>
                </div>
                <input type="range" class="eval-criterio" id="input-${c.id}" data-id="${c.id}" data-nombre="${c.nombre.replace(/"/g,'&quot;')}" data-max="${c.max}" min="0" max="${c.max}" value="${valorPrevio}">
            </div>`;
        }).join('');

        cont.querySelectorAll('.eval-criterio').forEach(input => {
            input.addEventListener('input', () => {
                document.getElementById('val-' + input.dataset.id).textContent = `${input.value}/${input.dataset.max}`;
                this.actualizarTotalEvaluacion();
            });
        });

        document.getElementById('evaluation-comentario').value = existente ? (existente.comentario || '') : '';
        document.getElementById('evaluation-form').dataset.dni = dni;
        this.actualizarTotalEvaluacion();
        this.openModal('evaluation-modal');
    },

    actualizarTotalEvaluacion() {
        const inputs = document.querySelectorAll('#evaluation-criterios .eval-criterio');
        let total = 0;
        inputs.forEach(i => total += Number(i.value));
        document.getElementById('evaluation-total').textContent = `${total} / 100`;
    },

    guardarEvaluacion(dni) {
        const persona = this.personal.find(p => p.dni === dni);
        const inputs = document.querySelectorAll('#evaluation-criterios .eval-criterio');
        const criterios = Array.from(inputs).map(i => ({
            id: i.dataset.id, nombre: i.dataset.nombre, max: Number(i.dataset.max), puntaje: Number(i.value)
        }));
        const total = criterios.reduce((s, c) => s + c.puntaje, 0);
        const comentario = document.getElementById('evaluation-comentario').value.trim();

        const existenteIdx = this.evaluaciones.findIndex(e => e.evaluadorDni === this.currentUser.dni && e.evaluadoDni === dni);
        const registro = {
            id: existenteIdx >= 0 ? this.evaluaciones[existenteIdx].id : 'ev_' + Date.now(),
            evaluadorDni: this.currentUser.dni,
            evaluadorNombre: this.currentUser.nombre_completo,
            evaluadorRol: this.currentUser.rol,
            evaluadoDni: dni,
            evaluadoNombre: persona.nombre_completo,
            evaluadoCargo: persona.cargo,
            evaluadoArea: persona.area,
            criterios, total, comentario,
            fecha: new Date().toISOString(),
        };
        if (existenteIdx >= 0) this.evaluaciones[existenteIdx] = registro;
        else this.evaluaciones.push(registro);

        this.storageSet('sgi_evaluaciones', this.evaluaciones);
        this.closeModal('evaluation-modal');
        this.showToast('Evaluación guardada correctamente', 'success');
        this.goTab(this.currentTab);
    },

    // ------------------------------------------------------------------
    // REPORTES
    // ------------------------------------------------------------------
    renderReportes() {
        const misForm1 = this.evaluacionesFormulario1.filter(e => e.evaluadorDni === this.currentUser.dni);
        const misForm2 = this.evaluacionesFormulario2.filter(e => e.evaluadorDni === this.currentUser.dni);
        const container = document.getElementById('tab-content');
        
        if (!misForm1.length && !misForm2.length) {
            container.innerHTML = `<div class="empty-state"><i class="fas fa-chart-column"></i><p>Aún no has completado evaluaciones. Cuando registres una, aparecerá aquí su reporte.</p></div>`;
            return;
        }

        const filtro = this._reportesFiltro || 'todos';
        const chips = [
            { key: 'todos', label: 'Todos', icon: 'fa-layer-group' },
            { key: 'form1', label: 'Formulario 1', icon: 'fa-pen-to-square' },
            { key: 'form2', label: 'Formulario 2', icon: 'fa-clipboard-list' },
        ].map(c => `<button class="filtro-chip ${filtro === c.key ? 'active' : ''}" onclick="App.setFiltroReportes('${c.key}')"><i class="fas ${c.icon}"></i> ${c.label}</button>`).join('');
        const filtroHtml = `<div class="filtro-bar">${chips}</div>`;

        let rowsForm1 = '';
        if (misForm1.length) {
            rowsForm1 = misForm1.map(e => {
                const completado = this.esRegistroCompletado(e);
                return `<div class="persona-card">
                    <div class="persona-info">
                        <h4>${e.evaluadoNombre}</h4>
                        <p>${e.evaluadoCargo || ''} · ${new Date(e.fecha).toLocaleDateString('es-PE')}</p>
                    </div>
                    ${completado
                        ? `<span class="badge badge-success"><i class="fas fa-check"></i> Completado</span>`
                        : `<span class="badge badge-info"><i class="fas fa-pen"></i> Borrador</span>`}
                    <div class="persona-actions">
                        ${completado
                            ? `<button class="btn btn-secondary btn-sm" onclick="App.verReporteFormulario1('${e.id}')"><i class="fas fa-eye"></i> Ver</button>`
                            : `<button class="btn btn-secondary btn-sm" onclick="App.abrirFormulario1('${e.evaluadoDni}')"><i class="fas fa-pen"></i> Continuar</button>`}
                    </div>
                </div>`;
            }).join('');
        }
        
        let rowsForm2 = '';
        if (misForm2.length) {
            rowsForm2 = misForm2.map(e => {
                const completado = this.esRegistroCompletado(e);
                const c = this.contarEstadosFormulario2(e.grupos);
                const porcentaje = c.total ? Math.round((c.logrado / c.total) * 100) : 0;
                return `<div class="persona-card">
                    <div class="persona-info">
                        <h4>${e.evaluadoNombre}</h4>
                        <p>${e.evaluadoCargo || ''} · ${new Date(e.fecha).toLocaleDateString('es-PE')}</p>
                    </div>
                    ${completado
                        ? `<span class="badge badge-info">${porcentaje}% Logrado</span>`
                        : `<span class="badge badge-warning"><i class="fas fa-pen"></i> Borrador</span>`}
                    <div class="persona-actions">
                        ${completado
                            ? `<button class="btn btn-secondary btn-sm" onclick="App.verReporteFormulario2('${e.id}')"><i class="fas fa-eye"></i> Ver</button>`
                            : `<button class="btn btn-secondary btn-sm" onclick="App.abrirFormulario2('${e.evaluadoDni}')"><i class="fas fa-pen"></i> Continuar</button>`}
                    </div>
                </div>`;
            }).join('');
        }

        const mostrarForm1 = misForm1.length && (filtro === 'todos' || filtro === 'form1');
        const mostrarForm2 = misForm2.length && (filtro === 'todos' || filtro === 'form2');
        const completadosForm1 = misForm1.filter(e => this.esRegistroCompletado(e)).length;
        const completadosForm2 = misForm2.filter(e => this.esRegistroCompletado(e)).length;

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-chart-column"></i> Reportes de Evaluación</span>
                    <div class="flex gap-8">
                        ${misForm1.length && filtro !== 'form2' ? `<button class="btn btn-primary btn-sm" onclick="App.verReporteConsolidadoForm1()"><i class="fas fa-file-lines"></i> Consolidado Formulario 1</button>` : ''}
                        ${misForm2.length && filtro !== 'form1' ? `<button class="btn btn-primary btn-sm" onclick="App.verReporteConsolidadoForm2()"><i class="fas fa-file-lines"></i> Consolidado Formulario 2</button>` : ''}
                    </div>
                </div>
                <div class="grid-3">
                    <div class="stat-card alt"><div class="stat-number">${completadosForm1}<span class="text-muted" style="font-size:1rem;">/${misForm1.length}</span></div><div class="stat-label">Formulario 1 finalizados</div></div>
                    <div class="stat-card alt"><div class="stat-number">${completadosForm2}<span class="text-muted" style="font-size:1rem;">/${misForm2.length}</span></div><div class="stat-label">Formulario 2 finalizados</div></div>
                    <div class="stat-card alt"><div class="stat-number">${misForm1.length + misForm2.length}</div><div class="stat-label">Total registros (incl. borradores)</div></div>
                </div>
                ${filtroHtml}
            </div>
            ${mostrarForm1 ? `<div class="card"><div class="card-header"><span class="card-title">Formulario 1</span></div>${rowsForm1}</div>` : ''}
            ${mostrarForm2 ? `<div class="card"><div class="card-header"><span class="card-title">Formulario 2</span></div>${rowsForm2}</div>` : ''}
            ${(!mostrarForm1 && !mostrarForm2) ? `<div class="empty-state"><i class="fas fa-filter-circle-xmark"></i><p>No hay reportes de este tipo todavía.</p></div>` : ''}
        `;
    },

    setFiltroReportes(key) {
        this._reportesFiltro = key;
        this.renderReportes();
    },
    
    verReporteFormulario1(evalId) {
        const e = this.evaluacionesFormulario1.find(x => x.id === evalId);
        if (!e) return;
        const logo = this.logoInstitucional || DEFAULT_LOGO;
        const filasPreguntas = e.respuestas.map((r, idx) => `
            <tr><td style="width:6%;font-weight:600;">${idx + 1}</td><td style="width:28%;font-weight:600;">${r.pregunta}</td><td style="width:66%;">${r.respuesta || '<em class="text-muted">Sin respuesta</em>'}</td></tr>
        `).join('');

        document.getElementById('report-body').innerHTML = `
            <div class="reporte-doc">
                <div class="reporte-header">
                    <div class="flex gap-12" style="align-items:center;">
                        <img src="${logo}" alt="Logo">
                        <div><h2>${this.config.nombre_institucion || ''}</h2><p>Reporte de Formulario 1 ${this.config.anio || ''}</p></div>
                    </div>
                </div>
                <div class="reporte-meta">
                    <div><span class="label">Evaluado(a)</span>${e.evaluadoNombre}</div>
                    <div><span class="label">Cargo / Área</span>${e.evaluadoCargo || ''}${e.evaluadoArea ? ' · ' + e.evaluadoArea : ''}</div>
                    <div><span class="label">Evaluador(a)</span>${e.evaluadorNombre} (${this.labelRol(e.evaluadorRol)})</div>
                    <div><span class="label">Fecha</span>${new Date(e.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                </div>
                <div class="table-container"><table><thead><tr><th style="width:6%;">#</th><th style="width:28%;">Pregunta</th><th style="width:66%;">Respuesta</th></tr></thead><tbody>${filasPreguntas}</tbody></table></div>
            </div>`;
        this.currentReportId = evalId;
        this.currentReportType = 'form1';
        this.openModal('report-modal');
    },
    
    // Cuenta cuántos ítems de una evaluación de Formulario 2 quedaron en cada estado
    // (Inicio / Proceso / Logrado). Ignora cualquier grupo de "Conclusiones" heredado
    // de versiones anteriores, ya que ahora esos campos son texto abierto.
    contarEstadosFormulario2(grupos) {
        const out = { inicio: 0, proceso: 0, logrado: 0, sinEvaluar: 0, total: 0 };
        (grupos || []).forEach(g => {
            if ((g.nombre || '').toUpperCase() === 'CONCLUSIONES') return;
            (g.items || []).forEach(i => {
                out.total++;
                if (i.estado === 'inicio') out.inicio++;
                else if (i.estado === 'proceso') out.proceso++;
                else if (i.estado === 'logrado') out.logrado++;
                else out.sinEvaluar++;
            });
        });
        return out;
    },

    renderConclusionesHtml(e) {
        const conclusiones = e.conclusiones || {};
        const campos = this.camposConclusionFormulario2.filter(c => conclusiones[c.id]);
        if (!campos.length) return '';
        return `
            <div class="reporte-seccion reporte-conclusiones">
                <h4><i class="fas fa-comment-dots"></i> Conclusiones</h4>
                ${campos.map(c => `<div class="reporte-obs-item"><strong>${c.label}:</strong> ${conclusiones[c.id]}</div>`).join('')}
            </div>`;
    },

    verReporteFormulario2(evalId) {
        const e = this.evaluacionesFormulario2.find(x => x.id === evalId);
        if (!e) return;
        const logo = this.logoInstitucional || DEFAULT_LOGO;
        
        const gruposHtml = e.grupos.filter(g => (g.nombre || '').toUpperCase() !== 'CONCLUSIONES').map(g => {
            const itemsHtml = g.items.map((item, idx) => {
                const estadoColor = item.estado === 'logrado' ? '#2FA84F' : item.estado === 'proceso' ? '#3E8ED0' : '#E0A82E';
                const estadoLabel = item.estado ? item.estado.charAt(0).toUpperCase() + item.estado.slice(1) : 'Sin evaluar';
                return `<tr>
                    <td style="width:4%;">${idx + 1}</td>
                    <td style="width:36%;">${item.pregunta}</td>
                    <td style="width:12%;text-align:center;"><span class="badge" style="background:${estadoColor}22;color:${estadoColor};">${estadoLabel}</span></td>
                    <td style="width:48%;">${item.observacion || '<em class="text-muted">Sin observación</em>'}</td>
                </tr>`;
            }).join('');
            return `<div class="reporte-seccion">
                <h4>${g.nombre}</h4>
                <div class="table-container"><table><thead><tr><th style="width:4%;">#</th><th style="width:36%;">Criterio</th><th style="width:12%;text-align:center;">Estado</th><th style="width:48%;">Observación</th></tr></thead><tbody>${itemsHtml}</tbody></table></div>
            </div>`;
        }).join('');

        const conteo = this.contarEstadosFormulario2(e.grupos);
        const porcentaje = conteo.total ? Math.round((conteo.logrado / conteo.total) * 100) : 0;
        const estadosHtml = `
            <div class="reporte-mini-stats">
                <div class="mini-stat" style="--c:#E0A82E;"><span class="mini-stat-num">${conteo.inicio}</span><span class="mini-stat-label">Inicio</span></div>
                <div class="mini-stat" style="--c:#3E8ED0;"><span class="mini-stat-num">${conteo.proceso}</span><span class="mini-stat-label">Proceso</span></div>
                <div class="mini-stat" style="--c:#2FA84F;"><span class="mini-stat-num">${conteo.logrado}</span><span class="mini-stat-label">Logrado</span></div>
            </div>`;

        // Agregar observaciones jerárquicas si existen
        let observacionesJerarquicasHtml = '';
        if (e.observacionesJerarquicas) {
            const obs = e.observacionesJerarquicas;
            const filas = [];
            if (obs.coordinador) filas.push(`<div class="reporte-obs-item"><strong><i class="fas fa-user-tie"></i> Coordinador:</strong> ${obs.coordinador}</div>`);
            if (obs.subdirectora) filas.push(`<div class="reporte-obs-item"><strong><i class="fas fa-user-shield"></i> Subdirectora${obs.subdirectoraFiltro ? ' (' + obs.subdirectoraFiltro + ')' : ''}:</strong> ${obs.subdirectora}</div>`);
            if (obs.directora) filas.push(`<div class="reporte-obs-item"><strong><i class="fas fa-user-crown"></i> Directora${obs.directoraFiltro ? ' (' + obs.directoraFiltro + ')' : ''}:</strong> ${obs.directora}</div>`);
            if (filas.length) {
                observacionesJerarquicasHtml = `<div class="reporte-seccion reporte-jerarquico"><h4><i class="fas fa-clipboard-user"></i> Observaciones Jerárquicas</h4>${filas.join('')}</div>`;
            }
        }

        document.getElementById('report-body').innerHTML = `
            <div class="reporte-doc">
                <div class="reporte-header">
                    <img src="${logo}" alt="Logo">
                    <div><h2>${this.config.nombre_institucion || ''}</h2><p>Reporte de Formulario 2 ${this.config.anio || ''}</p></div>
                </div>
                <div class="reporte-meta">
                    <div><span class="label">Evaluado(a)</span>${e.evaluadoNombre}</div>
                    <div><span class="label">Cargo / Área</span>${e.evaluadoCargo || ''}${e.evaluadoArea ? ' · ' + e.evaluadoArea : ''}</div>
                    <div><span class="label">Evaluador(a)</span>${e.evaluadorNombre} (${this.labelRol(e.evaluadorRol)})</div>
                    <div><span class="label">Fecha</span>${new Date(e.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                </div>
                <div class="reporte-total-row">
                    <div class="reporte-total"><div class="num">${porcentaje}%</div><div class="cal">Logrado</div></div>
                    ${estadosHtml}
                </div>
                ${gruposHtml}
                ${this.renderConclusionesHtml(e)}
                ${observacionesJerarquicasHtml}
            </div>`;
        this.currentReportId = evalId;
        this.currentReportType = 'form2';
        this.openModal('report-modal');
    },
    
    verReporteConsolidadoForm1() {
        const evaluables = this.personalEvaluable();
        const mis = this.evaluacionesFormulario1.filter(e => e.evaluadorDni === this.currentUser.dni && this.esRegistroCompletado(e));
        const logo = this.logoInstitucional || DEFAULT_LOGO;
        const filas = mis.map(e => {
            return `<tr><td>${e.evaluadoNombre}</td><td>${e.evaluadoCargo || ''}</td><td>${new Date(e.fecha).toLocaleDateString('es-PE')}</td><td><span class="badge badge-success">Completado</span></td></tr>`;
        }).join('');

        const evaluadosDni = new Set(mis.map(e => e.evaluadoDni));
        const pendientes = evaluables.filter(p => !evaluadosDni.has(p.dni));
        const pendientesHtml = pendientes.length
            ? `<div style="margin-top:24px;">
                <h4 style="color:var(--advertencia,#E0A82E);font-weight:700;margin-bottom:10px;"><i class="fas fa-triangle-exclamation"></i> Pendientes de evaluar (${pendientes.length})</h4>
                <div class="table-container"><table><thead><tr><th style="width:45%;">Nombre</th><th style="width:55%;">Cargo / Área</th></tr></thead><tbody>
                    ${pendientes.map(p => `<tr><td>${p.nombre_completo}</td><td>${p.cargo || ''}${p.area ? ' · ' + p.area : ''}</td></tr>`).join('')}
                </tbody></table></div>
            </div>`
            : `<div class="alert alert-success" style="margin-top:24px;"><i class="fas fa-circle-check"></i> No hay pendientes.</div>`;

        document.getElementById('report-body').innerHTML = `
            <div class="reporte-doc">
                <div class="reporte-header">
                    <div class="flex gap-12" style="align-items:center;">
                        <img src="${logo}" alt="Logo">
                        <div><h2>${this.config.nombre_institucion || ''}</h2><p>Reporte Consolidado de Formulario 1 — ${this.labelRol(this.currentUser.rol)}</p></div>
                    </div>
                </div>
                <div class="reporte-meta">
                    <div><span class="label">Evaluador(a)</span>${this.currentUser.nombre_completo}</div>
                    <div><span class="label">Fecha de emisión</span>${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                    <div><span class="label">Personas evaluadas</span>${mis.length} de ${evaluables.length}</div>
                </div>
                <div class="table-container"><table><thead><tr><th style="width:32%;">Nombre</th><th style="width:32%;">Cargo</th><th style="width:18%;">Fecha</th><th style="width:18%;">Estado</th></tr></thead><tbody>${filas || '<tr><td colspan="4" class="text-muted" style="text-align:center;padding:20px;">Sin evaluaciones registradas todavía.</td></tr>'}</tbody></table></div>
                ${pendientesHtml}
            </div>`;
        this.currentReportType = 'consolidado_form1';
        this.openModal('report-modal');
    },
    
    setConsolidadoF2Area(area) {
        this._consolidadoF2Area = area;
        this.verReporteConsolidadoForm2();
    },

    verReporteConsolidadoForm2() {
        const evaluablesBase = this.personalEvaluable();
        const areaSeleccionada = this._consolidadoF2Area || '';
        const evaluables = areaSeleccionada ? evaluablesBase.filter(p => p.area_codigo === areaSeleccionada) : evaluablesBase;

        const evaluablesDni = new Set(evaluables.map(p => p.dni));
        const mis = this.evaluacionesFormulario2.filter(e => e.evaluadorDni === this.currentUser.dni && evaluablesDni.has(e.evaluadoDni) && this.esRegistroCompletado(e));
        const logo = this.logoInstitucional || DEFAULT_LOGO;

        // Selector de área (solo si el evaluador tiene personas de más de un área a cargo)
        const codigosDisponibles = [...new Set(evaluablesBase.filter(p => p.area_codigo).map(p => p.area_codigo))];
        let selectorAreaHtml = '';
        if (codigosDisponibles.length > 1) {
            const opts = codigosDisponibles.sort((a, b) => (this.AREA_LABELS[a] || a).localeCompare(this.AREA_LABELS[b] || b))
                .map(c => `<option value="${c}" ${areaSeleccionada === c ? 'selected' : ''}>${this.AREA_LABELS[c] || c}</option>`).join('');
            selectorAreaHtml = `<div class="form-group" style="max-width:280px;">
                <label>Filtrar por área</label>
                <select class="form-control" onchange="App.setConsolidadoF2Area(this.value)">
                    <option value="">Todas las áreas</option>${opts}
                </select>
            </div>`;
        }

        // Conteo agregado de Inicio / Proceso / Logrado sobre todas las evaluaciones registradas
        const conteoTotal = { inicio: 0, proceso: 0, logrado: 0 };
        mis.forEach(e => {
            const c = this.contarEstadosFormulario2(e.grupos);
            conteoTotal.inicio += c.inicio;
            conteoTotal.proceso += c.proceso;
            conteoTotal.logrado += c.logrado;
        });

        const filas = mis.map(e => {
            const c = this.contarEstadosFormulario2(e.grupos);
            const porcentaje = c.total ? Math.round((c.logrado / c.total) * 100) : 0;
            return `<tr>
                <td>${e.evaluadoNombre}</td>
                <td>${e.evaluadoCargo || ''}${e.evaluadoArea ? ' · ' + e.evaluadoArea : ''}</td>
                <td style="text-align:center;">${c.inicio}</td>
                <td style="text-align:center;">${c.proceso}</td>
                <td style="text-align:center;">${c.logrado}</td>
                <td style="text-align:right;">${porcentaje}%</td>
                <td><button class="btn btn-secondary btn-sm" onclick="App.verReporteFormulario2('${e.id}')"><i class="fas fa-eye"></i></button></td>
            </tr>`;
        }).join('');

        // Personal pendiente por evaluar (con nombre, no solo cantidad)
        const evaluadosDni = new Set(mis.map(e => e.evaluadoDni));
        const pendientes = evaluables.filter(p => !evaluadosDni.has(p.dni));
        const pendientesHtml = pendientes.length
            ? `<div style="margin-top:24px;">
                <h4 style="color:var(--advertencia,#E0A82E);font-weight:700;margin-bottom:10px;"><i class="fas fa-triangle-exclamation"></i> Pendientes de evaluar (${pendientes.length})</h4>
                <div class="table-container"><table><thead><tr><th style="width:45%;">Nombre</th><th style="width:55%;">Cargo / Área</th></tr></thead><tbody>
                    ${pendientes.map(p => `<tr><td>${p.nombre_completo}</td><td>${p.cargo || ''}${p.area ? ' · ' + p.area : ''}</td></tr>`).join('')}
                </tbody></table></div>
            </div>`
            : `<div class="alert alert-success" style="margin-top:24px;"><i class="fas fa-circle-check"></i> No hay pendientes${areaSeleccionada ? ' en esta área' : ''}.</div>`;

        document.getElementById('report-body').innerHTML = `
            <div class="reporte-doc">
                <div class="reporte-header">
                    <div class="flex gap-12" style="align-items:center;">
                        <img src="${logo}" alt="Logo">
                        <div><h2>${this.config.nombre_institucion || ''}</h2><p>Reporte Consolidado de Formulario 2 — ${this.labelRol(this.currentUser.rol)}${areaSeleccionada ? ' · ' + (this.AREA_LABELS[areaSeleccionada] || areaSeleccionada) : ''}</p></div>
                    </div>
                </div>
                <div class="reporte-meta">
                    <div><span class="label">Evaluador(a)</span>${this.currentUser.nombre_completo}</div>
                    <div><span class="label">Fecha de emisión</span>${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                    <div><span class="label">Personas evaluadas</span>${mis.length} de ${evaluables.length}</div>
                </div>
                ${selectorAreaHtml}
                <div class="grid-3" style="margin:18px 0;">
                    <div class="stat-card alt"><div class="stat-number" style="color:#E0A82E;">${conteoTotal.inicio}</div><div class="stat-label">Inicio</div></div>
                    <div class="stat-card alt"><div class="stat-number" style="color:#3E8ED0;">${conteoTotal.proceso}</div><div class="stat-label">Proceso</div></div>
                    <div class="stat-card alt"><div class="stat-number" style="color:#2FA84F;">${conteoTotal.logrado}</div><div class="stat-label">Logrado</div></div>
                </div>
                <div class="table-container"><table><thead><tr><th style="width:24%;">Nombre</th><th style="width:20%;">Cargo / Área</th><th style="width:11%;text-align:center;">Inicio</th><th style="width:11%;text-align:center;">Proceso</th><th style="width:11%;text-align:center;">Logrado</th><th style="width:13%;text-align:right;">% Logrado</th><th style="width:10%;"></th></tr></thead><tbody>${filas || '<tr><td colspan="7" class="text-muted" style="text-align:center;padding:20px;">Sin evaluaciones registradas todavía.</td></tr>'}</tbody></table></div>
                ${pendientesHtml}
            </div>`;
        this.currentReportType = 'consolidado_form2';
        this.openModal('report-modal');
    },

    verReporte(evalId) {
        const e = this.evaluaciones.find(x => x.id === evalId);
        if (!e) return;
        const esc = this.escalaPara(e.total);
        const logo = this.logoInstitucional || DEFAULT_LOGO;
        const filasCriterios = e.criterios.map(c => `
            <tr><td>${c.nombre}</td><td style="text-align:right;">${c.puntaje} / ${c.max}</td></tr>
        `).join('');

        document.getElementById('report-body').innerHTML = `
            <div class="reporte-doc">
                <div class="reporte-header">
                    <div class="flex gap-12" style="align-items:center;">
                        <img src="${logo}" alt="Logo">
                        <div><h2>${this.config.nombre_institucion || ''}</h2><p>Reporte de Evaluación de Desempeño ${this.config.anio || ''}</p></div>
                    </div>
                </div>
                <div class="reporte-meta">
                    <div><span class="label">Evaluado(a)</span>${e.evaluadoNombre}</div>
                    <div><span class="label">Cargo / Área</span>${e.evaluadoCargo || ''}${e.evaluadoArea ? ' · ' + e.evaluadoArea : ''}</div>
                    <div><span class="label">Evaluador(a)</span>${e.evaluadorNombre} (${this.labelRol(e.evaluadorRol)})</div>
                    <div><span class="label">Fecha</span>${new Date(e.fecha).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                </div>
                <div class="table-container"><table><thead><tr><th style="width:70%;">Criterio</th><th style="width:30%;text-align:right;">Puntaje</th></tr></thead><tbody>${filasCriterios}</tbody></table></div>
                <div class="reporte-total"><div class="num">${e.total}/100</div><div class="cal">${esc.label}</div></div>
                ${e.comentario ? `<div><strong>Observaciones:</strong><p style="margin-top:6px;color:#444;">${e.comentario}</p></div>` : ''}
                <canvas id="report-chart" height="90" style="margin-top:20px;"></canvas>
            </div>`;
        this.openModal('report-modal');
        this.pintarChartReporte(e.criterios);
    },

    pintarChartReporte(criterios) {
        const canvas = document.getElementById('report-chart');
        if (!canvas) return;
        this.destroyChart('reporte');
        this.charts.reporte = new Chart(canvas, {
            type: 'bar',
            data: { labels: criterios.map(c => c.nombre), datasets: [{ label: 'Puntaje', data: criterios.map(c => c.puntaje), backgroundColor: '#800020', borderRadius: 8 }] },
            options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } },
                scales: { x: { ticks: { color: '#6E6E73' }, grid: { color: 'rgba(0,0,0,0.06)' } }, y: { ticks: { color: '#1D1D1F' }, grid: { display: false } } } }
        });
    },

    verReporteConsolidado() {
        const mis = this.evaluaciones.filter(e => e.evaluadorDni === this.currentUser.dni);
        const promedio = Math.round(mis.reduce((s, e) => s + e.total, 0) / mis.length);
        const esc = this.escalaPara(promedio);
        const logo = this.logoInstitucional || DEFAULT_LOGO;
        const filas = mis.map(e => {
            const es = this.escalaPara(e.total);
            return `<tr><td>${e.evaluadoNombre}</td><td>${e.evaluadoCargo || ''}</td><td style="text-align:right;">${e.total}/100</td><td><span class="badge" style="background:${es.color}22;color:${es.color};">${es.label}</span></td></tr>`;
        }).join('');

        document.getElementById('report-body').innerHTML = `
            <div class="reporte-doc">
                <div class="reporte-header">
                    <div class="flex gap-12" style="align-items:center;">
                        <img src="${logo}" alt="Logo">
                        <div><h2>${this.config.nombre_institucion || ''}</h2><p>Reporte Consolidado de Evaluaciones — ${this.labelRol(this.currentUser.rol)}</p></div>
                    </div>
                </div>
                <div class="reporte-meta">
                    <div><span class="label">Evaluador(a)</span>${this.currentUser.nombre_completo}</div>
                    <div><span class="label">Fecha de emisión</span>${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                    <div><span class="label">Personas evaluadas</span>${mis.length}</div>
                    <div><span class="label">Promedio general</span>${promedio}/100</div>
                </div>
                <div class="reporte-total"><div class="num">${promedio}/100</div><div class="cal">${esc.label}</div></div>
                <div class="table-container"><table><thead><tr><th style="width:34%;">Nombre</th><th style="width:26%;">Cargo</th><th style="width:20%;text-align:right;">Puntaje</th><th style="width:20%;">Calificación</th></tr></thead><tbody>${filas}</tbody></table></div>
            </div>`;
        this.openModal('report-modal');
    },

    // ------------------------------------------------------------------
    // PAGINACIÓN INTELIGENTE DEL PDF: nunca cortar una fila o bloque a la mitad
    // ------------------------------------------------------------------
    // A partir del reporte ya renderizado (clon fuera de pantalla), separa el
    // documento en:
    //   - "cabecera": todo lo que va antes de la primera tabla/sección (logo,
    //     datos del evaluado, tarjetas de totales) — se repite completa solo
    //     en la página 1.
    //   - "cuerpo": el resto, descompuesto en unidades atómicas (cada fila de
    //     cada tabla, o cada bloque sin tabla como "Conclusiones") que NUNCA
    //     se dividen entre dos páginas.
    // Devuelve un array de elementos <div class="reporte-doc"> ya armados,
    // uno por cada página, listos para capturarse con html2canvas.
    construirPaginasReporte(clone) {
        const reporteDoc = clone.querySelector('.reporte-doc') || clone;
        const hijos = Array.from(reporteDoc.children);
        const esInicioCuerpo = (el) => el.matches('table, .table-container, .reporte-seccion');
        let idxCuerpo = hijos.findIndex(esInicioCuerpo);
        if (idxCuerpo === -1) idxCuerpo = hijos.length;
        const cabeceraNodos = hijos.slice(0, idxCuerpo);
        const cuerpoNodos = hijos.slice(idxCuerpo);

        const PX_POR_MM = 794 / 210;
        const ALTO_PAGINA_PX = 297 * PX_POR_MM;
        const PADDING_DOC_PX = 64; // aprox. padding vertical del .reporte-doc
        const MARGEN_SEGURIDAD_PX = 18;
        const ALTO_MINI_CABECERA_PX = 46;
        const ALTO_THEAD_APROX_PX = 32;
        const ALTO_TITULO_APROX_PX = 26;

        const alturaNodo = (n) => n.getBoundingClientRect().height;
        const cabeceraAlturaPx = cabeceraNodos.reduce((s, n) => s + alturaNodo(n), 0)
            + Math.max(0, cabeceraNodos.length - 1) * 14;

        // Descomponer el cuerpo en items atómicos (fila de tabla o bloque completo)
        const items = [];
        cuerpoNodos.forEach(nodo => {
            const tabla = nodo.matches('table') ? nodo : nodo.querySelector('table');
            if (tabla) {
                const tituloEl = nodo.querySelector('h4');
                const tituloTexto = tituloEl ? tituloEl.textContent : '';
                const theadHTML = tabla.querySelector('thead') ? tabla.querySelector('thead').outerHTML : '';
                const wrapClass = nodo.className || 'reporte-seccion';
                const filas = Array.from(tabla.querySelectorAll('tbody > tr'));
                if (!filas.length) {
                    items.push({ tipo: 'bloque', html: nodo.outerHTML, alto: alturaNodo(nodo) + 16 });
                    return;
                }
                filas.forEach(tr => {
                    items.push({
                        tipo: 'fila',
                        grupoId: nodo,
                        tituloGrupo: tituloTexto,
                        theadHTML,
                        wrapClass,
                        trHTML: tr.outerHTML,
                        alto: alturaNodo(tr)
                    });
                });
            } else {
                items.push({ tipo: 'bloque', html: nodo.outerHTML, alto: alturaNodo(nodo) + 16 });
            }
        });

        // Empaquetar items en páginas sin cortar ninguno
        const paginasItems = [];
        let actual = [];
        let grupoActivo = null;
        let disponiblePx = ALTO_PAGINA_PX - PADDING_DOC_PX - MARGEN_SEGURIDAD_PX - cabeceraAlturaPx;

        items.forEach(item => {
            let costoPx = item.alto;
            const abreNuevaTabla = item.tipo === 'fila' && grupoActivo !== item.grupoId;
            if (abreNuevaTabla) costoPx += ALTO_THEAD_APROX_PX + (item.tituloGrupo ? ALTO_TITULO_APROX_PX : 0);

            if (actual.length && costoPx > disponiblePx) {
                paginasItems.push(actual);
                actual = [];
                grupoActivo = null;
                disponiblePx = ALTO_PAGINA_PX - PADDING_DOC_PX - MARGEN_SEGURIDAD_PX - ALTO_MINI_CABECERA_PX;
                if (item.tipo === 'fila') costoPx = item.alto + ALTO_THEAD_APROX_PX + (item.tituloGrupo ? ALTO_TITULO_APROX_PX : 0);
            }

            actual.push(item);
            disponiblePx -= costoPx;
            if (item.tipo === 'fila') grupoActivo = item.grupoId;
        });
        if (actual.length) paginasItems.push(actual);
        if (!paginasItems.length) paginasItems.push([]);

        // Construir el DOM real de cada página
        const gruposYaIniciados = new Set();
        return paginasItems.map((paginaItems, pIdx) => {
            const doc = document.createElement('div');
            doc.className = 'reporte-doc';

            if (pIdx === 0) {
                cabeceraNodos.forEach(n => doc.appendChild(n.cloneNode(true)));
            } else {
                const mini = document.createElement('div');
                mini.className = 'reporte-mini-header-continuacion';
                const nombreInst = (this.config && this.config.nombre_institucion) || '';
                mini.innerHTML = `<span>${nombreInst}</span><span>Página ${pIdx + 1}</span>`;
                doc.appendChild(mini);
            }

            let grupoActivoDom = null;
            let tbodyActualEl = null;
            paginaItems.forEach(item => {
                if (item.tipo === 'bloque') {
                    const tmp = document.createElement('div');
                    tmp.innerHTML = item.html;
                    if (tmp.firstElementChild) doc.appendChild(tmp.firstElementChild);
                    grupoActivoDom = null;
                    tbodyActualEl = null;
                    return;
                }
                if (grupoActivoDom !== item.grupoId || !tbodyActualEl) {
                    const contenedor = document.createElement('div');
                    contenedor.className = item.wrapClass;
                    if (item.tituloGrupo) {
                        const h4 = document.createElement('h4');
                        const esContinuacion = gruposYaIniciados.has(item.grupoId);
                        h4.textContent = esContinuacion ? `${item.tituloGrupo} (continuación)` : item.tituloGrupo;
                        contenedor.appendChild(h4);
                    }
                    gruposYaIniciados.add(item.grupoId);
                    const tabla = document.createElement('table');
                    tabla.innerHTML = item.theadHTML;
                    const tbody = document.createElement('tbody');
                    tabla.appendChild(tbody);
                    // Evitar anidar dos veces ".table-container" cuando el nodo
                    // original YA era ese contenedor (p. ej. reportes consolidados).
                    if (item.wrapClass && item.wrapClass.split(' ').includes('table-container')) {
                        contenedor.appendChild(tabla);
                    } else {
                        const tableContainer = document.createElement('div');
                        tableContainer.className = 'table-container';
                        tableContainer.appendChild(tabla);
                        contenedor.appendChild(tableContainer);
                    }
                    doc.appendChild(contenedor);
                    tbodyActualEl = tbody;
                    grupoActivoDom = item.grupoId;
                }
                const tmpTr = document.createElement('tbody');
                tmpTr.innerHTML = item.trHTML;
                if (tmpTr.firstElementChild) tbodyActualEl.appendChild(tmpTr.firstElementChild);
            });

            return doc;
        });
    },

    async descargarReportePDF() {
        const btn = document.getElementById('download-report-btn');
        let wrapper = null;
        try {
            // Verificar que las librerías estén disponibles
            if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
                this.showToast('Error: las librerías de PDF no están cargadas. Verifica tu conexión a internet e intenta de nuevo.', 'danger');
                return;
            }

            const original = document.getElementById('print-area');
            if (!original) {
                this.showToast('Error: no se encontró el contenido del reporte', 'danger');
                return;
            }

            // Mostrar indicador de carga
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando...';
            }

            // Esperar a que las fuentes web terminen de cargar (evita texto invisible/desplazado)
            if (document.fonts && document.fonts.ready) {
                try { await document.fonts.ready; } catch (e) { /* ignorar */ }
            }

            // IMPORTANTE: el reporte vive dentro de un modal con scroll (max-height + overflow-y),
            // así que capturarlo directamente puede recortar el contenido a solo lo visible en pantalla.
            // Para evitarlo, lo clonamos dentro de un contenedor fuera de pantalla, sin recorte,
            // con el ancho fijo de una hoja A4.
            const clone = original.cloneNode(true);
            wrapper = document.createElement('div');
            wrapper.style.position = 'fixed';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.transform = 'translateX(-10000px)';
            wrapper.style.width = '794px'; // ~210mm a 96dpi
            wrapper.style.background = '#ffffff';
            wrapper.style.zIndex = '-1';
            wrapper.appendChild(clone);
            document.body.appendChild(wrapper);

            // cloneNode() copia atributos de los <canvas> (como los gráficos Chart.js) pero NO
            // su contenido dibujado. Copiamos manualmente los píxeles para que los gráficos
            // aparezcan en el PDF en vez de salir en blanco.
            const canvasesOriginales = original.querySelectorAll('canvas');
            const canvasesClon = clone.querySelectorAll('canvas');
            canvasesOriginales.forEach((cOrig, i) => {
                const cClon = canvasesClon[i];
                if (!cClon) return;
                cClon.width = cOrig.width;
                cClon.height = cOrig.height;
                try { cClon.getContext('2d').drawImage(cOrig, 0, 0); } catch (e) { /* ignorar */ }
            });

            // Dar un pequeño respiro al layout/pintado antes de medir y capturar
            await new Promise(resolve => setTimeout(resolve, 60));

            // Cuando un docente escribe respuestas u observaciones muy largas, el
            // reporte puede necesitar más de una hoja. En vez de tomar una sola
            // "foto" del documento completo y cortarla cada 297mm (lo que parte
            // preguntas y filas justo por la mitad y se ve mal), aquí medimos el
            // contenido real y lo repartimos en páginas completas, respetando
            // siempre los bordes de cada pregunta / fila / bloque.
            const paginas = this.construirPaginasReporte(clone);

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidthMM = 210;
            const pageHeightMM = 297;

            for (let i = 0; i < paginas.length; i++) {
                wrapper.innerHTML = '';
                wrapper.appendChild(paginas[i]);

                // Si la página incluye algún <canvas> (p.ej. un gráfico), volvemos a
                // copiar los píxeles porque cada reconstrucción del DOM (clonar,
                // reordenar en páginas) pierde el contenido dibujado del canvas.
                const canvasesPagina = paginas[i].querySelectorAll('canvas');
                canvasesPagina.forEach((cPag, idx) => {
                    const cOrig = canvasesOriginales[idx];
                    if (!cOrig) return;
                    cPag.width = cOrig.width;
                    cPag.height = cOrig.height;
                    try { cPag.getContext('2d').drawImage(cOrig, 0, 0); } catch (e) { /* ignorar */ }
                });

                await new Promise(resolve => setTimeout(resolve, 20));

                const canvasPagina = await html2canvas(wrapper, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    useCORS: true,
                    allowTaint: true,
                    imageTimeout: 15000,
                    logging: false,
                    windowWidth: 794,
                    width: 794
                });

                const imgDataUrl = canvasPagina.toDataURL('image/png', 1.0);
                const imgWidthFull = pageWidthMM;
                const imgHeightFull = (canvasPagina.height * imgWidthFull) / canvasPagina.width;

                if (i > 0) pdf.addPage();

                if (paginas.length === 1 && imgHeightFull < pageHeightMM * 0.62) {
                    // Documento de una sola página y bastante corto (p.ej. pocas
                    // respuestas breves): lo ampliamos para que la hoja se vea
                    // completa en vez de un recorte pequeño con espacio en blanco.
                    const escala = Math.min(1.3, pageHeightMM / imgHeightFull);
                    const w = imgWidthFull * escala;
                    const h = imgHeightFull * escala;
                    const xOffset = (pageWidthMM - w) / 2;
                    const yOffset = Math.max(0, (pageHeightMM - h) / 2);
                    pdf.addImage(imgDataUrl, 'PNG', xOffset, yOffset, w, h, undefined, 'FAST');
                } else if (imgHeightFull > pageHeightMM) {
                    // Caso raro: una sola fila/bloque más alto que una hoja completa
                    // (p.ej. una respuesta larguísima sin espacios). Reducimos un
                    // poco, nunca por debajo del 82% para mantener la letra legible.
                    const escala = Math.max(0.82, pageHeightMM / imgHeightFull);
                    const w = imgWidthFull * escala;
                    const h = imgHeightFull * escala;
                    pdf.addImage(imgDataUrl, 'PNG', (pageWidthMM - w) / 2, 0, w, h, undefined, 'FAST');
                } else {
                    pdf.addImage(imgDataUrl, 'PNG', 0, 0, imgWidthFull, imgHeightFull, undefined, 'FAST');
                }
            }

            // Generar nombre de archivo específico según el tipo de reporte
            let filename = 'reporte_evaluacion.pdf';
            if (this.currentReportType === 'form1') {
                const e = this.evaluacionesFormulario1.find(x => x.id === this.currentReportId);
                if (e) {
                    const nombreNormalizado = e.evaluadoNombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '_');
                    filename = `formulario1_${nombreNormalizado}_${new Date(e.fecha).toISOString().split('T')[0]}.pdf`;
                }
            } else if (this.currentReportType === 'form2') {
                const e = this.evaluacionesFormulario2.find(x => x.id === this.currentReportId);
                if (e) {
                    const nombreNormalizado = e.evaluadoNombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '_');
                    filename = `formulario2_${nombreNormalizado}_${new Date(e.fecha).toISOString().split('T')[0]}.pdf`;
                }
            } else if (this.currentReportType === 'consolidado_form1') {
                const nombreNormalizado = this.currentUser.nombre_completo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '_');
                filename = `consolidado_formulario1_${nombreNormalizado}_${new Date().toISOString().split('T')[0]}.pdf`;
            } else if (this.currentReportType === 'consolidado_form2') {
                const nombreNormalizado = this.currentUser.nombre_completo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '_');
                filename = `consolidado_formulario2_${nombreNormalizado}_${new Date().toISOString().split('T')[0]}.pdf`;
            } else if (this.currentReportType === 'supervision') {
                filename = `supervision_evaluaciones_${new Date().toISOString().split('T')[0]}.pdf`;
            }
            
            pdf.save(filename);
            this.showToast('PDF descargado correctamente', 'success');
        } catch (error) {
            console.error('Error al generar PDF:', error);
            this.showToast('Error al generar PDF: ' + (error && error.message ? error.message : error), 'danger');
        } finally {
            if (wrapper && wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-file-pdf"></i> Descargar PDF';
            }
        }
    },

    // ------------------------------------------------------------------
    // SUPERVISIÓN (Dirección) — quién evaluó a quién, resultados por área
    // ------------------------------------------------------------------
    setSupervisionArea(area) {
        this._supervisionArea = area;
        this.renderSupervision();
    },

    // Clasifica a una persona en Inicio / Proceso / Logrado según el estado que
    // más se repite en su Formulario 2 (para responder "quién está en cada nivel",
    // no solo cuántos criterios sueltos cayeron en cada estado).
    nivelPredominante(grupos) {
        const c = this.contarEstadosFormulario2(grupos);
        if (!c.total) return null;
        if (c.logrado >= c.proceso && c.logrado >= c.inicio) return 'logrado';
        if (c.proceso >= c.inicio) return 'proceso';
        return 'inicio';
    },

    nivelBadge(nivel) {
        if (nivel === 'logrado') return `<span class="badge" style="background:#2FA84F22;color:#2FA84F;">Logrado</span>`;
        if (nivel === 'proceso') return `<span class="badge" style="background:#3E8ED022;color:#3E8ED0;">Proceso</span>`;
        if (nivel === 'inicio') return `<span class="badge" style="background:#E0A82E22;color:#E0A82E;">Inicio</span>`;
        return '<span class="text-muted">—</span>';
    },

    renderSupervision() {
        const container = document.getElementById('tab-content');
        const gruposCoord = Object.keys(this.config.coordination_areas || {});
        const estado = this._supervisionArea || 'todos';

        const chips = ['todos', ...gruposCoord].map(g => {
            const label = g === 'todos' ? 'Todas las áreas' : ((this.config.area_labels || {})[g] || g);
            return `<button class="filtro-chip ${estado === g ? 'active' : ''}" onclick="App.setSupervisionArea('${g}')"><i class="fas fa-layer-group"></i> ${label}</button>`;
        }).join('');

        const gruposAMostrar = estado === 'todos' ? gruposCoord : [estado];

        let filasHtml = '';
        let totalDocentes = 0, totalF1 = 0, totalF2 = 0;
        const conteoTotal = { inicio: 0, proceso: 0, logrado: 0 };
        const personasPorNivel = { inicio: [], proceso: [], logrado: [] };
        this._supervisionFilas = []; // usado luego para armar el PDF

        // ---- Equipo directivo: Subdirección y Coordinadores, evaluados directamente
        // por la Directora (no por un coordinador) — se muestran aparte, con lo que
        // ELLA misma puso en Formulario 1 y 2 al evaluarlos. ----
        let equipoDirectivoHtml = '';
        if (estado === 'todos') {
            const equipo = this.personal.filter(p => p.rol === 'subdireccion' || this.esCoordinador(p.rol));
            if (equipo.length) {
                const filasEquipo = equipo.map(persona => {
                    const ev1 = this.yaEvaluadoFormulario1(this.currentUser.dni, persona.dni);
                    const ev2 = this.yaEvaluadoFormulario2(this.currentUser.dni, persona.dni);
                    const ev1Completo = this.esRegistroCompletado(ev1);
                    const ev2Completo = this.esRegistroCompletado(ev2);
                    let nivel = null;
                    if (ev1Completo) totalF1++;
                    if (ev2Completo) {
                        totalF2++;
                        const c = this.contarEstadosFormulario2(ev2.grupos);
                        conteoTotal.inicio += c.inicio;
                        conteoTotal.proceso += c.proceso;
                        conteoTotal.logrado += c.logrado;
                        nivel = this.nivelPredominante(ev2.grupos);
                        if (nivel) personasPorNivel[nivel].push(persona.nombre_completo);
                    }
                    totalDocentes++; // se cuenta junto al resto para los totales generales

                    this._supervisionFilas.push({
                        area: 'Equipo directivo',
                        docente: persona.nombre_completo,
                        coordinador: 'Directora (evaluadora)',
                        form1: ev1Completo ? new Date(ev1.fecha).toLocaleDateString('es-PE') : (ev1 ? 'Borrador' : 'Pendiente'),
                        form2: ev2Completo ? new Date(ev2.fecha).toLocaleDateString('es-PE') : (ev2 ? 'Borrador' : 'Pendiente'),
                        nivel: nivel ? nivel.charAt(0).toUpperCase() + nivel.slice(1) : '—'
                    });

                    const estadoBadge = (ev, completo) => ev
                        ? (completo
                            ? `<span class="badge badge-success"><i class="fas fa-check"></i> ${new Date(ev.fecha).toLocaleDateString('es-PE')}</span>`
                            : `<span class="badge badge-info"><i class="fas fa-pen"></i> Borrador</span>`)
                        : `<span class="badge badge-warning"><i class="fas fa-clock"></i> Pendiente</span>`;

                    return `<tr>
                        <td>${persona.nombre_completo}</td>
                        <td>${this.labelRol(persona.rol)}</td>
                        <td>${estadoBadge(ev1, ev1Completo)} ${ev1Completo ? `<button class="btn btn-secondary btn-sm" onclick="App.verReporteFormulario1('${ev1.id}')"><i class="fas fa-eye"></i></button>` : ''}</td>
                        <td>${estadoBadge(ev2, ev2Completo)} ${ev2Completo ? `<button class="btn btn-secondary btn-sm" onclick="App.verReporteFormulario2('${ev2.id}')"><i class="fas fa-eye"></i></button>` : ''}</td>
                        <td>${this.nivelBadge(nivel)}</td>
                    </tr>`;
                }).join('');

                equipoDirectivoHtml = `<div class="card" style="margin-top:16px;">
                    <div class="card-header">
                        <span class="card-title"><i class="fas fa-user-tie"></i> Equipo directivo</span>
                        <span class="card-subtitle">Subdirección y Coordinadores, evaluados por Dirección</span>
                    </div>
                    <div class="table-container"><table><thead><tr><th>Nombre</th><th>Cargo</th><th>Formulario 1</th><th>Formulario 2</th><th>Nivel</th></tr></thead><tbody>${filasEquipo}</tbody></table></div>
                </div>`;
            }
        }

        gruposAMostrar.forEach(rolCoord => {
            const coordinador = this.personal.find(p => p.rol === rolCoord);
            const codigos = (this.config.coordination_areas || {})[rolCoord] || [];
            const docentes = this.personal.filter(p => p.rol === 'docente' && codigos.includes(p.area_codigo));
            if (!docentes.length) return;

            const filasGrupo = docentes.map(d => {
                totalDocentes++;
                const ev1 = coordinador ? this.yaEvaluadoFormulario1(coordinador.dni, d.dni) : null;
                const ev2 = coordinador ? this.yaEvaluadoFormulario2(coordinador.dni, d.dni) : null;
                const ev1Completo = this.esRegistroCompletado(ev1);
                const ev2Completo = this.esRegistroCompletado(ev2);
                let nivel = null;
                if (ev1Completo) totalF1++;
                if (ev2Completo) {
                    totalF2++;
                    const c = this.contarEstadosFormulario2(ev2.grupos);
                    conteoTotal.inicio += c.inicio;
                    conteoTotal.proceso += c.proceso;
                    conteoTotal.logrado += c.logrado;
                    nivel = this.nivelPredominante(ev2.grupos);
                    if (nivel) personasPorNivel[nivel].push(d.nombre_completo);
                }

                this._supervisionFilas.push({
                    area: (this.config.area_labels || {})[rolCoord] || rolCoord,
                    docente: d.nombre_completo,
                    coordinador: coordinador ? coordinador.nombre_completo : 'Sin coordinador',
                    form1: ev1Completo ? new Date(ev1.fecha).toLocaleDateString('es-PE') : (ev1 ? 'Borrador' : 'Pendiente'),
                    form2: ev2Completo ? new Date(ev2.fecha).toLocaleDateString('es-PE') : (ev2 ? 'Borrador' : 'Pendiente'),
                    nivel: nivel ? nivel.charAt(0).toUpperCase() + nivel.slice(1) : '—'
                });

                const estadoBadge = (ev, completo) => ev
                    ? (completo
                        ? `<span class="badge badge-success"><i class="fas fa-check"></i> ${new Date(ev.fecha).toLocaleDateString('es-PE')}</span>`
                        : `<span class="badge badge-info"><i class="fas fa-pen"></i> Borrador</span>`)
                    : `<span class="badge badge-warning"><i class="fas fa-clock"></i> Pendiente</span>`;

                return `<tr>
                    <td>${d.nombre_completo}</td>
                    <td>${coordinador ? coordinador.nombre_completo : '<span class="text-muted">Sin coordinador</span>'}</td>
                    <td>${estadoBadge(ev1, ev1Completo)} ${ev1Completo ? `<button class="btn btn-secondary btn-sm" onclick="App.verReporteFormulario1('${ev1.id}')"><i class="fas fa-eye"></i></button>` : ''}</td>
                    <td>${estadoBadge(ev2, ev2Completo)} ${ev2Completo ? `<button class="btn btn-secondary btn-sm" onclick="App.verReporteFormulario2('${ev2.id}')"><i class="fas fa-eye"></i></button>` : ''}</td>
                    <td>${this.nivelBadge(nivel)}</td>
                </tr>`;
            }).join('');

            filasHtml += `<div class="card" style="margin-top:16px;">
                <div class="card-header">
                    <span class="card-title">${(this.config.area_labels || {})[rolCoord] || rolCoord}</span>
                    <span class="card-subtitle">${coordinador ? 'Coordina: ' + coordinador.nombre_completo : 'Sin coordinador asignado'}</span>
                </div>
                <div class="table-container"><table><thead><tr><th>Docente</th><th>Coordinador</th><th>Formulario 1</th><th>Formulario 2</th><th>Nivel</th></tr></thead><tbody>${filasGrupo}</tbody></table></div>
            </div>`;
        });

        const statsHtml = this.statCards([
            ['fa-chalkboard-user', totalDocentes, 'Docentes en la vista'],
            ['fa-pen-to-square', totalF1, 'Formulario 1 completados'],
            ['fa-clipboard-list', totalF2, 'Formulario 2 completados'],
            ['fa-hourglass-half', totalDocentes - totalF2, 'Pendientes Formulario 2'],
        ]);

        const nombresPorNivel = (lista) => lista.length
            ? `<div class="pendiente-chips" style="margin-top:6px;">${lista.map(n => `<span class="pendiente-chip">${n}</span>`).join('')}</div>`
            : `<p class="text-muted" style="margin-top:6px;font-size:0.8rem;">Nadie todavía.</p>`;

        const nivelesHtml = `
            <div class="card">
                <div class="card-header"><span class="card-title"><i class="fas fa-layer-group"></i> ¿Quién está en Inicio, Proceso o Logrado?</span>
                    <span class="card-subtitle">Según el Formulario 2 completado por cada coordinador</span></div>
                <div class="grid-3" style="margin-bottom:6px;">
                    <div class="stat-card alt"><div class="stat-number" style="color:#E0A82E;">${personasPorNivel.inicio.length}</div><div class="stat-label">Docentes en Inicio</div></div>
                    <div class="stat-card alt"><div class="stat-number" style="color:#3E8ED0;">${personasPorNivel.proceso.length}</div><div class="stat-label">Docentes en Proceso</div></div>
                    <div class="stat-card alt"><div class="stat-number" style="color:#2FA84F;">${personasPorNivel.logrado.length}</div><div class="stat-label">Docentes en Logrado</div></div>
                </div>
                <div class="grid-3">
                    <div><strong style="color:#E0A82E;">Inicio</strong>${nombresPorNivel(personasPorNivel.inicio)}</div>
                    <div><strong style="color:#3E8ED0;">Proceso</strong>${nombresPorNivel(personasPorNivel.proceso)}</div>
                    <div><strong style="color:#2FA84F;">Logrado</strong>${nombresPorNivel(personasPorNivel.logrado)}</div>
                </div>
                <p class="text-muted" style="font-size:0.72rem;margin-top:10px;">Conteo de ítems (no de personas) de todo lo evaluado: ${conteoTotal.inicio} en Inicio, ${conteoTotal.proceso} en Proceso, ${conteoTotal.logrado} en Logrado.</p>
            </div>`;

        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-magnifying-glass-chart"></i> Supervisión de evaluaciones por coordinador</span>
                    <button class="btn btn-primary btn-sm" onclick="App.verReportePDFSupervision()"><i class="fas fa-file-pdf"></i> Descargar PDF</button>
                </div>
                <p class="text-muted" style="margin-bottom:12px;">Aquí puedes verificar qué coordinador evaluó a cada docente, ver sus resultados (Formulario 1 y 2), quién falta por evaluar y en qué nivel está cada quien, filtrando por área.</p>
                <div class="filtro-bar">${chips}</div>
                ${statsHtml}
            </div>
            ${nivelesHtml}
            ${equipoDirectivoHtml}
            ${filasHtml || '<div class="empty-state"><i class="fas fa-filter-circle-xmark"></i><p>No hay docentes en esta área.</p></div>'}
        `;
    },

    // Genera un documento imprimible con el mismo detalle de la pantalla de
    // Supervisión (por área, coordinador, estado de Formulario 1/2 y nivel
    // predominante) y lo abre en el modal de reporte para poder descargarlo en PDF.
    verReportePDFSupervision() {
        const logo = this.logoInstitucional || DEFAULT_LOGO;
        const filas = this._supervisionFilas || [];
        const estado = this._supervisionArea || 'todos';
        const areaLabel = estado === 'todos' ? 'Todas las áreas' : ((this.config.area_labels || {})[estado] || estado);

        const conteoNivel = { Inicio: 0, Proceso: 0, Logrado: 0 };
        filas.forEach(f => { if (conteoNivel[f.nivel] !== undefined) conteoNivel[f.nivel]++; });

        const filasHtml = filas.map(f => `
            <tr>
                <td>${f.docente}</td>
                <td>${f.area}</td>
                <td>${f.coordinador}</td>
                <td style="text-align:center;">${f.form1}</td>
                <td style="text-align:center;">${f.form2}</td>
                <td style="text-align:center;">${f.nivel}</td>
            </tr>`).join('');

        document.getElementById('report-body').innerHTML = `
            <div class="reporte-doc">
                <div class="reporte-header">
                    <img src="${logo}" alt="Logo">
                    <div><h2>${this.config.nombre_institucion || ''}</h2><p>Supervisión de evaluaciones · ${areaLabel}</p></div>
                </div>
                <div class="reporte-meta">
                    <div><span class="label">Emitido por</span>${this.currentUser.nombre_completo}</div>
                    <div><span class="label">Rol</span>${this.labelRol(this.currentUser.rol)}</div>
                    <div><span class="label">Fecha de emisión</span>${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                    <div><span class="label">Docentes en la vista</span>${filas.length}</div>
                </div>
                <div class="reporte-mini-stats" style="margin-bottom:16px;">
                    <div class="mini-stat" style="--c:#E0A82E;"><span class="mini-stat-num">${conteoNivel.Inicio}</span><span class="mini-stat-label">Inicio</span></div>
                    <div class="mini-stat" style="--c:#3E8ED0;"><span class="mini-stat-num">${conteoNivel.Proceso}</span><span class="mini-stat-label">Proceso</span></div>
                    <div class="mini-stat" style="--c:#2FA84F;"><span class="mini-stat-num">${conteoNivel.Logrado}</span><span class="mini-stat-label">Logrado</span></div>
                </div>
                <div class="table-container"><table><thead><tr><th style="width:24%;">Docente</th><th style="width:18%;">Área</th><th style="width:20%;">Coordinador</th><th style="width:13%;text-align:center;">Formulario 1</th><th style="width:13%;text-align:center;">Formulario 2</th><th style="width:12%;text-align:center;">Nivel</th></tr></thead><tbody>${filasHtml || '<tr><td colspan="6" class="text-muted" style="text-align:center;padding:20px;">Sin docentes en esta vista.</td></tr>'}</tbody></table></div>
            </div>`;
        this.currentReportType = 'supervision';
        this.openModal('report-modal');
    },

    // ------------------------------------------------------------------
    // DIRECTORIO (Dirección)
    // ------------------------------------------------------------------
    // Formatea la última conexión con fecha Y hora (a diferencia de los reportes
    // en PDF, que solo muestran fecha para que se vean más limpios).
    formatoUltimaConexion(dni) {
        const iso = (this.ultimasConexiones || {})[dni];
        if (!iso) return null;
        const f = new Date(iso);
        return f.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
            + ', ' + f.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    },

    renderDirectorio() {
        const container = document.getElementById('tab-content');
        const base = this.personal.filter(p => p.dni !== this.currentUser.dni);
        const estado = this.estadoFiltro('directorio');
        let lista = this.aplicarFiltro('directorio', base);
        const busqueda = (this._directorioBusqueda || '').trim().toUpperCase();
        if (busqueda) {
            lista = lista.filter(p =>
                this.normalizeText(p.nombre_completo).includes(busqueda) ||
                this.normalizeText(p.cargo || '').includes(busqueda) ||
                this.normalizeText(p.area || '').includes(busqueda));
        }
        const filtroHtml = this.renderFiltroBarra('directorio', base);
        const rows = lista.map(p => {
            const puedeEntrar = this.puedeIniciarSesion(p.rol);
            const conexion = puedeEntrar ? this.formatoUltimaConexion(p.dni) : null;
            let lineaConexion = '';
            if (puedeEntrar) {
                lineaConexion = conexion
                    ? `<p style="font-size:0.76rem;color:var(--text-tertiary);"><i class="fas fa-clock-rotate-left"></i> Última conexión: ${conexion}</p>`
                    : `<p style="font-size:0.76rem;color:var(--text-tertiary);"><i class="fas fa-clock-rotate-left"></i> Aún no ha ingresado (en este dispositivo)</p>`;
            }
            return `<div class="persona-card">
                <img class="persona-avatar-sm" src="${this.fotoDe(p)}" alt="">
                <div class="persona-info">
                    <h4>${p.nombre_completo}</h4>
                    <p>${p.cargo || ''}${p.area ? ' · ' + p.area : ''} · ${this.labelRol(p.rol)}</p>
                    ${lineaConexion}
                </div>
                ${this.estaActivo(p) ? '<span class="badge badge-success">Activo</span>' : '<span class="badge badge-danger">Inactivo</span>'}
            </div>`;
        }).join('') || `<div class="empty-state"><i class="fas fa-filter-circle-xmark"></i><p>No hay personas que coincidan con la búsqueda o el filtro.</p></div>`;
        container.innerHTML = `<div class="card"><div class="card-header">
                <span class="card-title"><i class="fas fa-address-book"></i> Directorio institucional</span>
                <span class="card-subtitle">${lista.length} de ${base.length} registros</span>
            </div>
            <p class="text-muted" style="font-size:0.78rem;margin:-4px 0 14px;"><i class="fas fa-circle-info"></i> La "última conexión" se registra en el navegador/computadora donde cada persona inicia sesión. Si todos usan la misma computadora, este registro es confiable; si cada uno usa su propio dispositivo, aquí solo verás los ingresos hechos desde este mismo equipo.</p>
            ${filtroHtml}
            <div class="form-group" style="margin-bottom:16px;">
                <input type="text" class="form-control" id="directorio-search" placeholder="Buscar por nombre, cargo o área..." value="${this._directorioBusqueda || ''}">
            </div>
            ${rows}</div>`;
        const searchInput = document.getElementById('directorio-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this._directorioBusqueda = e.target.value;
                this.renderDirectorio();
                // mantener el foco y el cursor tras re-renderizar
                const s = document.getElementById('directorio-search');
                if (s) { s.focus(); s.selectionStart = s.selectionEnd = s.value.length; }
            });
        }
    },

    // ------------------------------------------------------------------
    // SOPORTE TÉCNICO — Cuentas
    // ------------------------------------------------------------------
    renderSoporteCuentas() {
        const conLogin = this.personal.filter(p => this.puedeIniciarSesion(p.rol));
        const rows = conLogin.map(p => {
            const activo = this.estaActivo(p);
            const finalizadasF1 = this.evaluacionesFormulario1.filter(e => e.evaluadorDni === p.dni && this.esRegistroCompletado(e));
            const finalizadasF2 = this.evaluacionesFormulario2.filter(e => e.evaluadorDni === p.dni && this.esRegistroCompletado(e));
            const totalFinalizadas = finalizadasF1.length + finalizadasF2.length;
            const reabrirId = `reabrir-${p.dni}`;
            const listaReabrir = totalFinalizadas ? `
                <div id="${reabrirId}" class="reabrir-panel" style="display:none;">
                    <p class="text-muted" style="margin:10px 0 8px;font-size:0.8rem;">Si a <strong>${p.nombre_completo}</strong> se le olvidó marcar algo, puedes reabrir una evaluación finalizada para que la edite de nuevo:</p>
                    ${finalizadasF1.map(e => `<div class="reabrir-item"><span>Formulario 1 · ${e.evaluadoNombre}</span><button class="btn btn-secondary btn-sm" onclick="App.reabrirEvaluacion('form1','${e.id}')"><i class="fas fa-lock-open"></i> Reabrir</button></div>`).join('')}
                    ${finalizadasF2.map(e => `<div class="reabrir-item"><span>Formulario 2 · ${e.evaluadoNombre}</span><button class="btn btn-secondary btn-sm" onclick="App.reabrirEvaluacion('form2','${e.id}')"><i class="fas fa-lock-open"></i> Reabrir</button></div>`).join('')}
                </div>` : '';
            return `<div class="persona-card" style="flex-wrap:wrap;">
                <img class="persona-avatar-sm" src="${this.fotoDe(p)}" alt="">
                <div class="persona-info">
                    <h4>${p.nombre_completo}</h4>
                    <p>DNI de acceso: <strong>${p.rol === 'soporte' ? '(usuario fijo)' : p.dni}</strong> · ${this.labelRol(p.rol)}</p>
                </div>
                ${activo ? '<span class="badge badge-success">Activa</span>' : '<span class="badge badge-danger">Desactivada</span>'}
                <div class="persona-actions">
                    ${p.rol !== 'soporte' ? `<button class="btn btn-secondary btn-sm" onclick="App.restablecerContrasena('${p.dni}')"><i class="fas fa-key"></i> Reset</button>
                    <button class="btn ${activo ? 'btn-danger' : 'btn-success'} btn-sm" onclick="App.toggleCuenta('${p.dni}')"><i class="fas fa-power-off"></i> ${activo ? 'Desactivar' : 'Activar'}</button>
                    ${totalFinalizadas ? `<button class="btn btn-secondary btn-sm" onclick="document.getElementById('${reabrirId}').style.display = document.getElementById('${reabrirId}').style.display === 'none' ? 'block' : 'none';"><i class="fas fa-lock-open"></i> Reabrir evaluaciones (${totalFinalizadas})</button>` : ''}` : '<span class="badge badge-neutral">Fija</span>'}
                </div>
                ${listaReabrir}
            </div>`;
        }).join('');
        document.getElementById('tab-content').innerHTML = `<div class="card"><div class="card-header"><span class="card-title"><i class="fas fa-users-gear"></i> Cuentas del sistema</span><span class="card-subtitle">${conLogin.length} cuentas</span></div>
            <p class="text-muted" style="margin-bottom:16px;">Si a un coordinador, subdirectora o directora se le olvidó marcar algo en una evaluación ya finalizada, usa "Reabrir evaluaciones" para desbloquearla y que pueda corregirla.</p>
            ${rows}</div>`;
    },

    reabrirEvaluacion(tipo, evalId) {
        const lista = tipo === 'form1' ? this.evaluacionesFormulario1 : this.evaluacionesFormulario2;
        const key = tipo === 'form1' ? 'sgi_evaluaciones_formulario1' : 'sgi_evaluaciones_formulario2';
        const registro = lista.find(e => e.id === evalId);
        if (!registro) return;
        if (!confirm(`¿Reabrir la evaluación de ${registro.evaluadoNombre} para que ${registro.evaluadorNombre} pueda editarla? Volverá a estado "borrador" hasta que se finalice de nuevo.`)) return;
        registro.estadoRegistro = 'borrador';
        this.storageSet(key, lista);
        this.showToast('Evaluación reabierta para edición', 'success');
        this.renderSoporteCuentas();
    },

    restablecerContrasena(dni) {
        const persona = this.personal.find(p => p.dni === dni);
        if (!confirm(`¿Restablecer la contraseña de ${persona.nombre_completo} a su DNI (${persona.dni})?`)) return;
        this.cuentas[dni] = { ...(this.cuentas[dni] || {}), contrasena: persona.dni };
        this.storageSet('sgi_cuentas', this.cuentas);
        this.showToast('Contraseña restablecida al DNI', 'success');
    },

    toggleCuenta(dni) {
        const persona = this.personal.find(p => p.dni === dni);
        const activo = this.estaActivo(persona);
        this.cuentas[dni] = { ...(this.cuentas[dni] || {}), activo: !activo };
        this.storageSet('sgi_cuentas', this.cuentas);
        this.renderSoporteCuentas();
        this.showToast(activo ? 'Cuenta desactivada' : 'Cuenta activada', 'success');
    },

    // ------------------------------------------------------------------
    // SOPORTE TÉCNICO — Formularios (Word / Excel)
    // ------------------------------------------------------------------
    renderSoporteFormularios() {
        const areas = Object.keys(this.config.coordination_areas || {});
        const extra = ['direccion', 'subdireccion'];
        const destinos = [...areas, ...extra];
        const rows = destinos.map(rol => {
          const p = this.plantillas[rol];
          return `<div class="persona-card">
              <div class="persona-info">
                  <h4>${this.labelRol(rol)}</h4>
                  <p>${p ? `${p.nombreArchivo} · ${p.criterios.length} criterios · subido ${new Date(p.fecha).toLocaleDateString('es-PE')}` : 'Sin formulario personalizado (usa el predeterminado)'}</p>
              </div>
              ${p ? `<button class="btn btn-danger btn-sm" onclick="App.eliminarPlantilla('${rol}')"><i class="fas fa-trash"></i></button>` : ''}
          </div>`;
        }).join('');

        document.getElementById('tab-content').innerHTML = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title"><i class="fas fa-file-arrow-up"></i> Formularios de evaluación por área</span>
                    <button class="btn btn-primary btn-sm" onclick="App.abrirModalPlantilla()"><i class="fas fa-plus"></i> Subir formulario</button>
                </div>
                <p class="text-muted" style="margin-bottom:16px;">El sistema lee archivos Word (.docx) o Excel (.xlsx/.csv). Cada línea o fila del archivo se convierte en un criterio de evaluación exclusivo del área seleccionada.</p>
                ${rows}
            </div>`;
    },

    eliminarPlantilla(rol) {
        if (!confirm('¿Eliminar este formulario? Se usará el formulario predeterminado.')) return;
        delete this.plantillas[rol];
        this.storageSet('sgi_plantillas', this.plantillas);
        this.renderSoporteFormularios();
    },

    abrirModalPlantilla() {
        const sel = document.getElementById('template-area');
        const areas = Object.keys(this.config.coordination_areas || {});
        const extra = ['direccion', 'subdireccion'];
        sel.innerHTML = [...areas, ...extra].map(r => `<option value="${r}">${this.labelRol(r)}</option>`).join('');
        document.getElementById('template-form').reset();
        document.getElementById('template-file-chip').innerHTML = '';
        document.getElementById('template-preview').innerHTML = '';
        document.getElementById('template-submit-btn').disabled = true;
        this.currentTemplateParsed = null;
        this.openModal('template-modal');
    },

    async procesarArchivoPlantilla(file) {
        const chip = document.getElementById('template-file-chip');
        chip.innerHTML = `<div class="file-chip"><i class="fas fa-file"></i> ${file.name}</div>`;
        const ext = file.name.split('.').pop().toLowerCase();
        let criterios = [];

        try {
            if (ext === 'docx') {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                criterios = result.value.split('\n')
                    .map(l => l.replace(/^[\s\-•\d.\)]+/, '').trim())
                    .filter(l => l.length > 2);
            } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
                const arrayBuffer = await file.arrayBuffer();
                const wb = XLSX.read(arrayBuffer, { type: 'array' });
                const sheet = wb.Sheets[wb.SheetNames[0]];
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                rows.forEach(r => {
                    const nombre = (r[0] || '').toString().trim();
                    if (!nombre || /^criterio/i.test(nombre)) return;
                    const max = Number(r[1]) || null;
                    criterios.push(max ? { nombre, max } : nombre);
                });
            } else {
                throw new Error('Formato no soportado');
            }
        } catch (err) {
            document.getElementById('template-preview').innerHTML = `<div class="alert alert-danger"><i class="fas fa-triangle-exclamation"></i> No se pudo leer el archivo: ${err.message}</div>`;
            return;
        }

        criterios = criterios.slice(0, 15).map(c => typeof c === 'string' ? { nombre: c, max: 20 } : c);

        if (!criterios.length) {
            document.getElementById('template-preview').innerHTML = `<div class="alert alert-warning"><i class="fas fa-triangle-exclamation"></i> No se detectaron criterios en el archivo.</div>`;
            document.getElementById('template-submit-btn').disabled = true;
            return;
        }

        this.currentTemplateParsed = { nombreArchivo: file.name, criterios };
        document.getElementById('template-preview').innerHTML = `
            <div class="alert alert-success"><i class="fas fa-circle-check"></i> Se detectaron ${criterios.length} criterio(s):</div>
            <ul style="margin-left:18px;font-size:0.85rem;color:var(--text-secondary);">${criterios.map(c => `<li>${c.nombre}</li>`).join('')}</ul>`;
        document.getElementById('template-submit-btn').disabled = false;
    },

    guardarPlantilla() {
        const rol = document.getElementById('template-area').value;
        if (!this.currentTemplateParsed) return;
        this.plantillas[rol] = { ...this.currentTemplateParsed, fecha: new Date().toISOString(), subidoPor: this.currentUser.nombre_completo };
        this.storageSet('sgi_plantillas', this.plantillas);
        this.closeModal('template-modal');
        this.showToast('Formulario asignado a ' + this.labelRol(rol), 'success');
        this.renderSoporteFormularios();
    },

    // ------------------------------------------------------------------
    // SOPORTE TÉCNICO — Configuración institucional
    // ------------------------------------------------------------------
    renderSoporteConfig() {
        document.getElementById('tab-content').innerHTML = `
            <div class="card">
                <div class="card-header"><span class="card-title"><i class="fas fa-building"></i> Datos de la institución</span></div>
                <div class="form-group"><label>Nombre de la institución</label><input class="form-control" id="cfg-nombre" value="${this.config.nombre_institucion || ''}"></div>
                <div class="form-group"><label>Año escolar</label><input class="form-control" id="cfg-anio" value="${this.config.anio || ''}"></div>
                <div class="form-group"><label>Código modular</label><input class="form-control" id="cfg-codigo" value="${this.config.codigo_modular || ''}"></div>
                <div class="form-group"><label>Código local</label><input class="form-control" id="cfg-local" value="${this.config.codigo_local || ''}"></div>
                <div class="form-group"><label>Cambiar logo institucional</label><input type="file" id="cfg-logo" class="form-control" accept="image/*"></div>
                <p class="text-muted" style="font-size:0.8rem;margin-top:-10px;margin-bottom:16px;"><i class="fas fa-circle-info"></i> Tip: también puedes colocar la imagen de la insignia directamente en la carpeta <code>assets/images/insignia/</code> con el nombre <code>foto1</code> (por ejemplo <code>foto1.png</code>) y el sistema la detectará solo la próxima vez que se abra, sin tener que subirla aquí.</p>
                <button class="btn btn-primary" onclick="App.guardarConfigInstitucion()"><i class="fas fa-save"></i> Guardar cambios</button>
            </div>`;
    },

    guardarConfigInstitucion() {
        const nombre = document.getElementById('cfg-nombre').value.trim();
        const anio = document.getElementById('cfg-anio').value.trim();
        const codigo = document.getElementById('cfg-codigo').value.trim();
        const local = document.getElementById('cfg-local').value.trim();
        
        if (nombre) {
            this.config.nombre_institucion = nombre;
            document.getElementById('institution-name').textContent = nombre;
            document.getElementById('login-institution-name').textContent = nombre;
        }
        if (anio) {
            this.config.anio = anio;
            document.getElementById('header-anio').textContent = anio;
        }
        if (codigo) this.config.codigo_modular = codigo;
        if (local) this.config.codigo_local = local;
        
        this.storageSet('sgi_config_overrides', { nombre_institucion: nombre, anio, codigo_modular: codigo, codigo_local: local });
        
        const file = document.getElementById('cfg-logo').files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.logoInstitucional = e.target.result;
                this.storageSet('sgi_logo', this.logoInstitucional);
                this.storageSet('sgi_logo_origen', 'manual');
                document.getElementById('institution-logo').src = this.logoInstitucional;
                document.getElementById('login-logo-img').src = this.logoInstitucional;
                this.showToast('Datos institucionales actualizados', 'success');
            };
            reader.readAsDataURL(file);
        } else {
            this.showToast('Datos institucionales actualizados', 'success');
        }
    },
    
    // ------------------------------------------------------------------
    // SOPORTE TÉCNICO — Sistema y mantenimiento
    // ------------------------------------------------------------------
    renderSoporteSistema() {
        const totalEvaluaciones = this.evaluacionesFormulario1.length + this.evaluacionesFormulario2.length;
        const storageUsed = JSON.stringify({
            evaluacionesFormulario1: this.evaluacionesFormulario1,
            evaluacionesFormulario2: this.evaluacionesFormulario2,
            plantillas: this.plantillas,
            fotos: this.fotos,
            cuentas: this.cuentas
        }).length;
        const storageKB = Math.round(storageUsed / 1024);
        
        // Calcular estadísticas detalladas
        const evaluadoresForm1 = new Set(this.evaluacionesFormulario1.map(e => e.evaluadorDni)).size;
        const evaluadoresForm2 = new Set(this.evaluacionesFormulario2.map(e => e.evaluadorDni)).size;
        const totalFotos = Object.keys(this.fotos).length;
        const totalCuentasModificadas = Object.keys(this.cuentas).length;
        
        document.getElementById('tab-content').innerHTML = `
            <div class="card">
                <div class="card-header"><span class="card-title"><i class="fas fa-gears"></i> Mantenimiento del Sistema</span></div>
                <div class="grid-3">
                    <div class="stat-card alt"><div class="stat-number">${totalEvaluaciones}</div><div class="stat-label">Evaluaciones totales</div></div>
                    <div class="stat-card alt"><div class="stat-number">${storageKB}</div><div class="stat-label">KB usados</div></div>
                    <div class="stat-card alt"><div class="stat-number">${Object.keys(this.plantillas).length}</div><div class="stat-label">Formularios personalizados</div></div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><span class="card-title"><i class="fas fa-chart-pie"></i> Estadísticas Detalladas</span></div>
                <div class="grid-2">
                    <div class="stat-card alt"><div class="stat-number">${this.evaluacionesFormulario1.length}</div><div class="stat-label">Formulario 1 completados</div></div>
                    <div class="stat-card alt"><div class="stat-number">${this.evaluacionesFormulario2.length}</div><div class="stat-label">Formulario 2 completados</div></div>
                    <div class="stat-card alt"><div class="stat-number">${evaluadoresForm1}</div><div class="stat-label">Evaluadores Form1</div></div>
                    <div class="stat-card alt"><div class="stat-number">${evaluadoresForm2}</div><div class="stat-label">Evaluadores Form2</div></div>
                    <div class="stat-card alt"><div class="stat-number">${totalFotos}</div><div class="stat-label">Fotos de perfil</div></div>
                    <div class="stat-card alt"><div class="stat-number">${totalCuentasModificadas}</div><div class="stat-label">Cuentas modificadas</div></div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><span class="card-title"><i class="fas fa-database"></i> Gestión de Datos</span></div>
                <p class="text-muted" style="margin-bottom:16px;">Realiza copias de seguridad, limpia datos o restaura el sistema completo.</p>
                
                <div style="margin-bottom:20px;">
                    <h4 style="margin-bottom:12px;color:var(--text);font-weight:600;"><i class="fas fa-download"></i> Copias de Seguridad</h4>
                    <div class="flex gap-8">
                        <button class="btn btn-primary" onclick="App.exportarDatos()"><i class="fas fa-download"></i> Exportar datos completos</button>
                        <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()"><i class="fas fa-upload"></i> Importar respaldo</button>
                        <input type="file" id="import-file" accept=".json" style="display:none;" onchange="App.importarDatos(this.files[0])">
                    </div>
                </div>
                
                <div style="margin-bottom:20px;">
                    <h4 style="margin-bottom:12px;color:var(--text);font-weight:600;"><i class="fas fa-eraser"></i> Limpieza de Datos</h4>
                    <div class="flex gap-8">
                        <button class="btn btn-warning" onclick="App.limpiarEvaluaciones()"><i class="fas fa-trash"></i> Limpiar evaluaciones</button>
                        <button class="btn btn-danger" onclick="App.limpiarTodo()"><i class="fas fa-bomb"></i> Eliminar TODO</button>
                    </div>
                </div>
                
                <div>
                    <h4 style="margin-bottom:12px;color:var(--text);font-weight:600;"><i class="fas fa-sync"></i> Restauración</h4>
                    <div class="flex gap-8">
                        <button class="btn btn-secondary" onclick="App.restaurarDefault()"><i class="fas fa-undo"></i> Restaurar valores por defecto</button>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header"><span class="card-title"><i class="fas fa-info-circle"></i> Información del Sistema</span></div>
                <div class="table-container">
                    <table>
                        <tbody>
                            <tr><td>Versión</td><td>2.1 - Enhanced PDF & Data Management</td></tr>
                            <tr><td>Personal registrado</td><td>${this.personal.length} personas</td></tr>
                            <tr><td>Usuarios activos</td><td>${this.personal.filter(p => this.estaActivo(p)).length}</td></tr>
                            <tr><td>Coordinadores</td><td>${this.personal.filter(p => this.esCoordinador(p.rol)).length}</td></tr>
                            <tr><td>Docentes</td><td>${this.personal.filter(p => p.rol === 'docente').length}</td></tr>
                            <tr><td>Personal administrativo</td><td>${this.personal.filter(p => p.rol === 'administrativo').length}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },
    
    exportarDatos() {
        const datos = {
            version: '2.1',
            fechaExportacion: new Date().toISOString(),
            fechaExportacionLegible: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            institucion: this.config.nombre_institucion || 'Sistema Institucional',
            evaluacionesFormulario1: this.evaluacionesFormulario1,
            evaluacionesFormulario2: this.evaluacionesFormulario2,
            plantillas: this.plantillas,
            fotos: this.fotos,
            cuentas: this.cuentas,
            configOverrides: this.storageGet('sgi_config_overrides', {}),
            logoInstitucional: this.logoInstitucional
        };
        const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const nombreInstitucion = (this.config.nombre_institucion || 'sistema').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '_');
        a.download = `backup_${nombreInstitucion}_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Respaldo completo exportado correctamente', 'success');
    },
    
    importarDatos(file) {
        if (!file) return;
        
        // Verificar que sea un archivo JSON
        if (!file.name.endsWith('.json')) {
            this.showToast('Error: El archivo debe ser .json', 'danger');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const datos = JSON.parse(e.target.result);
                
                // Verificar que el archivo tenga la estructura correcta
                if (!datos.version) {
                    throw new Error('El archivo no parece ser un respaldo válido del sistema');
                }
                
                // Confirmar importación
                const fecha = datos.fechaExportacionLegible || datos.fechaExportacion || 'desconocida';
                if (!confirm(`¿Restaurar respaldo del ${fecha}?\n\nEsto reemplazará los datos actuales.\n\nVersiones en el respaldo:\n- Formulario 1: ${datos.evaluacionesFormulario1?.length || 0} evaluaciones\n- Formulario 2: ${datos.evaluacionesFormulario2?.length || 0} evaluaciones\n- Formularios personalizados: ${Object.keys(datos.plantillas || {}).length}`)) {
                    return;
                }
                
                // Importar datos
                if (datos.evaluacionesFormulario1) {
                    this.evaluacionesFormulario1 = datos.evaluacionesFormulario1;
                    this.storageSet('sgi_evaluaciones_formulario1', this.evaluacionesFormulario1);
                }
                if (datos.evaluacionesFormulario2) {
                    this.evaluacionesFormulario2 = datos.evaluacionesFormulario2;
                    this.storageSet('sgi_evaluaciones_formulario2', this.evaluacionesFormulario2);
                }
                if (datos.plantillas) {
                    this.plantillas = datos.plantillas;
                    this.storageSet('sgi_plantillas', this.plantillas);
                }
                if (datos.fotos) {
                    this.fotos = datos.fotos;
                    this.storageSet('sgi_fotos', this.fotos);
                }
                if (datos.cuentas) {
                    this.cuentas = datos.cuentas;
                    this.storageSet('sgi_cuentas', this.cuentas);
                }
                if (datos.configOverrides) {
                    this.storageSet('sgi_config_overrides', datos.configOverrides);
                }
                if (datos.logoInstitucional) {
                    this.logoInstitucional = datos.logoInstitucional;
                    this.storageSet('sgi_logo', this.logoInstitucional);
                    this.storageSet('sgi_logo_origen', 'manual');
                    document.getElementById('institution-logo').src = this.logoInstitucional;
                    document.getElementById('login-logo-img').src = this.logoInstitucional;
                }
                
                this.showToast('Respaldo restaurado correctamente', 'success');
                this.renderSoporteSistema();
                
                // Recargar la página para aplicar todos los cambios
                setTimeout(() => {
                    if (confirm('¿Desea recargar la página para aplicar todos los cambios?')) {
                        location.reload();
                    }
                }, 1000);
                
            } catch (err) {
                console.error('Error al importar:', err);
                this.showToast('Error al importar datos: ' + err.message, 'danger');
            }
        };
        reader.readAsText(file);
    },
    
    limpiarEvaluaciones() {
        if (!confirm('¿Estás seguro de eliminar todas las evaluaciones? Esta acción no se puede deshacer.')) return;
        this.evaluacionesFormulario1 = [];
        this.evaluacionesFormulario2 = [];
        this.storageSet('sgi_evaluaciones_formulario1', []);
        this.storageSet('sgi_evaluaciones_formulario2', []);
        this.showToast('Evaluaciones eliminadas', 'success');
        this.renderSoporteSistema();
    },
    
    limpiarTodo() {
        if (!confirm('⚠️ ADVERTENCIA: Esto eliminará TODOS los datos del sistema incluyendo evaluaciones, formularios personalizados, fotos, configuraciones y cuentas.\n\n¿Estás ABSOLUTAMENTE seguro? Esta acción no se puede deshacer.')) return;
        
        // Segunda confirmación
        if (!confirm('ÚLTIMA CONFIRMACIÓN: Se eliminará todo el contenido. ¿Continuar?')) return;
        
        // Limpiar todos los datos
        this.evaluacionesFormulario1 = [];
        this.evaluacionesFormulario2 = [];
        this.plantillas = {};
        this.fotos = {};
        this.cuentas = {};
        this.logoInstitucional = null;
        
        // Limpiar localStorage
        localStorage.removeItem('sgi_evaluaciones_formulario1');
        localStorage.removeItem('sgi_evaluaciones_formulario2');
        localStorage.removeItem('sgi_plantillas');
        localStorage.removeItem('sgi_fotos');
        localStorage.removeItem('sgi_cuentas');
        localStorage.removeItem('sgi_logo');
        localStorage.removeItem('sgi_logo_origen');
        localStorage.removeItem('sgi_config_overrides');
        
        // Restaurar logo por defecto
        document.getElementById('institution-logo').src = DEFAULT_LOGO;
        document.getElementById('login-logo-img').src = DEFAULT_LOGO;
        
        this.showToast('Sistema restaurado completamente', 'success');
        this.renderSoporteSistema();
    },
    
    restaurarDefault() {
        if (!confirm('¿Restaurar valores por defecto? Esto eliminará solo configuraciones personalizadas pero mantendrá las evaluaciones.')) return;
        
        // Restaurar configuraciones por defecto
        this.plantillas = {};
        this.fotos = {};
        this.cuentas = {};
        this.logoInstitucional = null;
        
        // Limpiar solo configuraciones
        localStorage.removeItem('sgi_plantillas');
        localStorage.removeItem('sgi_fotos');
        localStorage.removeItem('sgi_cuentas');
        localStorage.removeItem('sgi_logo');
        localStorage.removeItem('sgi_logo_origen');
        localStorage.removeItem('sgi_config_overrides');
        
        // Restaurar logo por defecto
        document.getElementById('institution-logo').src = DEFAULT_LOGO;
        document.getElementById('login-logo-img').src = DEFAULT_LOGO;
        
        this.showToast('Valores por defecto restaurados', 'success');
        this.renderSoporteSistema();
    },

    // ------------------------------------------------------------------
    // MODALES / UI GENERAL
    // ------------------------------------------------------------------
    openModal(id) { document.getElementById(id).classList.add('active'); },
    closeModal(id) { document.getElementById(id).classList.remove('active'); },

    showToast(msg, type) {
        const div = document.createElement('div');
        div.className = `alert alert-${type}`;
        div.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:3000;box-shadow:var(--sombra-lg);min-width:260px;';
        div.innerHTML = `<i class="fas fa-circle-check"></i> ${msg}`;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3200);
    },

    applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        document.getElementById('theme-toggle').innerHTML = `<i class="fas fa-${theme === 'dark' ? 'sun' : 'moon'}"></i>`;
        localStorage.setItem('sgi_theme', theme);
    },

    // ------------------------------------------------------------------
    // EVENTOS
    // ------------------------------------------------------------------
    bindGlobalEvents() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const res = this.loginPorDni(document.getElementById('login-dni').value);
            const errBox = document.getElementById('login-error');
            if (res !== true) { errBox.textContent = res; errBox.style.display = 'flex'; }
            else errBox.style.display = 'none';
        });

        const toggleSoporte = document.getElementById('toggle-soporte-login');
        if (toggleSoporte) {
            toggleSoporte.addEventListener('click', () => {
                const form = document.getElementById('soporte-login-form');
                const dniForm = document.getElementById('login-form');
                const showingSoporte = form.style.display !== 'none';
                form.style.display = showingSoporte ? 'none' : 'block';
                dniForm.style.display = showingSoporte ? 'block' : 'none';
                toggleSoporte.innerHTML = showingSoporte
                    ? '<i class="fas fa-user-gear"></i> Acceso Soporte Técnico'
                    : '<i class="fas fa-arrow-left"></i> Volver al acceso con DNI';
                document.getElementById('login-error').style.display = 'none';
            });
        }

        const soporteForm = document.getElementById('soporte-login-form');
        if (soporteForm) {
            soporteForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const res = this.login(document.getElementById('soporte-username').value, document.getElementById('soporte-password').value);
                const errBox = document.getElementById('login-error');
                if (res !== true) { errBox.textContent = res; errBox.style.display = 'flex'; }
                else errBox.style.display = 'none';
            });
        }

        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.applyTheme(document.body.classList.contains('dark-mode') ? 'light' : 'dark');
            if (this.currentTab) this.goTab(this.currentTab);
        });

        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal(btn.dataset.close));
        });
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
        });

        document.getElementById('change-password-btn').addEventListener('click', () => this.openModal('password-modal'));
        document.getElementById('change-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const actual = document.getElementById('current-password').value;
            const nueva = document.getElementById('new-password').value;
            const confirmar = document.getElementById('confirm-password').value;
            if (this.contrasenaDe(this.currentUser) !== actual) { this.showToast('La contraseña actual no es correcta', 'danger'); return; }
            if (nueva.length < 4) { this.showToast('La nueva contraseña es muy corta', 'danger'); return; }
            if (nueva !== confirmar) { this.showToast('Las contraseñas no coinciden', 'danger'); return; }
            this.cuentas[this.currentUser.dni] = { ...(this.cuentas[this.currentUser.dni] || {}), contrasena: nueva };
            this.storageSet('sgi_cuentas', this.cuentas);
            this.closeModal('password-modal');
            document.getElementById('change-password-form').reset();
            this.showToast('Contraseña actualizada', 'success');
        });

        document.getElementById('upload-photo-btn').addEventListener('click', () => this.openModal('photo-modal'));
        document.getElementById('photo-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('preview-image').src = ev.target.result;
                document.getElementById('photo-preview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
        document.getElementById('upload-photo-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const file = document.getElementById('photo-input').files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                this.fotos[this.currentUser.dni] = ev.target.result;
                this.storageSet('sgi_fotos', this.fotos);
                document.getElementById('user-avatar').src = ev.target.result;
                this.closeModal('photo-modal');
                this.showToast('Foto de perfil actualizada', 'success');
            };
            reader.readAsDataURL(file);
        });

        document.getElementById('evaluation-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarEvaluacion(e.target.dataset.dni);
        });

        document.getElementById('form1-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarFormulario1(e.target.dataset.dni, true);
        });
        document.getElementById('form1-guardar-borrador').addEventListener('click', () => {
            this.guardarFormulario1(document.getElementById('form1-form').dataset.dni, false);
        });

        document.getElementById('form2-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarFormulario2(e.target.dataset.dni, true);
        });
        document.getElementById('form2-guardar-borrador').addEventListener('click', () => {
            this.guardarFormulario2(document.getElementById('form2-form').dataset.dni, false);
        });

        document.getElementById('download-report-btn').addEventListener('click', () => this.descargarReportePDF());

        // Plantilla (dropzone)
        const dz = document.getElementById('template-dropzone');
        const input = document.getElementById('template-input');
        dz.addEventListener('click', () => input.click());
        dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dragover'); });
        dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
        dz.addEventListener('drop', (e) => {
            e.preventDefault(); dz.classList.remove('dragover');
            if (e.dataTransfer.files[0]) { input.files = e.dataTransfer.files; this.procesarArchivoPlantilla(e.dataTransfer.files[0]); }
        });
        input.addEventListener('change', () => { if (input.files[0]) this.procesarArchivoPlantilla(input.files[0]); });
        document.getElementById('template-form').addEventListener('submit', (e) => { e.preventDefault(); this.guardarPlantilla(); });
    },
};

document.addEventListener('DOMContentLoaded', () => App.init());
