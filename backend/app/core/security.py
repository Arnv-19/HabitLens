from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.jwt_utils import verify_token

security_scheme = HTTPBearer()


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    """Dependency to extract and verify the current user from JWT token."""
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    return payload
