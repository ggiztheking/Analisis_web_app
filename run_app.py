import os
import webbrowser
import threading
import time
from app.app import app

def open_browser():
    """Open web browser after a short delay"""
    time.sleep(1.5)  # Wait for Flask to start
    webbrowser.open('http://127.0.0.1:5000')

if __name__ == '__main__':
    # Start browser thread
    threading.Thread(target=open_browser).start()
    
    # Run Flask app
    app.run(debug=True)
