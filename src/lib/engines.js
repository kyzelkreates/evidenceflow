import { audiences, reportSections } from './data.js';
const safe = (v,f='Not specified') => (v && String(v).trim()) || f;
export function generateExplanationPack(project,audienceId,state){
 const audience = audiences.find(a=>a.id===audienceId) || audiences[0];
 const base = `${safe(project.name)} is a ${state.settings.demoMode?'demo/live-ready':'live-backend-ready'} product system. It helps explain, present and validate complex project ideas by turning structured facts into clear audience-specific outputs.`;
 const proof = `Current proof: ${safe(project.status)}. Technology direction: ${safe(project.tech)}. Public benefit: ${safe(project.publicBenefit)}.`;
 const focus = `For a ${audience.label}, the explanation focuses on ${audience.focus}.`;
 const next = state.settings.demoMode ? 'The next production step is to turn demo mode off, connect the chosen backend, and validate live records, auth and exports.' : 'The system is configured for live mode and should now be validated against real user, backend and export workflows.';
 return { short: `${safe(project.name)} turns complex product thinking into clear ${audience.label.toLowerCase()}-ready wording while preserving the original meaning.`, full: `${base}\n\n${focus}\n\nProblem solved: ${safe(project.problem)}\n\n${proof}\n\n${next}`, sections: { 'Plain English': base, 'Audience Focus': focus, 'Proof Statement': proof, 'Next Step': next } };
}
export function scoreProject(p,state){
 const len = Object.values(p||{}).join(' ').length;
 const hasUrl = p?.url ? 10 : 0; const live = state.settings.backendConfigured ? 20 : 8;
 return { clarity: Math.min(96,55+Math.floor(len/40)), investor: Math.min(94,50+hasUrl+live), publicBenefit: p?.publicBenefit?88:45, liveReadiness: state.settings.demoMode?64:86 };
}
export function buildPitchDeckSections(project,state){
 return [
  ['Problem', safe(project.problem)], ['Solution', `${safe(project.name)} structures project facts into clear audience-ready outputs.`], ['Product', 'A command-centre dashboard, explanation engine, scoring layer, evidence builder, pitch room and report pack generator.'], ['Proof', safe(project.status)], ['Technology', safe(project.tech)], ['Impact', safe(project.publicBenefit)], ['Roadmap', state.settings.demoMode?'Connect backend, auth, server-side AI and PDF exports.':'Validate live backend, onboarding, analytics and commercial plan.']
 ].map(([title,body])=>({title,body}));
}
export function buildReport(project,state,chosen){
 const lines = ['4P3X ExplainFlow OS™ Report Pack','Powered by 4P3X Intelligent AI™ Created by Kyzel Kreates™',''];
 for (const id of chosen){
  const label = reportSections.find(r=>r.id===id)?.label || id;
  lines.push(`## ${label}`);
  lines.push(sectionText(id,project,state)); lines.push('');
 }
 return lines.join('\n');
}
function sectionText(id,p,state){
 const name=safe(p.name); const mode=state.settings.demoMode?'demo/live-ready':'live-backend-ready';
 const map={
  summary:`${name} is a ${mode} system designed to make complex project value easier to understand and present.`,
  investor:`${name} demonstrates reusable architecture, product direction, evidence-based explanation and commercial expansion potential.`,
  founder:'This work demonstrates rapid learning, systems thinking, AI-assisted development, modular product architecture and controlled refactoring discipline.',
  technical:`Architecture direction: ${safe(p.tech)}. State should remain SSOT-driven with no duplicate hidden stores.`,
  benefit:`Public benefit direction: ${safe(p.publicBenefit)}.`,
  commercial:'Commercial routes include SaaS, licensing, white-label, consulting, implementation support and sector-specific productisation.',
  risk:'Risks include production backend setup, live AI cost controls, legal review, customer validation, accessibility and support processes.',
  next:'Recommended next step: production validation, backend configuration, auth rules, export testing and focused user feedback.',
  cv:`Built ${name}, a ${mode} AI-assisted product explanation system with dashboard, PWA-ready structure, scoring logic and report exports.`,
  linkedin:`I have been building ${name}: a system that turns complex project thinking into clear audience-ready explanations for investors, employers, clients and funders.`
 };
 return map[id] || `${name}: ${safe(p.summary)}`;
}


export function analyseClaimSafety(text){
 const risky = ['world first','guaranteed','always','never fails','fully legal','100%','no risk','certain profit'];
 const lower = String(text||'').toLowerCase();
 const flags = risky.filter(term=>lower.includes(term));
 const safeText = String(text||'')
  .replace(/world first/ig,'first-of-its-kind')
  .replace(/guaranteed/ig,'designed to support')
  .replace(/100%/g,'high-confidence')
  .replace(/never fails/ig,'includes fallback and validation behaviour')
  .replace(/fully legal/ig,'advisory and subject to human/legal verification');
 return { flags, safeText, status: flags.length ? 'Needs safer wording' : 'Looks balanced', score: Math.max(40, 96 - flags.length*14) };
}

export function buildFounderCapability(project){
 return [
  ['Rapid learning','Developed working product systems during a rapid self-directed learning window using AI-assisted development and structured validation.'],
  ['Systems thinking','Understands products as reusable architectures, not isolated pages: dashboards, PWAs, AI guidance, SSOT data flow and backend-ready paths.'],
  ['Execution proof',`${safe(project?.name,'The active project')} demonstrates controlled refactoring, product direction and explanation logic that can be adapted for different audiences.`],
  ['Commercial awareness','Frames products around SaaS, licensing, white-label, grant, public-benefit and client delivery pathways.'],
  ['Build discipline','Uses fix-first, preserve-first, validate-first workflow with clear scope, anti-drift rules and demo/live separation.']
 ];
}
