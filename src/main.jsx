import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Brain, Sparkles, ShieldCheck, FileText, Gauge, Users, Rocket, Database,
  Settings, Layers, Presentation, SearchCheck, MessageSquareWarning,
  PackageCheck, Menu, X, Download, Copy, Wand2, GitBranch, Building2,
  Crown, BookOpen, Eye, ClipboardCheck, CheckCircle2
} from 'lucide-react';
import './styles/global.css';
import { defaultState, loadState, saveState, createProject, createExplanation, updateSettings, resetDemo } from './lib/storage.js';
import { audiences, knowledgeVault, objectionBank, reportSections, buildRuns, investorJourneySteps, marketRoutes, productFamily } from './lib/data.js';
import { generateExplanationPack, scoreProject, buildReport, buildPitchDeckSections, analyseClaimSafety, buildFounderCapability } from './lib/engines.js';

const nav = [
  ['home',         'Home',             Sparkles],
  ['dashboard',    'Command Centre',   Gauge],
  ['wizard',       'Project Wizard',   Wand2],
  ['generator',    'Explanation Engine', Brain],
  ['compare',      'Audience Compare', Users],
  ['clarity',      'Clarity Transformer', SearchCheck],
  ['vault',        '4P3X Vault',       BookOpen],
  ['objections',   'Objection Handler', MessageSquareWarning],
  ['evidence',     'Evidence Builder', ClipboardCheck],
  ['pitch',        'Pitch Room',       Presentation],
  ['reports',      'Report Packs',     FileText],
  ['enterprise',   'Enterprise Layer', Crown],
  ['investor-demo','Investor Demo',    Rocket],
  ['founder',      'Founder Engine',   Building2],
  ['market',       'Market Mapper',    GitBranch],
  ['claim-guard',  'Claim Guard',      ShieldCheck],
  ['family',       'Product Family',   Layers],
  ['v5-wow',       'V5 Wow Layer',     Eye],
  ['settings',     'Settings',         Settings],
];

