import os
import httpx
from fastapi import HTTPException
from app.core.config import settings

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) evaluator and senior technical recruiter.

Your task is to compare a candidate's resume against a target job description.

Evaluate:

• ATS Match Score (0-100)
• Matched Keywords
• Missing Keywords
• Technical Skills Match
• Soft Skills Match
• Education Match
• Experience Match
• Formatting Problems
• ATS Compatibility
• Resume Readability
• Grammar Issues
• Action Verb Quality

Return STRICT JSON ONLY.

Never include markdown.

Never explain your reasoning.

Return exactly:

{
  "score":0,
  "matched_keywords":[],
  "missing_keywords":[],
  "formatting_issues":[],
  "suggestions":[]
}"""

async def evaluate_resume(resume_text: str, job_description: str) -> str:
    """
    Calls Groq to evaluate the resume against the job description.
    Returns the raw JSON string response.
    """
    api_key = settings.GROQ_API_KEY
    if not api_key:
        # Failsafe if not properly loaded
        raise HTTPException(status_code=500, detail="Groq API key is not configured.")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    user_prompt = f"Resume:\n{resume_text}\n\nJob Description:\n{job_description}"

    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt}
        ],
        "temperature": 0.2, # Low temperature for more deterministic JSON
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(GROQ_API_URL, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except httpx.HTTPStatusError as e:
            # We don't want to expose API errors directly to the user
            print(f"Groq HTTP error: {e}")
            raise HTTPException(status_code=502, detail="Failed to communicate with AI service.")
        except Exception as e:
            print(f"Groq request failed: {e}")
            raise HTTPException(status_code=500, detail="An error occurred during AI evaluation.")
