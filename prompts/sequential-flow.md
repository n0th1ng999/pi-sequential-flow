---
description: Automated sequential multi-agent orchestration flow (Scout -> Coder -> Tester -> Debugger)
argument-hint: "<path/to/spec_file.md>"
---

You are the Master Orchestrator. Your single immediate action is to launch the automated sequential development workflow.

CRITICAL INSTRUCTION FOR LOCAL MODELS:
- DO NOT output text plans or conversational outlines.
- DO NOT output pseudo-code or ```json { "action": ... } ``` blocks.
- Your immediate action right now is to call the `subagent` tool with `workflow: "./workflows/sequential-orchestrator.js"`.

Invoke the `subagent` tool now:
```json
{
  "workflow": "./workflows/sequential-orchestrator.js"
}
```
