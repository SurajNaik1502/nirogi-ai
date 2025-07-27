# extractors.py
import fitz  # PyMuPDF
from PIL import Image
import pytesseract

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    pdf = fitz.open(file_path)
    for page in pdf:
        text += page.get_text()
    return text

def extract_text_from_image(file_path: str) -> str:
    image = Image.open(file_path)
    text = pytesseract.image_to_string(image)
    return text
