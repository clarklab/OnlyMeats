# OnlyMeats — project memory

## PR status: always verify before reporting

Before saying anything about a PR's state (open/closed/merged, what commits
are on it, whether new work needs a new PR), call
`mcp__github__pull_request_read` with `method: "get"` and look at the
actual `state`, `merged`, `closed_at` and `head.sha` fields. Do not infer
from "I pushed to that branch" or "I opened it as draft." Branches stay
pushable after merge; PRs auto-close on merge; new commits to a merged
branch are orphaned until a new PR is opened.

Specifically: when the user reports a PR state that contradicts what I
said, treat their report as ground truth and re-check via the API
*before* defending the previous claim.
