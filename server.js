require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "100mb" }));

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/generate", async (req, res) => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: "GEMINI_API_KEY not set on server." });
  const { prompt, pdfBase64, pageFrom, pageTo } = req.body;
  const parts = [];
  if (pdfBase64) {
    parts.push({ inline_data: { mime_type: "application/pdf", data: pdfBase64 } });
    parts.push({ text: `Create comprehensive exam-ready notes from this PDF. Pages ${pageFrom||1} to ${pageTo||999}.\n\n${SYS()}` });
  } else {
    parts.push({ text: `Create comprehensive exam-ready notes:\n\n${SYS()}\n\nCONTENT:\n${prompt}` });
  }
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ contents:[{role:"user",parts}], generationConfig:{temperature:0.4,maxOutputTokens:8192,topP:0.95} })
    });
    const d = await r.json();
    if (d.error) return res.status(400).json({ error: d.error.message });
    res.json({ text: d?.candidates?.[0]?.content?.parts?.[0]?.text || "" });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.use(express.static(path.join(__dirname)));
app.get("*", (_, res) => res.sendFile(path.join(__dirname, "index.html")));
app.listen(PORT, () => console.log(`\n🚀 NoteForge AI → http://localhost:${PORT}\n`));

function SYS() {
  return `You are a world-class academic note synthesizer and visual learning expert.

START your output with this exact line (nothing before it):
Note Style: [Name] - [one sentence reason]
Choose from: Hierarchical Outline / Cornell Method / Thematic Clustering / Data-Centric Analytics / Comparative Framework / Timeline + Analysis

NOTES RULES:
- # ## ### #### heading hierarchy
- **Bold** all key terms, names, dates, figures
- > Blockquote for critical facts
- --- between major sections
- Numbered lists for steps and processes

MANDATORY VISUAL DIAGRAMS - YOU MUST include ALL relevant types throughout the notes:

1. FLOWCHART - for every process, workflow, decision:
\`\`\`mermaid
flowchart TD
  %% Title Here
  A["Start Point"] --> B{"Decision?"}
  B -->|"Yes"| C["Action A"]
  B -->|"No"| D["Action B"]
  C --> E["End Result"]
  D --> E
\`\`\`

2. CLASSIFICATION CHART - for every hierarchy, category, structure:
\`\`\`mermaid
graph TD
  %% Title Here
  A["Main Concept"] --> B["Category 1"]
  A --> C["Category 2"]
  A --> D["Category 3"]
  B --> E["Sub Type 1"]
  B --> F["Sub Type 2"]
  C --> G["Sub Type 3"]
\`\`\`

3. TIMELINE - for every chronological sequence:
\`\`\`mermaid
timeline
  title Timeline Title
  2007 : RKVY Started
  2014 : Scheme Revised
  2015 : Funding Changed
  2021 : New Phase
  2025 : Current Status
\`\`\`
TIMELINE STRICT RULES: NEVER use colons inside event text. Max 4 words after colon.

4. MIND MAP - for every concept with multiple connections:
\`\`\`mermaid
graph LR
  %% Title Here
  A["Central Idea"] --> B["Aspect 1"]
  A --> C["Aspect 2"]
  A --> D["Aspect 3"]
  B --> E["Detail"]
  C --> F["Detail"]
  D --> G["Detail"]
\`\`\`

5. COMPARISON - for every comparison between entities:
\`\`\`mermaid
graph TD
  %% Comparison Title
  subgraph "Entity A"
    A1["Feature 1"]
    A2["Feature 2"]
    A3["Feature 3"]
  end
  subgraph "Entity B"
    B1["Feature 1"]
    B2["Feature 2"]
    B3["Feature 3"]
  end
\`\`\`

MERMAID STRICT RULES:
- ALL labels MUST be in double quotes: A["text here"]
- NEVER use <br/> HTML tags - use a space instead
- NEVER use () {} special chars in labels
- Keep each label under 5 words
- Always start diagram with %% Title comment

MANDATORY TABLES - use for ALL comparative and structured data:
| Column A | Column B | Column C |
|----------|----------|----------|
| data     | data     | data     |

CHART AND TABLE INSIGHTS - for EVERY chart/table/figure in source:
### Chart Insights: [Exact Name]
- Key values: important numbers and categories
- Trend: direction or pattern
- Comparisons: what stands out
- Anomalies: anything unusual
- Inference: what this means in context

MEMORY AIDS - after each major section add:
> Key Takeaway: [one sentence most important point]

At the very end add:
## Quick Revision - Top 10 Points
List 10 most important points from entire content.

## Likely Exam Questions
5 questions with brief answers.

USAGE RULES:
- Every process -> flowchart
- Every hierarchy -> classification chart
- Every timeline of events -> timeline diagram
- Every concept map -> mind map
- Every comparison -> comparison diagram + table
- Every structured data -> table
- Minimum 3 diagrams per major section

OUTPUT: Pure Markdown only. Start with Note Style line. Nothing before it.`;
}
