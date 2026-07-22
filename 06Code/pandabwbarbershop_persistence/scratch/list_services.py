import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()
    services = await db.services.find_many()
    print("=== SERVICES IN DATABASE ===")
    for s in services:
        print(f"ID: {s.id} | Name: {s.name} | Price: {s.price} | Active: {s.is_active} | Barbershop: {s.barbershop_id}")
    print("============================")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
