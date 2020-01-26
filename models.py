from app import db
from sqlalchemy import event
from datetime import datetime


def generate_date(mapper, connection, target):
    target.date = datetime.today().strftime("%d/%m/%Y")


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(64))
    last_name = db.Column(db.String(64), unique=True, nullable=False)
    api_key = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def serialize(self):
        return {
            'name': self.name,
            'last_name': self.last_name,
            'api_key': self.api_key
        }

    def __repr__(self):
        return f"{self.name} api-key {self.api_key}"

    @staticmethod
    def get_user(api_key):
        return User.query.filter(User.api_key == api_key).first()


def generate_month(mapper, connection, target):
    target.date = target.date[3:]


class Month(db.Model):
    __tablename__ = 'months'
    date = db.Column(db.String(12), primary_key=True, nullable=False)
    user_last_name = db.Column(db.String, db.ForeignKey('users.last_name'))
    running_min = db.Column(db.Integer, default=0)

    @property
    def serialize(self):
        return {
            'date': self.date,
            'last_name': self.user_last_name,
            'running_min': self.running_min
        }

    @staticmethod
    def check_month(last_name):
        return Month.query.filter(Month.user_last_name == last_name,
                                  Month.date == datetime.today().strftime("%d/%m/%Y")[3:]).first()


event.listen(Month, 'before_insert', generate_month)


class Day(db.Model):
    __tablename__ = 'days'
    date = db.Column(db.String(10), primary_key=True, nullable=False)
    running_min = db.Column(db.Integer)
    # min = db.Column(db.Integer)
    user_last_name = db.Column(db.String, db.ForeignKey('users.last_name'))

    @property
    def serialize(self):
        return {
            'date': self.date,
            'running_min': self.running_min,
            'last_name': self.user_last_name
        }

    @staticmethod
    def by_month():
        return Day.query.join(User). \
            add_columns(User.name, User.last_name, User.api_key, Day.date, Day.running_min).all()

    @staticmethod
    def get_current_day(user_id):
        return Day.query.filter(Day.date == datetime.today().strftime("%d/%m/%Y"), user_id == user_id).first()

    def __repr__(self):
        return f"{self.date}"


# event.listen(Day, 'before_insert', generate_date)

# class Language(db.Model):
#     __tablename__ = 'languages'
#     id = db.Column(db.Integer, primary_key=True, nullable=False)
#     name = db.Column(db.String(64))

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
