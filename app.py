from flask import Flask
from flask import request, Response, render_template
from config import Config
from flask_sqlalchemy import SQLAlchemy
import base64
from utils import make_delta, get_time, get_today

app = Flask(__name__)

app.config.from_object(Config)

db = SQLAlchemy(app)

from models import User, Day, Payload


@app.route('/test', methods=['POST'])
def api():
    token = request.headers.get('Authorization')
    content = request.json
    if token and token.startswith('Basic') and len(content):
        fetched_content = content.pop()
        parsed_key = base64.b64decode(token.split()[1]).decode('utf-8')
        user = User.get_user(parsed_key)
        if user and fetched_content:
            payload = dict()
            payload['user_id'] = user.id
            payload_for_today = Payload.check_today(user.id)
            if payload_for_today:
                start_time = payload_for_today.start_time
                current_time = get_time(fetched_content['time'])
                payload['running_hours'] = make_delta(start_time, current_time)
                payload['date'] = get_today()
                day = Day(**payload)
                db.session.merge(day)
                db.session.commit()
            else:
                payload['start_time'] = get_time(fetched_content['time'])
                db_payload = Payload(**payload)
                db.session.add(db_payload)
                db.session.commit()
    return Response(status='200')


@app.route('/', methods=['GET'])
def index():
    users = User.query.all()
    return render_template('index.html', users=users, token='token')


if __name__ == '__main__':
    app.run(debug=True)
