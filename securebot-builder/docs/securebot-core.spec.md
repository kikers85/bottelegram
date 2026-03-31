# Especificación Técnica: SecureBot Builder (Core)

**Versión**: 1.1.0
**Rol**: Orquestador SDD
**Estado**: Bajo Revisión

## 1. Visión General
SecureBot Builder es una plataforma de orquestación de flujos para chatbots multi-canal. El sistema desacopla las automatizaciones (Flujos) de las identidades de despliegue (Bots), permitiendo una lógica de negocio modular y reutilizable.

**Idioma Oficial**: Toda la interfaz de usuario (textos, etiquetas, alertas y componentes) debe estar en **Español**.

## 2. Modelos de Datos (TypeScript Contracts)

### 2.1 Bot
Refleja el orquestador que conecta flujos con un canal.
```typescript
interface Bot {
  id: string; // UUID
  name: string;
  description?: string;
  owner_id: string; // Relacionado con public.users
  flow_ids: string[]; // Lista de UUIDs de flujos asociados
  channel_id?: string;
  interface_id?: string;
  status: 'draft' | 'published' | 'archived';
  version: string;
}
```

### 2.2 Flow
Automatización aislada y global.
```typescript
interface Flow {
  id: string; // UUID
  name: string;
  trigger_type: string;
  trigger_config: any;
  nodes: any[];
  edges: any[];
  status: 'draft' | 'published' | 'archived';
}
```

### 2.3 User Profile
```typescript
interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'agent';
}
```

## 3. Protocolo de Inicialización de la App
Para evitar bloqueos en el cargador (`loading` persistente):
1. El hook `initialize()` de `useAuthStore` debe ejecutarse una sola vez al montar `App.tsx`.
2. Se debe recuperar la sesión de Supabase.
3. Si existe sesión, se intenta recuperar el perfil en la tabla `users`.
4. **Regla Crítica**: Independientemente de si el perfil existe o si la consulta falla, al finalizar el proceso el estado `isLoading` DEBE ser `false`.
5. Si no hay perfil, se redirige a `OnboardingView`.

## 4. Gestión de Diálogos y Estados de Formulario (Reglas UI)
Para evitar que los inputs pierdan el foco o no permitan escribir (Bug de Tags):
1. Los estados locales de formularios (ej. `tagForm`) deben inicializarse **solo cuando el diálogo se abre por primera vez** (evento de apertura).
2. No usar `useEffect` con la bandera `activeDialog` como única dependencia disparada en cada render.
3. El cierre del diálogo debe limpiar el estado para el siguiente uso.

## 5. Arquitectura de Flujos Isolados
1. Los Flujos NO contienen `bot_id`. Son activos globales del usuario.
2. Un Bot puede orquestar N flujos mediante el array `flow_ids`.
3. El editor (`FlowBuilder`) carga el flujo seleccionado mediante `selectedFlowId` del store global.

---

**Aprobación del Usuario Requerida**: Por favor, confirma si esta especificación refleja correctamente el funcionamiento esperado para proceder con las correcciones de código.
