from flask import Flask
from flask import request, Response
from config import Config
from flask_sqlalchemy import SQLAlchemy
import base64
import time
from datetime import datetime

app = Flask(__name__)

app.config.from_object(Config)

db = SQLAlchemy(app)

from models import User, Day, Payload


@app.route('/test', methods=['POST'])
def index():
    token = request.headers.get('Authorization')
    content = request.json
    if token and token.startswith('Basic') and len(content):
        payload = dict()
        parse_token = base64.b64decode(token.split()[1]).decode('utf-8')
        user = User.query.filter(User.api_key == parse_token).first()
        if user:
            if Payload.check_today(user.id):
                print('make delta')
            else:
                fetch_content = content.pop()
                payload['start_time'] = time.strftime("%H:%M", time.localtime(fetch_content['time']))
                payload['date'] = datetime.today().strftime('%Y-%m-%d')
                payload['user_id'] = user.id
                db_payload = Payload(**payload)
                db.session.add(db_payload)
                db.session.commit()

    return Response(status='200')


if __name__ == '__main__':
    app.run(debug=True)
