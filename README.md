# Proofrail

Private-by-default, policy-bounded, receipt-driven execution for autonomous agents.

## What it is

Proofrail is a trust layer for AI agents. It sits between user intent and autonomous execution, enforcing scoped permissions, spend controls, target restrictions, and receipt generation for every critical action.

This project is designed for The Synthesis hackathon and targets:

- Synthesis Open Track
- Agents With Receipts — ERC-8004
- Let the Agent Cook — No Humans Required
- Private Agents, Trusted Actions
- Best Use of Delegations
- Agent Services on Base
- Best Use of Locus
- Ship Something Real with OpenServ
- Best Self Protocol Integration
- Best Use Case with Agentic Storage

## MVP

The MVP demonstrates one complete flow:

1. A human gives an agent a high-stakes task.
2. Proofrail turns it into a constrained policy.
3. The agent executes within allowed scope.
4. Every important step is recorded.
5. A verifiable receipt is generated at the end.

## Core components

- **Policy engine**: spend caps, action allowlists, target restrictions, risk levels
- **Execution runner**: deterministic task execution against a policy
- **Receipt generator**: machine-readable action receipts and hashes
- **Simple dashboard**: inspect policies, timelines, and final receipts

## Local demo

```bash
cd proofrail
npm start
open dashboard/index.html
```

This generates:
- a structured receipt in `receipts/`
- a visual demo dashboard in `dashboard/index.html`

## Demo story

A human asks an agent to perform a sensitive action. Proofrail constrains the action, executes it safely, and returns a structured proof of what happened without exposing unnecessary private context.

## Status

Early build skeleton for hackathon submission.
