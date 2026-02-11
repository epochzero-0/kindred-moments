import { Event, EventType, User } from "@/types";

export interface EventSuggestion {
  eventId: string;
  eventTitle: string;
  matchScore: number;
  reason: string;
  suggestedAction: "going" | "interested";
}

export interface TimeSlotSuggestion {
  time: string;
  score: number;
  reason: string;
}

export function useEventAI() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Get AI-powered event suggestions based on user profile
  const getSuggestedEvents = async (
    user: User,
    events: Event[]
  ): Promise<EventSuggestion[]> => {
    if (!apiKey) {
      console.warn("OpenAI API key not configured");
      return [];
    }

    try {
      const prompt = `You are a community event recommendation assistant. Analyze this data and provide recommendations.

User Profile:
- Name: ${user.name}
- Interests: ${user.interests.join(", ")}
- Neighbourhood: ${user.neighbourhood}
- Comfort Level: ${user.comfort_level}
- Available Times: ${user.free_slots.join(", ")}
- Languages: ${user.languages.join(", ")}

Available Events (next 2 weeks):
${events.map(e => `- [ID: ${e.id}] ${e.title} (${e.type}) at ${e.location} on ${e.date.toLocaleDateString()} ${e.date.toLocaleTimeString()}`).join("\n")}

Tasks:
1. Recommend the top 3 events this user would most enjoy
2. For each recommendation, explain WHY it matches their profile
3. Suggest optimal RSVP action (going or interested)
4. IMPORTANT: You must return the EXACT "ID" provided in the list above for the "eventId" field. Do not invent IDs.

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "recommendations": [
    {
      "eventId": "exact_id_from_list",
      "eventTitle": "event title here",
      "matchScore": 8,
      "reason": "explanation here",
      "suggestedAction": "going"
    }
  ]
}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      // Parse the JSON response
      const parsed = JSON.parse(content);
      return parsed.recommendations || [];
    } catch (error) {
      console.error("Error getting AI event suggestions:", error);
      return [];
    }
  };

  // Generate event description using AI
  const generateEventDescription = async (
    title: string,
    type: EventType,
    location?: string
  ): Promise<string> => {
    if (!apiKey) {
      return "";
    }

    try {
      const prompt = `Write a friendly, engaging event description for a community event titled "${title}" of type "${type}"${location ? ` at ${location}` : ""}.

Requirements:
- Keep it 2-3 sentences
- Make it inviting and community-focused
- Mention what participants can expect
- Use warm, inclusive language
- Don't use emojis

Return ONLY the description text, nothing else.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error generating event description:", error);
      return "";
    }
  };

  // Suggest optimal time slots based on user's schedule
  const suggestOptimalTime = async (
    user: User,
    existingEvents: Event[],
    proposedDate?: Date
  ): Promise<TimeSlotSuggestion[]> => {
    if (!apiKey) {
      return [];
    }

    try {
      const dateStr = proposedDate ? proposedDate.toDateString() : "next week";

      const prompt = `You are a smart scheduling assistant. Analyze the user's schedule and suggest optimal time slots.

User's Available Time Slots:
${user.free_slots.join(", ")}

Existing Events on ${dateStr}:
${existingEvents.filter(e => proposedDate ?
        new Date(e.date).toDateString() === proposedDate.toDateString() : true
      ).map(e => `- ${e.title} at ${e.date.toLocaleTimeString()}`).join("\n") || "None"}

User's Comfort Level: ${user.comfort_level}

Tasks:
1. Suggest 3 optimal time slots that don't conflict with existing events
2. Consider the user's comfort level (${user.comfort_level}s prefer ${user.comfort_level === "introvert" ? "smaller, quieter times" :
          user.comfort_level === "extrovert" ? "peak social times" :
            "flexible timing"
        })
3. Explain why each time slot is good

Return ONLY valid JSON (no markdown):
{
  "suggestions": [
    {
      "time": "2:00 PM",
      "score": 9,
      "reason": "explanation"
    }
  ]
}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 400
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      const parsed = JSON.parse(content);
      return parsed.suggestions || [];
    } catch (error) {
      console.error("Error suggesting optimal time:", error);
      return [];
    }
  };

  // Generate tags for an event
  const generateEventTags = async (
    title: string,
    type: EventType,
    description?: string
  ): Promise<string[]> => {
    if (!apiKey) {
      return [];
    }

    try {
      const prompt = `Generate 3-5 relevant tags for this community event:
Title: ${title}
Type: ${type}
${description ? `Description: ${description}` : ""}

Return ONLY a JSON array of tag strings, like: ["tag1", "tag2", "tag3"]
No markdown, no code blocks, just the JSON array.`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
          max_tokens: 100
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      return JSON.parse(content);
    } catch (error) {
      console.error("Error generating event tags:", error);
      return [];
    }
  };

  return {
    getSuggestedEvents,
    generateEventDescription,
    suggestOptimalTime,
    generateEventTags,
    isConfigured: !!apiKey,
  };
}
