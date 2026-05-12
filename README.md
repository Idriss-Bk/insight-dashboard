# Business Insight Engine

A lightweight AI-powered dashboard that takes messy business data or notes and returns **3 insights, 2 risks, and 1 recommended action** — built as a single HTML file with no dependencies or build step.

## Live Demo

> Open `index.html` directly in your browser — no server needed.

Or host instantly via GitHub Pages (see below).

## What it does

Paste any raw business data — CSV rows, meeting notes, sales numbers, customer feedback, KPIs — and the app calls the Claude API to return structured analysis:

- **3 key insights** with specific numbers from your data
- **2 risks** with urgency and impact framing  
- **1 recommended action** with owner and expected outcome

Includes 3 sample datasets (sales, customer feedback, ops notes) for instant demo.

## Setup

No install required. Just open `index.html` in a browser.

The app calls the Anthropic API directly from the browser. Make sure you're running it from a context where the API is accessible (e.g. Claude.ai artifacts, or a proxy setup).

To host on GitHub Pages:
1. Push this repo to GitHub
2. Go to Settings → Pages → Source: `main` branch, `/ (root)`
3. Your live URL will be `https://<your-username>.github.io/<repo-name>/`

## Tech stack

- Vanilla HTML/CSS/JS — zero frameworks, zero build step
- Anthropic Messages API (`claude-sonnet-4-20250514`)
- Tabler Icons (CDN)

## AI tools used

- **Claude Sonnet 4** via the Anthropic API for structured business analysis
- The prompt enforces JSON-only output with a strict schema (insights/risks/action/summary)
- Claude was also used to generate the initial UI scaffold and refine the prompt

## Validation approach

- Prompt instructs the model to cite specific numbers from input data — avoids generic platitudes
- JSON output is parsed with try/catch; failures surface a user-visible error message
- Model is told to be "specific, opinionated, direct" to prevent vague analysis
- Tested against 3 different data types: sales, NPS/feedback, ops notes

## What I'd improve next

- **Streaming responses** — show insights as they arrive token by token
- **Confidence indicators** — low/med/high based on data quality and completeness
- **Domain detection** — auto-detect finance vs ops vs customer success to tune the prompt
- **Multi-period comparison** — paste two time periods to get trend analysis
- **Export** — download analysis as PDF or copy as Markdown
- **CLI version** — Python script that reads CSV from stdin, writes structured Markdown output
- **History** — save past analyses in localStorage for comparison

## Time breakdown (30–45 min task)

| Phase | Time |
|---|---|
| UI design + layout | ~10 min |
| API integration + prompt engineering | ~10 min |
| Sample data + error handling | ~8 min |
| README + submission notes | ~7 min |

---

Built as a timed prototype — focus on judgment and UX, not polish.