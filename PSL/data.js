/* ===================================================
   PSL 2026 — DATA & STORAGE (Firebase Realtime DB)
   Switched from Firestore → Realtime Database since
   that's what is set up in the Firebase project.
   =================================================== */
 
/* ─── Firebase Realtime Database init ───────────── */
const firebaseConfig = {
  apiKey: "AIzaSyCsoxbY1Zh24t7W-pxTyMmW_dB62YIxkxk",
  authDomain: "psl-predictor-2026.firebaseapp.com",
  databaseURL: "https://psl-predictor-2026-default-rtdb.firebaseio.com",
  projectId: "psl-predictor-2026",
  storageBucket: "psl-predictor-2026.firebasestorage.app",
  messagingSenderId: "815301031018",
  appId: "1:815301031018:web:78fb5568f34892bdd6c613"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();
 
/* helper: read once from a path, returns the value or null */
function dbGet(path) {
  return db.ref(path).get().then(snap => snap.exists() ? snap.val() : null);
}
/* helper: write to a path */
function dbSet(path, value) {
  return db.ref(path).set(value);
}
/* helper: merge/update fields at a path */
function dbUpdate(path, value) {
  return db.ref(path).update(value);
}
 
/* ─── Teams ──────────────────────────────────────── */
const TEAMS = {
  LQ: { name:'Lahore Qalandars',   short:'LQ', abbr:'LQ', color:'#800020', group:'A' },
  KK: { name:'Karachi Kings',      short:'KK', abbr:'KK', color:'#1565C0', group:'A' },
  PZ: { name:'Peshawar Zalmi',     short:'PZ', abbr:'PZ', color:'#FFD600', group:'A' },
  QG: { name:'Quetta Gladiators',  short:'QG', abbr:'QG', color:'#7B1FA2', group:'A' },
  RP: { name:'RawalPINDIZ',        short:'RP', abbr:'RP', color:'#E65100', group:'B' },
  IU: { name:'Islamabad United',   short:'IU', abbr:'IU', color:'#D32F2F', group:'B' },
  MS: { name:'Multan Sultans',     short:'MS', abbr:'MS', color:'#1B5E20', group:'B' },
  HK: { name:'Hyderabad Kingsmen', short:'HK', abbr:'HK', color:'#8D6E1A', group:'B' },
};

/* ─── Matches ────────────────────────────────────── */
const MATCHES = [
  {id:1, date:'Mar 26',t1:'LQ',t2:'HK',venue:'Lahore', time:'7:00 PM',type:'X'},
  {id:2, date:'Mar 27',t1:'QG',t2:'KK',venue:'Lahore', time:'7:00 PM',type:'G'},
  {id:3, date:'Mar 28',t1:'PZ',t2:'RP',venue:'Lahore', time:'2:30 PM',type:'X'},
  {id:4, date:'Mar 28',t1:'MS',t2:'IU',venue:'Lahore', time:'7:00 PM',type:'G'},
  {id:5, date:'Mar 29',t1:'QG',t2:'HK',venue:'Lahore', time:'2:30 PM',type:'X'},
  {id:6, date:'Mar 29',t1:'LQ',t2:'KK',venue:'Lahore', time:'7:00 PM',type:'G'},
  {id:7, date:'Mar 31',t1:'IU',t2:'PZ',venue:'Lahore', time:'7:00 PM',type:'X'},
  {id:8, date:'Apr 1', t1:'MS',t2:'HK',venue:'Lahore', time:'7:00 PM',type:'G'},
  {id:9, date:'Apr 2', t1:'QG',t2:'IU',venue:'Lahore', time:'2:30 PM',type:'X'},
  {id:10,date:'Apr 2', t1:'RP',t2:'KK',venue:'Lahore', time:'7:00 PM',type:'X'},
  {id:11,date:'Apr 3', t1:'LQ',t2:'MS',venue:'Lahore', time:'7:00 PM',type:'X'},
  {id:12,date:'Apr 4', t1:'RP',t2:'IU',venue:'Lahore', time:'7:00 PM',type:'G'},
  {id:13,date:'Apr 5', t1:'QG',t2:'MS',venue:'Lahore', time:'7:00 PM',type:'X'},
  {id:14,date:'Apr 6', t1:'MS',t2:'RP',venue:'Lahore', time:'7:00 PM',type:'G'},
  {id:15,date:'Apr 8', t1:'HK',t2:'PZ',venue:'Karachi',time:'7:00 PM',type:'X'},
  {id:16,date:'Apr 9', t1:'LQ',t2:'IU',venue:'Karachi',time:'2:30 PM',type:'X'},
  {id:17,date:'Apr 9', t1:'KK',t2:'PZ',venue:'Karachi',time:'7:00 PM',type:'G'},
  {id:18,date:'Apr 10',t1:'QG',t2:'RP',venue:'Karachi',time:'7:00 PM',type:'X'},
  {id:19,date:'Apr 11',t1:'PZ',t2:'LQ',venue:'Karachi',time:'2:30 PM',type:'G'},
  {id:20,date:'Apr 11',t1:'KK',t2:'HK',venue:'Karachi',time:'7:00 PM',type:'X'},
  {id:21,date:'Apr 12',t1:'HK',t2:'IU',venue:'Karachi',time:'7:00 PM',type:'G'},
  {id:22,date:'Apr 13',t1:'PZ',t2:'MS',venue:'Karachi',time:'7:00 PM',type:'X'},
  {id:23,date:'Apr 15',t1:'PZ',t2:'QG',venue:'Karachi',time:'7:00 PM',type:'G'},
  {id:24,date:'Apr 16',t1:'HK',t2:'RP',venue:'Karachi',time:'2:30 PM',type:'G'},
  {id:25,date:'Apr 16',t1:'KK',t2:'IU',venue:'Karachi',time:'7:00 PM',type:'X'},
  {id:26,date:'Apr 17',t1:'LQ',t2:'QG',venue:'Karachi',time:'7:00 PM',type:'G'},
  {id:27,date:'Apr 18',t1:'LQ',t2:'RP',venue:'Karachi',time:'7:00 PM',type:'X'},
  {id:28,date:'Apr 19',t1:'KK',t2:'MS',venue:'Karachi',time:'2:30 PM',type:'X'},
  {id:29,date:'Apr 19',t1:'PZ',t2:'QG',venue:'Karachi',time:'7:00 PM',type:'G'},
  {id:30,date:'Apr 21',t1:'LQ',t2:'QG',venue:'Lahore', time:'2:30 PM',type:'G'},
  {id:31,date:'Apr 21',t1:'RP',t2:'MS',venue:'Karachi',time:'7:00 PM',type:'G'},
  {id:32,date:'Apr 22',t1:'KK',t2:'PZ',venue:'Lahore', time:'2:30 PM',type:'G'},
  {id:33,date:'Apr 22',t1:'HK',t2:'MS',venue:'Karachi',time:'7:00 PM',type:'G'},
  {id:34,date:'Apr 23',t1:'RP',t2:'IU',venue:'Karachi',time:'2:30 PM',type:'G'},
  {id:35,date:'Apr 23',t1:'LQ',t2:'KK',venue:'Lahore', time:'7:00 PM',type:'G'},
  {id:36,date:'Apr 24',t1:'HK',t2:'IU',venue:'Karachi',time:'7:00 PM',type:'G'},
  {id:37,date:'Apr 25',t1:'QG',t2:'KK',venue:'Lahore', time:'2:30 PM',type:'G'},
  {id:38,date:'Apr 25',t1:'LQ',t2:'PZ',venue:'Lahore', time:'7:00 PM',type:'G'},
  {id:39,date:'Apr 26',t1:'HK',t2:'RP',venue:'Karachi',time:'2:30 PM',type:'G'},
  {id:40,date:'Apr 26',t1:'IU',t2:'MS',venue:'Karachi',time:'7:00 PM',type:'G'},
  {id:41,date:'Apr 28',t1:'TBD',t2:'TBD',venue:'Karachi',time:'7:00 PM',type:'P',label:'QUALIFIER — 1st vs 2nd'},
  {id:42,date:'Apr 29',t1:'TBD',t2:'TBD',venue:'Lahore', time:'7:00 PM',type:'P',label:'ELIMINATOR 1 — 3rd vs 4th'},
  {id:43,date:'May 1', t1:'TBD',t2:'TBD',venue:'Lahore', time:'7:00 PM',type:'P',label:'ELIMINATOR 2'},
  {id:44,date:'May 3', t1:'TBD',t2:'TBD',venue:'Lahore', time:'7:00 PM',type:'P',label:'FINAL'},
];
const GROUP_MATCHES = MATCHES.filter(m => m.type === 'G' || m.type === 'X');
 
/* ═══════════════════════════════════════════════════
   SESSION — with inactivity timeout & fresh-start redirect
   Rules:
   • Session persists while the tab stays open (sessionStorage)
   • BUT username is also in localStorage so the login page
     can pre-fill (not auto-login) on a fresh browser open
   • On ANY page load that is NOT index.html, if no active
     session exists → redirect to login
   • After SESSION_TIMEOUT_MS of inactivity → auto-logout
   • Email is required: if user has no email on file,
     requireLogin() returns the username but pages should
     call requireEmail() which redirects to index with a flag
═══════════════════════════════════════════════════ */
 
const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours of inactivity
const SESSION_KEY  = 'psl2026_session';   // sessionStorage — clears on browser close
const ACTIVITY_KEY = 'psl2026_activity';  // localStorage — last activity timestamp
const USER_KEY     = 'psl2026_user';      // localStorage — for index page pre-fill only
 
function getCurrentUser() {
  // Primary: check active session (sessionStorage — dies when browser closes)
  const sess = sessionStorage.getItem(SESSION_KEY);
  if (!sess) return null;
  // Check inactivity timeout
  const lastActivity = parseInt(localStorage.getItem(ACTIVITY_KEY) || '0');
  if (Date.now() - lastActivity > SESSION_TIMEOUT_MS) {
    _clearSession();
    return null;
  }
  return sess;
}
 
function setCurrentUser(u) {
  sessionStorage.setItem(SESSION_KEY, u);
  localStorage.setItem(USER_KEY, u);         // for index page pre-fill
  localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
}
 
function _clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(ACTIVITY_KEY);
  // Keep USER_KEY so index.html can pre-fill username field
}
 
