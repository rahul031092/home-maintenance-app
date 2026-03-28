import { HomeProfile, MaintenancePlan, TaskOverride } from "./types";

export async function generatePlan(
  profile: HomeProfile,
  overrides: TaskOverride[] = [],
  years = 2
): Promise<MaintenancePlan> {
  const res = await fetch("/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, overrides, years }),
  });
  if (!res.ok) throw new Error(`Plan generation failed: ${res.status}`);
  return res.json();
}

export async function downloadIcs(
  profile: HomeProfile,
  overrides: TaskOverride[] = [],
  years = 2
): Promise<void> {
  const res = await fetch("/api/plan/ics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, overrides, years }),
  });
  if (!res.ok) throw new Error(`ICS export failed: ${res.status}`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "home-maintenance.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export async function checkChatStatus(): Promise<boolean> {
  try {
    const res = await fetch("/api/chat/status");
    if (!res.ok) return false;
    const data = await res.json();
    return data.available;
  } catch {
    return false;
  }
}

export async function* streamChat(
  message: string,
  profile: HomeProfile,
  planSummary: string,
  history: { role: string; content: string }[]
): AsyncGenerator<string> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      profile,
      plan_summary: planSummary,
      history,
    }),
  });

  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.content) yield data.content;
          if (data.error) throw new Error(data.error);
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }
  }
}
