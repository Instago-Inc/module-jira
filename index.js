// jira@1.0.0 — minimal Jira Cloud helper (REST API v3)
// Auth: Basic (email + API token), env via env@1.0.0 (jira.user/jira.apiToken)
// API:
// - configure({ baseUrl, user, apiToken })
// - createIssue({ projectKey, summary, description?, fields? })
// - transitionIssue({ issueKey, transitionId })
// - addComment({ issueKey, body })

(function(){
  const httpx = require('http@1.0.0');
  const b64 = require('b64@1.0.0');
  const log = require('log@1.0.0').create('jira');

  const cfg = { baseUrl: null, user: null, apiToken: null };

  function configure(opts){
    if (!opts || typeof opts !== 'object') return;
    if (opts.baseUrl) cfg.baseUrl = String(opts.baseUrl).replace(/\/$/, '');
    if (opts.user) cfg.user = String(opts.user);
    if (opts.apiToken) cfg.apiToken = String(opts.apiToken);
  }

  function pickBase(){ return (cfg.baseUrl || sys.env.get('jira.baseUrl') || '').replace(/\/$/, ''); }
  function authHeader(){
    const user = cfg.user || sys.env.get('jira.user') || '';
    const token = cfg.apiToken || sys.env.get('jira.apiToken') || '';
    if (!user || !token) return null;
    return { Authorization: 'Basic ' + b64.encodeAscii(user + ':' + token) };
  }

  async function createIssue({ projectKey, summary, description, fields }){
    try {
      const base = pickBase(); const auth = authHeader();
      if (!base || !auth) return { ok:false, error:'jira: missing baseUrl/user/apiToken' };
      const url = base + '/rest/api/3/issue';
      const bodyFields = Object.assign({
        project: { key: String(projectKey||'') },
        summary: String(summary||''),
        issuetype: (fields && fields.issuetype) || { name: 'Task' }
      }, fields || {});
      if (typeof description === 'string') bodyFields.description = description;
      const r = await httpx.json({ url, method:'POST', headers: Object.assign({ 'Content-Type':'application/json' }, auth), bodyObj: { fields: bodyFields } });
      return { ok:true, data: r && (r.json||r.raw) };
    } catch (e){ log.error('createIssue:error', e && (e.message||e)); return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  async function transitionIssue({ issueKey, transitionId }){
    try {
      const base = pickBase(); const auth = authHeader();
      if (!base || !auth) return { ok:false, error:'jira: missing baseUrl/user/apiToken' };
      const url = base + '/rest/api/3/issue/' + encodeURIComponent(issueKey) + '/transitions';
      const r = await httpx.json({ url, method:'POST', headers: Object.assign({ 'Content-Type':'application/json' }, auth), bodyObj: { transition: { id: String(transitionId) } } });
      return { ok:true, data: r && (r.json||r.raw) };
    } catch (e){ log.error('transitionIssue:error', e && (e.message||e)); return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  async function addComment({ issueKey, body }){
    try {
      const base = pickBase(); const auth = authHeader();
      if (!base || !auth) return { ok:false, error:'jira: missing baseUrl/user/apiToken' };
      const url = base + '/rest/api/3/issue/' + encodeURIComponent(issueKey) + '/comment';
      const r = await httpx.json({ url, method:'POST', headers: Object.assign({ 'Content-Type':'application/json' }, auth), bodyObj: { body: String(body||'') } });
      return { ok:true, data: r && (r.json||r.raw) };
    } catch (e){ log.error('addComment:error', e && (e.message||e)); return { ok:false, error: (e && (e.message||String(e))) || 'unknown' }; }
  }

  module.exports = { configure, createIssue, transitionIssue, addComment };
})();
