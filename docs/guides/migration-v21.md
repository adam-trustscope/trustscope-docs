# Migration Guide: v20 to v21.3

This guide covers upgrading from TrustScope v20.x to v21.3.

## Overview of Changes

### Breaking Changes

1. **Tier Renaming**: `observe` → `monitor`, `comply` → `govern`
2. **API Endpoints**: Some endpoints moved or renamed
3. **SDK Methods**: Deprecated methods removed
4. **Detection Engine Names**: Some engines renamed for consistency

### New Features

1. **17-Layer Governance Verification** (was 14-layer)
2. **Agent DNA** - Behavioral fingerprinting
3. **Import Workflow** - Bulk trace upload with field mapping
4. **MCP Integration** - Model Context Protocol support
5. **OpenTimestamps** - Bitcoin-anchored timestamps
6. **Enhanced Certificates** - Ed25519 signed governance certificates

## Step-by-Step Migration

### 1. Update SDK

```bash
# Python
pip install trustscope>=0.3.0

# Node
npm install @trustscope/sdk@latest

# React Native
npm install @trustscope/react-native@latest
```

### 2. Update Tier References

If you reference tiers in code, update the names:

| v20 Name | v21.3 Name | Notes |
|----------|------------|-------|
| `observe` | `monitor` | Free tier |
| `discover` | `monitor` | Mapped to monitor |
| `free` | `monitor` | Mapped to monitor |
| `starter` | `protect` | Mapped to protect |
| `pro` | `enforce` | Mapped to enforce |
| `comply` | `govern` | Enterprise tier |
| `enterprise` | `govern` | Mapped to govern |

**Python Example:**
```python
# Before (v20)
if org.tier == "observe":
    # ...

# After (v21.3)
if org.tier == "monitor":
    # ...
```

The API accepts both old and new tier names for backward compatibility, but new code should use the v21.3 names.

### 3. Update API Endpoints

#### Renamed Endpoints

| v20 Endpoint | v21.3 Endpoint |
|--------------|----------------|
| `POST /v1/observe` | `POST /v1/traces` |
| `GET /v1/observe/{id}` | `GET /v1/traces/{id}` |
| `POST /v1/comply/export` | `POST /v1/evidence/export` |
| `GET /v1/comply/certificates` | `GET /v1/governance/certificates` |

#### New Endpoints

```
# Import Workflow
POST /v1/import/session
POST /v1/import/upload
GET  /v1/import/job/{job_id}
POST /v1/import/job/{job_id}/mapping

# Agent DNA
GET  /v1/agents/{id}/dna
POST /v1/agents/{id}/dna/lock
GET  /v1/agents/{id}/dna/drift

# Governance
GET  /v1/governance/coverage/trace/{trace_id}
GET  /v1/governance/receipts/{trace_id}
POST /v1/governance/certificates
GET  /v1/governance/timestamps/{hash}

# MCP
GET  /v1/mcp/servers
POST /v1/mcp/servers/{id}/connect
GET  /v1/mcp/tools
```

### 4. Update SDK Methods

#### Python SDK

```python
# Before (v20)
from trustscope import TrustScope

ts = TrustScope(api_key="ts_xxx")
ts.log_action(agent_id="agent", action="query", params={})

# After (v21.3)
from trustscope import TrustScopeClient

client = TrustScopeClient(api_key="ts_xxx")
await client.observe_action(
    agent_id="agent",
    action_type="query",
    parameters={},
)
```

#### Node SDK

```typescript
// Before (v20)
import TrustScope from 'trustscope';

const ts = new TrustScope({ apiKey: 'ts_xxx' });
ts.log({ agentId: 'agent', action: 'query' });

// After (v21.3)
import { TrustScope } from '@trustscope/sdk';

const ts = new TrustScope({ apiKey: 'ts_xxx' });
const wrapped = ts.observe({ agentId: 'agent' }, async () => {
  // Your function
});
```

### 5. Update Detection Engine References

| v20 Name | v21.3 Name |
|----------|------------|
| `pii_detector` | `pii_scanner` |
| `secret_detector` | `secrets_scanner` |
| `injection_detector` | `prompt_injection` |
| `jailbreak_detector` | `jailbreak_detector` (unchanged) |
| `command_detector` | `command_firewall` |

If you configure engines by name in policies:

```python
# Before (v20)
Policy.detection_check("pii_detector", block=True)

# After (v21.3)
Policy.detection_check("pii_scanner", block=True)
```

### 6. Update Webhook Payloads

