const SAMPLES = {
  sales: `Q1 2024 Sales Data (Regional):
North: $412,000 (target $380k) — 3 reps, avg deal $28k, 14 deals closed
South: $198,000 (target $290k) — 2 reps, avg deal $19k, 10 deals closed
East: $521,000 (target $500k) — 4 reps, avg deal $31k, 17 deals closed
West: $89,000 (target $200k) — 1 rep (other resigned Jan), avg deal $22k, 4 deals
Product mix: SaaS licenses 60%, Pro Services 28%, Support contracts 12%
Churn: 3 customers lost (all SMB tier, $42k ARR total)
Pipeline: $1.1M in stage 3+ deals, avg close probability 38%
New logo wins: 6 this quarter (avg size $25k ARR)`,

  feedback: `Customer support tickets + NPS responses — last 30 days:
NPS score: 34 (down from 51 last quarter)
Top complaints (support tickets):
- Slow loading/performance issues: 47 tickets
- Billing confusion / wrong charges: 31 tickets
- Feature X not working on mobile: 28 tickets
- Onboarding too complex: 19 tickets
- Can't export data: 14 tickets
Positive feedback themes: great customer support team (12 mentions), love the reporting module (9 mentions)
Churn interviews (5 customers): 4 cited performance, 1 cited price
Trial-to-paid conversion: 18% (was 24% 6 months ago)
Support ticket volume up 34% MoM`,

  ops: `Weekly ops standup notes — last 4 weeks:
Wk1: Server outage 3hrs (Mon), lost ~$12k revenue. Root cause: DB migration script. 2 engineers OOO.
Wk2: Shipping delays from supplier — 4 orders >7 days late. Customers complaining. Inventory low on SKU-332 and SKU-441.
Wk3: New hire onboarding — 2 engineers started. Deploy pipeline broken for 2 days. Sales team closed record $180k week.
Wk4: Supply chain issue resolved. Still missing SLA on 6 open enterprise support tickets. Finance flagged COGS up 18% vs last quarter. Marketing campaign launched — early CTR good (3.2%).`
};

function loadSample(key) {
  document.getElementById('dataInput').value = SAMPLES[key];
}

function reset() {
  document.getElementById('dataInput').value = '';
  const r = document.getElementById('results');
  r.style.display = 'none';
  r.classList.remove('visible');
  document.getElementById('btnText').textContent = 'Analyze data';
}

async function analyze() {
  const data = document.getElementById('dataInput').value.trim();
  if (!data) return;

  const btn      = document.getElementById('analyzeBtn');
  const spinner  = document.getElementById('spinner');
  const btnIcon  = document.getElementById('btnIcon');
  const btnText  = document.getElementById('btnText');
  const errorMsg = document.getElementById('errorMsg');
  const results  = document.getElementById('results');

  btn.disabled = true;
  spinner.style.display = 'block';
  btnIcon.style.display = 'none';
  btnText.textContent = 'Analyzing…';
  errorMsg.style.display = 'none';
  results.style.display = 'none';
  results.classList.remove('visible');

  const prompt = `You are a sharp business analyst. Analyze the data below and return ONLY a valid JSON object (no markdown, no preamble) with this exact structure:

{
  "insights": [
    {"title": "short title", "body": "1-2 sentence insight with specific numbers where available"},
    {"title": "short title", "body": "1-2 sentence insight"},
    {"title": "short title", "body": "1-2 sentence insight"}
  ],
  "risks": [
    {"title": "short risk title", "body": "1-2 sentence risk with urgency and impact"},
    {"title": "short risk title", "body": "1-2 sentence risk"}
  ],
  "action": {
    "title": "single most important action",
    "body": "2-3 sentences: what to do, who should own it, expected outcome"
  },
  "summary": "one plain-English sentence summarizing what this data is about"
}

Be specific, opinionated, direct. Cite numbers. No generic platitudes.

DATA:
${data}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const json  = await res.json();
    const text  = json.content?.map(b => b.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    renderResults(parsed);
  } catch (e) {
    errorMsg.textContent = '// Analysis failed — check your data and try again.';
    errorMsg.style.display = 'block';
  } finally {
    btn.disabled = false;
    spinner.style.display = 'none';
    btnIcon.style.display = '';
    btnText.textContent = 'Analyze again';
  }
}

function renderResults(p) {
  document.getElementById('insights').innerHTML = p.insights.map(i => `
    <div class="card">
      <div class="card-icon-wrap insight"><i class="ti ti-chart-dots-3"></i></div>
      <div>
        <div class="card-title insight">${i.title}</div>
        <div class="card-body">${i.body}</div>
      </div>
    </div>`).join('');

  document.getElementById('risks').innerHTML = p.risks.map(r => `
    <div class="card risk-card">
      <div class="card-icon-wrap risk"><i class="ti ti-alert-triangle"></i></div>
      <div>
        <div class="card-title risk">${r.title}</div>
        <div class="card-body">${r.body}</div>
      </div>
    </div>`).join('');

  document.getElementById('action').innerHTML = `
    <div class="card action-card">
      <div class="card-icon-wrap action"><i class="ti ti-arrow-right"></i></div>
      <div>
        <div class="card-title action">${p.action.title}</div>
        <div class="card-body">${p.action.body}</div>
      </div>
    </div>`;

  document.getElementById('footerNote').textContent = `// ${p.summary || ''}`;
  const results = document.getElementById('results');
  results.style.display = 'block';
  requestAnimationFrame(() => results.classList.add('visible'));
}