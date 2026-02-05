from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Picset AI"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/picset_ai"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # 云雾 API
    YUNWU_API_URL: str = "https://yunwu.ai/v1"
    YUNWU_API_KEY: str = ""

    # Nano Banana API
    NANO_BANANA_API_URL: str = "https://yunwu.ai/fal-ai/nano-banana"

    # OSS/S3 Storage
    OSS_ACCESS_KEY: str = ""
    OSS_SECRET_KEY: str = ""
    OSS_BUCKET: str = "picset-ai"
    OSS_ENDPOINT: str = ""
    OSS_REGION: str = "cn-hangzhou"

    # Credits
    CREDIT_COST_GENESIS: int = 10
    CREDIT_COST_MIRROR: int = 15
    CREDIT_COST_REFINEMENT: int = 5
    CREDIT_COST_HD_EXPORT: int = 2
    DEFAULT_CREDITS: int = 100

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
