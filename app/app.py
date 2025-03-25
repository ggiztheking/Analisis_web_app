from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import os
import re
import random
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = Flask(__name__)

# Configuración de la base de datos MySQL para producción
if os.environ.get('FLASK_ENV') == 'production':
    # Configuración para Hostinger
    db_user = os.environ.get('DB_USER')
    db_password = os.environ.get('DB_PASSWORD')
    db_host = os.environ.get('DB_HOST')
    db_name = os.environ.get('DB_NAME')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql://{db_user}:{db_password}@{db_host}/{db_name}'
else:
    # Configuración para desarrollo local
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sentiment_analysis.db'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev_key_for_testing')
db = SQLAlchemy(app)

# Simple sentiment analysis function (replacement for Hugging Face transformers)
def simple_sentiment_analysis(text):
    # Simple keyword-based approach
    positive_words = ['feliz', 'alegre', 'contento', 'bueno', 'excelente', 'genial', 'fantástico', 
                     'maravilloso', 'increíble', 'happy', 'good', 'great', 'excellent', 'amazing',
                     'love', 'enjoy', 'fantastic', 'wonderful', 'awesome', 'smile', 'pleased']
    
    negative_words = ['triste', 'deprimido', 'enojado', 'malo', 'terrible', 'horrible', 'pésimo',
                      'enfadado', 'frustrado', 'sad', 'angry', 'bad', 'terrible', 'horrible', 
                      'awful', 'hate', 'dislike', 'disappointed', 'upset', 'unhappy', 'worry']
    
    # Convert to lowercase and tokenize on word boundaries
    text_lower = text.lower()
    words = re.findall(r'\b\w+\b', text_lower)
    
    # Count positive and negative words
    positive_count = sum(1 for word in words if word in positive_words)
    negative_count = sum(1 for word in words if word in negative_words)
    
    # Add some randomness to make it interesting
    positive_count += random.uniform(0, 0.5) * len(words) * 0.1
    negative_count += random.uniform(0, 0.5) * len(words) * 0.1
    
    if positive_count > negative_count:
        sentiment = "POSITIVE"
        score = 0.5 + (positive_count / (positive_count + negative_count + 1)) * 0.5
    elif negative_count > positive_count:
        sentiment = "NEGATIVE"
        score = 0.5 + (negative_count / (negative_count + positive_count + 1)) * 0.5
    else:
        sentiment = "NEUTRAL"
        score = 0.5 + random.uniform(-0.1, 0.1)
    
    # Ensure score is between 0 and 1
    score = min(max(score, 0.0), 1.0)
    
    return {"label": sentiment, "score": score}

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    analyses = db.relationship('Analysis', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

class Analysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(20), nullable=False)
    score = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    language = db.Column(db.String(20), default='en')

    def __repr__(self):
        return f'<Analysis {self.id}>'

# Create tables
with app.app_context():
    db.create_all()

# Authentication routes
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Check if username or email already exists
        user_exists = User.query.filter_by(username=username).first() is not None
        email_exists = User.query.filter_by(email=email).first() is not None
        
        if user_exists:
            flash('Username already exists.', 'danger')
            return redirect(url_for('register'))
        
        if email_exists:
            flash('Email already registered.', 'danger')
            return redirect(url_for('register'))
        
        # Create new user
        new_user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid username or password.', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

# Helper function to check if user is logged in
def is_logged_in():
    return 'user_id' in session

@app.route('/')
def home():
    if not is_logged_in():
        return redirect(url_for('login'))
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if not is_logged_in():
        return jsonify({'error': 'Not authenticated'}), 401
    
    if request.method == 'POST':
        text = request.form['text']
        language = request.form.get('language', 'en')
        
        # Perform sentiment analysis
        result = simple_sentiment_analysis(text)
        sentiment = result['label']
        score = result['score']
        
        # Save to database
        analysis = Analysis(
            text=text, 
            sentiment=sentiment, 
            score=score,
            user_id=session['user_id'],
            language=language
        )
        db.session.add(analysis)
        db.session.commit()
        
        return jsonify({
            'text': text,
            'sentiment': sentiment,
            'score': score,
            'language': language
        })

@app.route('/history')
def history():
    if not is_logged_in():
        return redirect(url_for('login'))
    
    analyses = Analysis.query.filter_by(user_id=session['user_id']).order_by(Analysis.timestamp.desc()).all()
    return render_template('history.html', analyses=analyses)

@app.route('/export-csv')
def export_csv():
    if not is_logged_in():
        return redirect(url_for('login'))
    
    import csv
    from io import StringIO
    from flask import Response
    
    # Get user's analyses
    analyses = Analysis.query.filter_by(user_id=session['user_id']).order_by(Analysis.timestamp.desc()).all()
    
    # Create CSV data
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Text', 'Sentiment', 'Score', 'Language', 'Timestamp'])
    
    for analysis in analyses:
        writer.writerow([
            analysis.id,
            analysis.text,
            analysis.sentiment,
            analysis.score,
            analysis.language,
            analysis.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        ])
    
    # Create response
    response = Response(output.getvalue(), mimetype='text/csv')
    response.headers["Content-Disposition"] = "attachment; filename=sentiment_analyses.csv"
    return response

@app.route('/dashboard')
def dashboard():
    if not is_logged_in():
        return redirect(url_for('login'))
    
    # Get aggregated sentiment data for the current user
    user_id = session['user_id']
    analyses = Analysis.query.filter_by(user_id=user_id).all()
    
    total_analyses = len(analyses)
    positive_count = sum(1 for a in analyses if a.sentiment == 'POSITIVE')
    negative_count = sum(1 for a in analyses if a.sentiment == 'NEGATIVE')
    neutral_count = total_analyses - positive_count - negative_count
    
    # Calculate percentages
    positive_pct = round((positive_count / total_analyses) * 100) if total_analyses > 0 else 0
    negative_pct = round((negative_count / total_analyses) * 100) if total_analyses > 0 else 0
    neutral_pct = round((neutral_count / total_analyses) * 100) if total_analyses > 0 else 0
    
    # Get recent analyses
    recent_analyses = Analysis.query.filter_by(user_id=user_id).order_by(Analysis.timestamp.desc()).limit(5).all()
    
    return render_template('dashboard.html', 
                          total_analyses=total_analyses,
                          positive_count=positive_count,
                          negative_count=negative_count,
                          neutral_count=neutral_count,
                          positive_pct=positive_pct,
                          negative_pct=negative_pct,
                          neutral_pct=neutral_pct,
                          recent_analyses=recent_analyses)

if __name__ == '__main__':
    app.run(debug=True)
