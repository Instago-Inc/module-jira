# module/jira - V8 module

Keep Jira work visible in your automations without digging through API docs. This module focuses on a few common ticket actions so your flows stay clear and lightweight.

Learn more about the platform at https://instago.ai.

## Technical reference

Exports:
- `configure({ baseUrl, user, apiToken })`
- `createIssue({ projectKey, summary, description?, fields? })`
- `transitionIssue({ issueKey, transitionId })`
- `addComment({ issueKey, body })`

Usage:
```js
const jira = require('jira@latest');

jira.configure({
  baseUrl: 'https://your-org.atlassian.net',
  user: 'you@company.com',
  apiToken: 'api-token'
});
```

Configuration:
- `configure({ baseUrl, user, apiToken })` stores defaults in memory for subsequent calls.
- Optional env keys: `jira.baseUrl`, `jira.user`, `jira.apiToken`.

Examples:
```js
const jira = require('jira@latest');

jira.configure({
  baseUrl: env.JIRA_URL,
  user: env.JIRA_USER,
  apiToken: env.JIRA_API_TOKEN
});

const created = await jira.createIssue({
  projectKey: 'ENG',
  summary: 'Bug report',
  description: 'Steps to reproduce...'
});

const moved = await jira.transitionIssue({
  issueKey: 'ENG-123',
  transitionId: '31'
});

const commented = await jira.addComment({
  issueKey: 'ENG-123',
  body: 'Investigating.'
});
```

Returns:
- All calls resolve to `{ ok, data, error }`.
