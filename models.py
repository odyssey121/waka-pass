from app import db
from sqlalchemy import event
from datetime import datetime


def generate_date(mapper, connection, target):
    target.date = datetime.today().strftime('%Y-%m-%d')

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    api_key = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"{self.name} api-key {self.api_key}"


class Day(db.Model):
    __tablename__ = 'days'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    date = db.Column(db.DateTime())
    running_hours = db.Column(db.Integer, default=0, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __repr__(self):
        return f"{self.date}"


event.listen(Day, 'before_insert', generate_date)

# class Language(db.Model):
#     __tablename__ = 'languages'
#     id = db.Column(db.Integer, primary_key=True, nullable=False)
#     name = db.Column(db.String(64))

class Payload(db.Model):
    __tablename__ = 'payloads'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    start_time = db.Column(db.String(5))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    date = db.Column(db.String(10))

    @staticmethod
    def check_today(user_id):
        return Payload.query.filter(Payload.user_id == user_id,
                                    Payload.date == datetime.today().strftime('%Y-%m-%d')).first()


event.listen(Payload, 'before_insert', generate_date)
