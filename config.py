from os import getenv
from os.path import dirname, join
from dotenv import load_dotenv

root_dir = dirname(__file__)
dotenv_path = join(root_dir, '.env')
load_dotenv(dotenv_path)


class Config:
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://{user}:{pw}@{url}/{db}'.format(
        user=getenv('DB_USERNAME'), pw=getenv('DB_PASSWORD'), url=getenv('DB_HOST'), db=getenv('DB_DATABASE')
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


