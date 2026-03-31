import type { Node, Edge } from 'reactflow';

export interface FlowLogEntry {
  timestamp: string;
  nodeId: string;
  nodeType: string;
  action: string;
  details: string;
  status: 'pending' | 'executing' | 'success' | 'error';
}

export interface FlowExecutionResult {
  response: string;
  buttons?: Array<{ id: string; label: string }>;
  logs: FlowLogEntry[];
}

export function useFlowExecutor(nodes: Node[] = [], edges: Edge[] = [], _triggerConfig?: any) {

  const addLog = (logs: FlowLogEntry[], node: Node, action: string, details: string, status: FlowLogEntry['status']): FlowLogEntry[] => {
    const entry: FlowLogEntry = {
      timestamp: new Date().toISOString(),
      nodeId: node.id,
      nodeType: node.type || 'unknown',
      action,
      details,
      status,
    };
    return [...logs, entry];
  };

  const findNodeById = (id: string): Node | undefined => {
    return nodes.find((n: Node) => n.id === id);
  };

  const findOutgoingEdges = (nodeId: string): Edge[] => {
    return edges.filter((e: Edge) => e.source === nodeId);
  };

  const findNextNode = (nodeId: string, edgeId?: string): Node | undefined => {
    const outgoingEdges = findOutgoingEdges(nodeId);
    if (outgoingEdges.length === 0) return undefined;
    
    const targetEdge = edgeId 
      ? outgoingEdges.find((e: Edge) => e.id === edgeId)
      : outgoingEdges[0];
    
    if (!targetEdge) return undefined;
    return findNodeById(targetEdge.target);
  };

  const executeMessageNode = async (node: Node, logs: FlowLogEntry[]): Promise<{ response: string; buttons: Array<{ id: string; label: string }>; logs: FlowLogEntry[] }> => {
    const data = node.data;
    let logsUpdated = addLog(logs, node, 'Ejecutando', `Nodo de mensaje: ${data.label || 'Sin título'}`, 'executing');
    
    await delay(500);
    
    const message = data.messages?.[0]?.content || 'Mensaje vacío';
    const buttons = data.buttons?.map((btn: any) => ({ id: btn.id, label: btn.label })) || [];
    
    logsUpdated = addLog(logsUpdated, node, 'Completado', `Mensaje enviado: "${message.substring(0, 50)}..."`, 'success');
    
    return { response: message, buttons, logs: logsUpdated };
  };

  const executeConditionNode = async (node: Node, userInput: string, logs: FlowLogEntry[]): Promise<{ conditionResult: boolean; nextNodeId: string | null; logs: FlowLogEntry[] }> => {
    const data = node.data;
    let logsUpdated = addLog(logs, node, 'Evaluando', `Condición: ${data.condition || 'Sin condición'}`, 'executing');
    
    await delay(300);
    
    const condition = data.condition?.toLowerCase() || '';
    let conditionResult = false;
    
    if (condition.includes('contains') || condition.includes('contiene')) {
      const match = condition.match(/contains[:\s]+["']?([^"']+)["']?/i);
      if (match && userInput.toLowerCase().includes(match[1].toLowerCase())) {
        conditionResult = true;
      }
    } else if (condition.includes('equals') || condition.includes('igual')) {
      const match = condition.match(/equals[:\s]+["']?([^"']+)["']?/i);
      if (match && userInput.toLowerCase() === match[1].toLowerCase()) {
        conditionResult = true;
      }
    } else if (condition.includes('startswith') || condition.includes('empieza')) {
      const match = condition.match(/startswith[:\s]+["']?([^"']+)["']?/i);
      if (match && userInput.toLowerCase().startsWith(match[1].toLowerCase())) {
        conditionResult = true;
      }
    } else {
      conditionResult = userInput.toLowerCase().includes(condition) || condition.length === 0;
    }
    
    const edgeId = conditionResult ? 'true' : 'false';
    const nextEdge = edges.find(e => e.source === node.id && e.sourceHandle === edgeId);
    const nextNode = nextEdge ? findNodeById(nextEdge.target) : null;
    
    logsUpdated = addLog(
      logsUpdated, 
      node, 
      'Resultado', 
      `Condición ${conditionResult ? 'TRUE' : 'FALSE'}. ${nextNode ? 'Nodo siguiente encontrado' : 'Sin nodo siguiente'}`, 
      'success'
    );
    
    return { 
      conditionResult, 
      nextNodeId: nextNode?.id || null, 
      logs: logsUpdated 
    };
  };

  const executeActionNode = async (node: Node, logs: FlowLogEntry[]): Promise<{ response: string; logs: FlowLogEntry[] }> => {
    const data = node.data;
    let logsUpdated = addLog(logs, node, 'Ejecutando', `Acción: ${data.action || 'Sin acción'}`, 'executing');
    
    await delay(400);
    
    let response = '';
    
    if (data.action === 'External API' && data.externalApi) {
      logsUpdated = addLog(logsUpdated, node, 'API', `Llamando a ${data.externalApi.url}`, 'executing');
      await delay(500);
      logsUpdated = addLog(logsUpdated, node, 'API', `Respuesta recibida`, 'success');
      response = data.externalApi.response_variable 
        ? `Variable ${data.externalApi.response_variable} actualizada` 
        : 'Acción completada';
    } else if (data.action === 'Assign Tag' || data.action === 'Asignar Etiqueta') {
      logsUpdated = addLog(logsUpdated, node, 'Etiqueta', 'Etiqueta asignada al usuario', 'success');
      response = 'Etiqueta asignada correctamente';
    } else if (data.action === 'Send Email' || data.action === 'Enviar Email') {
      logsUpdated = addLog(logsUpdated, node, 'Email', 'Email enviado', 'success');
      response = 'Email enviado correctamente';
    } else {
      response = 'Acción completada';
    }
    
    logsUpdated = addLog(logsUpdated, node, 'Completado', response, 'success');
    
    return { response, logs: logsUpdated };
  };

  const executeFlow = async (userInput: string): Promise<FlowExecutionResult> => {
    let logs: FlowLogEntry[] = [];
    
    logs = addLog(logs, { id: 'system', type: 'triggerNode', data: {} } as Node, 'Iniciando', `Ejecutando flujo para mensaje: "${userInput}"`, 'executing');
    
    const triggerNode = nodes.find(n => n.type === 'triggerNode');
    if (!triggerNode) {
      logs = addLog(logs, { id: 'system', type: 'triggerNode', data: {} } as Node, 'Error', 'No se encontró nodo de trigger', 'error');
      return { 
        response: 'El flujo no tiene un nodo de trigger configurado. Por favor configura el flujo primero.', 
        logs 
      };
    }
    
    logs = addLog(logs, triggerNode, 'Iniciado', 'Flujo iniciado desde trigger', 'success');
    
    let currentNode = findNextNode(triggerNode.id);
    let stepCount = 0;
    const maxSteps = 20;
    
    while (currentNode && stepCount < maxSteps) {
      stepCount++;
      
      switch (currentNode.type) {
        case 'messageNode': {
          const result = await executeMessageNode(currentNode, logs);
          logs = result.logs;
          
          if (result.buttons.length > 0) {
            return { 
              response: result.response, 
              buttons: result.buttons, 
              logs 
            };
          }
          
          currentNode = findNextNode(currentNode.id);
          break;
        }
        
        case 'conditionNode': {
          const result = await executeConditionNode(currentNode, userInput, logs);
          logs = result.logs;
          currentNode = result.nextNodeId ? findNodeById(result.nextNodeId) : undefined;
          break;
        }
        
        case 'actionNode': {
          const result = await executeActionNode(currentNode, logs);
          logs = result.logs;
          currentNode = findNextNode(currentNode.id);
          break;
        }
        
        default:
          logs = addLog(logs, currentNode, 'Error', `Tipo de nodo desconocido: ${currentNode.type}`, 'error');
          currentNode = undefined;
      }
    }
    
    logs = addLog(logs, { id: 'system', type: 'triggerNode', data: {} } as Node, 'Finalizado', 'Ejecución del flujo completada', 'success');
    
    return {
      response: 'El flujo se ha ejecutado correctamente.',
      logs
    };
  };

  return { executeFlow };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
