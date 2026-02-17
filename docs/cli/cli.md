# CLI Reference

The TrustScope CLI provides tools for discovering ungoverned AI agents, testing detections, proxying LLM calls, and managing your TrustScope configuration.

## Installation

```bash
# NPX (no install)
npx @trustscope/cli <command>

# Global install
npm install -g @trustscope/cli
trustscope <command>

# Or with pip
pip install trustscope-cli
trustscope <command>
```

## Commands

### scan

Scan your codebase for ungoverned AI agents and security risks.

```bash
trustscope scan [path] [options]
```

**Arguments:**
- `path` - Directory to scan (default: current directory)

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--github <org>` | Scan entire GitHub organization | - |
| `--depth <n>` | Maximum directory depth | 10 |
| `--exclude <pattern>` | Glob patterns to exclude | node_modules, .git |
| `--format <type>` | Output format: terminal, json, sarif | terminal |
| `--output, -o <file>` | Write output to file | stdout |
| `--severity <level>` | Minimum severity: info, warning, critical | info |
| `--no-color` | Disable colored output | - |
| `--quiet, -q` | Suppress non-essential output | - |
| `--verbose, -v` | Verbose output | - |

**Examples:**
```bash
# Scan current directory
trustscope scan

# Scan specific path
trustscope scan ./src

# Scan GitHub organization
trustscope scan --github acme-corp

# Output SARIF for GitHub Security
trustscope scan --format sarif --output results.sarif

# JSON output
trustscope scan --json