/* ── Utility components ─────────────────── */
function Section({ eyebrow, title, children, actions }) {
  return (
    <section className="section" aria-label={title}>
      <div className="section-head">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        {actions && <div className="actions">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function Meter({ label, value }) {
  return (
    <div className="meter" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div><span>{label}</span><b>{value}%</b></div>
      <progress value={value} max="100" aria-hidden="true" />
    </div>
  );
}

function CopyBtn({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  function handle() {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button onClick={handle} aria-label={`Copy ${label}`}>
      {copied ? <CheckCircle2 size={16} color="var(--green)" /> : <Copy size={16} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}

function SaveOK() {
  return <span className="save-ok" aria-live="polite"><CheckCircle2 size={14} /> Saved</span>;
}

function download(name, text, type = 'text/plain') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

/* ── App Shell ──────────────────────────── */
function App() {
  const [state, setState] = useState(() => loadState());
  const [page, setPage] = useState('home');
  const [menu, setMenu] = useState(false);

  useEffect(() => saveState(state), [state]);
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  const activeProject = state.projects.find(p => p.id === state.activeProjectId) || state.projects[0];
  const scores = useMemo(() => scoreProject(activeProject, state), [activeProject, state]);
  const setAndSave = useCallback(next => setState(next), []);
  const shellProps = { state, setState: setAndSave, page, setPage, activeProject, scores };

  const closeMenu = useCallback(() => setMenu(false), []);

  return (
    <div className="app-shell">
      {/* Mobile overlay */}
      {menu && <div className="sidebar-overlay" onClick={closeMenu} aria-hidden="true" />}

      <aside className={`sidebar ${menu ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
        <div className="brand">
          <div className="orb" aria-hidden="true">4X</div>
          <div>
            <strong>4P3X ExplainFlow OS™</strong>
            <span>Created by Kyzel Kreates™</span>
          </div>
        </div>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={page === id ? 'active' : ''}
              aria-current={page === id ? 'page' : undefined}
              onClick={() => { setPage(id); closeMenu(); }}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="side-card">
          <ShieldCheck size={16} aria-hidden="true" />
          <p><b>Demo Mode shows the product.</b><br />Live Mode runs the product.</p>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="hamb" onClick={() => setMenu(!menu)} aria-label={menu ? 'Close menu' : 'Open menu'} aria-expanded={menu}>
            {menu ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <b>{nav.find(n => n[0] === page)?.[1]}</b>
            <span>{state.settings.demoMode ? 'Demo Mode Active' : 'Live Mode Ready'}</span>
          </div>
          <button className="pill" onClick={() => setPage('settings')} aria-label="API Config Guard settings">
            <Database size={15} aria-hidden="true" /> API Config Guard™
          </button>
        </header>

        {page === 'home'          && <Home         {...shellProps} />}
        {page === 'dashboard'     && <Dashboard    {...shellProps} />}
        {page === 'wizard'        && <Wizard       {...shellProps} />}
        {page === 'generator'     && <Generator    {...shellProps} />}
        {page === 'compare'       && <Compare      {...shellProps} />}
        {page === 'clarity'       && <Clarity      {...shellProps} />}
        {page === 'vault'         && <Vault        {...shellProps} />}
        {page === 'objections'    && <Objections   {...shellProps} />}
        {page === 'evidence'      && <Evidence     {...shellProps} />}
        {page === 'pitch'         && <PitchRoom    {...shellProps} />}
        {page === 'reports'       && <Reports      {...shellProps} />}
        {page === 'enterprise'    && <Enterprise   {...shellProps} />}
        {page === 'investor-demo' && <InvestorDemo {...shellProps} />}
        {page === 'founder'       && <FounderEngine {...shellProps} />}
        {page === 'market'        && <MarketMapper {...shellProps} />}
        {page === 'claim-guard'   && <ClaimGuard   {...shellProps} />}
        {page === 'family'        && <ProductFamily {...shellProps} />}
        {page === 'v5-wow'        && <V5Wow        {...shellProps} />}
        {page === 'settings'      && <SettingsPage {...shellProps} />}
      </main>
    </div>
  );
}

/* ── Pages ──────────────────────────────── */

function Home({ setPage }) {
  return (
    <Section
      eyebrow="Flagship build"
      title="Audience-aware explanation intelligence for projects, pitches, proof and public benefit."
      actions={<button className="cta" onClick={() => setPage('wizard')}>Start Project Wizard</button>}
    >
      <div className="hero-grid">
        <Card className="hero">
          <h2>4P3X ExplainFlow OS™</h2>
          <p>Powered by 4P3X Intelligent AI™ &nbsp;·&nbsp; Created by Kyzel Kreates™</p>
          <p className="lead">A complete explanation operating system that turns complex project thinking into investor-ready, employer-ready, client-ready, technical and public-benefit language — without losing the original meaning.</p>
          <div className="hero-flow">
            <span>Rough idea</span><b>→</b>
            <span>Structured proof</span><b>→</b>
            <span>Audience output</span><b>→</b>
            <span>Report pack</span>
          </div>
        </Card>
        <Card>
          <h3>Who / What / Why</h3>
          <p><b>Who:</b> founders, builders, employers, funders, clients, technical reviewers and non-technical viewers.</p>
          <p><b>What:</b> explanation generator, scoring engine, pitch room, evidence builder, objection handler, report exporter and portfolio knowledge vault.</p>
          <p><b>Why:</b> strong ideas lose value when they are hard to explain. ExplainFlow makes the thinking visible.</p>
        </Card>
      </div>
      <div className="grid four">
        {[
          ['Audience Intelligence', 'Different wording for each audience without changing the truth.'],
          ['Evidence-to-Explanation', 'Turns proof points, URLs and product facts into usable statements.'],
          ['Pitch Theatre Mode', 'Fullscreen pitch flow for meetings, demos and portfolio presentations.'],
          ['Enterprise Ready', 'Supabase, auth, AI provider and licensing-ready structure.'],
        ].map(([title, desc]) => (
          <Card key={title}>
            <Sparkles size={20} color="var(--gold)" aria-hidden="true" />
            <h3>{title}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{desc}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Dashboard({ state, activeProject, scores, setPage }) {
  return (
    <Section
      eyebrow="Command centre"
      title="ExplainFlow Intelligence Dashboard"
      actions={<button className="cta" onClick={() => setPage('reports')}>Build Report Pack</button>}
    >
      <div className="grid three">
        <Card>
          <h3>Active Project</h3>
          <h2>{activeProject.name}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>{activeProject.summary}</p>
          <div className="tags">{activeProject.tags.map(t => <span key={t}>{t}</span>)}</div>
        </Card>
        <Card>
          <h3>System Status</h3>
          <p><b>Mode:</b> {state.settings.demoMode ? 'Demo / local-first' : 'Live backend-ready'}</p>
          <p><b>AI:</b> {state.settings.aiProviderConfigured ? 'Provider configured' : 'Deterministic fallback active'}</p>
          <p><b>Backend:</b> {state.settings.backendConfigured ? 'Configured' : 'Placeholder safe fallback'}</p>
        </Card>
        <Card>
          <h3>Build Scope</h3>
          <p>V5 Investor Demo + Founder Intelligence Layer</p>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>38 planned capability runs included: V4 Enterprise plus V5 investor demo and founder intelligence upgrades.</p>
        </Card>
      </div>
      <div className="grid four" style={{ marginTop: 18 }}>
        <Meter label="Clarity" value={scores.clarity} />
        <Meter label="Investor readiness" value={scores.investor} />
        <Meter label="Public benefit" value={scores.publicBenefit} />
        <Meter label="Live readiness" value={scores.liveReadiness} />
      </div>
      <div className="timeline">
        {buildRuns.map(r => (
          <div className="run" key={r.run}>
            <b>Run {r.run}</b>
            <span>{r.title}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Wizard({ state, setState }) {
  const [form, setForm] = useState({
    name: '', summary: '', problem: '', audience: 'investor',
    url: '', publicBenefit: '',
    tech: 'React, Vite, PWA, Local-first SSOT, Supabase-ready',
    status: 'Working demo/live-ready',
  });
  const [saved, setSaved] = useState(false);

  function add() {
    if (!form.name.trim()) return;
    const p = createProject(form);
    setState({ ...state, projects: [p, ...state.projects], activeProjectId: p.id });
    setForm({ ...form, name: '', summary: '', problem: '', url: '', publicBenefit: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields = [
    ['name', 'Project name'],
    ['summary', 'Summary'],
    ['problem', 'Problem solved'],
    ['url', 'Demo / live URL'],
    ['publicBenefit', 'Public benefit'],
    ['tech', 'Technology stack'],
    ['status', 'Current status'],
  ];

  return (
    <Section eyebrow="Project intake" title="Smart Project Wizard">
      <div className="form-grid">
        <Card>
          <h3>Project details</h3>
          {fields.map(([k, lbl]) => (
            <label key={k}>
              {lbl}
              <textarea
                value={form[k]}
                onChange={e => setForm({ ...form, [k]: e.target.value })}
                placeholder={`Enter ${lbl.toLowerCase()}`}
                rows={2}
              />
            </label>
          ))}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="cta" onClick={add} disabled={!form.name.trim()}>Save Project Profile</button>
            {saved && <SaveOK />}
          </div>
        </Card>
        <Card>
          <h3>Wizard logic</h3>
          <p style={{ color: 'var(--muted)' }}>This run captures the facts before generating polished wording. It keeps output grounded and avoids fake claims.</p>
          <ul style={{ color: 'var(--silver)', paddingLeft: 18, lineHeight: 1.8 }}>
            <li>Project purpose</li>
            <li>Who it helps</li>
            <li>Proof points</li>
            <li>Demo / live state</li>
            <li>Technical and public-benefit value</li>
          </ul>
          {state.projects.length > 0 && (
            <>
              <h3 style={{ marginTop: 18 }}>Saved projects ({state.projects.length})</h3>
              {state.projects.map(p => (
                <div key={p.id} style={{ padding: '8px 10px', border: '1px solid var(--line)', borderRadius: 10, marginBottom: 8, fontSize: 13, color: 'var(--silver)' }}>
                  <b style={{ color: 'var(--text)' }}>{p.name}</b>
                  {p.status && <span style={{ color: 'var(--muted)', marginLeft: 8 }}>{p.status}</span>}
                </div>
              ))}
            </>
          )}
        </Card>
      </div>
    </Section>
  );
}

function Generator({ state, setState, activeProject }) {
  const [aud, setAud] = useState('investor');
  const [saved, setSaved] = useState(false);
  const pack = generateExplanationPack(activeProject, aud, state);

  function save() {
    const rec = createExplanation(activeProject.id, aud, pack);
    setState({ ...state, explanations: [rec, ...state.explanations] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Section
      eyebrow="Explanation engine"
      title="Generate audience-ready wording"
      actions={
        <select value={aud} onChange={e => setAud(e.target.value)} aria-label="Select audience">
          {audiences.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      }
    >
      <div className="grid two">
        <Card>
          <h3>{audiences.find(a => a.id === aud)?.label} output</h3>
          <pre className="output">{pack.full}</pre>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <CopyBtn text={pack.full} label="Copy output" />
            <button onClick={save}><PackageCheck size={16} aria-hidden="true" /> Save Output</button>
            {saved && <SaveOK />}
          </div>
        </Card>
        <Card>
          <h3>Generated pack</h3>
          {Object.entries(pack.sections).map(([k, v]) => (
            <details key={k} open>
              <summary>{k}</summary>
              <p>{v}</p>
            </details>
          ))}
          {state.explanations.length > 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 14 }}>
              {state.explanations.length} output{state.explanations.length > 1 ? 's' : ''} saved this session.
            </p>
          )}
        </Card>
      </div>
    </Section>
  );
}

function Compare({ state, activeProject }) {
  const selected = ['investor', 'employer', 'client', 'funder', 'technical', 'public'];
  return (
    <Section eyebrow="Multi-audience intelligence" title="One project explained six ways">
      <div className="grid three">
        {selected.map(id => {
          const pack = generateExplanationPack(activeProject, id, state);
          return (
            <Card key={id}>
              <h3>{audiences.find(a => a.id === id)?.label}</h3>
              <p style={{ color: 'var(--silver)', fontSize: 14 }}>{pack.short}</p>
              <CopyBtn text={pack.full} label="Copy" />
            </Card>
          );
        })}
      </div>
    </Section>
  );
}

function Clarity() {
  const [rough, setRough] = useState('I made a system that uses one base to make loads of different software products with AI and dashboards and it can become live later.');
  const cleaned = rough
    .replace(/loads of/gi, 'many')
    .replace(/\bmade\b/gi, 'built')
    .trim();
  const transformed = `Clear version:\n${cleaned}\n\nInvestor version:\nThis project demonstrates a reusable modular software architecture that can be adapted into multiple AI-assisted product directions, with demo/live readiness and backend expansion potential.\n\nPlain English version:\nIt is one flexible software base that can be reshaped into different working products instead of rebuilding everything from scratch.`;
  return (
    <Section eyebrow="Before / after transformer" title="Turn rough thinking into clear professional language">
      <div className="grid two">
        <Card>
          <h3>Rough input</h3>
          <textarea className="big" value={rough} onChange={e => setRough(e.target.value)} aria-label="Rough text input" />
        </Card>
        <Card>
          <h3>Professional transformation</h3>
          <pre className="output">{transformed}</pre>
          <CopyBtn text={transformed} label="Copy transformation" />
        </Card>
      </div>
    </Section>
  );
}

function Vault() {
  return (
    <Section eyebrow="4P3X Verse™ Knowledge Vault" title="Built-in ecosystem brain">
      <div className="grid two">
        {knowledgeVault.map(item => (
          <Card key={item.title}>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--muted)' }}>{item.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Objections() {
  return (
    <Section eyebrow="Smart objection handler" title="Difficult questions answered professionally">
      <div className="grid two">
        {objectionBank.map(o => (
          <Card key={o.q}>
            <h3 style={{ color: 'var(--gold)' }}>{o.q}</h3>
            <p style={{ color: 'var(--silver)', fontSize: 14 }}>{o.a}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Evidence() {
  const [proof, setProof] = useState('11 live deployed demos prove one base can be adapted into multiple sector-ready working products.');
  return (
    <Section eyebrow="Evidence-to-explanation" title="Convert proof points into trust statements">
      <div className="grid two">
        <Card>
          <h3>Your proof point</h3>
          <textarea className="big" value={proof} onChange={e => setProof(e.target.value)} aria-label="Proof point input" />
        </Card>
        <Card>
          <h3>Evidence output</h3>
          <p><b style={{ color: 'var(--gold)' }}>Investor proof:</b><br />{proof} This supports the claim that the architecture is repeatable, adaptable and not limited to a single isolated prototype.</p>
          <p style={{ marginTop: 14 }}><b style={{ color: 'var(--silver)' }}>CV proof:</b><br />Demonstrated rapid AI-assisted product engineering by deploying multiple working sector variants from a reusable modular base.</p>
        </Card>
      </div>
    </Section>
  );
}

function PitchRoom({ state, activeProject }) {
  const deck = buildPitchDeckSections(activeProject, state);
  return (
    <Section eyebrow="Demo theatre mode" title="Pitch Room / Presentation Mode">
      <div className="pitch-stage">
        {deck.map((s, i) => (
          <Card key={s.title}>
            <span className="slide-no">{String(i + 1).padStart(2, '0')}</span>
            <h2>{s.title}</h2>
            <p style={{ color: 'var(--silver)' }}>{s.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Reports({ state, activeProject }) {
  const [chosen, setChosen] = useState(reportSections.map(r => r.id));
  const report = buildReport(activeProject, state, chosen);
  const toggle = (id, checked) => setChosen(checked ? [...chosen, id] : chosen.filter(x => x !== id));

  return (
    <Section eyebrow="Advanced report pack builder" title="Build exportable explanation packs">
      <div className="grid two">
        <Card>
          <h3>Select sections</h3>
          {reportSections.map(r => (
            <label className="check" key={r.id} htmlFor={`rep-${r.id}`}>
              <input
                id={`rep-${r.id}`}
                type="checkbox"
                checked={chosen.includes(r.id)}
                onChange={e => toggle(r.id, e.target.checked)}
              />
              {r.label}
            </label>
          ))}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
            <button onClick={() => download('explainflow-report-pack.txt', report)}>
              <Download size={15} aria-hidden="true" /> Download .txt
            </button>
            <button onClick={() => download('explainflow-report-pack.json', JSON.stringify({ project: activeProject, report }, null, 2), 'application/json')}>
              <Download size={15} aria-hidden="true" /> Download .json
            </button>
          </div>
        </Card>
        <Card>
          <h3>Report preview</h3>
          <pre className="output tall">{report}</pre>
        </Card>
      </div>
    </Section>
  );
}

function Enterprise() {
  const items = [
    ['Supabase backend', 'SQL schema included in /sql/supabase_schema.sql with RLS enabled.'],
    ['Auth & workspaces', 'User/workspace ownership model planned and UI-ready.'],
    ['AI provider layer', 'Config Guard™ prevents fake live AI claims and falls back safely.'],
    ['PDF / export suite', 'Print-ready and text/json export structure included.'],
    ['Reviewer collaboration', 'Notes, approvals and review states designed.'],
    ['Licensing readiness', 'Free, founder, team, enterprise and white-label plan matrix.'],
  ];
  return (
    <Section eyebrow="V4 Enterprise layer" title="Commercial infrastructure readiness">
      <div className="grid three">
        {items.map(([a, b]) => (
          <Card key={a}>
            <ShieldCheck size={20} color="var(--green)" aria-hidden="true" />
            <h3 style={{ marginTop: 10 }}>{a}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{b}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function InvestorDemo({ setPage }) {
  return (
    <Section
      eyebrow="Run 33 — investor demo journey"
      title="Guided investor, employer and funder walkthrough"
      actions={<button className="cta" onClick={() => setPage('pitch')}>Open Pitch Room</button>}
    >
      <div className="journey">
        {investorJourneySteps.map((step, i) => (
          <Card key={step.title}>
            <span className="slide-no">STEP {i + 1}</span>
            <h2>{step.title}</h2>
            <p style={{ color: 'var(--silver)' }}>{step.body}</p>
          </Card>
        ))}
      </div>
      <Card className="banner">
        <h3>Demo journey outcome</h3>
        <p style={{ color: 'var(--muted)' }}>This page gives viewers a clear route through the product instead of leaving them to click around randomly. It explains the founder story, product problem, solution, proof, public benefit and next commercial step.</p>
      </Card>
    </Section>
  );
}

function FounderEngine({ activeProject }) {
  const items = buildFounderCapability(activeProject);
  return (
    <Section eyebrow="Run 34 — founder capability engine" title="Turn the builder story into professional proof">
      <div className="grid two">
        {items.map(([title, body]) => (
          <Card key={title}>
            <Building2 size={20} color="var(--purple)" aria-hidden="true" />
            <h3 style={{ marginTop: 10 }}>{title}</h3>
            <p style={{ color: 'var(--muted)' }}>{body}</p>
          </Card>
        ))}
      </div>
      <Card className="banner">
        <h3>CV / portfolio positioning</h3>
        <p style={{ color: 'var(--muted)' }}>Rapid Learning. Modular Thinking. Real Product Direction. The value is not only the number of demos; it is the reusable architecture, controlled refactoring workflow and ability to convert complex ideas into working product systems.</p>
      </Card>
    </Section>
  );
}

function MarketMapper() {
  return (
    <Section eyebrow="Run 35 — product-to-market mapper" title="Map one product into realistic commercial pathways">
      <div className="grid three">
        {marketRoutes.map(r => (
          <Card key={r.route}>
            <GitBranch size={20} color="var(--green)" aria-hidden="true" />
            <h3 style={{ marginTop: 10 }}>{r.route}</h3>
            <p style={{ color: 'var(--muted)' }}>{r.value}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function ClaimGuard() {
  const [text, setText] = useState('This is a world first system that guarantees 100% success and never fails.');
  const result = analyseClaimSafety(text);
  return (
    <Section eyebrow="Run 36 — AI Trust & Claim Safety Guard" title="Protect investor credibility by flagging risky claims">
      <div className="grid two">
        <Card>
          <h3>Claim input</h3>
          <textarea className="big" value={text} onChange={e => setText(e.target.value)} aria-label="Claim text input" />
          <Meter label="Claim safety score" value={result.score} />
          <p style={{ marginTop: 10 }}><b>Status:</b> <span style={{ color: result.flags.length ? 'var(--danger)' : 'var(--green)' }}>{result.status}</span></p>
          {result.flags.length > 0 && (
            <div className="tags" style={{ marginTop: 8 }}>
              {result.flags.map(f => <span key={f} style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>{f}</span>)}
            </div>
          )}
          {result.flags.length === 0 && <p style={{ color: 'var(--green)', fontSize: 13 }}>✓ No risky terms detected.</p>}
        </Card>
        <Card>
          <h3>Safer wording suggestion</h3>
          <pre className="output">{result.safeText}</pre>
          <CopyBtn text={result.safeText} label="Copy safer wording" />
        </Card>
      </div>
    </Section>
  );
}

function ProductFamily() {
  return (
    <Section eyebrow="Run 37 — 4P3X product family mapper" title="Show how the ecosystem scales from one base to many product directions">
      <div className="family-map">
        {productFamily.map((item, i) => (
          <Card key={item.layer}>
            <span className="slide-no">{String(i + 1).padStart(2, '0')}</span>
            <h2>{item.layer}</h2>
            <p style={{ color: 'var(--silver)' }}>{item.body}</p>
          </Card>
        ))}
      </div>
      <Card className="banner">
        <h3>Professional ecosystem wording</h3>
        <p style={{ color: 'var(--muted)' }}>4P3X Verse™ is best presented as one connected modular AI-powered engineering ecosystem. One base architecture can support dashboards, PWAs, AI guidance, demo/live switching, progress tracking, reporting, evidence capture and backend-ready workflows across multiple sectors.</p>
      </Card>
    </Section>
  );
}

function V5Wow({ setPage }) {
  const items = [
    ['Guided Demo',   'A clear investor/employer/funder journey mode.', 'investor-demo'],
    ['Founder Proof', 'A capability engine explaining rapid learning and systems thinking.', 'founder'],
    ['Market Paths',  'SaaS, licensing, white-label, public-benefit and client delivery mapping.', 'market'],
    ['Claim Safety',  'Safer wording guard for investor credibility.', 'claim-guard'],
    ['Family Mapper', 'Base-to-variant ecosystem scale story.', 'family'],
    ['Polish Guard',  'No rebuild, no broken SSOT, no fake completion claims.', 'settings'],
  ];
  return (
    <Section eyebrow="Run 38 — final V5 wow polish pack" title="Investor demo + founder intelligence layer complete">
      <div className="grid three">
        {items.map(([a, b, target]) => (
          <Card key={a}>
            <Sparkles size={20} color="var(--gold)" aria-hidden="true" />
            <h3 style={{ marginTop: 10 }}>{a}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>{b}</p>
            <button onClick={() => setPage(target)} style={{ marginTop: 8 }}>Open →</button>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function SettingsPage({ state, setState }) {
  const upd = patch => setState(updateSettings(state, patch));
  const [reset, setReset] = useState(false);

  function handleReset() {
    setState(resetDemo());
    setReset(true);
    setTimeout(() => setReset(false), 2000);
  }

  return (
    <Section eyebrow="Settings" title="Demo/live, backend and API Config Guard™">
      <div className="grid two">
        <Card>
          <h3>Mode controls</h3>
          <label className="switch">
            <input type="checkbox" checked={state.settings.demoMode} onChange={e => upd({ demoMode: e.target.checked })} />
            <span>Demo Mode {state.settings.demoMode ? 'ON' : 'OFF'}</span>
          </label>
          <label className="switch">
            <input type="checkbox" checked={state.settings.backendConfigured} onChange={e => upd({ backendConfigured: e.target.checked })} />
            <span>Backend configured</span>
          </label>
          <label className="switch">
            <input type="checkbox" checked={state.settings.aiProviderConfigured} onChange={e => upd({ aiProviderConfigured: e.target.checked })} />
            <span>AI provider configured</span>
          </label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14 }}>
            <button onClick={handleReset}>Reset Demo Data</button>
            {reset && <SaveOK />}
          </div>
        </Card>
        <Card>
          <h3>API Config Guard™</h3>
          <p style={{ color: 'var(--muted)' }}>No backend-only secrets are stored in this frontend demo. Live mode must use server-side functions or Supabase Edge Functions for protected provider keys.</p>
          <p style={{ marginTop: 12 }}><b>Allowed here:</b> public anon keys, masked config status, safe fallback UI.</p>
          <p style={{ marginTop: 8 }}><b style={{ color: 'var(--danger)' }}>Forbidden:</b> service-role keys, private AI provider secrets, fake success states.</p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 14 }}>Current plan: <b>{state.settings.currentPlan || 'Founder Demo'}</b></p>
        </Card>
      </div>
    </Section>
  );
}

/* ── Mount ──────────────────────────────── */
createRoot(document.getElementById('root')).render(<App />);
