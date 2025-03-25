# Sentiment Analysis Web Application

Una aplicación web que analiza el sentimiento de textos utilizando modelos de análisis de sentimientos de Hugging Face y almacena los resultados en una base de datos.

## Características

- Análisis de sentimiento de texto (positivo, negativo, neutral)
- Representación visual de los puntajes de sentimiento
- Historial de análisis anteriores
- Diseño responsivo y terapéutico enfocado en la salud mental

## Tecnologías Utilizadas

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **Base de Datos**: SQLite (desarrollo) / MySQL (producción) con SQLAlchemy ORM
- **IA**: Biblioteca transformers de Hugging Face
- **Control de Versiones**: Git

## Configuración e Instalación Local

1. Clonar el repositorio
2. Instalar dependencias:
   ```
   pip install -r requirements.txt
   ```
3. Ejecutar la aplicación:
   ```
   python app/app.py
   ```
4. Abrir el navegador y dirigirse a `http://localhost:5000`

## Estructura del Proyecto

```
1_Sentiment_Analysis_App/
├── app/
│   ├── app.py                # Aplicación principal de Flask
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css     # Estilos CSS
│   │   └── js/
│   │       └── script.js     # JavaScript para el frontend
│   └── templates/
│       ├── dashboard.html    # Página del dashboard
│       ├── history.html      # Página de historial de análisis
│       ├── index.html        # Página principal
│       ├── login.html        # Página de inicio de sesión
│       └── register.html     # Página de registro
├── .env                      # Variables de entorno (no incluir en control de versiones)
├── .htaccess                 # Configuración para el servidor web
├── Procfile                  # Configuración para Gunicorn
├── requirements.txt          # Dependencias de Python
└── wsgi.py                   # Punto de entrada para WSGI
```

## Instrucciones de Despliegue en Hostinger

### Preparación

1. Crear una cuenta en Hostinger y adquirir un plan de hosting (recomendado: Plan Premium)
2. Configurar el dominio `artemindstudios.com` en el panel de Hostinger

### Configuración de la Base de Datos

1. En el panel de Hostinger, ir a "Bases de datos MySQL"
2. Crear una nueva base de datos con:
   - Nombre: `artemindstudios_sentiment`
   - Usuario: `artemindstudios_admin`
   - Contraseña: [usar una contraseña segura]

### Subir Archivos

1. Conectarse al servidor mediante FTP o el Administrador de Archivos de Hostinger
2. Subir todos los archivos del proyecto al directorio raíz del sitio web
3. Asegurarse de que el archivo `.env` contenga las credenciales correctas:
   ```
   DB_HOST=localhost
   DB_USER=artemindstudios_admin
   DB_PASSWORD=[tu_contraseña]
   DB_NAME=artemindstudios_sentiment
   SECRET_KEY=[clave_secreta_segura]
   FLASK_ENV=production
   ```

### Configuración de Python

1. En el panel de Hostinger, ir a "Opciones de PHP"
2. Seleccionar la versión de Python 3.9 o superior
3. Activar la extensión de Python para PHP

### Inicialización de la Base de Datos

1. Acceder al servidor mediante SSH (si está disponible en tu plan)
2. Navegar al directorio del proyecto
3. Ejecutar:
   ```
   export FLASK_APP=app/app.py
   export FLASK_ENV=production
   python -c "from app.app import app, db; app.app_context().push(); db.create_all()"
   ```

### Verificación

1. Visitar `artemindstudios.com` en el navegador
2. Verificar que la aplicación funcione correctamente
3. Probar el registro, inicio de sesión y análisis de sentimientos

## Cómo Usar

1. Registrarse o iniciar sesión en la aplicación
2. Ingresar texto en el campo de entrada
3. Hacer clic en "Analizar Sentimiento"
4. Ver el resultado del análisis de sentimiento
5. Explorar análisis anteriores en la página de Historial

## Mejoras Futuras

- Soporte para múltiples idiomas
- Exportación de resultados a CSV/PDF
- Configuración personalizada de modelos
- Integración con APIs de terapia y bienestar mental

## Soporte

Para soporte técnico, contactar a: artemindstudios@gmail.com