function logout() {
  _clearSession();
  localStorage.removeItem(USER_KEY);
  window.location.href = 'index.html';
}
 
function _setNavigating() {} // legacy no-op
 
// Touch the activity timestamp on every user interaction
function _refreshActivity() {
  if (getCurrentUser()) localStorage.setItem(ACTIVITY_KEY, Date.now().toString());
}
if (typeof document !== 'undefined') {
  ['click','keydown','touchstart','scroll'].forEach(ev =>
    document.addEventListener(ev, _refreshActivity, { passive: true })
  );
}
 
function requireLogin() {
  const u = getCurrentUser();
  if (!u) {
    window.location.href = 'index.html';
    return null;
  }
  _refreshActivity();
  return u;
}
 
/* ═══════════════════════════════════════════════════
   LOCAL CACHE — fast reads after pageInit
═══════════════════════════════════════════════════ */
const LS_KEY = 'psl2026_data';
function _read()      { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } }
function _write(data) { localStorage.setItem(LS_KEY, JSON.stringify(data)); window.__psl_cache = data; }
function _cache()     { return window.__psl_cache || _read(); }
 
/* ═══════════════════════════════════════════════════
   PAGE INIT — await before rendering any protected page
   Pulls latest user data from Realtime DB into local cache
═══════════════════════════════════════════════════ */
async function pageInit(username) {
  try {
    const data = await dbGet('users/' + username);
    const local = _read();
    if (!local.users) local.users = {};
    if (data) {
      local.users[username] = data;
      _write(local);
    } else if (local.users[username]) {
      // Has local data but not in DB — push it up
      await dbSet('users/' + username, local.users[username]).catch(() => {});
    }
  } catch (e) {
    console.warn('pageInit error:', e.code, e.message);
  }
}
 
/* ═══════════════════════════════════════════════════
   USER DATA
═══════════════════════════════════════════════════ */
function getAllUsers()     { return _cache().users || {}; }
function getUser(username) { return getAllUsers()[username] || null; }
 
function saveUser(username, obj) {
  const d = _read(); if (!d.users) d.users = {};
  d.users[username] = obj; _write(d);
  dbSet('users/' + username, obj).catch(e => console.warn('saveUser push failed:', e.message));
}
 
function getPredictions(username)  { return getUser(username)?.predictions || {}; }
 
function savePrediction(username, matchId, winner) {
  const d = _read(); if (!d.users?.[username]) return;
  if (!d.users[username].predictions) d.users[username].predictions = {};
  d.users[username].predictions[matchId] = winner;
  _write(d);
  dbUpdate('users/' + username + '/predictions', { [matchId]: winner })
    .catch(e => console.warn('savePrediction push failed:', e.message));
}
 
