"""AI chat endpoints using Ollama."""

import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ..models import ChatRequest
from ..ollama_client import check_ollama_status, stream_chat

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.get("/status")
async def chat_status():
    """Check if Ollama is available."""
    available = await check_ollama_status()
    return {"available": available}


@router.post("")
async def chat(request: ChatRequest):
    """Stream a chat response about home maintenance."""
    system_prompt = (
        "You are a knowledgeable home maintenance advisor. "
        "You give practical, safety-conscious advice about maintaining a home. "
        "Be concise but thorough. If something requires a professional, say so.\n\n"
    )

    if request.profile:
        system_prompt += (
            f"The user's home details:\n"
            f"- Year built: {request.profile.year_built}\n"
            f"- Square footage: {request.profile.square_footage}\n"
            f"- Home type: {request.profile.home_type}\n"
            f"- Floors: {request.profile.num_floors}\n"
            f"- HVAC: {request.profile.hvac_type}\n"
            f"- Water heater: {request.profile.water_heater}\n"
            f"- Roof: {request.profile.roof_material}\n"
            f"- Has basement: {request.profile.has_basement}\n"
            f"- Has attic: {request.profile.has_attic}\n"
            f"- Has pool: {request.profile.has_pool}\n"
            f"- Has sprinkler system: {request.profile.has_sprinkler_system}\n"
        )

    if request.plan_summary:
        system_prompt += f"\nCurrent maintenance plan summary:\n{request.plan_summary}\n"

    messages = request.history + [{"role": "user", "content": request.message}]

    async def event_stream():
        try:
            async for chunk in stream_chat(system_prompt, messages):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )
