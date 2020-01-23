from flask import Flask
from flask import request, Response
from config import Config
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object(Config)

db = SQLAlchemy(app)

print(app.config)

@app.route('/api', methods=['POST', 'GET'])

def index():
    content = request.json
    print(content)
    return Response(status='200')


if __name__ == '__main__':
    app.run(debug=True)
