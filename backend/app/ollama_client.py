"""Ollama HTTP client for streaming chat responses."""

from collections.abc import AsyncIterator

import httpx

OLLAMA_BASE = "http://localhost:11434"
MODEL = "llama3.1:8b"


async def check_ollama_status() -> bool:
    """Check if Ollama is running and accessible."""
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{OLLAMA_BASE}/api/tags")
            return resp.status_code == 200
    except (httpx.ConnectError, httpx.TimeoutException):
        return False


async def stream_chat(
    system_prompt: str,
    messages: list[dict],
) -> AsyncIterator[str]:
    """Stream a chat response from Ollama."""
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            *messages,
        ],
        "stream": True,
    }

    async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=10.0)) as client:
        async with client.stream(
            "POST",
            f"{OLLAMA_BASE}/api/chat",
            json=payload,
        ) as response:
            import json
            async for line in response.aiter_lines():
                if line.strip():
                    try:
                        data = json.loads(line)
                        content = data.get("message", {}).get("content", "")
                        if content:
                            yield content
                    except json.JSONDecodeError:
                        continue
