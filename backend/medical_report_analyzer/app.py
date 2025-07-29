# app.py
from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

from extractors import extract_text_from_pdf, extract_text_from_image
from analyzer import analyze_report_text

app = FastAPI()

# Enable CORS for local frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.post("/upload-report/")
async def upload_report(
    report_type: str = Form(...),
    report_date: str = Form(...),
    file: UploadFile = Form(...)
):
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if file.filename.lower().endswith(".pdf"):
        text = extract_text_from_pdf(file_location)
    elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        text = extract_text_from_image(file_location)
    else:
        return {"error": "Unsupported file format"}

    analysis = analyze_report_text(text)

    return {
        "report_type": report_type,
        "report_date": report_date,
        "summary": analysis["summary"],
        "detailed_analysis": analysis["detailed_analysis"],
    }