function getPlayoffPicks(username) { return getUser(username)?.playoffPicks || {}; }
 
function savePlayoffPicks(username, picks) {
  const d = _read(); if (!d.users?.[username]) return;
  d.users[username].playoffPicks = picks;
  d.users[username].playoffsComplete = true;
  _write(d);
  dbUpdate('users/' + username, { playoffPicks: picks, playoffsComplete: true })
    .catch(e => console.warn('savePlayoffPicks push failed:', e.message));
}
 
function getTiebreakers(username) { return getUser(username)?.tiebreakers || {}; }
 
function saveTiebreaker(username, group, team) {
  const d = _read(); if (!d.users?.[username]) return;
  if (!d.users[username].tiebreakers) d.users[username].tiebreakers = {};
  d.users[username].tiebreakers[group] = team;
  _write(d);
  dbUpdate('users/' + username + '/tiebreakers', { [group]: team })
    .catch(e => console.warn('saveTiebreaker push failed:', e.message));
}
 
function getPlayoffSeedChoice(username) { return getUser(username)?.playoffSeedChoice || null; }
 
function savePlayoffSeedChoice(username, team) {
  const d = _read(); if (!d.users?.[username]) return;
  d.users[username].playoffSeedChoice = team;
  _write(d);
  dbUpdate('users/' + username, { playoffSeedChoice: team })
    .catch(e => console.warn('savePlayoffSeedChoice push failed:', e.message));
}
 
/* ═══════════════════════════════════════════════════
   AUTH — register / login
═══════════════════════════════════════════════════ */
async function registerUser(username, password) {
  try {
    const existing = await dbGet('users/' + username);
    if (existing) return { error: 'Username already taken!' };
    const obj = { username, password: btoa(password), predictions: {}, joinedAt: Date.now() };
    await dbSet('users/' + username, obj);
    // Cache locally
    const d = _read(); if (!d.users) d.users = {};
    d.users[username] = obj; _write(d);
    return { ok: true };
  } catch (e) {
    console.warn('registerUser error:', e.code, e.message);
    if (e.code === 'PERMISSION_DENIED') {
      return { error: 'Database permission denied. Please update your Firebase Realtime Database rules to allow read/write.' };
    }
    // Offline fallback — save locally only
    if (getUser(username)) return { error: 'Username already taken!' };
    const obj = { username, password: btoa(password), predictions: {}, joinedAt: Date.now() };
    const d = _read(); if (!d.users) d.users = {};
    d.users[username] = obj; _write(d);
    return { ok: true };
  }
}
 
async function loginUser(username, password) {
  try {
    const data = await dbGet('users/' + username);
    if (!data) {
      // Not in DB — check local cache (in case created offline)
      const local = getUser(username);
      if (!local) return { error: 'User not found. Please register first!' };
      if (local.password !== btoa(password)) return { error: 'Incorrect password' };
      // Push local account to DB so other devices can see it
      dbSet('users/' + username, local).catch(() => {});
      return { ok: true };
    }
    if (data.password !== btoa(password)) return { error: 'Incorrect password' };
    // Cache locally
    const d = _read(); if (!d.users) d.users = {};
    d.users[username] = data; _write(d);
    return { ok: true };
  } catch (e) {
    console.warn('loginUser error:', e.code, e.message);
    if (e.code === 'PERMISSION_DENIED') {
      return { error: 'Database permission denied. Go to Firebase → Realtime Database → Rules and set .read and .write to true.' };
    }
    // Genuine offline — try local cache
    const local = getUser(username);
    if (!local) return { error: 'Cannot reach server. Connect to the internet and try again.' };
    if (local.password !== btoa(password)) return { error: 'Incorrect password' };
    return { ok: true };
  }
}
 
/* Load ALL users — for community, home & leaderboard pages.
   CRITICAL: We REPLACE the local users cache with exactly what
   Firebase returns. We do NOT merge. This prevents deleted/test
   users that exist only in localStorage from appearing in lists.
   The currently-logged-in user is always kept in cache so their
   session still works even if Firebase is briefly unavailable. */
async function loadAllUsers() {
  try {
    const all = await dbGet('users');
    if (all && typeof all === 'object') {
      const d = _read();
      const currentUser = getCurrentUser();
      // Keep the current user's local data (so their session isn't broken)
      const myData = currentUser && d.users?.[currentUser] ? d.users[currentUser] : null;
      // REPLACE — not merge — with exactly what Firebase has
      d.users = { ...all };
      // Restore current user's data if Firebase returned it too (Firebase wins),
      // or keep local if Firebase doesn't have them (offline edge case)
      if (myData && !d.users[currentUser]) {
        d.users[currentUser] = myData;
      }
      _write(d);
      return d.users;
    }
    // Firebase returned nothing (offline) — return only current user from cache
    // so the UI degrades gracefully rather than showing stale data
    const d = _read();
    const currentUser = getCurrentUser();
    if (currentUser && d.users?.[currentUser]) {
      return { [currentUser]: d.users[currentUser] };
    }
    return {};
  } catch (e) {
    console.warn('loadAllUsers error:', e.code, e.message);
    // Same offline fallback
    const d = _read();
    const currentUser = getCurrentUser();
    if (currentUser && d.users?.[currentUser]) {
      return { [currentUser]: d.users[currentUser] };
    }
    return {};
  }
}
 
/* Stats for login page */
async function getLoginStats() {
  try {
    const all = await dbGet('users');
    if (!all) return { total:0, completed:0, preds:0 };
    const users = Object.values(all);
    return {
      total:     users.length,
      completed: users.filter(u => u.playoffsComplete).length,
      preds:     users.reduce((s,u) => s + Object.keys(u.predictions||{}).length, 0)
    };
  } catch (e) {
    const users = Object.values(getAllUsers());
    return {
      total:     users.length,
      completed: users.filter(u => u.playoffsComplete).length,
      preds:     users.reduce((s,u) => s + Object.keys(u.predictions||{}).length, 0)
    };
  }
}
 
