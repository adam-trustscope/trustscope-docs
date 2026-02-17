# Governance API Reference

The Governance API provides cryptographically signed verification of AI agent actions, coverage proofs, check receipts, and compliance certificates.

## Overview

TrustScope's governance layer delivers:
- **17-Layer Verification** - Comprehensive checks on every trace
- **Coverage Proofs** - Cryptographic proof of which checks executed
- **Check Receipts** - Signed records of each verification result
- **Certificates** - Bitcoin-timestamped compliance artifacts
- **Evidence Export** - Audit-ready compliance packages

> **Tier Requirement:** Most governance features require the **Govern** tier ($2K+/mo).

## 17-Layer Verification

Every trace processed through TrustScope runs through our 17-layer governance verification engine:

| Layer | Category | Check |
|-------|----------|-------|
| 1 | Input | PII Scan |
| 2 | Input | Secrets Scan |
| 3 | Input | Prompt Injection |
| 4 | Input | Jailbreak Detection |
| 5 | Behavior | Command Firewall |
| 6 | Behavior | Data Exfiltration |
| 7 | Behavior | Loop Detection |
| 8 | Behavior | Token Growth |
| 9 | Output | Toxicity Filter |
| 10 | Output | Blocked Phrases |
| 11 | Output | Action Label Match |
| 12 | Policy | Policy Compliance |
| 13 | Policy | Rate Limits |
| 14 | Policy | Budget Caps |
| 15 | Identity | Agent DNA Match |
| 16 | Identity | Drift Detection |
| 17 | Identity | Lock Status |

## Endpoints

### Get Trace Coverage

```http
GET /api/v1/governance/coverage/trace/{trace_id}
```

Get governance coverage details for a specific trace.

**Response:**
```json
{
  "trace_id": "tr_abc123",
  "coverage_percent": 94,
  "layers_checked": 16,
  "checks_executed": [
    {
      "layer": "pii_scan",
      "passed": true,
      "message": "No PII detected"
    },
    {
      "layer": "secrets_scan",
      "passed": true,
      "message": "No secrets detected"
    },
    {
      "layer": "prompt_injection",
      "passed": false,
      "message": "Potential injection detected: 'ignore previous instructions'"
    }
  ],
  "checks_required": ["pii_scan", "secrets_scan", "prompt_injection", ...],
  "check_summary": {
    "input": { "passed": 3, "failed": 1, "waived": 0 },
    "behavior": { "passed": 4, "failed": 0, "waived": 0 },
    "output": { "passed": 3, "failed": 0, "waived": 0 },
    "policy": { "passed": 3, "failed": 0, "waived": 0 },
    "identity": { "passed": 3, "failed": 0, "waived": 0 }
  },
  "context_commitment": "sha256:a1b2c3d4...",
  "context_committed_at": "2024-02-16T14:30:00Z"
}
```

### Get Check Receipts

```http
GET /api/v1/governance/receipts/{trace_id}
```

Get cryptographically signed receipts for all checks executed on a trace.

**Response:**
```json
{
  "trace_id": "tr_abc123",
  "total": 17,
  "receipts": [
    {
      "id": "rcpt_xyz789",
      "check_category": "input",
      "check_name": "pii_scan",
      "result": "passed",
      "details": {
        "patterns_checked": 88,
        "matches": 0,
        "execution_ms": 12
      },
      "receipt_hash": "sha256:b2c3d4e5...",
      "signature": "ed25519:f6g7h8i9...",
      "public_key": "ed25519:j0k1l2m3...",
      "timestamp": "2024-02-16T14:30:01Z"
    }
  ]
}
```

### List Certificates

```http
GET /api/v1/governance/certificates
```

List all governance certificates for the organization.

**Query Parameters:**
- `type` - Filter by type (single, aggregate, compliance)
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset

**Response:**
```json
{
  "certificates": [
    {
      "hash": "sha256:c3d4e5f6...",
      "type": "aggregate",
      "created_at": "2024-02-16T00:00:00Z",
      "trace_id": null,
      "traces_included": 1500,
      "period_start": "2024-02-15T00:00:00Z",
      "period_end": "2024-02-16T00:00:00Z"
    },
    {
      "hash": "sha256:d4e5f6g7...",
      "type": "single",
      "created_at": "2024-02-16T14:30:00Z",
      "trace_id": "tr_abc123",
      "traces_included": 1,
      "period_start": null,
      "period_end": null
    }
  ],
  "total": 45,
  "has_more": true
}
```

### Get Certificate

```http
GET /api/v1/governance/certificates/{hash}
```

Download a specific certificate by its hash.

