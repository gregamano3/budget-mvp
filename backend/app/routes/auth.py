"""
Auth routes: signup, login.
"""

from fastapi import APIRouter, HTTPException, status

from app.schemas import UserCreate, UserLogin, UserResponse, Token
from app.database import create_user, get_user_by_email
from app.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def signup(body: UserCreate):
    """Register a new user account."""
    if get_user_by_email(body.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    hashed = hash_password(body.password)
    user = create_user(
        full_name=body.full_name,
        email=body.email,
        hashed_password=hashed,
    )
    return user


@router.post("/login", response_model=Token)
def login(body: UserLogin):
    """Authenticate and return an access token."""
    user = get_user_by_email(body.email)
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user["id"])
    return {"access_token": token, "token_type": "bearer"}