/* ═══════════════════════════════════════════════════
   STANDINGS & QUALIFIERS
═══════════════════════════════════════════════════ */
function calcStandings(predictions, tiebreakers) {
  tiebreakers = tiebreakers || {};
  const rows = {};
  Object.keys(TEAMS).forEach(t => { rows[t] = { team:t, mp:0, w:0, l:0, pts:0 }; });
  GROUP_MATCHES.forEach(m => {
    const w = predictions[m.id]; if (!w) return;
    if (w === 'NR') {
      // No result: count as played but no win/loss/pts
      rows[m.t1].mp++; rows[m.t1].nr = (rows[m.t1].nr || 0) + 1;
      rows[m.t2].mp++; rows[m.t2].nr = (rows[m.t2].nr || 0) + 1;
      return;
    }
    const l = w === m.t1 ? m.t2 : m.t1;
    rows[w].mp++; rows[w].w++; rows[w].pts += 2;
    rows[l].mp++; rows[l].l++;
  });
  const sort = (teams, grp) => {
    const tb = tiebreakers[grp];
    return teams.sort((a,b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.w   !== a.w)   return b.w   - a.w;
      if (tb) { if (a.team===tb) return -1; if (b.team===tb) return 1; }
      return 0;
    });
  };
  const grpA = sort(Object.values(rows).filter(r => TEAMS[r.team].group==='A'), 'A');
  const grpB = sort(Object.values(rows).filter(r => TEAMS[r.team].group==='B'), 'B');
  const tieA = grpA.length>=3 && grpA[1].pts===grpA[2].pts && grpA[1].w===grpA[2].w;
  const tieB = grpB.length>=3 && grpB[1].pts===grpB[2].pts && grpB[1].w===grpB[2].w;
  return { A:grpA, B:grpB, tieA, tieB };
}
 
function getQualifiers(predictions, tiebreakers) {
  // If admin has confirmed the real qualifiers, use those (with NRR from actual results).
  // This ensures playoff page shows correct actual teams, not predicted teams.
  const results = getResults();
  if (results.qualifiers && Array.isArray(results.qualifiers) && results.qualifiers.length === 4) {
    // Admin has set the real qualifiers — build rows from actual standings NRR
    const nrr = results.nrr || {};
    return results.qualifiers.map(team => {
      const n = nrr[team] || {};
      return { team, pts: n.pts||0, w: n.w||0, nrr: n.nrr||0 };
    });
  }
  // Fall back to calculated from user's predictions
  const { A, B } = calcStandings(predictions, tiebreakers);
  const q = [A[0],A[1],B[0],B[1]].filter(Boolean);
  q.sort((a,b) => b.pts-a.pts || b.w-a.w);
  return q;
}

// Get the actual confirmed qualifier seeding (for use in playoffs page and results)
// Returns array of 4 team keys in seed order [1st, 2nd, 3rd, 4th]
// Qualifier = seeds 1 vs 2, Elim1 = seeds 3 vs 4
function getActualQualifiers() {
  const results = getResults();
  if (results.qualifiers && Array.isArray(results.qualifiers) && results.qualifiers.length === 4) {
    return results.qualifiers;
  }
  return null; // not yet confirmed by admin
}

// Get the real playoff teams for a given round based on confirmed results
// Returns { t1, t2 } or null if not yet determined
function getPlayoffMatchTeams(round) {
  const results = getResults();
  const quals = results.qualifiers;
  if (!quals || quals.length < 4) return null;

  const s1 = quals[0], s2 = quals[1], s3 = quals[2], s4 = quals[3];

  if (round === 'playoff_qualifier') return { t1: s1, t2: s2 };
  if (round === 'playoff_elim1')     return { t1: s3, t2: s4 };
  if (round === 'playoff_elim2') {
    // Loser of qualifier vs winner of elim1
    const qualWinner = results.playoff_qualifier;
    const e1Winner   = results.playoff_elim1;
    if (!qualWinner || !e1Winner) return null;
    const qualLoser  = qualWinner === s1 ? s2 : s1;
    return { t1: qualLoser, t2: e1Winner };
  }
  if (round === 'playoff_final') {
    // Winner of qualifier vs winner of elim2
    const qualWinner = results.playoff_qualifier;
    const e2Winner   = results.playoff_elim2;
    if (!qualWinner || !e2Winner) return null;
    return { t1: qualWinner, t2: e2Winner };
  }
  return null;
}
 
/* ═══════════════════════════════════════════════════
   NAV & UI HELPERS
═══════════════════════════════════════════════════ */
function renderNav(activePage) {
  const user = getCurrentUser();
  const u = user ? getUser(user) : null;
  const preds = u ? (u.predictions || {}) : {};
  // Playoffs nav unlocks only once the user has predicted ALL 40 group matches.
  // A user who missed some locked matches must still fill them in on the predict page
  // before they can access playoffs (they get 0 points for those picks, but we need
  // all 40 to calculate their standings and determine their qualifier picks).
  const allDone = user && GROUP_MATCHES.every(m => !!preds[m.id]);
  const playoffDone = u ? !!u.playoffsComplete : false;
  const pages = [
    { id:'home',        label:'Home',        href:'home.html' },
    { id:'squads',      label:'Squads',      href:'squads.html' },
    { id:'predict',     label:'Predictions', href:'predict.html',   locked:!user },
    { id:'playoffs',    label:'Playoffs',    href:'playoffs.html',  locked:!allDone },
    { id:'community',   label:'Community',   href:'community.html', locked:!playoffDone },
    { id:'results',     label:'📊 Results',  href:'results.html',   locked:false },
    { id:'leaderboard', label:'Leaderboard',   href:'leaderboard.html', locked:false },
    { id:'stats',       label:'📈 Stats',     href:'stats.html',       locked:false },
  ];
  const pslLogo = (typeof LOGOS !== 'undefined' && LOGOS.PSL)
    ? `<img src="${LOGOS.PSL}" style="height:32px;width:auto;vertical-align:middle;margin-right:6px;" alt="PSL"/>`
    : `<span class="nav__badge">PSL</span>`;
 
  return `<nav class="nav"><div class="nav__inner">
    <a href="home.html" class="nav__brand">
      ${pslLogo}
      <span class="nav__title">2026 PREDICTOR</span>
    </a>
    <div class="nav__links">
      ${pages.map(p=>`
        <a href="${p.locked?'#':p.href}"
           class="nav__link ${p.id===activePage?'active':''} ${p.locked?'locked':''}"
           title="${p.locked?'Complete previous steps to unlock':''}">
          ${p.label}
        </a>`).join('')}
    </div>
    ${user
      ?`<div class="nav__user"><span class="dot"></span>${user}&nbsp;<a href="#" onclick="logout();return false;" style="color:var(--text-muted);font-size:11px;text-decoration:none">LOGOUT</a></div>`
      :`<a href="index.html" class="btn btn--outline btn--sm">Login</a>`}
  </div></nav>`;
}
 
