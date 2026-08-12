import io
import re
from fastapi import UploadFile, HTTPException
import pypdf
import mammoth

MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB

def normalize_text(text: str) -> str:
    """Removes excessive whitespace and standardizes newlines."""
    text = re.sub(r'\s*\n\s*', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

async def extract_text_from_file(file: UploadFile) -> str:
    """
    Extracts text from PDF or DOCX file.
    Rejects files over 5MB or unsupported types.
    """
    # Read the file contents into memory
    content = await file.read()
    
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File size exceeds the 5MB limit.")
        
    filename = file.filename or ""
    text = ""
    
    try:
        if filename.lower().endswith('.pdf') or file.content_type == 'application/pdf':
            pdf_reader = pypdf.PdfReader(io.BytesIO(content))
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        elif filename.lower().endswith('.docx') or file.content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            result = mammoth.extract_raw_text(io.BytesIO(content))
            text = result.value
        else:
            raise HTTPException(status_code=415, detail="Unsupported file format. Please upload PDF or DOCX.")
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")
        
    if not text.strip():
        raise HTTPException(status_code=400, detail="Could not extract any text from the document.")
        
    return normalize_text(text)
