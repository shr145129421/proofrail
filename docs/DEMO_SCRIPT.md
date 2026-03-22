# Demo Script

## Goal
Show that Proofrail does two things well:
1. lets an autonomous agent act inside bounded authority
2. stops an autonomous agent when the request is unsafe or out of scope

## 90-second version

### Opening
"Proofrail is a trust layer for autonomous agents. Instead of giving an agent unlimited authority, it gives the agent a policy, enforces boundaries, and produces receipts for every critical action."

### Success scenario
- Open the dashboard
- Show the `demo` scenario
- Point out:
  - allowed action
  - allowlisted target
  - spend within cap
  - successful receipt

Narration:
"Here the request is sensitive, but still inside policy. Proofrail allows execution and emits a receipt that explains what happened."

### Blocked scenario
- Scroll to the `blocking` scenario
- Point out:
  - action not allowed
  - target not allowlisted
  - spend exceeds cap
  - confirmation required
  - final status is `blocked`

Narration:
"This is the more important path. Proofrail does not just help agents act. It helps them refuse unsafe or out-of-scope actions. The blocked path is part of the product."

### Close
"That is the thesis of Proofrail: safer agent autonomy through bounded authority, policy enforcement, and verifiable receipts."

## Repo walkthrough order
1. `README.md`
2. `agent.json`
3. `agent_log.json`
4. `docs/JUDGE_WALKTHROUGH.md`
5. `docs/TRACK_MAPPING.md`
6. `dashboard/index.html`
7. `receipts/`

## Suggested judge framing
- For Protocol Labs: emphasize manifest, log, receipts, and autonomy loop
- For Venice: emphasize private-by-default execution and output-focused trust
- For MetaMask: emphasize scoped authority and bounded permissions
- For Open Track: emphasize broad trust infrastructure for agents
