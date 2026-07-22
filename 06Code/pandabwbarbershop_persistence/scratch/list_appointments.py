import asyncio
import os
from dotenv import load_dotenv
load_dotenv()

from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()
    appointments = await db.appointments.find_many()
    print("=== APPOINTMENTS IN DATABASE ===")
    for app in appointments:
        print(f"ID: {app.id} | Date: {app.appointment_date} | Status: {app.status} | Barber: {app.barber_id}")
    print("================================")
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
