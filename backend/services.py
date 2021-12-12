from sqlalchemy.sql.expression import false
import fastapi as fastapi
import fastapi.security as security
from sqlalchemy.sql.functions import mode
import database
import datetime as dt
import sqlalchemy.orm as orm
import database, models, schemas
import passlib.hash as hash
import jwt 

oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/api/token")
JWT_SECRET = "THISISSUPERSECRETHEHE"

def create_database():
    return database.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_user_by_email(email: str, db: orm.Session):
    return db.query(models.User).filter(models.User.email == email).first()


async def create_user(user: schemas.UserCreate, db: orm.Session):
    user_obj = models.User(
        email=user.email, hashed_password= hash.bcrypt.hash(user.hashed_password)
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

async def authenticate_user(email: str, password: str, db: orm.Session):
    user = await get_user_by_email(db=db, email=email)
    if not user:
        return False
    if not user.verify_password(password):
        return False
    return user

async def create_token(user: models.User):
    user_obj = schemas.User.from_orm(user)
    token = jwt.encode(user_obj.dict(), JWT_SECRET)

    return dict(access_token=token, token_type="bearer")

async def get_current_user(db:orm.Session = fastapi.Depends(get_db) , token: str = fastapi.Depends(oauth2schema)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user = db.query(models.User).get(payload["id"])
    except:
        raise fastapi.HTTPException(status_code=401, detail="Invalid email or password")
    return schemas.User.from_orm(user)

async def create_lead(user: schemas.User, db: orm.Session, lead: schemas.LeadCreate):
    lead = models.Lead(**lead.dict() , owner_id=user.id)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return schemas.Lead.from_orm(lead)

async def get_leads(user: schemas.User, db: orm.Session):
    leads = db.query(models.Lead).filter_by(owner_id=user.id)
    return list(map(schemas.Lead.from_orm, leads))

async def _lead_selector(lead_id: int ,user: schemas.User, db: orm.Session):
    lead = db.query(models.Lead).filter_by(owner_id=user.id).filter(models.Lead.id == lead_id).first()
    if lead is None:
        raise fastapi.HTTPException(status_code=404, detail="Lead does not exits")
    return lead

async def get_lead(lead_id: int ,user: schemas.User, db: orm.Session):
    lead = await _lead_selector(lead_id=lead_id, user=user, db=db)
    return schemas.Lead.from_orm(lead)

async def delete_lead(lead_id: int ,user: schemas.User, db: orm.Session):
    lead = await _lead_selector(lead_id, user, db)
    db.delete(lead)
    db.commit()

async def update_lead(lead_id: int, lead: schemas.LeadCreate ,user: schemas.User, db: orm.Session):
    lead_db = await _lead_selector(lead_id, user,db)
    lead_db.first_name = lead.first_name
    lead_db.last_name = lead.last_name
    lead_db.email = lead.email
    lead_db.company = lead.company
    lead_db.note = lead.note
    lead_db.date_last_updated = dt.datetime.utcnow()

    db.commit()
    db.refresh(lead_db)
    return schemas.Lead.from_orm(lead_db)
