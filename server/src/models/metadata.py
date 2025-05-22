from typing_extensions import Optional
from base import BaseEntity
import filetype
from enum import Enum


class Metadata(BaseEntity):
    id: Optional[int]
    path: Optional[str]
    file_name: str
    file_type: filetype
    file_size: bytes
    subject: str # ToDo: maybe convert this type later to a Subject from SubjectModel
    storage_strategy: Enum