**Response:** Certificate JSON with full verification data:
```json
{
  "certificate": {
    "version": "1.0",
    "type": "single",
    "hash": "sha256:c3d4e5f6...",
    "issued_at": "2024-02-16T14:30:00Z",
    "issuer": {
      "name": "TrustScope",
      "public_key": "ed25519:xyz..."
    },
    "subject": {
      "organization_id": "org_123",
      "trace_id": "tr_abc123",
      "agent_id": "customer-support-bot"
    },
    "verification": {
      "layers_executed": 17,
      "layers_passed": 16,
      "layers_failed": 1,
      "coverage_percent": 94,
      "merkle_root": "sha256:m3r4k5l6..."
    },
    "receipts_hash": "sha256:r7e8c9i0...",
    "timestamp_proof": {
      "type": "opentimestamps",
      "anchor": "bitcoin",
      "ots_file_url": "https://r2.trustscope.ai/ots/...",
      "bitcoin_block": 883456,
      "confirmed_at": "2024-02-16T15:00:00Z"
    }
  },
  "signature": "ed25519:s1i2g3n4..."
}
```

### Generate Certificate

```http
POST /api/v1/governance/certificates
```

Generate a new governance certificate.

**Request Body:**
```json
{
  "type": "single",
  "trace_id": "tr_abc123"
}
```

Or for aggregate certificates:
```json
{
  "type": "aggregate",
  "period_start": "2024-02-15T00:00:00Z",
  "period_end": "2024-02-16T00:00:00Z",
  "agent_ids": ["agent-1", "agent-2"]
}
```

**Response:**
```json
{
  "hash": "sha256:new_cert_hash...",
  "type": "single",
  "status": "pending_timestamp",
  "created_at": "2024-02-16T14:35:00Z"
}
```

### Verify Certificate

```http
POST /api/v1/governance/certificates/verify
```

Independently verify a certificate's authenticity.

**Request Body:**
```json
{
  "certificate_hash": "sha256:c3d4e5f6..."
}
```

**Response:**
```json
{
  "valid": true,
  "signature_valid": true,
  "receipts_valid": true,
  "timestamp_valid": true,
  "timestamp_anchor": "bitcoin",
  "bitcoin_block": 883456,
  "verified_at": "2024-02-16T16:00:00Z"
}
```

## Coverage Proofs

Coverage proofs cryptographically bind which checks executed on a trace.

### Get Coverage Proof

```http
GET /api/v1/governance/coverage/proof/{trace_id}
```

**Response:**
```json
{
  "trace_id": "tr_abc123",
  "proof": {
    "version": "1.0",
    "coverage_percent": 94,
    "checks_executed": [
      "pii_scan",
      "secrets_scan",
      "prompt_injection",
      ...
    ],
    "check_hashes": [
      "sha256:check1...",
      "sha256:check2...",
      ...
    ],
    "merkle_root": "sha256:m3r4k5l6...",
    "merkle_proof": [
      { "position": "left", "hash": "sha256:..." },
      { "position": "right", "hash": "sha256:..." }
    ]
  },
  "commitment": "sha256:final_commitment...",
  "committed_at": "2024-02-16T14:30:05Z"
}
```

## Evidence Export

### Generate Evidence Pack

```http
POST /api/v1/governance/evidence/export
```

Generate a compliance evidence pack for audits.

**Request Body:**
```json
{
  "format": "json",
  "period_start": "2024-02-01T00:00:00Z",
  "period_end": "2024-02-16T00:00:00Z",
  "include": {
    "traces": true,
    "receipts": true,
    "certificates": true,
    "policies": true,
    "ots_files": true
  },
  "agent_ids": ["agent-1", "agent-2"]
}
```

**Response:**
```json
{
  "export_id": "exp_abc123",
  "status": "processing",
  "estimated_size_mb": 45,
  "download_url": null,
  "expires_at": null
}
```

### Get Export Status

```http
GET /api/v1/governance/evidence/export/{export_id}
```

**Response:**
```json
{
  "export_id": "exp_abc123",
  "status": "completed",
  "size_mb": 42,
  "download_url": "https://r2.trustscope.ai/exports/...",
  "expires_at": "2024-02-23T14:30:00Z",
  "contents": {
    "traces": 5000,
    "receipts": 85000,
    "certificates": 45,
    "policies": 12
  }
}
```

## OpenTimestamps

TrustScope anchors certificates to Bitcoin for immutable timestamping.

### How It Works

1. **Daily Aggregation** - At midnight UTC, all day's certificates are aggregated
2. **Merkle Tree** - A Merkle tree is built from all certificate hashes
3. **Bitcoin Anchor** - The Merkle root is embedded in a Bitcoin transaction
4. **OTS File** - An OpenTimestamps proof file is generated for each certificate
5. **Verification** - Anyone can independently verify the timestamp

### Get Timestamp Status

```http
GET /api/v1/governance/timestamps/{certificate_hash}
```