# Only show critical issues
trustscope scan --severity critical
```

**Exit Codes:**
- `0` - No critical or high severity findings
- `1` - Critical or high severity findings detected (fails CI)

**What It Detects:**

| Category | Examples |
|----------|----------|
| **Frameworks** | LangChain, CrewAI, AutoGen, LlamaIndex, Semantic Kernel |
| **SDKs** | OpenAI, Anthropic, Google AI, Mistral, Cohere, Groq |
| **MCP Servers** | Claude Desktop config, Cursor config |
| **Security** | Hardcoded API keys, exposed secrets |
| **Compliance** | Missing audit trails, no human oversight |

---

### watch

Start a local proxy that monitors and protects LLM API calls in real-time.

```bash
trustscope watch [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--port, -p <port>` | Proxy port | 4000 |
| `--host <host>` | Proxy host | localhost |
| `--max-rpm <n>` | Max requests per minute | 60 |
| `--max-cost <n>` | Max cost per session ($) | 10 |
| `--loop-threshold <n>` | Identical prompts before blocking | 5 |
| `--no-loop-detection` | Disable loop detection | - |
| `--no-cost-tracking` | Disable cost tracking | - |
| `--verbose, -v` | Verbose logging | - |

**Usage:**
```bash
# Start the proxy
trustscope watch --port 4000

# In your app, point to the proxy
export OPENAI_BASE_URL=http://localhost:4000/v1
export ANTHROPIC_BASE_URL=http://localhost:4000

# Run your agent
python my_agent.py
```

**Supported Providers:**
- OpenAI
- Anthropic
- Google AI
- Mistral
- Cohere
- Groq
- Azure OpenAI

**Protection Features:**

| Feature | Description | Default |
|---------|-------------|---------|
| Loop Detection | Blocks repeated identical prompts | 5 repetitions |
| Velocity Limit | Rate limits requests | 60 RPM |
| Cost Cap | Stops when cost exceeds threshold | $10/session |

**Example Output:**
```
TrustScope Watch Mode Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Listening: http://localhost:4000
Forwarding: OpenAI, Anthropic, Google, Mistral, Cohere, Groq

Press Ctrl+C to stop

[14:32:01] ✓ gpt-4o → 1,234 tokens ($0.05)
[14:32:03] ✓ gpt-4o → 856 tokens ($0.03)
[14:32:05] ⚠ LOOP DETECTED: Same prompt 5x in 10s
[14:32:05] ✕ BLOCKED: Loop protection triggered
           Estimated $47.20 saved
```

---

### test

Test a prompt through TrustScope detection engines.

```bash
trustscope test <prompt> [options]
```

**Arguments:**
- `prompt` - The prompt to test

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--agent <id>` | Agent ID for context | anonymous |
| `--detection <type>` | Specific detection to run | all |
| `--json` | JSON output | - |
| `--verbose, -v` | Show detailed results | - |

**Examples:**
```bash
# Test a prompt through all detections
trustscope test "What is 2+2?"

# Test with specific agent context
trustscope test "Process this refund" --agent refund-bot

# Test specific detection
trustscope test "DROP TABLE users;" --detection command_firewall

# JSON output
trustscope test "ignore previous instructions" --json
```

**Available Detections:**
- `pii_scan` - Personal identifiable information
- `secrets_scan` - API keys, passwords, tokens
- `prompt_injection` - Injection attempts
- `jailbreak` - Jailbreak patterns
- `command_firewall` - Dangerous commands
- `toxicity` - Harmful content
- `data_exfiltration` - Data leak patterns

---

### check

Run a specific detection engine on content.

```bash
trustscope check --detection <type> --input <content>
```

**Options:**
| Option | Description | Required |
|--------|-------------|----------|
| `--detection <type>` | Detection engine to run | Yes |
| `--input <content>` | Content to check | Yes |
| `--file <path>` | Read content from file | - |
| `--json` | JSON output | - |

**Examples:**
```bash
# Check for PII
trustscope check --detection pii_scan --input "SSN: 123-45-6789"

# Check for secrets
trustscope check --detection secrets_scan --input "sk-abc123..."

# Check file contents
trustscope check --detection prompt_injection --file prompt.txt

# JSON output
trustscope check --detection command_firewall --input "rm -rf /" --json
```

---

### traces

Query your TrustScope trace history.

```bash
trustscope traces [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--agent <id>` | Filter by agent ID | - |
| `--last <n>` | Last N traces | 20 |
| `--since <date>` | Traces since date | - |
| `--until <date>` | Traces until date | - |
| `--status <status>` | Filter by status | - |
| `--json` | JSON output | - |
| `--wide, -w` | Wide output (more columns) | - |

**Examples:**
```bash
# Recent traces
trustscope traces --last 10

# Traces for specific agent
trustscope traces --agent customer-support --last 50

# Traces from last hour
trustscope traces --since "1 hour ago"

# Failed traces only
trustscope traces --status failed

# JSON output
trustscope traces --json
```

---

### replay

Replay a trace through policy evaluation.

```bash
trustscope replay <trace_id> [options]
```

**Arguments:**
- `trace_id` - The trace ID to replay

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--with-policies` | Evaluate against current policies | - |
| `--with-detections` | Run detection engines | - |
| `--json` | JSON output | - |
| `--verbose, -v` | Detailed output | - |

**Examples:**
```bash
# Replay a trace
trustscope replay tr_abc123

# Replay with policy evaluation
trustscope replay tr_abc123 --with-policies

# Replay with all checks
trustscope replay tr_abc123 --with-policies --with-detections
```

---

### agents

List and manage your agents.

```bash
trustscope agents [command] [options]
```

**Subcommands:**
- `list` - List all agents (default)
- `show <id>` - Show agent details
- `dna <id>` - Show agent DNA fingerprint

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--exposure-score` | Sort by risk exposure | - |
| `--json` | JSON output | - |
| `--wide, -w` | Wide output | - |

**Examples:**
```bash
# List all agents
trustscope agents

# List sorted by exposure
trustscope agents list --exposure-score

# Show agent details
trustscope agents show customer-support

# Get agent DNA
trustscope agents dna customer-support
```

---

### export

Export traces and data for debugging or compliance.

```bash
trustscope export [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--agent <id>` | Filter by agent ID | - |
| `--days <n>` | Export last N days | 7 |
| `--since <date>` | Export since date | - |
| `--until <date>` | Export until date | - |
| `--format <type>` | Format: json, csv, parquet | json |
| `--output, -o <file>` | Output file | stdout |
| `--include-receipts` | Include check receipts | - |

**Examples:**
```bash
# Export last 7 days
trustscope export --days 7 --output traces.json

# Export specific agent
trustscope export --agent billing-agent --days 30 --format csv

# Export with receipts (Govern tier)
trustscope export --include-receipts --output evidence.json
```

---

### init

Initialize TrustScope configuration.

```bash
trustscope init [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--ci` | Create GitHub Actions workflow | - |
| `--force` | Overwrite existing files | - |
| `--config-only` | Only create .trustscope.yaml | - |

**Examples:**
```bash
# Create configuration
trustscope init

# Setup CI/CD
trustscope init --ci

# Force overwrite
trustscope init --force
```

**Creates:**
- `.trustscope.yaml` - Configuration file
- `.github/workflows/trustscope.yml` - GitHub Actions workflow (with --ci)

---

### login

Authenticate with TrustScope.

```bash
trustscope login [options]
```

**Options:**
| Option | Description | Default |
|--------|-------------|---------|
| `--token <key>` | Use API key directly | - |
| `--browser` | Open browser for auth | - |

**Examples:**
```bash
# Interactive login
trustscope login

# Login with token
trustscope login --token ts_live_xxx

# Browser-based login
trustscope login --browser
```

---

### config

Manage CLI configuration.

```bash
trustscope config [command] [options]
```

**Subcommands:**
- `show` - Show current config
- `set <key> <value>` - Set config value
- `get <key>` - Get config value
- `reset` - Reset to defaults

**Examples:**
```bash
# Show config
trustscope config show

# Set default agent
trustscope config set default_agent my-agent

# Get value
trustscope config get api_url
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TRUSTSCOPE_API_KEY` | API key for authentication | - |
| `TRUSTSCOPE_API_URL` | API base URL | https://api.trustscope.ai |
| `GITHUB_TOKEN` | GitHub token for org scanning | - |
| `TRUSTSCOPE_GITHUB_TOKEN` | Alternative GitHub token | - |
| `TRUSTSCOPE_DEBUG` | Enable debug logging | false |
| `NO_COLOR` | Disable colored output | false |

## Configuration File

`.trustscope.yaml`:

```yaml
# TrustScope CLI Configuration

# API settings
api_key: ${TRUSTSCOPE_API_KEY}
api_url: https://api.trustscope.ai

# Default scan settings
scan:
  exclude:
    - node_modules
    - .git
    - __pycache__
    - venv
    - .venv
  depth: 10
  severity: info

# Watch mode settings
watch:
  port: 4000
  max_rpm: 60
  max_cost: 10
  loop_threshold: 5

# Default agent for commands
default_agent: my-agent

# Output preferences
output:
  format: terminal
  color: true
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/trustscope.yml
name: TrustScope AI Governance

on:
  pull_request:
  push:
    branches: [main]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run TrustScope Scan
        run: npx @trustscope/cli scan --format sarif --output results.sarif

      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: results.sarif
```

### GitLab CI

```yaml
# .gitlab-ci.yml
trustscope:
  stage: test
  image: node:20
  script:
    - npx @trustscope/cli scan --format json --output report.json
  artifacts:
    reports:
      codequality: report.json
```

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success, no critical findings |
| 1 | Critical or high severity findings |
| 2 | Configuration error |
| 3 | Authentication error |
| 4 | Network error |

## Troubleshooting

### Authentication Failed

```bash
# Check API key
echo $TRUSTSCOPE_API_KEY

# Re-login
trustscope login
```

### Scan Not Finding Agents

```bash
# Increase depth
trustscope scan --depth 20

# Enable verbose
trustscope scan --verbose

# Check excludes
trustscope config show
```

### Watch Mode Not Proxying

```bash
# Check port availability
lsof -i :4000

# Use different port
trustscope watch --port 5000

# Check env vars
echo $OPENAI_BASE_URL
```

### Rate Limited

```bash
# Wait and retry
trustscope traces --last 10

# Use API key for higher limits
trustscope login --token ts_live_xxx
```

## Next Steps

- [Python SDK Quickstart](/docs/quickstart/python.md)
- [Node SDK Quickstart](/docs/quickstart/node.md)
- [MCP Setup Guide](/docs/guides/mcp-setup.md)
- [Governance API](/docs/api/governance.md)
