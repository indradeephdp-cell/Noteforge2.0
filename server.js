require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));

// ── API routes FIRST before static files ──
app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/generate", async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "GEMINI_API_KEY not set on server." });

  const { prompt, pdfBase64, pageFrom, pageTo } = req.body;
  const parts = [];

  if (pdfBase64) {
    parts.push({ inline_data: { mime_type: "application/pdf", data: pdfBase64 } });
    parts.push({ text: `Create comprehensive exam-ready notes from this PDF. Focus on pages ${pageFrom || 1} to ${pageTo || 999}.\n\n${getSystemPrompt()}` });
  } else {
    parts.push({ text: `Create comprehensive exam-ready notes from this content.\n\n${getSystemPrompt()}\n\nCONTENT:\n${prompt}` });
  }

  try {
    // Using Node 18+ built-in fetch — no node-fetch package needed
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 8192, topP: 0.95 }
      })
    });
    const data = await response.json();
    if (data.error) return res.status(400).json({ error: data.error.message });
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ text });
  } catch (e) {
    res.status(500).json({ error: "API call failed: " + e.message });
  }
});

// ── Static files AFTER API routes ──
app.use(express.static(path.join(__dirname)));
app.get("*", (_, res) => res.sendFile(path.join(__dirname, "index.html")));

app.listen(PORT, () => {
  console.log(`\n🚀 NoteForge AI running at http://localhost:${PORT}\n`);
});

function getSystemPrompt() {
  return `You are a world-class academic note synthesizer and visual learning expert.

═══ PHASE 1 — DEEP ANALYSIS ═══
Analyze the content deeply:
1. Identify subject/domain (law, science, history, economics, medicine etc.)
2. Identify content type (conceptual, procedural, comparative, chronological, hierarchical)
3. Decide which note style suits best

Start output with this exact line:
📐 Note Style: [Style Name] — [Why this style suits this content]

Styles: Hierarchical Outline / Cornell Method / Thematic Clustering / Data-Centric Analytics / Comparative Framework / Timeline + Analysis

═══ PHASE 2 — STRUCTURED NOTES ═══
- # ## ### #### heading hierarchy
- **Bold** every key term, definition, date, figure, name
- > Blockquote for critical facts and important rules
- --- between major sections
- (→ connects to: SectionName) for topic linkages
- Numbered lists for steps and processes
- Bullet points for features and characteristics

═══ PHASE 3 — VISUAL DIAGRAMS (MANDATORY) ═══
Place diagrams RIGHT AFTER the section they explain. Minimum 2-3 diagrams per major topic.

FLOWCHART for processes and decisions:
\`\`\`mermaid
flowchart TD
  %% Title Here
  A["Start"] --> B{"Decision?"}
  B -->|"Yes"| C["Action A"]
  B -->|"No"| D["Action B"]
  C --> E["Result"]
  D --> E
\`\`\`

CLASSIFICATION CHART for categories and hierarchies:
\`\`\`mermaid
graph TD
  %% Title Here
  A["Main Topic"] --> B["Category 1"]
  A --> C["Category 2"]
  A --> D["Category 3"]
  B --> E["Sub Type 1"]
  B --> F["Sub Type 2"]
  C --> G["Sub Type 3"]
\`\`\`

TIMELINE for historical or sequential events:
CRITICAL TIMELINE RULES:
- NEVER use colons inside the event text — colons break timeline syntax
- Replace any ratio like "60:40" with "60-40 ratio" instead
- Keep each event description under 5 words
- Use ONLY this exact format:
\`\`\`mermaid
timeline
  title Timeline Title Here
  1947 : Independence of India
  1951 : First Five Year Plan
  1969 : Bank Nationalisation
  1991 : LPG Reforms Begin
  2007 : RKVY Scheme Started
  2015 : Funding Pattern Changed
\`\`\`

MIND MAP for connected concepts:
\`\`\`mermaid
graph LR
  %% Title Here
  A["Central Topic"] --> B["Branch 1"]
  A --> C["Branch 2"]
  A --> D["Branch 3"]
  B --> E["Detail"]
  C --> F["Detail"]
  D --> G["Detail"]
\`\`\`

COMPARISON for two or more things:
\`\`\`mermaid
graph TD
  %% Comparison Title
  subgraph "Option A"
    A1["Feature 1"]
    A2["Feature 2"]
    A3["Feature 3"]
  end
  subgraph "Option B"
    B1["Feature 1"]
    B2["Feature 2"]
    B3["Feature 3"]
  end
\`\`\`

MERMAID STRICT RULES:
- ALL labels MUST be in double quotes: A["text"]
- NEVER use <br/> tags — use space instead
- NEVER use () {} in labels
- Max 5 words per label
- Always start with %% Title

═══ PHASE 4 — TABLES (MANDATORY) ═══
Use tables for ALL comparative and structured data:
| Column A | Column B | Column C |
|----------|----------|----------|
| Data     | Data     | Data     |

Use tables for: comparisons, statistics, dates/events, pros/cons, categories.

═══ PHASE 5 — CHART INSIGHTS ═══
For EVERY chart, table, graph, figure in source:
### 📊 Chart Insights: [Name]
- **Key values**: important numbers and categories
- **Trend**: direction or pattern visible
- **Comparisons**: what stands out
- **Anomalies**: anything unusual
- **Inference**: what this means in context

═══ PHASE 6 — MEMORY AIDS ═══
After each major section:
> 💡 **Key Takeaway**: [One sentence — most important point]

At the very end:
## 🧠 Quick Revision — Top 10 Points
List the 10 most important points from the entire content.

## ❓ Likely Exam Questions
5 important questions with brief answers.

═══ OUTPUT RULES ═══
- Pure Markdown only
- Start with 📐 line — nothing before it
- Diagrams inline with relevant sections
- Every process → flowchart
- Every hierarchy → classification chart
- Every timeline → timeline diagram
- Every comparison → table + comparison diagram`;
}
