# Judge Walkthrough

## 30-second summary
Proofrail is a trust layer for autonomous agents. It gives agents bounded authority, enforces policy constraints, and emits verifiable receipts for every important action. The key idea is that safe autonomy is not only about what an agent can do, but also about what it refuses to do.

## What to look at first
1. `README.md`
2. `agent.json`
3. `agent_log.json`
4. `dashboard/index.html`
5. `receipts/`

## Demo story
The local demo intentionally shows **two scenarios**:

### Scenario A — Allowed execution
- A user requests a sensitive but in-scope task
- Proofrail compiles a policy
- The action is allowed
- The receipt shows successful execution

### Scenario B — Blocked execution
- A user requests an out-of-scope, high-risk action
- The policy denies the action because the action type, target, and spend all violate constraints
- The system emits a blocked receipt instead of blindly executing

This is a core claim of the project: **the blocked path is a product feature, not a product failure**.

## Why this matters
Most agent demos only prove that the system can act. Proofrail tries to prove a more important property for real deployment:

- autonomous action
- bounded authority
- auditable behavior
- refusal of unsafe execution

## How this maps to tracks

### Open Track
Proofrail is a broad infrastructure project for the agent economy, spanning trust, privacy, authority, and safety.

### Agents With Receipts — ERC-8004
The system is built around verifiable outputs, explicit agent/operator identity, and judging artifacts (`agent.json`, `agent_log.json`, receipts).

### Let the Agent Cook — No Humans Required
The build documents a full loop: discover → plan → execute → verify → submit.

### Private Agents, Trusted Actions
The system is explicitly private-by-default and tries to expose only trustworthy outputs rather than raw sensitive context.

### Best Use of Delegations
Proofrail's authority model is based on scoped permissions rather than broad control.

## Quick run
```bash
cd proofrail
npm start
open dashboard/index.html
```

## Key takeaway
Proofrail is an argument for safer agent autonomy: agents should be able to act with real power, but only inside enforceable boundaries and with receipts that make their behavior legible.
