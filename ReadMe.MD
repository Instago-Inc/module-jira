# module/jira - V8 module

Make Jira updates part of your automated workflows without having to learn the API surface. This module focuses on the most common ticket actions so your flows stay small and easy to read.

If you need more context on the platform, visit https://instago.ai.

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
- `configure({ baseUrl, user, apiToken })` to set defaults in memory.
- Optional env keys: `jira.baseUrl`, `jira.user`, `jira.apiToken`.

Examples:
```js
const jira = require('jira@latest');

jira.configure({ baseUrl: env.JIRA_URL, user: env.JIRA_USER, apiToken: env.JIRA_API_TOKEN });

const created = await jira.createIssue({
  projectKey: 'ENG',
  summary: 'Bug report',
  description: 'Steps to reproduce...'
});

const moved = await jira.transitionIssue({ issueKey: 'ENG-123', transitionId: '31' });
const commented = await jira.addComment({ issueKey: 'ENG-123', body: 'Investigating.' });
```

Returns:
- All calls resolve to `{ ok, data, error }`.
