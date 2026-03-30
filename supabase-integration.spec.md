# Supabase Integration Spec v1.0

## a) Reglas de Negocio (Backend/Supabase)

1. **Persistencia**: Todos los datos (Agents, Bots, Tags, Variables, Flows) deben residir en Supabase. `database.json` pasará a ser solo una semilla de desarrollo.
2. **Relaciones**:
   - `bots` pertenece a un `agent` (owner_id).
   - `tags` pertenecen a un `bot` (bot_id).
   - `flows` están vinculados 1:1 con un `bot`.
   - `global_variables` pueden ser de scope `global` o `bot`.
3. **Validación**: Cada operación de escritura debe pasar por una validación de esquema Zod en el frontend antes de enviarse a Supabase.
4. **Sincronización**: Uso prioritario de React Query para evitar re-fetches innecesarios y manejo de Mutaciones Optimistas (Optimistic Updates) en la UI.

## b) Contratos de Datos & Zod (TypeScript)

### 1. Agents Schema
```typescript
import { z } from 'zod';

export const AgentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  email: z.string().email(),
  telegram_id: z.string().nullable(),
  role: z.enum(['owner', 'admin', 'editor', 'viewer']),
  permissions: z.array(z.string()),
  created_at: z.string().datetime(),
  last_login: z.string().datetime().nullable(),
});

export type Agent = z.infer<typeof AgentSchema>;
```

### 2. Bots Schema
```typescript
export const BotSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  owner_id: z.string().uuid(),
  status: z.enum(['draft', 'published', 'archived']),
  trigger_on: z.string(),
  trigger_config: z.record(z.unknown()),
  version: z.string(),
  flow_id: z.string().uuid().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  published_at: z.string().datetime().nullable(),
});
```

## c) Migración SQL (Table Definitions)

```sql
-- Agents Table
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telegram_id TEXT,
  role TEXT CHECK (role IN ('owner', 'admin', 'editor', 'viewer')) DEFAULT 'editor',
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Bots Table
CREATE TABLE public.bots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  trigger_on TEXT,
  trigger_config JSONB DEFAULT '{}'::jsonb,
  version TEXT DEFAULT '1.0.0',
  flow_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- (Siguen tablas: tags, global_variables, flows...)
```

## d) Estructura de Servicios y Hooks

### Directorio: `src/services/`
- `SupabaseService.ts`: Base genérica para operaciones CRUD.
- `BotService.ts`: Lógica específica de bots y flujos.

### Directorio: `src/hooks/queries/`
- `useBots.ts`: `useQuery` para listas y `useMutation` para CRUD con caché de React Query.
- `useAgents.ts`: Gestión de agentes sincronizada.

---
> [!IMPORTANT]
> Esta especificación requiere aprobación para proceder a la **Fase 2 (Backend/Supabase)** con @Dev_Node.
