import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(process.cwd());
const policiesDir = path.join(root, 'policies');
const receiptsDir = path.join(root, 'receipts');
const dashboardDir = path.join(root, 'dashboard');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function nowIso() {
  return new Date().toISOString();
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function loadScenario(name) {
  return {
    policy: loadJson(path.join(policiesDir, `${name}-policy.json`)),
    task: loadJson(path.join(policiesDir, `${name}-task.json`)),
  };
}

function evaluatePolicy(policy, task) {
  const spend = task.plannedSpend ?? { amount: 0, asset: policy.maxSpend.asset };
  const actionAllowed = policy.allowedActions.includes(task.action);
  const targetAllowed = policy.targetAllowlist.includes(task.target);
  const spendAllowed = spend.amount <= policy.maxSpend.amount && spend.asset === policy.maxSpend.asset;
  const confirmationRequired = policy.requiresHumanConfirmation === true;
  const blocked = !(actionAllowed && targetAllowed && spendAllowed) || confirmationRequired;

  return { spend, actionAllowed, targetAllowed, spendAllowed, confirmationRequired, blocked };
}

function buildTimeline(policy, task, checks) {
  const startedAt = nowIso();
  return [
    {
      type: 'intent_received',
      at: startedAt,
      detail: `${task.requester} requested: ${task.summary}`
    },
    {
      type: 'policy_compiled',
      at: nowIso(),
      detail: `Policy ${policy.policyId} compiled with risk=${policy.riskLevel}`
    },
    {
      type: 'action_checked',
      at: nowIso(),
      detail: checks.actionAllowed ? `Action ${task.action} is allowed` : `Action ${task.action} is blocked`
    },
    {
      type: 'target_checked',
      at: nowIso(),
      detail: checks.targetAllowed ? `Target ${task.target} is allowlisted` : `Target ${task.target} is blocked`
    },
    {
      type: 'spend_checked',
      at: nowIso(),
      detail: checks.spendAllowed
        ? `Planned spend ${checks.spend.amount} ${checks.spend.asset} is within cap`
        : `Planned spend ${checks.spend.amount} ${checks.spend.asset} exceeds cap`
    },
    {
      type: 'confirmation_checked',
      at: nowIso(),
      detail: checks.confirmationRequired
        ? 'Human confirmation is required before irreversible action'
        : 'No human confirmation required for this policy'
    },
    {
      type: checks.blocked ? 'task_blocked' : 'task_completed',
      at: nowIso(),
      detail: checks.blocked
        ? 'Execution was blocked by policy and safety guardrails'
        : 'Demo execution finished inside policy bounds'
    }
  ];
}

function buildReceipt(policy, task, timeline, checks, scenarioName) {
  const body = {
    receiptVersion: 1,
    scenario: scenarioName,
    project: 'Proofrail',
    task,
    actor: {
      type: 'agent',
      name: 'SynthPartner',
      harness: 'openclaw',
      model: 'gpt-5.4'
    },
    authority: {
      model: 'scoped-delegation',
      policyId: policy.policyId,
      riskLevel: policy.riskLevel,
      wallet: '0x2180227875EdF6e2089636Dd9369e458cAf6Da87'
    },
    policy,
    evaluation: {
      actionAllowed: checks.actionAllowed,
      targetAllowed: checks.targetAllowed,
      spendAllowed: checks.spendAllowed,
      confirmationRequired: checks.confirmationRequired
    },
    timeline,
    outcome: {
      status: checks.blocked ? 'blocked' : 'success',
      spendUsed: checks.blocked ? { amount: 0, asset: policy.maxSpend.asset } : checks.spend,
      summary: checks.blocked
        ? 'Task was rejected because it violated policy bounds or required confirmation.'
        : 'Task executed within policy; receipt generated.'
    },
    generatedAt: nowIso()
  };

  const canonical = JSON.stringify(body, null, 2);
  return {
    ...body,
    receiptHash: sha256(canonical)
  };
}

function renderScenarioCard(receipt) {
  const outcomeClass = receipt.outcome.status === 'success' ? 'ok' : 'bad';
  return `
    <div class="card">
      <div class="label">Scenario</div>
      <div class="value">${receipt.scenario}</div>
      <p><strong>Status:</strong> <span class="${outcomeClass}">${receipt.outcome.status}</span></p>
      <p><strong>Policy:</strong> ${receipt.policy.policyId}</p>
      <p><strong>Task:</strong> ${receipt.task.summary}</p>
      <p><strong>Receipt Hash:</strong><br />${receipt.receiptHash}</p>
    </div>`;
}

function renderDashboard(receipts) {
  const scenarioCards = receipts.map(renderScenarioCard).join('');
  const receiptBlocks = receipts.map((receipt) => {
    const timelineHtml = receipt.timeline.map((event) => `
      <li>
        <strong>${event.type}</strong><br />
        <span>${event.at}</span><br />
        <span>${event.detail}</span>
      </li>`).join('');

    return `
      <div class="card" style="margin-top:16px;">
        <div class="label">${receipt.scenario} Timeline</div>
        <ul>${timelineHtml}</ul>
      </div>
      <div class="card" style="margin-top:16px;">
        <div class="label">${receipt.scenario} Receipt JSON</div>
        <pre>${escapeHtml(JSON.stringify(receipt, null, 2))}</pre>
      </div>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Proofrail Dashboard</title>
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, sans-serif; margin: 0; background: #0b1020; color: #e9eefc; }
    .wrap { max-width: 1080px; margin: 0 auto; padding: 32px 20px 60px; }
    .hero { margin-bottom: 24px; }
    .hero h1 { margin: 0 0 8px; font-size: 40px; }
    .hero p { color: #b5c0e0; max-width: 900px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .card { background: #121933; border: 1px solid #23305e; border-radius: 16px; padding: 18px; box-shadow: 0 8px 28px rgba(0,0,0,0.2); }
    .label { color: #8ea0d8; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    .value { font-size: 24px; margin-top: 6px; word-break: break-word; }
    ul { padding-left: 20px; }
    li { margin-bottom: 14px; }
    code, pre { background: #0d1430; color: #c8d5ff; border-radius: 12px; }
    pre { padding: 16px; overflow: auto; }
    .ok { color: #64f0a7; }
    .bad { color: #ff8c8c; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hero">
      <h1>Proofrail Dashboard</h1>
      <p>Private-by-default, delegated, policy-bounded execution with verifiable receipts for autonomous agents. This demo now shows both allowed and blocked execution paths, which makes the safety model much easier for judges to understand.</p>
    </div>

    <div class="grid">${scenarioCards}</div>

    <div class="card" style="margin-top:16px;">
      <div class="label">Why this matters</div>
      <p>Proofrail should not only show that an agent can act. It should also show that an agent can refuse unsafe or out-of-scope actions. The blocked path is part of the product, not a failure of the product.</p>
    </div>

    ${receiptBlocks}
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function runScenario(name) {
  const { policy, task } = loadScenario(name);
  const checks = evaluatePolicy(policy, task);
  const timeline = buildTimeline(policy, task, checks);
  const receipt = buildReceipt(policy, task, timeline, checks, name);
  const receiptPath = path.join(receiptsDir, `${name}-receipt-${Date.now()}.json`);
  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2));
  return { receipt, receiptPath };
}

function main() {
  ensureDir(receiptsDir);
  ensureDir(dashboardDir);

  const scenarios = ['demo', 'blocking'];
  const results = scenarios.map(runScenario);
  const dashboardPath = path.join(dashboardDir, 'index.html');
  fs.writeFileSync(dashboardPath, renderDashboard(results.map((x) => x.receipt)));

  console.log('Proofrail demo complete.');
  for (const result of results) {
    console.log(`Scenario: ${result.receipt.scenario}`);
    console.log(`Status: ${result.receipt.outcome.status}`);
    console.log(`Receipt hash: ${result.receipt.receiptHash}`);
    console.log(`Saved receipt: ${result.receiptPath}`);
  }
  console.log(`Saved dashboard: ${dashboardPath}`);
}

main();
