// This script is a simplified adapter to show how the React component could be integrated
// In a real-world scenario, you would use a proper React build system

document.addEventListener('DOMContentLoaded', function() {
  // Simple simulation of the React component behavior
  const emotionalStates = {
    'POSITIVE': [0.8, 0.7, 0.6, 0.2, 0.1, 0.1],
    'NEGATIVE': [0.1, 0.2, 0.3, 0.7, 0.8, 0.9],
    'NEUTRAL': [0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
  };

  const analyzeBtn = document.getElementById('analyze-button');
  const textInput = document.getElementById('text-input');
  const resultContainer = document.getElementById('result-container');
  const emotionalVisualizer = document.getElementById('emotional-visualizer');
  
  if (analyzeBtn && textInput) {
    analyzeBtn.addEventListener('click', function() {
      const text = textInput.value.trim();
      if (!text) return;
      
      // Show loading state
      resultContainer.innerHTML = '<p class="text-center">Analyzing...</p>';
      
      // Send to backend API
      fetch('/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'text': text
        })
      })
      .then(response => response.json())
      .then(data => {
        // Display the results
        let sentimentClass = data.sentiment === 'POSITIVE' ? 'text-green-600' : 
                           data.sentiment === 'NEGATIVE' ? 'text-red-600' : 'text-blue-600';
        
        resultContainer.innerHTML = `
          <div class="bg-white p-4 rounded-lg shadow-md">
            <h3 class="font-bold ${sentimentClass} text-xl mb-2">
              ${data.sentiment}
            </h3>
            <p class="text-gray-700">Confidence: ${(data.score * 100).toFixed(2)}%</p>
            <p class="text-gray-700 mt-2">Text analyzed: "${data.text}"</p>
          </div>
        `;
        
        // Update emotional visualizer
        const emotionalVector = emotionalStates[data.sentiment] || emotionalStates['NEUTRAL'];
        updateEmotionalVisualizer(emotionalVector);
        
        // Add to history display if it exists on this page
        updateHistoryDisplay(data);
      })
      .catch(error => {
        resultContainer.innerHTML = `
          <div class="bg-red-100 p-4 rounded-lg">
            <p class="text-red-600">Error: Could not analyze text. Please try again.</p>
          </div>
        `;
        console.error('Error:', error);
      });
    });
  }
  
  function updateEmotionalVisualizer(emotionalVector) {
    if (!emotionalVisualizer) return;
    
    emotionalVisualizer.innerHTML = '';
    emotionalVector.forEach(value => {
      const bar = document.createElement('div');
      bar.className = 'h-4 bg-blue-500 rounded';
      bar.style.width = `${value * 100}%`;
      bar.style.opacity = value;
      emotionalVisualizer.appendChild(bar);
    });
  }
  
  function updateHistoryDisplay(data) {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;
    
    const item = document.createElement('div');
    item.className = 'bg-white p-3 rounded-md shadow mb-2';
    
    let sentimentClass = data.sentiment === 'POSITIVE' ? 'text-green-600' : 
                       data.sentiment === 'NEGATIVE' ? 'text-red-600' : 'text-blue-600';
    
    item.innerHTML = `
      <p class="text-sm">${data.text}</p>
      <p class="text-xs ${sentimentClass} font-semibold mt-1">
        ${data.sentiment} (${(data.score * 100).toFixed(2)}%)
      </p>
      <p class="text-xs text-gray-500">Just now</p>
    `;
    
    historyList.prepend(item);
  }
});
