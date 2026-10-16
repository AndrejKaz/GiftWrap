# Capture setup verification

## Tool and model

- Tool: VS Code using the GitHub Copilot SDK harness.
- Model selection: `Auto (gpt-6-luna)`, as shown in the model picker; the captured response events identify `gpt-6-luna`.
- The UI does not expose separate planning and execution model assignments; it reports one Auto-selected model for the agent session.
- Automatic capture: yes. The Copilot lifecycle hooks run on prompt submission and when the agent stops.

## Mechanism

The repository hook configuration is [`.github/hooks/agent-capture.json`](./.github/hooks/agent-capture.json). It invokes [`scripts/capture-agent-log.ps1`](./scripts/capture-agent-log.ps1) for `userPromptSubmitted` and `agentStop`. The prompt hook receives the submitted prompt on stdin; the stop hook reads the final `assistant.message` from the session transcript path and appends it to `.agent-logs/`. Both hooks were exercised in separate Copilot sessions, not only the session that installed the hooks.

## Canary logs

The first successful canary landed in [`.agent-logs/2026-10-16_16-28-28_140adbab-7017-4517-8fd9-9309359a72b0.md`](./.agent-logs/2026-10-16_16-28-28_140adbab-7017-4517-8fd9-9309359a72b0.md). The second, from a separate session, landed in [`.agent-logs/2026-10-16_16-28-31_7496029e-80e7-44aa-a561-b274496bd141.md`](./.agent-logs/2026-10-16_16-28-31_7496029e-80e7-44aa-a561-b274496bd141.md).

### Canary 1 — raw log entry

```text
[LOG_ENTRY type=PROMPT num=1 session=140adbab]
timestamp: 2026-10-16T16:28:28.675Z
model: Auto (gpt-6-luna)

CAPTURE TEST — 8x assignment, Copilot

[LOG_ENTRY type=RESPONSE num=1 session=140adbab]
timestamp: 2026-10-16T16:28:41.568Z
model: gpt-6-luna

Capture test received. The prompt is recorded in [the session log](</C:/Users/kazio/OneDrive - UPR/Desktop/8xProject/.agent-logs/2026-10-16_16-28-28_140adbab-7017-4517-8fd9-9309359a72b0.md>); the agent-stop hook should append this response and finalize the exchange count.
```

### Canary 2 — raw log entry

```text
[LOG_ENTRY type=PROMPT num=1 session=7496029e]
timestamp: 2026-10-16T16:28:31.576Z
model: Auto (gpt-6-luna)

CAPTURE TEST — 8x assignment, Copilot (second session)

[LOG_ENTRY type=RESPONSE num=1 session=7496029e]
timestamp: 2026-10-16T16:28:50.145Z
model: gpt-6-luna

Capture test received. The prompt was recorded as entry 1 in [the session log](</C:/Users/kazio/OneDrive - UPR/Desktop/8xProject/.agent-logs/2026-10-16_16-28-31_7496029e-80e7-44aa-a561-b274496bd141.md>); the pending capture is ready for the stop hook to append this response.
```

## First attempt and limitations

The first pair of canary sessions exposed a Windows stdin encoding issue: the em dash in each prompt was decoded as mojibake. The exchange-count header also remained at zero because the update pattern did not handle CRLF. Those original, failed captures remain unchanged in `.agent-logs/`; they were not edited or deleted. I changed stdin handling to explicit UTF-8 and made the header updates CRLF-aware, then verified the handlers with a disposable transcript and reran both canaries successfully. The GitHub handle was confirmed after the successful canaries, so those raw log headers remain `author: unknown`; subsequent logs use `AndrejKaz`.

This hook was installed after the current conversation had already begun. It does not retroactively capture earlier turns in this conversation; the two canary sessions above demonstrate capture for sessions started after installation.
