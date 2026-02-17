# Import API Reference

The Import API allows you to upload historical trace data from any source into TrustScope for analysis, detection, and governance verification.

## Overview

TrustScope's import workflow supports:
- **Bulk uploads** - Upload thousands of traces at once
- **Multiple formats** - JSON, CSV, JSONL supported
- **Field mapping** - Map your data schema to TrustScope's trace format
- **Background processing** - Large imports run asynchronously
- **Deduplication** - Automatic detection of duplicate traces

## Endpoints

### Create Import Job

```http
POST /api/v1/import/jobs
```

Create a new import job and get a presigned URL for file upload.

**Request Body:**
```json
{
  "filename": "traces-2024.json",
  "format": "json",
  "source": "langsmith",
  "options": {
    "dedup_strategy": "skip",
    "batch_size": 500
  }
}
```

**Response:**
```json
{
  "job_id": "imp_abc123",
  "upload_url": "https://r2.trustscope.ai/...",
  "expires_at": "2024-02-16T15:00:00Z",
  "status": "pending_upload"
}
```

### Upload File

Upload your trace file to the presigned URL returned from the create job endpoint.

```bash
curl -X PUT "${upload_url}" \
  -H "Content-Type: application/json" \
  --data-binary @traces.json
```

### Complete Upload

```http
POST /api/v1/import/jobs/{job_id}/complete
```

Signal that the file upload is complete and begin processing.

**Response:**
```json
{
  "job_id": "imp_abc123",
  "status": "mapping",
  "detected_fields": [
    {"name": "input", "type": "string", "sample": "What is..."},
    {"name": "output", "type": "string", "sample": "The answer..."},
    {"name": "timestamp", "type": "datetime", "sample": "2024-02-16T..."},
    {"name": "agent_id", "type": "string", "sample": "agent-1"}
  ]
}
```

### Submit Field Mapping

```http
POST /api/v1/import/jobs/{job_id}/mapping
```

Map detected fields from your data to TrustScope's trace schema.

**Request Body:**
```json
{
  "field_mapping": {
    "input": "trigger_input",
    "output": "trigger_output",
    "timestamp": "timestamp",
    "agent_id": "agent_id",
    "model": "model_id"
  }
}
```

**Response:**
```json
{
  "job_id": "imp_abc123",
  "status": "processing",
  "estimated_traces": 5000
}
```

### Get Job Status

```http
GET /api/v1/import/jobs/{job_id}
```

Check the status and progress of an import job.

**Response:**
```json
{
  "job_id": "imp_abc123",
  "status": "completed",
  "progress": {
    "total_rows": 5000,
    "processed_rows": 5000,
    "imported_traces": 4850,
    "skipped_duplicates": 150,
    "errors": 0
  },
  "started_at": "2024-02-16T14:30:00Z",
  "completed_at": "2024-02-16T14:31:15Z",
  "detection_summary": {
    "pii_detected": 12,
    "secrets_detected": 2,
    "prompt_injection": 5
  }
}
```

### List Import Jobs

```http
GET /api/v1/import/jobs
```

List all import jobs for the organization.

**Query Parameters:**
- `status` - Filter by status (pending, processing, completed, failed)
- `limit` - Number of results (default: 20)
- `offset` - Pagination offset

**Response:**
```json
{
  "jobs": [
    {
      "job_id": "imp_abc123",
      "filename": "traces-2024.json",
      "status": "completed",
      "imported_traces": 4850,
      "created_at": "2024-02-16T14:00:00Z"
    }
  ],
  "total": 15,
  "has_more": true
}
```

## Supported Formats

### JSON

Standard JSON array of trace objects:

```json
[
  {
    "input": "What is the weather?",
    "output": "It's sunny today.",
    "timestamp": "2024-02-16T14:00:00Z",
    "agent_id": "weather-bot"
  }
]
```

### JSONL (JSON Lines)

One trace object per line:

```jsonl
{"input": "Hello", "output": "Hi there!", "timestamp": "2024-02-16T14:00:00Z"}
{"input": "Goodbye", "output": "See you!", "timestamp": "2024-02-16T14:01:00Z"}
```

### CSV

Comma-separated values with header row:

```csv
input,output,timestamp,agent_id
"What is 2+2?","4","2024-02-16T14:00:00Z","math-bot"
"What is 3+3?","6","2024-02-16T14:01:00Z","math-bot"
```

## Field Mapping

TrustScope's trace schema includes these fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `trigger_input` | string | Yes | User input / prompt |
| `trigger_output` | string | No | AI response |
| `timestamp` | datetime | Yes | When the trace occurred |
| `agent_id` | string | Yes | Agent identifier |
| `model_id` | string | No | Model used (e.g., gpt-4) |
| `session_id` | string | No | Session identifier |
| `action_type` | string | No | Type of action |
| `tool_calls` | array | No | Tool/function calls made |
| `metadata` | object | No | Additional metadata |

## Deduplication Strategies

- **skip** (default) - Skip duplicate traces
- **update** - Update existing traces with new data
- **error** - Fail if duplicates are found

Duplicates are detected using a hash of: `org_id + agent_id + timestamp + trigger_input`.

## Rate Limits

| Tier | Jobs/day | Max file size | Traces/job |
|------|----------|---------------|------------|
| Monitor | 5 | 10 MB | 5,000 |
| Protect | 20 | 100 MB | 25,000 |
| Enforce | 100 | 500 MB | 100,000 |
| Govern | Unlimited | 1 GB | 500,000 |

## Detection Engines

All imported traces are processed through TrustScope's detection engines:

- **PII Scanner** - Detects personal information
- **Secrets Scanner** - Finds API keys and credentials
- **Prompt Injection** - Identifies injection attempts
- **Jailbreak Detection** - Detects jailbreak patterns
- **Toxicity Filter** - Flags harmful content

Detection results are stored with each trace and available in the dashboard.

## Example: Import from LangSmith

```python
import requests

# 1. Create import job
job = requests.post(
    "https://api.trustscope.ai/api/v1/import/jobs",
    headers={"Authorization": f"Bearer {api_key}"},
    json={
        "filename": "langsmith-export.json",
        "format": "json",
        "source": "langsmith"
    }
).json()

# 2. Upload file
with open("langsmith-export.json", "rb") as f:
    requests.put(job["upload_url"], data=f)

# 3. Complete upload
requests.post(
    f"https://api.trustscope.ai/api/v1/import/jobs/{job['job_id']}/complete",
    headers={"Authorization": f"Bearer {api_key}"}
)

# 4. Submit mapping (if needed)
requests.post(
    f"https://api.trustscope.ai/api/v1/import/jobs/{job['job_id']}/mapping",
    headers={"Authorization": f"Bearer {api_key}"},
    json={
        "field_mapping": {
            "inputs.input": "trigger_input",
            "outputs.output": "trigger_output",
            "run_id": "trace_id"
        }
    }
)

# 5. Poll for completion
while True:
    status = requests.get(
        f"https://api.trustscope.ai/api/v1/import/jobs/{job['job_id']}",
        headers={"Authorization": f"Bearer {api_key}"}
    ).json()

    if status["status"] == "completed":
        print(f"Imported {status['progress']['imported_traces']} traces")
        break
    elif status["status"] == "failed":
        print(f"Import failed: {status['error']}")
        break

    time.sleep(5)
```

## Error Codes

| Code | Description |
|------|-------------|
| `INVALID_FORMAT` | Unsupported file format |
| `PARSE_ERROR` | Failed to parse file |
| `MAPPING_REQUIRED` | Field mapping not submitted |
| `QUOTA_EXCEEDED` | Import quota exceeded for tier |
| `FILE_TOO_LARGE` | File exceeds size limit |
| `DUPLICATE_JOB` | Import job already exists for this file |
