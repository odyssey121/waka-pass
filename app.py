from flask import Flask
from flask import request, Response, render_template, jsonify
from config import Config
from flask_sqlalchemy import SQLAlchemy
import base64
from utils import make_delta, get_time, get_today, hms_to_m
from flask_jwt import JWT, jwt_required, current_identity
from passlib.hash import pbkdf2_sha256 as sha256

app = Flask(__name__)

app.config.from_object(Config)

db = SQLAlchemy(app)

from models import User, Day, Payload, Month, authenticate, identity

jwt = JWT(app, authenticate, identity)


@app.route('/identity', methods=['GET'])
@jwt_required()
def protected():
    data = request.headers.get('Authorization')
    if data and data.startswith("JWT"):
        token = data.split(" ")[1]
        return jsonify({
            'user': current_identity.serialize(token)
        })


@app.route('/login', methods=["POST"])
def login():
    content = request.json
    user = User.get_user(content.get('api_key'))
    if user and content.get('last_name') == user.last_name:
        return jsonify({
            'user': user.serialize(sha256.hash(user.api_key))
        })
    return jsonify({'error': "Неверный ключ или Фамилия входа"}), 401


@app.route('/retrieve', methods=["GET"])
def retrieve():
    data = request.headers.get('Authorization')
    if data and len(data.split(" ")) == 2:
        ids, hash = data.split(" ")
        user = User.query.get(ids)
        if user and user.check_hash(hash):
            return jsonify({
                'user': user.serialize(hash)
            })
    return jsonify({'error': "Неверный токен"}), 401


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/fetch', methods=['GET'])
def month():
    return jsonify(month=[i.serialize for i in Month.query.all()], days=[i.serialize for i in Day.query.all()])


@app.route('/month_retrieve/', methods=['POST'])
def retrieve_month():
    content = request.json
    if content.get('month'):
        return jsonify(data=[m.serialize for m in Month.get_retrieve_month(content.get('month'))])
    return Response(status='404')


# @app.route('/day_count/<last_name>', methods)

# @app.route('/days_all', methods=['GET'])
# def days_all():
#     return jsonify(data=[i.serialize for i in Day.query.all()])


@app.route('/days/<last_name>', methods=['GET'])
def days(last_name):
    user = User.query.filter_by(last_name=last_name).first()
    if user:
        return jsonify(data=[i.serialize for i in Day.days_by_user(user.last_name)])

    return Response(status='400')


@app.route('/user', methods=['POST'])
def user():
    content = request.json
    user = User.query.filter_by(last_name=content.get('last_name')).first()
    if user:
        response = jsonify({'status': 302, 'message': f"Пользователь с фамилией {user.last_name} уже существует"})
        response.status_code = 302
        return response
    db.session.add(User(**content))
    db.session.commit()
    new_month = Month(date=get_today(), user_last_name=content['last_name'])
    db.session.add(new_month)
    db.session.commit()
    response = jsonify({'status': 201, 'message': "Created"})
    response.status_code = 201
    return response


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
                if delta > 10:
                    payload_for_today.last_time = current_time
                    db.session.commit()
                    return Response(status='200')
                current_day = Day.get_current_day(user.last_name)
                payload['date'] = get_today()
                payload['running_min'] = delta

                if current_day:
                    current_day_running_min = current_day.running_min
                    current_day.running_min = current_day_running_min + delta
                else:
                    db.session.add(Day(**payload))

                if current_month:
                    current_month_running_min = current_month.running_min
                    current_month.running_min = current_month_running_min + delta
                else:
                    db.session.add(Month(**payload))

                payload_for_today.last_time = current_time
                db.session.commit()
            else:
                payload['last_time'] = get_time(fetched_content['time'])
                db.session.add(Payload(**payload))
                db.session.commit()
    return Response(status='200')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('index.html')


@app.errorhandler(405)
def page_not_found(e):
    return render_template('index.html')


@jwt.auth_response_handler
def cstm_response(token, indentity):
    if not Day.query.filter(Day.user_last_name == indentity.last_name).all() and not indentity.isAdmin:
        return jsonify({'message': "К сожалению вы не можете войти в систему - т.к вы еще не наработали и минуты"}), 406
    return jsonify({
        'user': indentity.serialize(token.decode('utf-8'))
    })


if __name__ == '__main__':
    app.run(debug=True)
