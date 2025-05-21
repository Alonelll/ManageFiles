from fastapi import APIRouter

router = APIRouter()

@router.get("/materials")
def get_materials():
    return {"message": "Hier könnten Materialien stehen"}

@router.post("/materials")
def upload_material():
    return {"message": "Material hochgeladen"}
