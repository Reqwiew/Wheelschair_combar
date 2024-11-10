import asyncio

import uvicorn
from fastapi import FastAPI, Request

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy import Column, Integer, BIGINT
from sqlalchemy.orm import declarative_base
from starlette.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles

Base = declarative_base()
app = FastAPI()
engine = create_async_engine("sqlite+aiosqlite:///database.db")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/getCoins")
async def get_coins(user_id=0):
    async with AsyncSession(engine) as session:
        data = await session.get(Users, int(user_id))
        if data is None:
            user = Users(id=user_id)
            session.add(user)
            await session.commit()
            return {
                "id": user_id,
                "balance": 0,
            }
        return {
            "id": user_id,
            "balance": data.balance,
        }


@app.post("/addCoins")
async def add_coin(request: Request):
    user_data = await request.json()
    async with AsyncSession(engine) as session:
        data = await session.get(Users, user_data["user_id"])
        if data is None:
            user = Users(id=user_data["user_id"], balance=user_data["coins"])
            session.add(user)
            await session.commit()
            return {
                "id": user_data["user_id"],
                "balance": user_data["coins"],
            }
        data.balance += user_data["coins"]
        balance = data.balance
        user_id = data.id
        await session.commit()
        return {
            "id": user_id,
            "balance": balance,
        }
app.mount("/", StaticFiles(directory="pochti_homyak/build"))

class Users(Base):
    __tablename__ = "users"

    id = Column(BIGINT, primary_key=True)
    balance = Column(Integer, nullable=False, default=0)


async def create_tables() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


if __name__ == "__main__":
    asyncio.run(create_tables())
    uvicorn.run(app, host="127.0.0.1", port=8000)
