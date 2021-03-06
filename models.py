from app import db
from sqlalchemy import event
from datetime import datetime
from werkzeug.security import safe_str_cmp
from passlib.hash import pbkdf2_sha256 as sha256


def generate_date(mapper, connection, target):
    target.date = datetime.today().strftime("%d/%m/%Y")


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(64))
    last_name = db.Column(db.String(64), unique=True, nullable=False)
    api_key = db.Column(db.String(128))
    isAdmin = db.Column(db.Boolean, nullable=True, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def serialize(self, token=None):
        return {
            'id': self.id,
            'name': self.name,
            'last_name': self.last_name,
            'token': token,
            'omnipotent': self.isAdmin,
        }

    def __repr__(self):
        return f"{self.name} api-key {self.api_key}"

    def check_hash(self, hash):
        return sha256.verify(self.api_key, hash)

    @staticmethod
    def get_user(api_key):
        return User.query.filter(User.api_key == api_key).first()


def generate_month(mapper, connection, target):
    target.date = target.date[3:]


class Month(db.Model):
    __tablename__ = 'months'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    date = db.Column(db.String(12), nullable=False)
    user_last_name = db.Column(db.String, db.ForeignKey('users.last_name'))
    running_min = db.Column(db.Integer, default=0)

    @property
    def serialize(self):
        return {
            'date': self.date,
            'last_name': self.user_last_name,
            'running_min': self.running_min,
        }

    @staticmethod
    def check_month(last_name):
        return Month.query.filter(Month.user_last_name == last_name,
                                  Month.date == datetime.today().strftime("%d/%m/%Y")[3:]).first()

    @staticmethod
    def get_available_month():
        return list(set([m.date for m in Month.query.all()]))

    @staticmethod
    def get_retrieve_month(month):
        return Month.query.filter_by(date=month).all()


event.listen(Month, 'before_insert', generate_month)


class Day(db.Model):
    __tablename__ = 'days'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    date = db.Column(db.String(10), nullable=False)
    running_min = db.Column(db.Integer)
    user_last_name = db.Column(db.String, db.ForeignKey('users.last_name'))

    @property
    def serialize(self):
        return {
            'date': self.date,
            'running_min': self.running_min,
            'last_name': self.user_last_name
        }

    @staticmethod
    def days_by_user(last_name):
        return Day.query.filter(Day.user_last_name == last_name).all()

    @staticmethod
    def get_current_day(last_name):
        return Day.query.filter(Day.date == datetime.today().strftime("%d/%m/%Y"),
                                Day.user_last_name == last_name).first()

    def __repr__(self):
        return f"{self.date}"


class Payload(db.Model):
    __tablename__ = 'payloads'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    last_time = db.Column(db.String(5))
    user_last_name = db.Column(db.String, db.ForeignKey('users.last_name'))
    date = db.Column(db.String(10))

    @staticmethod
    def check_today(last_name):
        return Payload.query.filter(Payload.user_last_name == last_name,
                                    Payload.date == datetime.today().strftime("%d/%m/%Y")).first()

    def __str__(self):
        return f"start {self.start_time} user_id {self.user_id} date {self.date}"


event.listen(Payload, 'before_insert', generate_date)


def authenticate(last_name, api_key):
    user = User.query.filter_by(last_name=last_name).first()
    if user and safe_str_cmp(user.api_key.encode('utf-8'), api_key.encode('utf-8')):
        return user


def identity(payload):
    user_id = payload['identity']
    return User.query.get(user_id) if user_id else None
