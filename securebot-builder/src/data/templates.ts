import { MessageCircle, Send, Globe, Camera, Layout } from 'lucide-react';

export interface Template {
  id: string;
  name: string;
  description: string;
  platform: 'whatsapp' | 'instagram' | 'telegram' | 'facebook' | 'web';
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  trigger_type: string;
  trigger_config: any;
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
    trigger_type: 'keyword',
    trigger_config: { type: 'keyword', condition: 'exactly', keywords: ['hola', 'hello'] },
    nodes: [
      {
        id: 'msg-1',
        type: 'messageNode',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Saludo Inicial', 
          messages: [{ id: 'm1', type: 'text', content: '¡Hola! Bienvenido a nuestro servicio. ¿Cómo podemos ayudarte hoy?' }],
          buttons: []
        }
      }
    ],
    edges: []
  },
  {
    id: 'ig-captura-leads',
    name: 'Captura de Leads IG',
    description: 'Respuesta automática a menciones en historias para calificar prospectos.',
    platform: 'instagram',
    difficulty: 'Intermedio',
    icon: Camera,
    color: 'bg-pink-500',
    trigger_type: 'story_mention',
    trigger_config: { type: 'story_mention', thank_you_msg: '¡Gracias por mencionarnos!', excluded_words: [] },
    nodes: [
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
    edges: []
  },
  {
    id: 'tg-soporte',
    name: 'Bot de Soporte Nivel 1',
    description: 'Menú interactivo en Telegram para resolver dudas frecuentes.',
    platform: 'telegram',
    difficulty: 'Principiante',
    icon: Send,
    color: 'bg-sky-500',
    trigger_type: 'keyword',
    trigger_config: { type: 'keyword', condition: 'exactly', keywords: ['/start', 'start'] },
    nodes: [
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
    edges: []
  },
  {
    id: 'fb-ventas',
    name: 'Asistente de Ventas FB',
    description: 'Automatización de respuestas para Messenger con catálogo de productos.',
    platform: 'facebook',
    difficulty: 'Avanzado',
    icon: Layout,
    color: 'bg-blue-600',
    trigger_type: 'post_comment',
    trigger_config: { type: 'post_comment', source: 'any', keyword: '' },
    nodes: [
      {
        id: 'condition-1',
        type: 'conditionNode',
        position: { x: 100, y: 100 },
        data: { label: '¿Es pregunta de precio?', condition: 'contains', value: 'precio' }
      },
      {
        id: 'msg-precios',
        type: 'messageNode',
        position: { x: 400, y: 50 },
        data: { 
          label: 'Responder Precios', 
          messages: [{ id: 'm1', type: 'text', content: '¡Tenemos greates ofertas! Te envío nuestro catálogo:' }],
          buttons: [{ id: 'b1', label: 'Ver Catálogo' }]
        }
      },
      {
        id: 'msg-general',
        type: 'messageNode',
        position: { x: 400, y: 200 },
        data: { 
          label: 'Responder General', 
          messages: [{ id: 'm2', type: 'text', content: '¡Gracias por escribirnos! ¿En qué puedo ayudarte?' }],
          buttons: []
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'condition-1', target: 'msg-precios', label: 'Sí' },
      { id: 'e2', source: 'condition-1', target: 'msg-general', label: 'No' }
    ]
  },
  {
    id: 'web-leads',
    name: 'Lead Magnet Web',
    description: 'Chatbot para sitios web que ofrece un PDF a cambio de datos.',
    platform: 'web',
    difficulty: 'Principiante',
    icon: Globe,
    color: 'bg-indigo-600',
    trigger_type: 'new_contact',
    trigger_config: { type: 'new_contact', platform: 'web' },
    nodes: [
      {
        id: 'msg-bienvenida',
        type: 'messageNode',
        position: { x: 100, y: 100 },
        data: { 
          label: 'Bienvenida Web', 
          messages: [{ id: 'm1', type: 'text', content: '¡Hola! Descarga nuestra guía gratuita de tips de marketing digital.' }],
          buttons: []
        }
      },
      {
        id: 'input-email',
        type: 'userInputNode',
        position: { x: 400, y: 100 },
        data: { 
          label: 'Capturar Email', 
          question: '¿Cuál es tu email?', 
          variableName: 'lead_email', 
          variableType: 'string' 
        }
      },
      {
        id: 'msg-descarga',
        type: 'messageNode',
        position: { x: 700, y: 100 },
        data: { 
          label: 'Enviar PDF', 
          messages: [{ id: 'm2', type: 'text', content: '¡Perfecto! Aquí tienes la guía: [LINK_PDF]' }],
          buttons: []
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'msg-bienvenida', target: 'input-email' },
      { id: 'e2', source: 'input-email', target: 'msg-descarga' }
    ]
  }
];
