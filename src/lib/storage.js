const KEY = 'explainflow_os_v4_state';
export const defaultState = {
  activeProjectId: 'demo-4p3x-verse',
  settings: { demoMode: true, backendConfigured: false, aiProviderConfigured: false, pwaEnabled: true, currentPlan: 'Founder Demo' },
  projects: [{
    id: 'demo-4p3x-verse',
    name: '4P3X Verse™ Portfolio Ecosystem',
    summary: 'One reusable modular architecture adapted into multiple AI-powered product systems with dashboards, PWAs, demo/live mode, AI guidance layers and backend-ready workflows.',
    problem: 'Strong AI-assisted builds can be difficult to explain clearly to investors, employers, clients and non-technical viewers.',
    url: 'https://4p3xaiinvestorportfoliokyzelkreates.vercel.app',
    publicBenefit: 'Mental health support, training access, compliance evidence, safer route planning and public-benefit software patterns.',
    tech: 'React, Vite, PWA, local-first SSOT, Supabase-ready, AI Config Guard™, report exports',
    status: 'Working deployed demo/live-ready ecosystem',
    tags: ['AI-assisted', 'PWA', 'Demo/live-ready', 'Portfolio', 'Backend-ready']
  }],
  explanations: [],
  reports: [],
  reviewerNotes: [],
  evidence: []
};
export function loadState(){
  try { return {...defaultState, ...(JSON.parse(localStorage.getItem(KEY)||'{}'))}; } catch { return defaultState; }
}
export function saveState(state){ localStorage.setItem(KEY, JSON.stringify(state)); }
export function resetDemo(){ localStorage.removeItem(KEY); return defaultState; }
export function createProject(form){ return { id: `project-${Date.now()}`, tags:['New','ExplainFlow'], ...form }; }
export function createExplanation(projectId,audience,pack){ return { id:`exp-${Date.now()}`, projectId, audience, pack, createdAt:new Date().toISOString() }; }
export function updateSettings(state,patch){ return {...state, settings:{...state.settings,...patch}}; }