Webhook event payloads have new fields:

```json
// v21.3 trace webhook
{
  "event": "trace.created",
  "data": {
    "trace_id": "tr_xxx",
    "agent_id": "my-agent",
    // NEW: Governance verification results
    "verification_results": [...],
    // NEW: Coverage score
    "governance_meta": {
      "coverage_percent": 94,
      "checks_executed": 17
    }
  }
}
```

### 7. Update Dashboard Integrations

If you embed TrustScope dashboard components:

```tsx
// Before (v20)
import { TraceViewer } from '@trustscope/embed';

// After (v21.3)
import { TraceViewer, GovernancePanel } from '@trustscope/embed';

// New: Governance panel shows 17-layer verification
<GovernancePanel traceId={traceId} />
```

### 8. Enable New Features (Optional)

#### Agent DNA

Lock agent behavior to prevent drift:

```python
# Get current DNA
dna = await client.get_agent_dna("my-agent")

# Lock the DNA baseline
await client.lock_agent_dna("my-agent")

# Monitor for drift
drift = await client.check_agent_drift("my-agent")
```

#### Import Historical Traces

Bulk import from LangSmith, custom systems, etc:

```python
# Create import job
job = await client.create_import_job(
    filename="traces.json",
    format="json",
    source="langsmith"
)

# Upload file
await client.upload_import_file(job["upload_url"], "traces.json")

# Complete and process
await client.complete_import(job["job_id"])
```

#### 17-Layer Verification

Automatically enabled for all traces. Access results:

```python
trace = await client.get_trace("tr_xxx")
verification = trace["verification_results"]
coverage = trace["governance_meta"]["coverage_percent"]
```

## Configuration Changes

### Environment Variables

New variables in v21.3:

```bash
# Required for OpenTimestamps (Govern tier)
OTS_DATA_DIR=/data/ots_proofs

# Optional: Import storage
R2_BUCKET_NAME=trustscope-imports
R2_ACCESS_KEY_ID=xxx
R2_SECRET_ACCESS_KEY=xxx

# Optional: MCP integration
MCP_REGISTRY_URL=https://mcp.trustscope.ai
```

### Rate Limits

Rate limits changed in v21.3:

| Endpoint | v20 | v21.3 |
|----------|-----|-------|
| `POST /traces` | 100/min | 200/min |
| `GET /traces` | 200/min | 500/min |
| Import jobs | N/A | 10/hour (Monitor) |
| Certificates | N/A | 50/day (Govern) |

## Database Migrations

If self-hosting, run migrations:

```bash
alembic upgrade head
```

Key schema changes:
- New `agent_dna` table
- New `import_jobs` table
- New `timestamp_proofs` table
- New columns on `traces`: `verification_results`, `governance_meta`

## Deprecation Timeline

| Feature | Deprecated | Removed |
|---------|------------|---------|
| `observe` tier name | v21.0 | v22.0 |
| `POST /v1/observe` | v21.0 | v22.0 |
| Old detection names | v21.0 | v22.0 |
| Python sync client | v21.2 | v22.0 |

## Testing Your Migration

### 1. Verify SDK Connection

```python
from trustscope import TrustScopeClient

client = TrustScopeClient(api_key="ts_test_xxx")
result = await client.get_policies()
print(f"Connected: {len(result['policies'])} policies")
```

### 2. Verify Tier Access

```python
# Check your tier
org = await client.get_organization()
print(f"Tier: {org['tier']}")  # Should show "monitor", "protect", etc.
```

### 3. Verify Detection Engines

```python
# Test a detection
result = await client.test_detection(
    detection="pii_scanner",
    input="SSN: 123-45-6789"
)
print(f"Triggered: {result['triggered']}")
```

### 4. Verify Governance

```python
# Create a trace and check governance
trace = await client.observe_action(
    agent_id="test-agent",
    action_type="test",
    parameters={"test": True}
)

# Should have verification results
assert "verification_results" in trace
assert "governance_meta" in trace
```

## Getting Help

- **Documentation**: [docs.trustscope.ai](https://docs.trustscope.ai)
- **Migration Support**: support@trustscope.ai
- **API Reference**: [docs.trustscope.ai/api](https://docs.trustscope.ai/api)

## Rollback

If you need to roll back:

1. **SDK**: Pin to previous version
   ```bash
   pip install trustscope==0.2.x
   ```

2. **API**: Use v1 endpoints (will continue working)

3. **Dashboard**: Contact support for version pinning

The v20 API will remain available until v22 release (estimated Q4 2026).
