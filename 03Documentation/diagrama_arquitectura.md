# 🏗️ Diagrama de Arquitectura de SharkHub

A continuación te presento el diagrama de la arquitectura del proyecto, modelado con **Mermaid** para mostrar cómo interactúan los 3 servidores descentralizados, el cliente y la base de datos externa.

Este diagrama ilustra el flujo de los datos y el desacoplamiento de las capas (Presentación, Reglas de Negocio, y Persistencia).

```mermaid
graph TD
    %% Estilos de Nodos
    classDef client fill:#3498db,stroke:#2980b9,stroke-width:2px,color:#fff;
    classDef frontend fill:#f39c12,stroke:#d35400,stroke-width:2px,color:#fff;
    classDef business fill:#9b59b6,stroke:#8e44ad,stroke-width:2px,color:#fff;
    classDef persistence fill:#2ecc71,stroke:#27ae60,stroke-width:2px,color:#fff;
    classDef database fill:#e74c3c,stroke:#c0392b,stroke-width:2px,color:#fff;
    classDef external fill:#95a5a6,stroke:#7f8c8d,stroke-width:2px,color:#fff;

    %% Nodos Principales
    User((Usuario Final)):::client
    Browser[Navegador Web / Cliente SPA]:::client
    GoogleOAuth[Google OAuth 2.0]:::external

    subgraph "Capa de Presentación (Frontend)"
        Proxy[Caddy / Nginx Reverse Proxy]:::frontend
        ViteReact[Servidor Frontend - React/Vite]:::frontend
    end

    subgraph "Capa Lógica (Backend API)"
        FastAPIBiz[API Business Rules - FastAPI]:::business
        JWTAuth[Validación JWT & Lógica]:::business
    end

    subgraph "Capa de Datos (Persistence API)"
        FastAPIPersist[API de Persistencia - FastAPI]:::persistence
        PrismaORM[Prisma Client Python]:::persistence
    end

    subgraph "Supabase Cloud"
        SupabaseAuth[Supabase Auth / RLS]:::database
        PostgreSQL[(Base de Datos PostgreSQL)]:::database
    end

    %% Relaciones y Flujos de Datos
    User -- Interactúa con UI --> Browser
    Browser -- "HTTP GET (Archivos Estáticos)" --> Proxy
    Proxy --> ViteReact
    
    Browser -- "Google Login (OIDC)" --> GoogleOAuth
    GoogleOAuth -. "Token OAuth" .-> Browser
    
    Browser -- "Peticiones HTTPS (con JWT)" --> FastAPIBiz
    FastAPIBiz -- Analiza y orquesta --> JWTAuth
    
    JWTAuth -- "Llamadas REST Internas" --> FastAPIPersist
    FastAPIPersist -- Usa Modelos DTO --> PrismaORM
    
    PrismaORM -- "Conexión TCP / Queries SQL" --> PostgreSQL
    SupabaseAuth -. "Protege datos" .- PostgreSQL

    %% Notas Adicionales
    class User,Browser,GoogleOAuth,Proxy,ViteReact,FastAPIBiz,JWTAuth,FastAPIPersist,PrismaORM,PostgreSQL,SupabaseAuth default
```

### Explicación del Flujo:
1. **Cliente / Frontend**: El usuario accede a la plataforma y el servidor Frontend (React) le entrega la interfaz. El login externo se procesa en el navegador a través de Google OAuth.
2. **Business Rules**: El frontend nunca toca la base de datos. Se comunica con el servidor `API_businessRules`, enviando su JWT. Este servidor valida la sesión, aplica reglas de negocio complejas y orquesta la petición.
3. **Persistencia**: Si la lógica es correcta, el servidor Business Rules hace una solicitud interna al servidor `persistence`. Este servidor usa `Prisma ORM` para ejecutar la acción en PostgreSQL de forma segura.
4. **Base de Datos**: Hospedada en Supabase (PostgreSQL), la cual proporciona capas extra de seguridad y control de sesiones nativo.
