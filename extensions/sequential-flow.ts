import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import * as fs from "node:fs";
import * as path from "node:path";

export default function (pi: ExtensionAPI) {
  // Register slash command /seq-flow and /sequential-flow
  const registerSequentialFlow = (cmdName: string) => {
    pi.registerCommand(cmdName, {
      description: "Automated Sequential Multi-Agent Orchestration Flow (Scout -> Coder -> Tester -> Debugger)",
      handler: async (args: string, ctx: ExtensionCommandContext) => {
        const specFileName = args.trim() || "PROJECT_SPECS.md";
        const specPath = path.resolve(ctx.cwd, specFileName);

        if (!fs.existsSync(specPath)) {
          ctx.ui.notify(`Spec file not found: ${specFileName}`, "error");
          return;
        }

        ctx.ui.notify(`Initializing Sequential Workflow for ${specFileName}...`, "info");

        // 1. Ensure workflows/sequential-orchestrator.js exists in project
        const projectWorkflowDir = path.join(ctx.cwd, "workflows");
        const projectWorkflowPath = path.join(projectWorkflowDir, "sequential-orchestrator.js");
        const globalWorkflowPath = path.join(__dirname, "..", "workflows", "sequential-orchestrator.js");

        if (!fs.existsSync(projectWorkflowPath)) {
          if (!fs.existsSync(projectWorkflowDir)) {
            fs.mkdirSync(projectWorkflowDir, { recursive: true });
          }
          if (fs.existsSync(globalWorkflowPath)) {
            fs.copyFileSync(globalWorkflowPath, projectWorkflowPath);
          }
        }

        // 2. Ensure PROJECT_PHASE.md exists in project
        const phasePath = path.join(ctx.cwd, "PROJECT_PHASE.md");
        if (!fs.existsSync(phasePath)) {
          const initialPhase = `# Project Phase State: Automated Sequential Flow

**Specification**: [\`${specFileName}\`](./${specFileName})  
**Overall Status**: ⏳ \`IN_PROGRESS\`  
**Current Phase**: \`1.0 RECONNAISSANCE\`  
**Active Task**: \`Task 1: Foundation & Data Schema\`  
**Last Updated**: ${new Date().toISOString()}  

---

## 1. Specifications Matrix

| Spec Item | Description | Status | Recon (Scout) | Implementation (Coder) | Verification (Tester) | Debug Rounds | Final Verdict |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Task 1** | Foundation & Data Schema | 🔄 \`RECON\` | ⏳ Pending | ⏳ Pending | ⏳ Pending | \`0 / 3\` | ⏳ PENDING |
| **Task 2** | Seed & Service Layer | ⏳ \`PENDING\` | ⏳ Pending | ⏳ Pending | ⏳ Pending | \`0 / 3\` | ⏳ PENDING |
| **Task 3** | REST / Server Actions API | ⏳ \`PENDING\` | ⏳ Pending | ⏳ Pending | ⏳ Pending | \`0 / 3\` | ⏳ PENDING |
| **Task 4** | Main UI & Feed Display | ⏳ \`PENDING\` | ⏳ Pending | ⏳ Pending | ⏳ Pending | \`0 / 3\` | ⏳ PENDING |
| **Task 5** | Social Interactivity & State | ⏳ \`PENDING\` | ⏳ Pending | ⏳ Pending | ⏳ Pending | \`0 / 3\` | ⏳ PENDING |
| **Task 6** | Verification & Quality Gates | ⏳ \`PENDING\` | ⏳ Pending | ⏳ Pending | ⏳ Pending | \`0 / 3\` | ⏳ PENDING |

---

## 2. Phase Execution History

| Timestamp | Task | Phase | Agent | Status / Summary |
| :--- | :--- | :--- | :--- | :--- |
| \`${new Date().toISOString()}\` | - | \`INIT\` | Master Orchestrator | Initialized workflow for ${specFileName}. |

---

## 3. Human-in-the-Loop (HITL) Logs

| Timestamp | Task | Agent | Reason / Query | Supervisor / User Resolution | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *(None)* | - | - | Workflow initialized | Running automated multi-agent pipeline | \`RESOLVED\` |
`;
          fs.writeFileSync(phasePath, initialPhase, "utf-8");
        }

        ctx.ui.notify("Triggering automated subagent workflow...", "info");

        // 3. Send direct, imperative tool invocation message to agent session
        pi.sendUserMessage(
          `Execute the sequential workflow immediately by invoking the subagent tool with {"workflow": "./workflows/sequential-orchestrator.js"}. Do not output any conversational plan or markdown blocks; execute the tool call now.`
        );
      }
    });
  };

  registerSequentialFlow("sequential-flow");
  registerSequentialFlow("seq-flow");
}
