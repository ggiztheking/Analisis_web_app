import React, { useState, useReducer, useCallback } from 'react';
import { 
  Brain, 
  Zap, 
  Layers, 
  Grid, 
  Settings, 
  Cpu, 
  Book, 
  Filter 
} from 'lucide-react';

// Definición de Tipos Fundamentales
interface CognitiveState {
  emotionalContext: number[];
  cognitiveInsights: {
    [key: string]: any;
  };
  processingMode: 'analysis' | 'generation' | 'inference';
}

interface AIInteractionPayload {
  input: string;
  contextualEmotion?: number[];
}

// Reductor de Estado Cognitivo
function cognitiveReducer(state: CognitiveState, action: {
  type: string;
  payload?: any;
}): CognitiveState {
  switch (action.type) {
    case 'UPDATE_EMOTIONAL_CONTEXT':
      return {
        ...state,
        emotionalContext: action.payload.emotionalVector,
        cognitiveInsights: action.payload.insights
      };
    case 'CHANGE_PROCESSING_MODE':
      return {
        ...state,
        processingMode: action.payload
      };
    default:
      return state;
  }
}

// Simulación de Modelo de Procesamiento Cognitivo
const simulateCognitiveProcessing = (
  input: string, 
  emotionalContext?: number[]
): { 
  emotionalVector: number[]; 
  insights: any 
} => {
  // Generación de vector emocional multidimensional
  const emotionalVector = emotionalContext 
    || new Array(8).fill(0).map(() => Math.random());
  
  // Generación de insights cognitivos
  const insights = {
    semanticDensity: input.length / Math.max(input.split(/\s+/).length, 1),
    emotionalComplexity: emotionalVector.reduce((a, b) => a + b, 0) / emotionalVector.length,
    linguisticEntropy: Math.random(),
    contextualRelevance: Math.random(),
    inferentialCapacity: Math.random()
  };

  return { emotionalVector, insights };
};

// Componente Principal de IA Cognitiva
const CognitiveAISystem: React.FC = () => {
  const initialState: CognitiveState = {
    emotionalContext: new Array(8).fill(0),
    cognitiveInsights: {},
    processingMode: 'analysis'
  };

  const [state, dispatch] = useReducer(cognitiveReducer, initialState);
  const [inputText, setInputText] = useState('');
  const [interactionHistory, setInteractionHistory] = useState<AIInteractionPayload[]>([]);

  const processCognitiveInput = useCallback(() => {
    if (!inputText.trim()) return;

    // Procesamiento cognitivo del input
    const { emotionalVector, insights } = simulateCognitiveProcessing(
      inputText, 
      state.emotionalContext
    );

    // Actualización del estado cognitivo
    dispatch({
      type: 'UPDATE_EMOTIONAL_CONTEXT',
      payload: { 
        emotionalVector, 
        insights 
      }
    });

    // Registro de interacción
    setInteractionHistory(prev => [
      ...prev, 
      { 
        input: inputText, 
        contextualEmotion: emotionalVector 
      }
    ]);

    // Limpieza de input
    setInputText('');
  }, [inputText, state.emotionalContext]);

  const changeProcessingMode = (mode: 'analysis' | 'generation' | 'inference') => {
    dispatch({
      type: 'CHANGE_PROCESSING_MODE',
      payload: mode
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel de Control Cognitivo */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Brain className="mr-3 text-indigo-600" /> 
            Sistema Cognitivo
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Cpu className="text-blue-500" />
              <span>Modo Procesamiento: {state.processingMode}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(['analysis', 'generation', 'inference'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => changeProcessingMode(mode)}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-all
                    ${state.processingMode === mode 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }
                  `}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Visualización de Contexto Emocional */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2 flex items-center">
              <Filter className="mr-2 text-green-500" /> 
              Contexto Emocional
            </h3>
            <div className="grid grid-cols-4 gap-1">
              {state.emotionalContext.map((value, index) => (
                <div 
                  key={index} 
                  className="h-4 bg-blue-500" 
                  style={{ 
                    opacity: value, 
                    width: `${value * 100}%` 
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Panel de Interacción */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex space-x-4 mb-4">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ingrese texto para procesamiento cognitivo"
              className="flex-grow p-2 border rounded-md"
            />
            <button
              onClick={processCognitiveInput}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Procesar
            </button>
          </div>

          {/* Registro de Interacciones */}
          <div className="mt-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Book className="mr-2 text-purple-500" /> 
              Historial de Interacciones
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {interactionHistory.map((interaction, index) => (
                <div 
                  key={index} 
                  className="bg-gray-100 p-3 rounded-md"
                >
                  <p className="text-sm font-medium">
                    {interaction.input}
                  </p>
                  {interaction.contextualEmotion && (
                    <div className="mt-2 flex space-x-1">
                      {interaction.contextualEmotion.map((emotion, idx) => (
                        <div 
                          key={idx}
                          className="w-2 h-2 bg-blue-500 rounded-full"
                          style={{ opacity: emotion }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Insights Cognitivos */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Layers className="mr-3 text-green-600" /> 
          Insights Cognitivos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(state.cognitiveInsights).map(([key, value]) => (
            <div 
              key={key} 
              className="bg-gray-100 p-4 rounded-md text-center"
            >
              <h4 className="font-semibold text-sm text-gray-600">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })}
              </h4>
              <p className="text-lg font-bold text-indigo-600">
                {typeof value === 'number' ? value.toFixed(3) : value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CognitiveAISystem;
