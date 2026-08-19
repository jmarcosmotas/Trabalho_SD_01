from fastapi import FastAPI
from routers.auth import router as auth_router
from routers.create import router as create_router
from routers.read import router as read_router
from routers.delete import router as delete_router
from routers.update import router as update_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)
app.include_router(create_router)
app.include_router(read_router)
app.include_router(delete_router)
app.include_router(update_router)