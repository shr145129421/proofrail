# Artifact Index

## Fastest review path
If you only have 2 minutes, read these in order:

1. `docs/PROJECT_BRIEF.md`
2. `docs/JUDGE_WALKTHROUGH.md`
3. `agent.json`
4. `agent_log.json`
5. `dashboard/index.html`

## Core artifacts

### Project framing
- `README.md` — high-level overview
- `docs/PROJECT_BRIEF.md` — compact summary
- `docs/TRACK_MAPPING.md` — current strength by track
- `docs/SPONSOR_ANGLES.md` — sponsor-specific framing

### Judge-facing execution evidence
- `agent.json` — manifest
- `agent_log.json` — structured execution/build log
- `receipts/demo-receipt-*.json` — successful in-policy execution
- `receipts/blocking-receipt-*.json` — blocked out-of-policy execution

### Demo materials
- `dashboard/index.html` — visual walkthrough
- `docs/DEMO_SCRIPT.md` — concise demo narration

### Policy and safety model
- `policies/demo-policy.json` — allowed-path policy
- `policies/demo-task.json` — allowed-path task
- `policies/blocking-policy.json` — blocked-path policy
- `policies/blocking-task.json` — blocked-path task

## Core project claim
Proofrail should be judged not only by whether the agent can act, but by whether the agent can refuse unsafe execution while still leaving behind legible receipts.
