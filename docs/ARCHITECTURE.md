# Proofrail Architecture

## Layers

1. **Intent Intake**
   - Accept user or agent tasks
   - Normalize task requests

2. **Policy Compilation**
   - Convert requests into execution constraints
   - Apply spend and target rules

3. **Execution Runtime**
   - Run approved actions within scope
   - Log each critical step

4. **Receipt Layer**
   - Produce structured receipts
   - Hash outputs for verification

5. **Service Surface**
   - Expose Proofrail as an agent-facing or human-facing service

## Future integrations

- MetaMask Delegation Framework
- Locus wallets / spending controls
- Base agent service payments
- Venice private inference
- ERC-8004 / attestations
- Filecoin-backed durable receipt storage