/* teamAvatar: uses real logo if LOGOS object available, falls back to abbr badge */
function teamAvatar(short, size=36) {
  const t = TEAMS[short]; if (!t) return '';
  if (typeof LOGOS !== 'undefined' && LOGOS[short]) {
    return `<img src="${LOGOS[short]}" alt="${t.name}"
      style="width:${size}px;height:${size}px;object-fit:contain;flex-shrink:0;background:transparent;"
      title="${t.name}"/>`;
  }
  return `<div class="team-avatar" style="background:${t.color}22;border-color:${t.color}55;width:${size}px;height:${size}px;font-size:${Math.round(size/3)}px;color:${t.color};">${t.abbr}</div>`;
}
 
/* ═══════════════════════════════════════════════════
   MATCH LOCKING
   Compares current time to each match's kickoff time.
   Match is locked AT kickoff (no prediction changes after).
   All times are PKT = UTC+5.
═══════════════════════════════════════════════════ */
 
// Parse a match date+time string into a UTC timestamp
function _matchKickoff(m) {
  // m.date like "Mar 26", m.time like "7:00 PM" or "2:30 PM"
  const year = 2026;
  const monthMap = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const [mon, day] = m.date.split(' ');
  const month = monthMap[mon];
  // Parse time
  const t = m.time.trim();
  let [hm, ampm] = t.split(' ');
  let [hh, mm] = hm.split(':').map(Number);
  if (ampm === 'PM' && hh !== 12) hh += 12;
  if (ampm === 'AM' && hh === 12) hh = 0;
  // PKT = UTC+5, so UTC = PKT - 5h
  const pktDate = new Date(Date.UTC(year, month, parseInt(day), hh, mm, 0));
  const utcMs = pktDate.getTime() - (5 * 60 * 60 * 1000);
  return utcMs;
}
 
function isMatchLocked(matchId) {
  const m = MATCHES.find(x => x.id === matchId);
  if (!m) return false;
  const kickoff = _matchKickoff(m);
  return Date.now() >= kickoff;
}
 
function getMatchStatus(matchId) {
  // returns: 'upcoming' | 'locked' | 'resulted'
  const m = MATCHES.find(x => x.id === matchId);
  if (!m) return 'upcoming';
  const results = _cache().results || {};
  if (results[matchId]) return 'resulted';
  if (isMatchLocked(matchId)) return 'locked';
  return 'upcoming';
}
 
/* ═══════════════════════════════════════════════════
   RESULTS — stored at db root: results/matchId = teamShort
   Also: results/qualifiers = [t1,t2,t3,t4]
   Also: results/playoff_qualifier / playoff_elim1 /
         playoff_elim2 / playoff_final
   Admin writes these; everyone reads them.
═══════════════════════════════════════════════════ */
 
// Load all results into local cache
async function loadResults() {
  try {
    const res = await dbGet('results');
    const d = _read();
    d.results = res || {};
    _write(d);
  } catch(e) { console.warn('loadResults:', e.message); }
  return _cache().results || {};
}
 
function getResults() { return _cache().results || {}; }
 
// Admin: save a group match result
async function adminSetResult(matchId, winner) {
  const d = _read(); if (!d.results) d.results = {};
  d.results[matchId] = winner; _write(d);
  await dbUpdate('results', { [matchId]: winner });
}
 
// Admin: save the 4 qualified teams
async function adminSetQualifiers(teams) {
  // teams = ['LQ','IU','PZ','MS'] etc — order matters for seeding
  const d = _read(); if (!d.results) d.results = {};
  d.results.qualifiers = teams; _write(d);
  await dbUpdate('results', { qualifiers: teams });
}
 
// Admin: save a playoff result
async function adminSetPlayoffResult(round, winner) {
  // round: 'playoff_qualifier' | 'playoff_elim1' | 'playoff_elim2' | 'playoff_final'
  const d = _read(); if (!d.results) d.results = {};
  d.results[round] = winner; _write(d);
  await dbUpdate('results', { [round]: winner });
}
 
/* ═══════════════════════════════════════════════════
   SCORING ENGINE
   Call calcScore(username) after loadResults() to get
   a full breakdown for any user.
 
   Points:
   ┌─────────────────────────────────────┐
   │ Group match correct             +10 │
   │ Group match wrong                -5 │
   │ Correct qualifying team         +15 │
   │ Qualifier / Elim correct        +15 │
   │ Correct final winner            +25 │
   └─────────────────────────────────────┘
═══════════════════════════════════════════════════ */
function calcScore(usernameArg) {
  const u = getUser(usernameArg);
  if (!u) return { total:0, breakdown:{} };
 
  const results    = getResults();
  const preds      = u.predictions || {};
  const playPicks  = u.playoffPicks || {};
 
  let total = 0;
  const bd = {
    groupCorrect: 0, groupWrong: 0, groupNR: 0,
    qualifyingPts: 0,
    playoffCorrect: 0,
    finalCorrect: 0,
  };
 
  // ── Group stage matches ──────────────────────────
  GROUP_MATCHES.forEach(m => {
    const actual = results[m.id];
    const pred   = preds[m.id];
    if (!actual || !pred) return; // not resulted yet
    if (actual === 'NR') { bd.groupNR++; return; } // no result — no points awarded or deducted
    if (pred === actual) { bd.groupCorrect++; total += 10; }
    else                 { bd.groupWrong++;   total -= 5;  }
  });
 
  // ── Qualifying teams ─────────────────────────────
  const actualQualifiers = results.qualifiers; // array of 4 team shorts
  if (actualQualifiers && Array.isArray(actualQualifiers) && actualQualifiers.length === 4) {
    // IMPORTANT: Always derive the user's predicted qualifiers from their OWN group stage
    // picks via calcStandings — never call getQualifiers() here, because getQualifiers()
    // returns the real confirmed teams when admin has set them, which would give everyone
    // full 60 pts regardless of what they actually predicted.
    //
    // For missed/locked matches where the user has no prediction, fill in the actual
    // match result so their standings aren't distorted by the gap. This is fair because
    // they earn 0 pts for the missed match prediction but their qualifier standings
    // should still reflect the realistic outcome of those games.
    try {
      const userTb = u.tiebreakers || {};
      const filledPreds = {};
      GROUP_MATCHES.forEach(m => {
        const raw = preds[m.id];
        if (raw) {
          // normalize missed-pick object format {v, missed:true} to plain string
          filledPreds[m.id] = (typeof raw === 'object' && raw.v) ? raw.v : raw;
        } else if (results[m.id]) {
          filledPreds[m.id] = results[m.id]; // fill gap with actual result
        }
        // if neither exists (future match), leave blank → won't affect standings
      });
      const standings = calcStandings(filledPreds, userTb);
      const _qA = standings.A || [];
      const _qB = standings.B || [];
      const userQuals = [_qA[0], _qA[1], _qB[0], _qB[1]].filter(Boolean).map(q => q.team);
      userQuals.forEach(t => {
        if (actualQualifiers.includes(t)) { bd.qualifyingPts += 15; total += 15; }
      });
    } catch(e) { console.warn('calcScore qualifying error for', usernameArg, e.message); }
  }
 
  // ── Playoff rounds ───────────────────────────────
  const playoffRounds = [
    { key:'qualifier',       resultKey:'playoff_qualifier', pts:15 },
    { key:'elim1',           resultKey:'playoff_elim1',     pts:15 },
    { key:'elim2',           resultKey:'playoff_elim2',     pts:15 },
    { key:'final',           resultKey:'playoff_final',     pts:25 },
  ];
  playoffRounds.forEach(r => {
    const actual = results[r.resultKey];
    const pred   = playPicks[r.key];
    if (!actual || !pred) return;
    if (pred === actual) {
      if (r.key === 'final') { bd.finalCorrect++; }
      else                   { bd.playoffCorrect++; }
      total += r.pts;
    }
  });
 
  return { total, breakdown: bd };
}
 
