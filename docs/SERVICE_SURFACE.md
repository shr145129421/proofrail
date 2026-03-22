# Service Surface

## Why this exists
Proofrail is not only a local demo. It can also be framed as an agent-facing service that evaluates tasks against policy and returns structured receipts.

This matters for tracks like:
- Agent Services on Base
- Open Track
- OpenServ

## Local API

### Start
```bash
cd proofrail
npm run serve
```

### Health check
```bash
curl http://localhost:8787/health
```

### Evaluate a task
```bash
curl -X POST http://localhost:8787/evaluate \
  -H 'Content-Type: application/json' \
  -d '{
    "scenarioName": "service-demo",
    "policy": {
      "policyId": "service-policy-001",
      "riskLevel": "medium",
      "allowedActions": ["read", "analyze"],
      "targetAllowlist": ["approved-api"],
      "maxSpend": {"amount": 20, "asset": "USDC"},
      "requiresHumanConfirmation": false
    },
    "task": {
      "requester": "demo-user",
      "summary": "Analyze an in-scope request through the service surface",
      "action": "analyze",
      "target": "approved-api",
      "plannedSpend": {"amount": 5, "asset": "USDC"}
    }
  }'
```

## Output
The service returns:
- receipt hash
- evaluation details
- final outcome
- saved receipt path

## Why this helps the project
It makes the repo look less like a static concept and more like a reusable execution-verification service.
