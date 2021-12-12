from typing import Dict
from pydantic import BaseModel

class BarModel(BaseModel):
    whatever: float
    foo: str

class FooBarModel(BaseModel):
    dictionaries: Dict[str, BarModel]

m1 = FooBarModel(dictionaries={
    'a': {'whatever': 12.3, 'foo': 'hello'},
    'b': {'whatever': 12.4, 'foo': 'bye'}
})

print(m1.dict())
