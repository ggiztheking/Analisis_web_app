// Variables globales
let userMood = 'neutral';
let analysisHistory = [];
let showSupportMessages = true;

// Mensajes de apoyo basados en el sentimiento
const supportMessages = {
    positive: [
        "¡Excelente! Mantener este estado de ánimo positivo es beneficioso para tu bienestar.",
        "Es maravilloso ver este optimismo. Recuerda celebrar estos momentos.",
        "Tu perspectiva positiva es una fortaleza. Sigue cultivándola."
    ],
    negative: [
        "Está bien no estar bien. Recuerda que los sentimientos difíciles son temporales.",
        "Considera hablar con alguien de confianza sobre cómo te sientes.",
        "Tómate un momento para respirar profundamente. Estamos aquí para apoyarte."
    ],
    neutral: [
        "La neutralidad también es un estado válido. Observa cómo evoluciona tu estado de ánimo.",
        "Este es un buen momento para la reflexión y el autocuidado.",
        "Mantén el equilibrio y sé consciente de tus emociones."
    ]
};

// Recursos de salud mental
const mentalHealthResources = [
    {
        name: "Línea de Crisis Nacional",
        description: "Apoyo emocional gratuito 24/7",
        contact: "988",
        url: "https://988lifeline.org/"
    },
    {
        name: "Terapia Online",
        description: "Plataformas de terapia accesibles",
        url: "https://www.betterhelp.com/"
    },
    {
        name: "Mindfulness y Meditación",
        description: "Aplicaciones para reducir el estrés",
        url: "https://www.headspace.com/"
    }
];

// Inicialización cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar el formulario de análisis
    const sentimentForm = document.getElementById('sentiment-form');
    if (sentimentForm) {
        sentimentForm.addEventListener('submit', analyzeText);
    }

    // Inicializar tooltips de Bootstrap si existen
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Añadir botón de crisis si no existe
    if (!document.querySelector('.crisis-button')) {
        createCrisisButton();
    }

    // Añadir recursos de salud mental si estamos en la página de dashboard
    if (window.location.pathname.includes('dashboard')) {
        addMentalHealthResources();
    }

    // Añadir animaciones de entrada
    addFadeInAnimations();
});

