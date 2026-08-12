import json
from typing import Any, Dict
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session
from app.services.resume_parser import extract_text_from_file
from app.services.groq_client import evaluate_resume
from app.utils.json_parser import parse_json_safely
from app.utils.validators import validate_ats_response
from app.models.ats import AtsReport

async def perform_ats_check(
    db: Session,
    user_id: str,
    resume_file: UploadFile,
    job_description: str
) -> Dict[str, Any]:
    # 1. Extract text
    resume_text = await extract_text_from_file(resume_file)
    
    # 2. Call Groq, with 1 retry on JSON parse failure
    max_retries = 1
    raw_response = ""
    parsed_json = None
    
    for attempt in range(max_retries + 1):
        raw_response = await evaluate_resume(resume_text, job_description)
        try:
            parsed_json = parse_json_safely(raw_response)
            validate_ats_response(parsed_json)
            break # Success
        except ValueError as e:
            if attempt == max_retries:
                print(f"Failed to parse or validate JSON after {max_retries} retries: {e}")
                print(f"Raw response was: {raw_response}")
                raise HTTPException(status_code=502, detail="Received an invalid response format from the AI service.")
            else:
                # Retry
                continue

    if not parsed_json:
        raise HTTPException(status_code=502, detail="Failed to generate evaluation.")
        
    # 3. Store result in database
    try:
        report = AtsReport(
            user_id=user_id,
            score=int(parsed_json.get("score", 0)),
            job_title="", # We don't have a title field in the form yet, could extract or pass
            matched_keywords=parsed_json.get("matched_keywords", []),
            missing_keywords=parsed_json.get("missing_keywords", []),
            formatting_issues=parsed_json.get("formatting_issues", []),
            suggestions=parsed_json.get("suggestions", [])
        )
        db.add(report)
        db.commit()
    except Exception as e:
        print(f"Failed to save ATS report to database: {e}")
        # We can still return the result to the user even if DB save fails
        pass

    return parsed_json
