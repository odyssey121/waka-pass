from flask import Flask
from flask import request, Response, render_template, jsonify
from config import Config
from flask_sqlalchemy import SQLAlchemy
import base64
from utils import make_delta, get_time, get_today, hms_to_m

app = Flask(__name__)

app.config.from_object(Config)

db = SQLAlchemy(app)

from models import User, Day, Payload, Month


@app.route('/month', methods=['GET'])
def month():
    return jsonify(data=[i.serialize for i in Month.query.all()])


@app.route('/days', methods=['GET'])
def day():
    return jsonify(data=[i.serialize for i in Day.query.all()])


@app.route('/user', methods=['POST'])
def user():
    content = request.json
    if User.query.filter_by(last_name=content.get('last_name')).first():
        return Response(status='302',
                        response="user with {} last_name already exist".format(content['last_name']))
    db.session.add(User(**content))
    db.session.commit()
    return Response(status='201')


@app.route('/time', methods=['POST'])
def api():
    token = request.headers.get('Authorization')
    content = request.json
    if token and token.startswith('Basic') and len(content):
        fetched_content = content.pop()
        parsed_key = base64.b64decode(token.split()[1]).decode('utf-8')
        user = User.get_user(parsed_key)
        if user and fetched_content:
            payload = dict()
            payload['user_last_name'] = user.last_name
            payload_for_today = Payload.check_today(user.last_name)
            current_month = Month.check_month(user.last_name)
            if payload_for_today:
                last_time = payload_for_today.last_time
                current_time = get_time(fetched_content['time'])
                delta = hms_to_m(make_delta(last_time, current_time))
                print(delta)
                if delta > 15:
                    payload_for_today.last_time = get_time(fetched_content['time'])
                    db.session.commit()
                    return Response(status='200')
                current_day = Day.get_current_day(user.id)
                payload['date'] = get_today()

                if current_day:
                    payload['running_min'] = current_day.running_min + delta
                else:
                    payload['running_min'] = delta
                if current_month:
                    current_month.running_min += delta
                else:
                    current_month = Month(**payload)
                    db.session.add(current_month)
                payload_for_today.last_time = get_time(fetched_content['time'])
                db.session.merge(Day(**payload))
                db.session.commit()
            else:
                payload['last_time'] = get_time(fetched_content['time'])
                db.session.add(Payload(**payload))
                db.session.commit()
    return Response(status='200')


if __name__ == '__main__':
    app.run(debug=True)