**Response:**
```json
{
  "certificate_hash": "sha256:c3d4e5f6...",
  "status": "confirmed",
  "anchor": "bitcoin",
  "bitcoin_txid": "abc123def456...",
  "bitcoin_block": 883456,
  "block_time": "2024-02-16T15:30:00Z",
  "confirmations": 6,
  "ots_file_url": "https://r2.trustscope.ai/ots/..."
}
```

### Download OTS File

```http
GET /api/v1/governance/timestamps/{certificate_hash}/ots
```

Returns the raw `.ots` file for independent verification.

## Verification Data in Traces

When you retrieve traces, governance data is included:

```json
{
  "trace_id": "tr_abc123",
  "trigger_input": "...",
  "trigger_output": "...",
  "verification_results": [
    {
      "layer": "pii_scan",
      "triggered": false,
      "severity": "info",
      "reason": "No PII patterns detected"
    },
    {
      "layer": "prompt_injection",
      "triggered": true,
      "severity": "warning",
      "reason": "Pattern match: 'ignore previous instructions'",
      "evidence": {
        "matched_pattern": "ignore.*instructions",
        "position": 45
      }
    }
  ],
  "governance_meta": {
    "coverage_percent": 94,
    "checks_executed": 17,
    "checks_passed": 16,
    "certificate_hash": "sha256:..."
  }
}
```

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Coverage endpoints | 100/min |
| Receipts endpoints | 50/min |
| Certificate generation | 10/min |
| Evidence export | 5/hour |
| Verification | 100/min |

## Error Codes

| Code | Description |
|------|-------------|
| `TIER_REQUIRED` | Govern tier required for this endpoint |
| `TRACE_NOT_FOUND` | Trace does not exist |
| `CERTIFICATE_NOT_FOUND` | Certificate hash not found |
| `EXPORT_IN_PROGRESS` | Export already in progress |
| `TIMESTAMP_PENDING` | Timestamp not yet confirmed |
| `VERIFICATION_FAILED` | Certificate verification failed |

## Example: Complete Audit Flow

```python
import requests

api_key = "ts_live_xxx"
headers = {"Authorization": f"Bearer {api_key}"}
base = "https://api.trustscope.ai"

# 1. Get coverage for a trace
coverage = requests.get(
    f"{base}/api/v1/governance/coverage/trace/tr_abc123",
    headers=headers
).json()
print(f"Coverage: {coverage['coverage_percent']}%")

# 2. Get check receipts
receipts = requests.get(
    f"{base}/api/v1/governance/receipts/tr_abc123",
    headers=headers
).json()
print(f"Total receipts: {receipts['total']}")

# 3. Generate certificate
cert = requests.post(
    f"{base}/api/v1/governance/certificates",
    headers=headers,
    json={"type": "single", "trace_id": "tr_abc123"}
).json()
print(f"Certificate: {cert['hash']}")

# 4. Wait for timestamp and verify
import time
while True:
    status = requests.get(
        f"{base}/api/v1/governance/timestamps/{cert['hash']}",
        headers=headers
    ).json()

    if status["status"] == "confirmed":
        print(f"Timestamped at block {status['bitcoin_block']}")
        break

    time.sleep(60)

# 5. Export evidence pack
export = requests.post(
    f"{base}/api/v1/governance/evidence/export",
    headers=headers,
    json={
        "format": "json",
        "period_start": "2024-02-01T00:00:00Z",
        "period_end": "2024-02-16T00:00:00Z",
        "include": {"traces": True, "receipts": True, "certificates": True}
    }
).json()

# Poll for completion
while True:
    status = requests.get(
        f"{base}/api/v1/governance/evidence/export/{export['export_id']}",
        headers=headers
    ).json()

    if status["status"] == "completed":
        print(f"Download: {status['download_url']}")
        break

    time.sleep(30)
```

## Independent Verification

Certificates can be verified without TrustScope:

```python
import hashlib
import json
from nacl.signing import VerifyKey

# 1. Download certificate
cert_data = download_certificate(cert_hash)

# 2. Verify signature
public_key = VerifyKey(bytes.fromhex(cert_data["issuer"]["public_key"]))
message = json.dumps(cert_data["certificate"], sort_keys=True).encode()
signature = bytes.fromhex(cert_data["signature"])

try:
    public_key.verify(message, signature)
    print("Signature valid")
except:
    print("Signature invalid")

# 3. Verify OpenTimestamps
# Use ots-cli or opentimestamps-client
# ots verify certificate.ots
```

## Compliance Frameworks Supported

Evidence packs map to:
- **EU AI Act** - Article 12 logging requirements
- **SOC 2** - CC7.1, CC7.2 monitoring controls
- **ISO 42001** - AI management system evidence
- **NIST AI RMF** - Govern, Map, Measure, Manage functions
- **HIPAA** - Audit trail requirements for AI in healthcare
- **SEC 17a-4** - Records retention for automated trading