// Build full leaderboard array sorted by score
// Uses only Firebase users (loadAllUsers now returns only DB users)
async function buildLeaderboard() {
  await loadResults();
  const allUsers = await loadAllUsers(); // guaranteed to be Firebase-only
  return Object.values(allUsers)
    .filter(u => u && u.username)       // skip any malformed entries
    .map(u => {
      try {
        return { ...calcScore(u.username), username: u.username, playoffsComplete: !!u.playoffsComplete };
      } catch(e) {
        console.warn('buildLeaderboard: calcScore failed for', u.username, e.message);
        return { total: 0, breakdown: {}, username: u.username, playoffsComplete: !!u.playoffsComplete };
      }
    })
    .sort((a,b) => b.total - a.total || a.username.localeCompare(b.username));
}
 
 
/* ═══════════════════════════════════════════════════
   EMAIL — save/get user email
═══════════════════════════════════════════════════ */
function getUserEmail(username) { return getUser(username)?.email || null; }
 
async function saveUserEmail(username, email) {
  const d = _read();
  if (!d.users?.[username]) return;
  d.users[username].email = email;
  _write(d);
  await dbUpdate('users/' + username, { email }).catch(e => console.warn('saveEmail failed:', e.message));
}
 
/* ═══════════════════════════════════════════════════
   ENHANCED RESULTS — match detail for NRR & result display
   Stored at: results/detail/{matchId} = {
     winner, margin, marginType, winnerScore, loserScore,
     winnerOvers, loserOvers, ballsRemaining, summary
   }
   NRR stored at: results/nrr/{teamShort} = {
     runsScored, oversFaced, runsConceded, oversBowled
   }
═══════════════════════════════════════════════════ */
 
async function adminSetMatchDetail(matchId, detail) {
  // detail: { winner, winnerScore, winnerWkts, winnerOvers, loserScore, loserWkts, loserOvers,
  //           marginType, margin, ballsRemaining }
  const d = _read();
  if (!d.results) d.results = {};
  if (!d.results.detail) d.results.detail = {};
  // Build summary string
  const m = MATCHES.find(x => x.id === parseInt(matchId));
  const wTeam = TEAMS[detail.winner];
  const lTeam = TEAMS[detail.winner === m?.t1 ? m?.t2 : m?.t1];
  let summary = '';
  if (detail.winner === 'NR') {
    // No result — no winner, no NRR impact, 1 pt each
    summary = 'No Result';
    detail.summary = summary;
    d.results.detail[matchId] = detail;
    d.results[matchId] = 'NR';
    _write(d);
    await dbUpdate('results', {
      [matchId]: 'NR',
      [`detail/${matchId}`]: detail
    }).catch(e => console.warn('setMatchDetail failed:', e.message));
    return; // skip NRR recalc
  }
  if (detail.marginType === 'runs') {
    // Won by runs: winner batted first
    const wScore = detail.winnerScore || '';
    const wWkts  = detail.winnerWkts !== null && detail.winnerWkts !== undefined ? detail.winnerWkts : 'all';
    const lScore = detail.loserScore  || '';
    const lWkts  = detail.loserWkts  !== null && detail.loserWkts  !== undefined ? detail.loserWkts  : 10;
    summary = `${wTeam?.name || detail.winner} won by ${detail.margin} run${detail.margin!=1?'s':''}`;
  } else {
    // Won by wickets: winner chased
    const ballsLeft = parseInt(detail.ballsRemaining) || 0;
    const oversLeft = ballsLeft > 0 ? ` (${Math.floor(ballsLeft/6)}.${ballsLeft%6} overs remaining)` : '';
    summary = `${wTeam?.name || detail.winner} won by ${detail.margin} wicket${detail.margin!=1?'s':''}${oversLeft}`;
  }
  detail.summary = summary;
  d.results.detail[matchId] = detail;
  // Also update the winner in top-level results (for scoring engine)
  d.results[matchId] = detail.winner;
  _write(d);
  await dbUpdate('results', {
    [matchId]: detail.winner,
    [`detail/${matchId}`]: detail
  }).catch(e => console.warn('setMatchDetail failed:', e.message));
  // Recalculate NRR for both teams
  await _recalcNRR();
}
 
async function adminSetPlayoffDetail(round, detail) {
  // round: 'playoff_qualifier' etc, detail same structure as above
  const d = _read();
  if (!d.results) d.results = {};
  if (!d.results.playoffDetail) d.results.playoffDetail = {};
  const wTeam = TEAMS[detail.winner];
  let summary = '';
  if (detail.marginType === 'runs') {
    summary = `${wTeam?.name || detail.winner} won by ${detail.margin} run${detail.margin!=1?'s':''}`;
  } else {
    const ballsLeft = parseInt(detail.ballsRemaining) || 0;
    const oversLeft = ballsLeft > 0 ? ` (${Math.floor(ballsLeft/6)}.${ballsLeft%6} overs remaining)` : '';
    summary = `${wTeam?.name || detail.winner} won by ${detail.margin} wicket${detail.margin!=1?'s':''}${oversLeft}`;
  }
  detail.summary = summary;
  d.results.playoffDetail[round] = detail;
  d.results[round] = detail.winner;
  _write(d);
  await dbUpdate('results', {
    [round]: detail.winner,
    [`playoffDetail/${round}`]: detail
  }).catch(e => console.warn('setPlayoffDetail failed:', e.message));
}
 
