# 🚀 SharkHub: Plataforma de Gestión Integral (Pitch Comercial)

> [!TIP]
> **Visión del Producto:** SharkHub no es solo un software de agendamiento; es una plataforma SaaS robusta, escalable y construida bajo los más altos estándares de la industria, diseñada para administrar la operativa completa de Barbería PANDA y expandible a múltiples sucursales (Multitenant).

Este documento presenta la propuesta de valor técnica y comercial del sistema, ideal para ser evaluado por un experto en desarrollo de software web.

---

## 1. Objetivo del Proyecto y Alcance

### Objetivo Principal
Desarrollar una solución integral, segura y altamente escalable para la gestión operativa, administrativa y comercial de barberías. El sistema optimiza la interacción entre clientes, barberos y administradores mediante una plataforma web de alto rendimiento.

### Alcances Clave
- **Gestión de Citas y Disponibilidad:** Agendamiento inteligente con control de disponibilidad de barberos, horarios (start/end time) y servicios.
- **Control de Inventario y Catálogo:** Administración de productos, stock, precios y servicios de la barbería.
- **Gestión de Roles y Usuarios:** Sistema de permisos jerárquicos (Clientes, Barberos, Administradores) con manejo de perfiles y avatares.
- **SaaS Multitenant:** Arquitectura preparada para administrar múltiples barberías (`barbershops`), control de miembros (`barbershop_members`) y acceso mediante códigos de invitación seguros.

---

## 2. Arquitectura Descentralizada y Desacoplada

El proyecto ha sido diseñado bajo el paradigma **API-First** y una **Arquitectura de Microservicios (Servidores Descentralizados)**. Esta separación total de responsabilidades garantiza mantenibilidad, escalabilidad independiente y máxima seguridad.

El ecosistema se divide en 3 servidores independientes:

### 🎨 1. Servidor Frontend (Capa de Presentación)
- **Responsabilidad:** Interfaz de usuario interactiva (SPA), consumo de servicios y experiencia de usuario (UX/UI).
- **Tecnología:** React 19, TypeScript, Vite, React Router, Framer Motion (para animaciones dinámicas).
- **Características:** Totalmente desacoplado. Solo se comunica a través de peticiones HTTP/REST protegidas por tokens.

### 🧠 2. Servidor API Business Rules (Capa Lógica)
- **Responsabilidad:** Actúa como un *Gateway* y procesador de lógica de negocio. Valida los *requests* del frontend, orquesta procesos complejos y gestiona la seguridad antes de solicitar datos.
- **Tecnología:** FastAPI (Python), Uvicorn, Pydantic, PyJWT.
- **Características:** No tiene conexión directa a la base de datos. Pide y envía información procesada al servidor de persistencia.

### 🗄️ 3. Servidor de Persistencia (Capa de Datos)
- **Responsabilidad:** Único servidor autorizado para interactuar directamente con la base de datos.
- **Tecnología:** FastAPI (Python) + **Prisma ORM** (Prisma Client Python) + PostgreSQL.
- **Características:** Aísla por completo la estructura de datos (`schema.prisma`) de internet y de la capa lógica. Convierte sentencias de bases de datos complejas en respuestas JSON limpias.

---

## 3. Seguridad de Grado Empresarial 🛡️

El sistema fue concebido con el concepto de **Seguridad por Diseño (Security by Design)**:

1. **Protocolo HTTPS y DNS:** Tráfico 100% cifrado con certificados SSL, enrutado mediante servidores web (Caddy / Nginx) bajo un dominio personalizado y gratuito.
2. **Autenticación Híbrida (Auth & OAuth 2.0):** 
   - Registro tradicional con contraseñas encriptadas (bcrypt / Passlib).
   - Integración nativa con **Google OAuth 2.0** (`@react-oauth/google`).
3. **JSON Web Tokens (JWT):** Manejo de sesiones sin estado (Stateless), garantizando que las APIs estén protegidas y requieran un token de autorización válido en cada petición.
4. **Protección de Datos (Supabase Auth):** La base de datos (PostgreSQL vía Supabase) implementa políticas de seguridad a nivel de filas (RLS - Row Level Security), tokens OTP y control de sesiones OAuth integrados directamente en el núcleo de la base de datos.

---

## 4. Stack Tecnológico Resumido

| Capa | Tecnologías Implementadas |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Bootstrap, Framer Motion, Lucide Icons |
| **Backend APIs** | Python 3, FastAPI, Uvicorn, Pydantic (Validación de Modelos) |
| **Base de Datos & ORM** | PostgreSQL, Prisma ORM (Python Client Async), Supabase |
| **DevOps & Infraestructura** | Docker & Docker Compose, Nginx / Caddyfile, Render (Cloud) |

> [!IMPORTANT]  
> **Ventaja Competitiva Técnica:** La inclusión de **Prisma ORM** en un entorno asíncrono con **FastAPI** permite un tipado estricto de extremo a extremo, previniendo errores en tiempo de compilación y evitando ataques de inyección SQL. La orquestación en contenedores **Docker** garantiza que el entorno de desarrollo y producción sean idénticos.

---

## 5. Conclusión para Inversores y Evaluadores

**SharkHub** representa un caso de estudio perfecto de cómo estructurar una aplicación moderna web. No es un monolito tradicional; es un ecosistema distribuido que demuestra dominio en:
- Microservicios y contenedores.
- Seguridad web avanzada (OAuth, JWT, HTTPS).
- Integración de Bases de Datos Gestionadas con ORMs de última generación.
- Interfaces dinámicas de alto rendimiento.

**Es un producto listo para escalar, monetizar y auditar bajo los estándares más exigentes de la industria del software.**
