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

function loadPolicy() {
  return loadJson(path.join(policiesDir, 'demo-policy.json'));
}

function loadTask() {
  return loadJson(path.join(policiesDir, 'demo-task.json'));
}

function buildTimeline(policy, task) {
  const startedAt = nowIso();
  const spend = task.plannedSpend ?? { amount: 0, asset: policy.maxSpend.asset };
  const spendAllowed = spend.amount <= policy.maxSpend.amount && spend.asset === policy.maxSpend.asset;
  const actionAllowed = policy.allowedActions.includes(task.action);
  const targetAllowed = policy.targetAllowlist.includes(task.target);

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
      detail: actionAllowed ? `Action ${task.action} is allowed` : `Action ${task.action} is blocked`
    },
    {
      type: 'target_checked',
      at: nowIso(),
      detail: targetAllowed ? `Target ${task.target} is allowlisted` : `Target ${task.target} is blocked`
    },
    {
      type: 'spend_checked',
      at: nowIso(),
      detail: spendAllowed
        ? `Planned spend ${spend.amount} ${spend.asset} is within cap`
        : `Planned spend ${spend.amount} ${spend.asset} exceeds cap`
    },
    {
      type: actionAllowed && targetAllowed && spendAllowed ? 'task_completed' : 'task_blocked',
      at: nowIso(),
      detail: actionAllowed && targetAllowed && spendAllowed
        ? 'Demo execution finished inside policy bounds'
        : 'Execution was blocked by policy'
    }
  ];
}

function buildReceipt(policy, task, timeline) {
  const blocked = timeline.some((x) => x.type === 'task_blocked');
  const body = {
    receiptVersion: 1,
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
    timeline,
    outcome: {
      status: blocked ? 'blocked' : 'success',
      spendUsed: blocked ? { amount: 0, asset: policy.maxSpend.asset } : task.plannedSpend,
      summary: blocked
        ? 'Task was rejected because it violated policy bounds.'
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

function renderDashboard(receipt) {
  const timelineHtml = receipt.timeline.map((event) => `
    <li>
      <strong>${event.type}</strong><br />
      <span>${event.at}</span><br />
      <span>${event.detail}</span>
    </li>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Proofrail Dashboard</title>
  <style>
    body { font-family: Inter, ui-sans-serif, system-ui, sans-serif; margin: 0; background: #0b1020; color: #e9eefc; }
    .wrap { max-width: 960px; margin: 0 auto; padding: 32px 20px 60px; }
    .hero { margin-bottom: 24px; }
    .hero h1 { margin: 0 0 8px; font-size: 40px; }
    .hero p { color: #b5c0e0; max-width: 800px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
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
      <p>Private-by-default, delegated, policy-bounded execution with verifiable receipts for autonomous agents.</p>
    </div>

    <div class="grid">
      <div class="card"><div class="label">Project</div><div class="value">${receipt.project}</div></div>
      <div class="card"><div class="label">Status</div><div class="value ${receipt.outcome.status === 'success' ? 'ok' : 'bad'}">${receipt.outcome.status}</div></div>
      <div class="card"><div class="label">Receipt Hash</div><div class="value">${receipt.receiptHash}</div></div>
      <div class="card"><div class="label">Wallet</div><div class="value">${receipt.authority.wallet}</div></div>
      <div class="card"><div class="label">Policy ID</div><div class="value">${receipt.policy.policyId}</div></div>
      <div class="card"><div class="label">Track Angle</div><div class="value">Receipts · Delegation · Privacy · Agent Services</div></div>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="label">Task Summary</div>
      <div class="value" style="font-size:18px;">${receipt.task.summary}</div>
      <p>Requester: ${receipt.task.requester}</p>
      <p>Action: ${receipt.task.action}</p>
      <p>Target: ${receipt.task.target}</p>
      <p>Spend: ${receipt.outcome.spendUsed.amount} ${receipt.outcome.spendUsed.asset}</p>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="label">Execution Timeline</div>
      <ul>${timelineHtml}</ul>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="label">Receipt JSON</div>
      <pre>${escapeHtml(JSON.stringify(receipt, null, 2))}</pre>
    </div>
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

function main() {
  ensureDir(receiptsDir);
  ensureDir(dashboardDir);

  const policy = loadPolicy();
  const task = loadTask();
  const timeline = buildTimeline(policy, task);
  const receipt = buildReceipt(policy, task, timeline);

  const stamp = Date.now();
  const receiptPath = path.join(receiptsDir, `receipt-${stamp}.json`);
  const dashboardPath = path.join(dashboardDir, 'index.html');

  fs.writeFileSync(receiptPath, JSON.stringify(receipt, null, 2));
  fs.writeFileSync(dashboardPath, renderDashboard(receipt));

  console.log('Proofrail demo complete.');
  console.log(`Policy: ${policy.policyId}`);
  console.log(`Receipt hash: ${receipt.receiptHash}`);
  console.log(`Saved receipt: ${receiptPath}`);
  console.log(`Saved dashboard: ${dashboardPath}`);
}

main();