// ─── Cricket overs converter ─────────────────────────
// Cricket notation X.Y means X full overs + Y balls.
// Y balls = Y/6 of an over in decimal.
// e.g. 19.1 overs = 19 + 1/6 = 19.1667 (NOT 19.1 as a decimal)
// e.g. 18.4 overs = 18 + 4/6 = 18.6667
// This is the single most common NRR calculation mistake.
function _oversToDecimal(overs) {
  if (overs === '' || overs === null || overs === undefined) return 20;
  const raw = parseFloat(overs);
  if (isNaN(raw) || raw < 0) return 20;
  if (raw === 0) return 20; // treat 0 as full innings (admin left blank / didn't enter)

  // ── KEY FIX ──────────────────────────────────────────────────────────────
  // HTML <input type="number" step="0.1"> stores values as floats, which can
  // cause floating-point noise: e.g. 18.3 stored as 18.299999999999997.
  // If we do String(18.299999...).split('.') we get '299...' not '3' → WRONG.
  //
  // Solution: round to 1 decimal FIRST, then extract the balls digit from
  // the rounded string — not from the raw float.
  // ─────────────────────────────────────────────────────────────────────────
  const rounded   = Math.round(raw * 10) / 10;   // e.g. 18.2999... → 18.3
  const fullOvers = Math.floor(rounded);
  const ballsStr  = rounded.toFixed(1).split('.')[1] || '0'; // always 1 decimal digit
  const balls     = parseInt(ballsStr, 10);

  // Clamp: balls must be 0–5 in cricket
  if (balls >= 6) return fullOvers + 1; // treat as next full over (shouldn't happen)
  return fullOvers + balls / 6;
}
 
// Recalculate NRR for all teams.
// CRITICAL: Always fetch details fresh from Firebase to avoid stale localStorage
// causing wrong NRR (e.g. if admin entered earlier matches in a previous session).
async function _recalcNRR() {
  // Always fetch the FULL results node fresh from Firebase so we have ALL match details
  let freshResults = null;
  try {
    freshResults = await dbGet('results');
  } catch(e) {
    console.warn('_recalcNRR: could not fetch from Firebase, falling back to cache', e.message);
  }
  // Merge fresh Firebase data into local cache so nothing is lost
  const d = _read();
  if (freshResults) {
    d.results = { ...(d.results || {}), ...freshResults };
    _write(d);
  }
  const details = d.results?.detail || {};

  const nrr = {};
  Object.keys(TEAMS).forEach(t => {
    nrr[t] = { runsScored:0, oversFaced:0, runsConceded:0, oversBowled:0 };
  });

  Object.entries(details).forEach(([matchId, det]) => {
    if (!det || !det.winner) return;
    // Skip no-result matches — NRR unaffected
    if (det.winner === 'NR' || det.winner === 'NO_RESULT') return;
    const m = GROUP_MATCHES.find(x => x.id === parseInt(matchId));
    if (!m) return; // skip playoff matches

    const w = det.winner;
    const l = w === m.t1 ? m.t2 : m.t1;
    if (!TEAMS[w] || !TEAMS[l]) return; // skip if team not recognised

    // Convert cricket overs (X.Y where Y = balls 0–5) to decimal fraction of 6
    let wOvers = _oversToDecimal(det.winnerOvers);
    let lOvers = _oversToDecimal(det.loserOvers);
    const wRuns  = parseInt(det.winnerScore) || 0;
    const lRuns  = parseInt(det.loserScore)  || 0;

    // ── CRITICAL NRR RULE ──────────────────────────────────────────────────
    // ICC standard: if a team is DISMISSED (all 10 wickets fall), their
    // oversFaced is counted as the FULL allocation (20), NOT the actual overs
    // played. Only teams that complete their innings without being dismissed
    // (e.g. win by wickets, or bat out all 20 overs without falling) use
    // their actual overs.
    //
    // "Won by runs"    → winner batted 1st (not dismissed if wkts < 10),
    //                    loser batted 2nd (dismissed if lWkts = 10 OR lWkts >= 10)
    // "Won by wickets" → loser batted 1st (dismissed if lWkts >= 10),
    //                    winner batted 2nd (NOT dismissed — they won)
    //
    // Admin stores wickets as winnerWkts / loserWkts (wickets LOST).
    // 10 wickets lost = all out = use full 20 overs.
    // winnerWkts null/undefined is treated as NOT all out (winner won by wickets,
    // so they never lose 10 wickets finishing the chase, or they batted first &
    // the admin would have entered the actual wickets).
    // ──────────────────────────────────────────────────────────────────────
    const MAX_OVERS = 20;

    if (det.marginType === 'runs') {
      // Winner batted first — use actual overs (they finished their full innings)
      // Loser batted second — if all out (lWkts >= 10), use 20 overs
      const loserAllOut = (parseInt(det.loserWkts) || 0) >= 10;
      if (loserAllOut) lOvers = MAX_OVERS;
      // Winner overs: always ≈20 when batting first; use actual entered
    } else {
      // Won by wickets — winner chased, batted 2nd: use actual overs (NOT all out)
      // Loser batted first — if all out (lWkts >= 10), use 20 overs
      const loserAllOut = (parseInt(det.loserWkts) || 0) >= 10;
      if (loserAllOut) lOvers = MAX_OVERS;
      // Winner overs: they won, so never use 20 override
    }

    // NRR formula applied correctly for BOTH "won by runs" and "won by wickets":
    //
    // In BOTH cases, winner's field = their own batting stats.
    // Admin enters: "Winner Score/Overs" = what the WINNING TEAM scored/faced.
    //               "Loser Score/Overs"  = what the LOSING TEAM scored/faced.
    // This is consistent regardless of batting order — correct for NRR.

    if (nrr[w]) {
      nrr[w].runsScored   += wRuns;   // runs the winning team scored
      nrr[w].oversFaced   += wOvers;  // overs the winning team faced
      nrr[w].runsConceded += lRuns;   // runs the winning team conceded (loser's total)
      nrr[w].oversBowled  += lOvers;  // overs the winning team bowled (= loser's overs, incl. 20 if dismissed)
    }
    if (nrr[l]) {
      nrr[l].runsScored   += lRuns;   // runs the losing team scored
      nrr[l].oversFaced   += lOvers;  // overs the losing team faced (20 if all out)
      nrr[l].runsConceded += wRuns;   // runs the losing team conceded (winner's total)
      nrr[l].oversBowled  += wOvers;  // overs the losing team bowled
    }
  });

  // NRR = (total runs scored / total overs faced) − (total runs conceded / total overs bowled)
  const nrrFinal = {};
  Object.entries(nrr).forEach(([t, v]) => {
    const forRate = v.oversFaced  > 0 ? v.runsScored   / v.oversFaced  : 0;
    const agaRate = v.oversBowled > 0 ? v.runsConceded / v.oversBowled : 0;
    nrrFinal[t] = { ...v, nrr: parseFloat((forRate - agaRate).toFixed(3)) };
  });

  if (!d.results) d.results = {};
  d.results.nrr = nrrFinal;
  _write(d);
  await dbUpdate('results', { nrr: nrrFinal }).catch(() => {});
}
 
