from typing_extensions import Optional
from base import BaseEntity
from enum import Enum


class StorageStrategy(str, Enum):
    LOCAL = "LOCAL"
    DATABASE = "DATABASE"
    # ggf. weitere Strategien ergänzen


class Metadata(BaseEntity):
    id: Optional[int]
    path: Optional[str]
    title: str
    author: str
    file_name: str
    file_type: str
    file_size: int  # in Bytes (MySQL: INT UNSIGNED oder BIGINT UNSIGNED für große Dateien)
    subject: str
    storage_strategy: StorageStrategy