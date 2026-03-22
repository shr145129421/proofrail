import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(process.cwd());
const receiptsDir = path.join(root, 'receipts');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function nowIso() {
  return new Date().toISOString();
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function evaluate(policy, task, scenarioName = 'api') {
  const spend = task.plannedSpend ?? { amount: 0, asset: policy.maxSpend?.asset ?? 'USDC' };
  const actionAllowed = Array.isArray(policy.allowedActions) && policy.allowedActions.includes(task.action);
  const targetAllowed = Array.isArray(policy.targetAllowlist) && policy.targetAllowlist.includes(task.target);
  const spendAllowed = spend.amount <= (policy.maxSpend?.amount ?? 0) && spend.asset === (policy.maxSpend?.asset ?? spend.asset);
  const confirmationRequired = policy.requiresHumanConfirmation === true;
  const blocked = !(actionAllowed && targetAllowed && spendAllowed) || confirmationRequired;

  const receipt = {
    receiptVersion: 1,
    scenario: scenarioName,
    project: 'Proofrail',
    task,
    authority: {
      policyId: policy.policyId,
      riskLevel: policy.riskLevel,
      model: 'scoped-delegation'
    },
    evaluation: {
      actionAllowed,
      targetAllowed,
      spendAllowed,
      confirmationRequired
    },
    outcome: {
      status: blocked ? 'blocked' : 'success',
      summary: blocked ? 'Request blocked by policy.' : 'Request allowed by policy.'
    },
    generatedAt: nowIso()
  };

  receipt.receiptHash = sha256(JSON.stringify(receipt));
  return receipt;
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, service: 'proofrail', time: nowIso() }));
    return;
  }

  if (req.method === 'POST' && req.url === '/evaluate') {
    try {
      const body = await readJsonBody(req);
      const receipt = evaluate(body.policy ?? {}, body.task ?? {}, body.scenarioName ?? 'api');
      ensureDir(receiptsDir);
      const out = path.join(receiptsDir, `api-receipt-${Date.now()}.json`);
      fs.writeFileSync(out, JSON.stringify(receipt, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ receipt, savedTo: out }));
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: String(err) }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const port = Number(process.env.PORT || 8787);
server.listen(port, () => {
  console.log(`Proofrail service listening on http://localhost:${port}`);
});