// Función para analizar el texto
async function analyzeText(event) {
    event.preventDefault();
    
    const form = event.target;
    const textInput = form.querySelector('#text');
    const text = textInput.value.trim();
    
    if (!text) {
        showAlert('Por favor, ingresa algún texto para analizar.', 'warning');
        return;
    }
    
    // Mostrar indicador de carga
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analizando...';
    submitButton.disabled = true;
    
    try {
        const formData = new FormData();
        formData.append('text', text);
        
        const response = await fetch('/analyze', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        
        const result = await response.json();
        displayResult(result);
        
        // Guardar en el historial local
        saveToLocalHistory(result);
        
        // Actualizar el estado de ánimo del usuario
        updateUserMood(result.sentiment);
        
        // Mostrar mensaje de apoyo si está habilitado
        if (showSupportMessages) {
            showSupportMessage(result.sentiment);
        }
        
    } catch (error) {
        console.error('Error:', error);
        showAlert('Ocurrió un error al analizar el texto. Por favor, intenta nuevamente.', 'danger');
    } finally {
        // Restaurar el botón
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
}

// Función para mostrar el resultado
function displayResult(result) {
    const resultDiv = document.getElementById('result');
    const resultBox = document.getElementById('result-box');
    const sentimentText = document.getElementById('sentiment-text');
    const sentimentResult = document.getElementById('sentiment-result');
    const sentimentScore = document.getElementById('sentiment-score');
    
    // Determinar la clase CSS basada en el sentimiento
    let sentimentClass = '';
    let sentimentLabel = '';
    
    switch (result.sentiment) {
        case 'POSITIVE':
            sentimentClass = 'positive';
            sentimentLabel = 'Positivo';
            break;
        case 'NEGATIVE':
            sentimentClass = 'negative';
            sentimentLabel = 'Negativo';
            break;
        default:
            sentimentClass = 'neutral';
            sentimentLabel = 'Neutral';
    }
    
    // Actualizar clases y contenido
    resultBox.className = 'alert ' + sentimentClass;
    sentimentText.textContent = `"${result.text}"`;
    sentimentResult.textContent = `Sentimiento detectado: ${sentimentLabel}`;
    
    // Actualizar la barra de progreso
    const scorePercentage = Math.round(result.score * 100);
    sentimentScore.style.width = `${scorePercentage}%`;
    sentimentScore.textContent = `${scorePercentage}%`;
    sentimentScore.setAttribute('aria-valuenow', scorePercentage);
    sentimentScore.className = `progress-bar ${sentimentClass}`;
    
    // Mostrar el resultado con animación
    resultDiv.style.display = 'block';
    resultDiv.classList.add('fade-in');
    
    // Desplazarse suavemente hasta el resultado
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Función para guardar en el historial local
function saveToLocalHistory(result) {
    const analysis = {
        text: result.text,
        sentiment: result.sentiment,
        score: result.score,
        timestamp: new Date().toISOString()
    };
    
    analysisHistory.push(analysis);
    
    // Limitar el historial a 20 elementos
    if (analysisHistory.length > 20) {
        analysisHistory.shift();
    }
    
    // Guardar en localStorage si está disponible
    if (window.localStorage) {
        try {
            localStorage.setItem('sentimentAnalysisHistory', JSON.stringify(analysisHistory));
        } catch (e) {
            console.warn('No se pudo guardar en localStorage:', e);
        }
    }
}

// Función para actualizar el estado de ánimo del usuario
function updateUserMood(sentiment) {
    // Algoritmo simple para actualizar el estado de ánimo basado en análisis recientes
    // En una aplicación real, esto sería más sofisticado
    if (sentiment === 'POSITIVE') {
        userMood = userMood === 'negative' ? 'neutral' : 'positive';
    } else if (sentiment === 'NEGATIVE') {
        userMood = userMood === 'positive' ? 'neutral' : 'negative';
    }
    
    // Guardar el estado de ánimo en localStorage
    if (window.localStorage) {
        localStorage.setItem('userMood', userMood);
    }
}

// Función para mostrar mensaje de apoyo
function showSupportMessage(sentiment) {
    const normalizedSentiment = sentiment.toLowerCase();
    if (!supportMessages[normalizedSentiment]) return;
    
    // Seleccionar un mensaje aleatorio
    const messages = supportMessages[normalizedSentiment];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Crear elemento para el mensaje
    const supportMessageDiv = document.createElement('div');
    supportMessageDiv.className = `alert alert-info mt-4 fade-in support-message`;
    supportMessageDiv.innerHTML = `
        <i class="fas fa-heart"></i> <strong>Nota de apoyo:</strong>
        <p>${randomMessage}</p>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Añadir al DOM después del resultado
    const resultDiv = document.getElementById('result');
    if (resultDiv && resultDiv.parentNode) {
        resultDiv.parentNode.insertBefore(supportMessageDiv, resultDiv.nextSibling);
        
        // Eliminar automáticamente después de 10 segundos
        setTimeout(() => {
            if (supportMessageDiv.parentNode) {
                supportMessageDiv.parentNode.removeChild(supportMessageDiv);
            }
        }, 10000);
    }
}

// Función para crear el botón de crisis
function createCrisisButton() {
    const crisisButton = document.createElement('div');
    crisisButton.className = 'crisis-button';
    crisisButton.setAttribute('data-bs-toggle', 'modal');
    crisisButton.setAttribute('data-bs-target', '#crisisModal');
    crisisButton.innerHTML = '<i class="fas fa-phone"></i>';
    crisisButton.setAttribute('title', 'Línea de ayuda');
    
    // Crear el modal de crisis
    const modalHtml = `
    <div class="modal fade" id="crisisModal" tabindex="-1" aria-labelledby="crisisModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="crisisModalLabel">Recursos de ayuda inmediata</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Si estás experimentando una crisis emocional o pensamientos de hacerte daño, por favor contacta a uno de estos recursos:</p>
            <ul class="list-group">
              <li class="list-group-item">
                <strong>Línea Nacional de Prevención del Suicidio:</strong><br>
                988 (llamada o texto)<br>
                <a href="https://988lifeline.org/" target="_blank">988lifeline.org</a>
              </li>
              <li class="list-group-item">
                <strong>Línea de Texto de Crisis:</strong><br>
                Envía HOME al 741741<br>
                <a href="https://www.crisistextline.org/" target="_blank">crisistextline.org</a>
              </li>
            </ul>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <a href="tel:988" class="btn btn-danger">Llamar ahora (988)</a>
          </div>
        </div>
      </div>
    </div>
    `;
    
    // Añadir elementos al DOM
    document.body.appendChild(crisisButton);
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Función para añadir recursos de salud mental
function addMentalHealthResources() {
    const dashboardContainer = document.querySelector('.container');
    if (!dashboardContainer) return;
    
    const resourcesSection = document.createElement('div');
    resourcesSection.className = 'card mt-4 fade-in';
    resourcesSection.innerHTML = `
        <div class="card-header">
            <h3>Recursos de Salud Mental</h3>
        </div>
        <div class="card-body">
            <p>Estos recursos pueden ser útiles para mantener y mejorar tu bienestar emocional:</p>
            <div class="row">
                ${mentalHealthResources.map(resource => `
                    <div class="col-md-4 mb-3">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${resource.name}</h5>
                                <p class="card-text">${resource.description}</p>
                                ${resource.contact ? `<p><strong>Contacto:</strong> ${resource.contact}</p>` : ''}
                                <a href="${resource.url}" target="_blank" class="btn btn-outline-primary btn-sm">Visitar</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    dashboardContainer.appendChild(resourcesSection);
}

// Función para añadir animaciones de entrada
function addFadeInAnimations() {
    const elements = document.querySelectorAll('.card, .alert');
    elements.forEach((element, index) => {
        element.classList.add('fade-in');
        element.style.animationDelay = `${index * 0.1}s`;
    });
}

// Función para mostrar alertas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Insertar al principio del contenedor
    const container = document.querySelector('.container');
    if (container && container.firstChild) {
        container.insertBefore(alertDiv, container.firstChild);
    }
    
    // Eliminar automáticamente después de 5 segundos
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Cargar historial desde localStorage al iniciar
if (window.localStorage && localStorage.getItem('sentimentAnalysisHistory')) {
    try {
        analysisHistory = JSON.parse(localStorage.getItem('sentimentAnalysisHistory')) || [];
    } catch (e) {
        console.warn('Error al cargar el historial:', e);
        analysisHistory = [];
    }
}

// Cargar estado de ánimo del usuario desde localStorage
if (window.localStorage && localStorage.getItem('userMood')) {
    userMood = localStorage.getItem('userMood');
}