function getMatchDetail(matchId) {
  return (_cache().results?.detail || {})[matchId] || null;
}
function getPlayoffDetail(round) {
  return (_cache().results?.playoffDetail || {})[round] || null;
}
function getNRR() {
  return _cache().results?.nrr || {};
}
 
/* ═══════════════════════════════════════════════════
   ACTUAL STANDINGS — from real results (for results page)
   Different from calcStandings (which uses user predictions)
═══════════════════════════════════════════════════ */
function calcActualStandings() {
  const results = getResults();
  const nrrData = getNRR();
  const rows = {};
  Object.keys(TEAMS).forEach(t => {
    rows[t] = { team:t, mp:0, w:0, l:0, nr:0, pts:0, nrr: nrrData[t]?.nrr || 0 };
  });
  GROUP_MATCHES.forEach(m => {
    const w = results[m.id]; if (!w) return;
    if (w === 'NR') {
      // No result: both teams get 1 pt, mp+1, nr+1, NRR unchanged
      rows[m.t1].mp++; rows[m.t1].nr++; rows[m.t1].pts += 1;
      rows[m.t2].mp++; rows[m.t2].nr++; rows[m.t2].pts += 1;
      return;
    }
    const l = w === m.t1 ? m.t2 : m.t1;
    rows[w].mp++; rows[w].w++; rows[w].pts += 2;
    rows[l].mp++; rows[l].l++;
  });
  const sort = arr => arr.sort((a,b) => b.pts-a.pts || b.nrr-a.nrr || b.w-a.w);
  return {
    A: sort(Object.values(rows).filter(r => TEAMS[r.team].group==='A')),
    B: sort(Object.values(rows).filter(r => TEAMS[r.team].group==='B')),
  };
}
 
/* ═══════════════════════════════════════════════════
   MATCH 12 MIGRATION
   Match 12 was IU vs HK — corrected to RP vs IU.
   Rules:
   • If user predicted IU  → keep as IU (still valid, IU is still in this match)
   • If user predicted HK  → change to RP (HK is no longer in this match)
   • If after the swap the user's predicted qualifiers change
     (different set of 4 teams would qualify) → reset playoffPicks
     and set playoffResetReason = 'match12_correction' so the
     UI can notify them to re-predict playoffs.
   This function is IDEMPOTENT — calling it multiple times is safe.
   It skips users who already have m12CorrectionApplied = true.
═══════════════════════════════════════════════════ */
async function applyMatch12Migration() {
  try {
    const allSnap = await dbGet('users');
    if (!allSnap) return;
 
    for (const [uname, u] of Object.entries(allSnap)) {
      if (u.m12CorrectionApplied) continue; // already migrated
 
      const preds = u.predictions || {};
      const m12pred = preds[12];
 
      let changed = false;
      let playoffReset = false;
 
      // Step 1: If they predicted HK for match 12, swap to RP
      if (m12pred === 'HK') {
        preds[12] = 'RP';
        changed = true;
      }
      // If they predicted IU — no change needed, IU is still in match 12
      // If they predicted nothing — no change needed
 
      // Step 2: Check if the corrected predictions change their qualifiers
      if (changed && u.playoffsComplete) {
        const tbs = u.tiebreakers || {};
        // Qualifiers BEFORE correction (using original HK pick)
        const predsBefore = { ...preds, 12: 'HK' };
        const qualsBefore = getQualifiers(predsBefore, tbs).map(q => q.team).sort().join(',');
        // Qualifiers AFTER correction (using RP)
        const qualsAfter  = getQualifiers(preds,       tbs).map(q => q.team).sort().join(',');
 
        if (qualsBefore !== qualsAfter) {
          // Qualifier set changed — reset playoffs only
          playoffReset = true;
        }
      }
 
      // Step 3: Write updates to Firebase
      const updates = {
        predictions: preds,
        m12CorrectionApplied: true,
      };
      if (playoffReset) {
        updates.playoffPicks      = {};
        updates.playoffsComplete  = false;
        updates.playoffResetReason = 'match12_correction';
      }
 
      await dbUpdate('users/' + uname, updates).catch(e =>
        console.warn('M12 migration failed for', uname, e.message)
      );
 
      // Update local cache too
      const d = _read();
      if (d.users?.[uname]) {
        d.users[uname].predictions        = preds;
        d.users[uname].m12CorrectionApplied = true;
        if (playoffReset) {
          d.users[uname].playoffPicks     = {};
          d.users[uname].playoffsComplete = false;
          d.users[uname].playoffResetReason = 'match12_correction';
        }
        _write(d);
      }
 
      console.log(`M12 migration: ${uname} | pred was ${m12pred} → ${preds[12]} | playoffReset=${playoffReset}`);
    }
    console.log('Match 12 migration complete.');
  } catch(e) {
    console.warn('applyMatch12Migration error:', e.message);
  }
}
 
/* ═══════════════════════════════════════════════════
   LOCAL CACHE CLEANUP
   Call this to purge any users from localStorage that
   are not in Firebase. Useful after test accounts were
   created locally and are now showing up in lists.
═══════════════════════════════════════════════════ */
async function purgeStaleLocalUsers() {
  try {
    const firebaseUsers = await dbGet('users');
    if (!firebaseUsers) return;
    const d = _read();
    if (!d.users) return;
    let purged = 0;
    Object.keys(d.users).forEach(uname => {
      if (!firebaseUsers[uname]) {
        delete d.users[uname];
        purged++;
      }
    });
    if (purged > 0) {
      _write(d);
      console.log(`Purged ${purged} stale local user(s) from cache.`);
    }
  } catch(e) {
    console.warn('purgeStaleLocalUsers:', e.message);
  }
}
 
// Auto-purge stale users once per session on page load
(async function() {
  try { await purgeStaleLocalUsers(); } catch(e) {}
})();
