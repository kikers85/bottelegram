import { MessageCircle, Send, Globe, Camera, Layout } from 'lucide-react';

export interface Template {
  id: string;
  name: string;
  description: string;
  platform: 'whatsapp' | 'instagram' | 'telegram' | 'facebook' | 'web';
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  nodes: any[];
  edges: any[];
  icon: any;
  color: string;
}

export const marketplaceTemplates: Template[] = [
  {
    id: 'wa-welcome',
    name: 'Bienvenida Automática WA',
    description: 'Flujo estándar para saludar a nuevos clientes y capturar su nombre.',
    platform: 'whatsapp',
    difficulty: 'Principiante',
    icon: MessageCircle,
    color: 'bg-green-500',
    nodes: [
      {
        id: 'trigger-1',
        type: 'triggerNode',
        position: { x: 100, y: 100 },
        data: { label: 'Palabra Clave: Hola', trigger_type: 'keyword', status: 'published' }
      },
      {
        id: 'msg-1',
        type: 'messageNode',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Saludo Inicial', 
          messages: [{ id: 'm1', type: 'text', content: '¡Hola! Bienvido a nuestro servicio. ¿Cómo podemos ayudarte hoy?' }],
          buttons: []
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'msg-1', animated: true }
    ]
  },
  {
    id: 'ig-captura-leads',
    name: 'Captura de Leads IG',
    description: 'Respuesta automática a menciones en historias para calificar prospectos.',
    platform: 'instagram',
    difficulty: 'Intermedio',
    icon: Camera,
    color: 'bg-pink-500',
    nodes: [
      {
        id: 'trigger-1',
        type: 'triggerNode',
        position: { x: 100, y: 100 },
        data: { label: 'Mención en Story', trigger_type: 'mention', status: 'published' }
      },
      {
        id: 'msg-1',
        type: 'messageNode',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Gracias', 
          messages: [{ id: 'm1', type: 'text', content: '¡Gracias por mencionarnos! Déjanos tu correo para enviarte una sorpresa.' }],
          buttons: []
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'msg-1', animated: true }
    ]
  },
  {
    id: 'tg-soporte',
    name: 'Bot de Soporte Nivel 1',
    description: 'Menú interactivo en Telegram para resolver dudas frecuentes.',
    platform: 'telegram',
    difficulty: 'Principiante',
    icon: Send,
    color: 'bg-sky-500',
    nodes: [
      {
        id: 'trigger-1',
        type: 'triggerNode',
        position: { x: 100, y: 100 },
        data: { label: 'Comando /start', trigger_type: 'command', status: 'published' }
      },
      {
        id: 'msg-1',
        type: 'messageNode',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Menú de Ayuda', 
          messages: [{ id: 'm1', type: 'text', content: 'Selecciona una opción:' }],
          buttons: [
            { id: 'b1', label: 'Horarios' },
            { id: 'b2', label: 'Precios' }
          ]
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'msg-1', animated: true }
    ]
  },
  {
    id: 'fb-ventas',
    name: 'Asistente de Ventas FB',
    description: 'Automatización de respuestas para Messenger con catálogo de productos.',
    platform: 'facebook',
    difficulty: 'Avanzado',
    icon: Layout,
    color: 'bg-blue-600',
    nodes: [],
    edges: []
  },
  {
    id: 'web-leads',
    name: 'Lead Magnet Web',
    description: 'Chatbot para sitios web que ofrece un PDF a cambio de datos.',
    platform: 'web',
    difficulty: 'Principiante',
    icon: Globe,
    color: 'bg-indigo-600',
    nodes: [],
    edges: []
  }
];
