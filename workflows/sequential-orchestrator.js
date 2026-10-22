// workflows/sequential-orchestrator.js
// Pi-Subagents Workflow Script: Sequential SDD Development & Testing Loop

const defaultTasks = [
  {
    id: 1,
    title: "Foundation & Data Schema",
    requirements: "Initialize project template with TypeScript and Tailwind CSS. Define Prisma/Drizzle schema for User, Tweet, Like, Follow with relational constraints. Run migrations."
  },
  {
    id: 2,
    title: "Seed & Service Layer",
    requirements: "Create seed.ts with sample users, tweets, and follow relationships. Implement data access layer: getHomeFeed(userId), createTweet(userId, content), toggleLike(userId, tweetId)."
  },
  {
    id: 3,
    title: "REST / Server Actions API",
    requirements: "Implement endpoints with input validation (content <= 280 chars). Write automated API integration tests."
  },
  {
    id: 4,
    title: "Main UI & Feed Display",
    requirements: "Construct Twitter-like layout (left nav, feed timeline, right sidebar). Implement TweetComposer with character countdown. Implement TweetCard with user details and relative timestamps."
  },
  {
    id: 5,
    title: "Social Interactivity & State",
    requirements: "Implement optimistic like toggle with real-time counter. Implement follow/unfollow toggle for user profiles and suggestions."
  },
  {
    id: 6,
    title: "Verification & Quality Gates",
    requirements: "Run linter, TypeScript typecheck, and unit/integration test suite. Verify negative constraints (cannot post > 280 chars, cannot follow self)."
  }
];

const tasks = (args && args.tasks && args.tasks.length > 0) ? args.tasks : defaultTasks;
const results = [];

emit("Starting Sequential Development Flow for " + tasks.length + " tasks...");

for (let i = 0; i < tasks.length; i++) {
  const task = tasks[i];
  const taskLabel = "Task " + (task.id || (i + 1)) + ": " + task.title;

  emit("------------------------------------------------------------");
  emit(">>> " + taskLabel + " [PHASE: RECON]");

  // 1. RECON PHASE (Scout)
  const scoutKey = "recon-t" + (i + 1);
  const scoutPrompt = [
    "Task: RECONNAISSANCE FOR " + taskLabel,
    "Requirements: " + task.requirements,
    "",
    "Inspect the repository structure, existing files, and package configuration.",
    "Identify target files to create or modify, data models/schemas, and the test command to run.",
    "Output a concise Cold-Start Context Packet."
  ].join("\n");

  const scoutRun = await runs.run(scoutKey, {
    agent: "scout",
    task: scoutPrompt,
    acceptance: false
  });

  const scoutPacket = scoutRun.output || "No recon output captured.";
  emit(">>> " + taskLabel + " [PHASE: IMPLEMENTATION]");

  // 2. IMPLEMENTATION PHASE (Coder)
  const coderKey = "coder-t" + (i + 1);
  const coderPrompt = [
    "Task: IMPLEMENTATION FOR " + taskLabel,
    "Requirements: " + task.requirements,
    "",
    "Context from Scout:",
    scoutPacket,
    "",
    "Instructions:",
    "- Implement both the production code and tests for this task directly in the repository.",
    "- Initialize the project, dependencies, and configuration as needed.",
    "- Verify that the tests and build pass before concluding."
  ].join("\n");

  const coderRun = await runs.run(coderKey, {
    agent: "coder",
    task: coderPrompt,
    acceptance: false
  });

  emit(">>> " + taskLabel + " [PHASE: TESTING & DEBUG LOOP]");

  // 3. TESTING & DEBUG LOOP (Tester & Debugger)
  let taskPassed = false;
  let finalTestOutput = "";
  let debugRounds = 0;

  for (let round = 1; round <= 3; round++) {
    const testKey = "test-t" + (i + 1) + "-r" + round;
    const testPrompt = [
      "Task: VERIFICATION FOR " + taskLabel + " (Round " + round + "/3)",
      "Instructions:",
      "- Run the tests and typecheck for the repository to verify the implementation.",
      "- Conclude your turn with: `VERDICT: PASS` if all tests pass, or `VERDICT: FAIL` if any test fails or files are missing."
    ].join("\n");

    const testRun = await runs.run(testKey, {
      agent: "tester",
      task: testPrompt,
      acceptance: false
    });

    finalTestOutput = testRun.output || "";
    const isPass = finalTestOutput.includes("VERDICT: PASS") ||
      (finalTestOutput.includes("PASS") && !finalTestOutput.includes("VERDICT: FAIL") && !finalTestOutput.includes("FAIL:"));

    if (isPass) {
      taskPassed = true;
      emit(">>> " + taskLabel + " ✅ PASSED on round " + round + "!");
      break;
    }

    debugRounds = round;
    if (round < 3) {
      emit(">>> " + taskLabel + " ⚠️ Tests failed. Launching Debugger (Round " + round + "/3)...");
      const debugKey = "debug-t" + (i + 1) + "-r" + round;
      const debugPrompt = [
        "Task: BUG-FIXING FOR " + taskLabel + " (Round " + round + "/3)",
        "The tester reported the following outcome:",
        finalTestOutput,
        "",
        "Instructions:",
        "- Fix the implementation code in the repository to make the tests pass.",
        "- Anti-tamper: Never delete or weaken test assertions.",
        "- Verify with tests and provide a brief summary of what was fixed."
      ].join("\n");

      await runs.run(debugKey, {
        agent: "debugger",
        task: debugPrompt,
        acceptance: false
      });
    } else {
      emit(">>> " + taskLabel + " ❌ FAILED after 3 debug rounds. Escalating to human supervisor.");
    }
  }

  results.push({
    taskId: task.id || (i + 1),
    title: task.title,
    passed: taskPassed,
    debugRounds: debugRounds,
    summary: finalTestOutput.slice(0, 500)
  });

  if (!taskPassed) {
    return {
      status: "BLOCKED",
      blockedTask: taskLabel,
      completedCount: i,
      totalCount: tasks.length,
      results: results
    };
  }
}

emit("============================================================");
emit("🎉 All " + tasks.length + " tasks PASSED successfully!");
return {
  status: "SUCCESS",
  totalCount: tasks.length,
  results: results
};
