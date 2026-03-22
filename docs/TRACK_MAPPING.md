# Proofrail Track Mapping

## Primary thesis
Proofrail is a private-by-default, delegated, policy-bounded execution layer for autonomous agents. It exists to make agent behavior auditable without removing agent autonomy.

## 1. Synthesis Open Track
**Why it fits**
- Broad agent infrastructure project
- Crosses privacy, trust, payments, identity, and execution safety
- Strong fit for the event's core themes: agents that pay, trust, cooperate, and keep secrets

## 2. Agents With Receipts — ERC-8004
**Why it fits**
- Structured action receipts are core output
- Agent identity and operator wallet are documented in `agent.json`
- Build and execution logs are documented in `agent_log.json`

**Current evidence**
- `agent.json`
- `agent_log.json`
- `receipts/*.json`

## 3. Let the Agent Cook — No Humans Required
**Why it fits**
- End-to-end loop is documented: discover → plan → execute → verify → submit
- The project includes execution logs, guardrails, and verifiable outputs

**Current evidence**
- `agent_log.json`
- dashboard execution timeline
- receipt generation flow

## 4. Private Agents, Trusted Actions
**Why it fits**
- Core positioning is private-by-default execution
- Focus on minimizing data leakage while still producing trustworthy outputs

**Current evidence**
- README positioning
- submission narrative
- bounded execution and receipt-based verification

## 5. Best Use of Delegations
**Why it fits**
- The authority model is explicitly scoped and delegation-oriented
- Agent actions are framed as bounded authority, not unlimited control

**Current evidence**
- policy model
- authority section in receipts
- documentation language around scoped delegation

## 6. Agent Services on Base
**Why it fits**
- Proofrail can be exposed as a service to other agents or humans
- The product naturally supports fee-gated verification and execution safety as a service

**Current evidence**
- service-surface architecture section
- reusable receipt engine and policy engine

## 7. Best Use of Locus
**Reality check**
- Current fit is conceptual, not hard integration
- We talk about spend controls, but we do not yet have a real Locus integration

## 8. Ship Something Real with OpenServ
**Reality check**
- Current fit is conceptual, not hard integration
- We reference service infrastructure and multi-agent coordination, but OpenServ is not yet load-bearing

## 9. Best Self Protocol Integration
**Reality check**
- Current fit is weak
- Identity is important in the architecture, but Self Protocol is not yet integrated

## 10. Best Use Case with Agentic Storage
**Reality check**
- Current fit is weak
- Receipts and logs could use durable storage, but Filecoin is not yet essential to the build

## Honest submission posture
Strongest current tracks:
- Open Track
- Agents With Receipts — ERC-8004
- Let the Agent Cook — No Humans Required
- Private Agents, Trusted Actions
- Best Use of Delegations

Medium/aspirational tracks:
- Agent Services on Base
- Best Use of Locus
- Ship Something Real with OpenServ

Weak current tracks unless deeper integration is added:
- Best Self Protocol Integration
- Best Use Case with Agentic Storage
