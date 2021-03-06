from os import getenv
from os.path import dirname, join
from dotenv import load_dotenv
from os import urandom
from datetime import timedelta

root_dir = dirname(__file__)
dotenv_path = join(root_dir, '.env')
load_dotenv(dotenv_path)


class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
        user=getenv('DB_USERNAME'), pw=getenv('DB_PASSWORD'), url=getenv('DB_HOST'), db=getenv('DB_DATABASE')
    )
    # SQLALCHEMY_DATABASE_URI = 'sqlite:///' + join(root_dir, 'db.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = urandom(16)
    JWT_AUTH_USERNAME_KEY = 'last_name'
    JWT_AUTH_PASSWORD_KEY = 'api_key'
    JWT_AUTH_URL_RULE = '/identity'
    JWT_ACCESS_TOKEN_EXPIRES = 2592000
    JWT_EXPIRATION_DELTA = timedelta(seconds=2592000)





