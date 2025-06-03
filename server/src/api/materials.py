from . import apiRouter as router

@router.get("/materials")
async def get_materials():
    return {"message": "Hier könnten Materialien stehen"}

@router.post("/materials")
async def upload_material():
    return {"message": "Material hochgeladen"}


