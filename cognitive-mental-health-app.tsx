import React, { useState, useReducer, useCallback } from 'react';
import { 
  Brain, 
  Zap, 
  Layers, 
  Grid, 
  Settings, 
  Cpu, 
  Book, 
  Filter,
  Heart,
  Smile,
  Frown,
  Users,
  MessageCircle
} from 'lucide-react';

// Cognitive State and Processing Logic (similar to previous implementation)
interface CognitiveState {
  emotionalContext: number[];
  cognitiveInsights: {
    [key: string]: any;
  };
  processingMode: 'analysis' | 'support' | 'reflection';
}

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

// Cognitive Processing Simulation for Mental Health Context
const simulateMentalHealthProcessing = (
  input: string, 
  emotionalContext?: number[]
) => {
  const emotionalVector = emotionalContext 
    || new Array(6).fill(0).map(() => Math.random());
  
  const insights = {
    emotionalIntensity: emotionalVector.reduce((a, b) => a + b, 0) / emotionalVector.length,
    stressLevel: Math.random(),
    mentalWellnessPotential: 1 - Math.random(),
    supportNeed: Math.random(),
    resilienceScore: Math.random(),
    selfAwarenessIndex: Math.random()
  };

  return { emotionalVector, insights };
};

// Main Cognitive Mental Health App Component
const CognitiveMentalHealthApp: React.FC = () => {
  const initialState: CognitiveState = {
    emotionalContext: new Array(6).fill(0),
    cognitiveInsights: {},
    processingMode: 'analysis'
  };

  const [state, dispatch] = useReducer(cognitiveReducer, initialState);
  const [inputText, setInputText] = useState('');
  const [interactionHistory, setInteractionHistory] = useState<{
    input: string, 
    contextualEmotion?: number[]
  }[]>([]);

  const processCognitiveInput = useCallback(() => {
    if (!inputText.trim()) return;

    const { emotionalVector, insights } = simulateMentalHealthProcessing(
      inputText, 
      state.emotionalContext
    );

    dispatch({
      type: 'UPDATE_EMOTIONAL_CONTEXT',
      payload: { 
        emotionalVector, 
        insights 
      }
    });

    setInteractionHistory(prev => [
      ...prev, 
      { 
        input: inputText, 
        contextualEmotion: emotionalVector 
      }
    ]);

    setInputText('');
  }, [inputText, state.emotionalContext]);

  const changeProcessingMode = (mode: 'analysis' | 'support' | 'reflection') => {
    dispatch({
      type: 'CHANGE_PROCESSING_MODE',
      payload: mode
    });
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cognitive Control Panel */}
        <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Brain className="mr-3 text-indigo-600" /> 
            Cognitive Wellness
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Cpu className="text-blue-500" />
              <span>Processing Mode: {state.processingMode}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {(['analysis', 'support', 'reflection'] as const).map((mode) => (
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

          {/* Emotional Context Visualization */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2 flex items-center">
              <Heart className="mr-2 text-red-500" /> 
              Emotional Landscape
            </h3>
            <div className="grid grid-cols-6 gap-1">
              {state.emotionalContext.map((value, index) => (
                <div 
                  key={index} 
                  className="h-4 bg-blue-500 rounded" 
                  style={{ 
                    opacity: value, 
                    width: `${value * 100}%` 
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Interaction Panel */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <div className="flex space-x-4 mb-4">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Share your thoughts or feelings..."
              className="flex-grow p-2 border rounded-md"
            />
            <button
              onClick={processCognitiveInput}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Process
            </button>
          </div>

          {/* Interaction History */}
          <div className="mt-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageCircle className="mr-2 text-purple-500" /> 
              Interaction Journal
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

      {/* Cognitive Insights Panel */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Layers className="mr-3 text-green-600" /> 
          Wellness Insights
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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

      {/* Support Resources */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Users className="mr-3 text-blue-600" /> 
          Support Resources
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <Smile className="text-green-500 mb-2" />
            <h4 className="font-semibold">Emotional Wellbeing</h4>
            <p className="text-sm text-gray-600">Resources for managing emotions</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <Frown className="text-red-500 mb-2" />
            <h4 className="font-semibold">Stress Management</h4>
            <p className="text-sm text-gray-600">Techniques to reduce anxiety</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <Heart className="text-purple-500 mb-2" />
            <h4 className="font-semibold">Self-Care</h4>
            <p className="text-sm text-gray-600">Personalized wellness strategies</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CognitiveMentalHealthApp;
