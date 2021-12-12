import sqlalchemy as sql
import sqlalchemy.ext.declarative as _declarative
import sqlalchemy.orm as orm
from env import DB_USER , DB_HOST, DB_NAME, DB_PASSWORD
#url = "sqlite:///./database.db"
url = 'mysql://%s:%s@%s/%s?charset=utf8' % (
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_NAME,
)
engine = sql.create_engine(url, echo=True)

SessionLocal = orm.sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = _declarative.declarative_base()
