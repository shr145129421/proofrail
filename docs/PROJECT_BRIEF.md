# Project Brief

## Name
Proofrail

## One sentence
A private-by-default execution layer for autonomous agents that enforces delegated permissions, policy guardrails, and verifiable receipts.

## Problem
Autonomous agents are becoming powerful enough to move money, call services, and take meaningful actions on behalf of humans. The problem is that most agents are either too weak to do useful work or too overpowered to be trusted. Proofrail addresses that gap.

## Solution
Proofrail constrains agent behavior with policy, keeps authority bounded, records execution decisions, and emits receipts that make critical actions inspectable.

## Current demo
The current project demonstrates both:
- a successful in-policy execution path
- a blocked out-of-policy execution path

## Key artifacts
- `agent.json`
- `agent_log.json`
- `receipts/`
- `dashboard/index.html`
- `docs/JUDGE_WALKTHROUGH.md`
- `docs/SPONSOR_ANGLES.md`
- `docs/TRACK_MAPPING.md`
- `docs/DEMO_SCRIPT.md`

## Strongest track fit today
- Synthesis Open Track
- Agents With Receipts — ERC-8004
- Let the Agent Cook — No Humans Required
- Private Agents, Trusted Actions
- Best Use of Delegations

## Honest current limitation
Some tracks in the submission list still have stronger conceptual fit than concrete third-party integration. The current repo is strongest where judges care about autonomy, bounded authority, safety guardrails, and verifiable execution artifacts.
