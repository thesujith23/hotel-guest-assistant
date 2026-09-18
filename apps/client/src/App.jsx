import { useState } from 'react';
import { sendChat, getAvailability } from './services/api.js';
import './styles.css';

const suggestions = [
  { label: 'Check-in times', prompt: 'What time is check-in?', icon: '◷' },
  { label: 'Swimming pool', prompt: 'Does the hotel have a swimming pool?', icon: '≈' },
  { label: 'Breakfast', prompt: 'Is breakfast included?', icon: '✦' },
  { label: 'Cancellation', prompt: 'What is the cancellation policy?', icon: '↗' }
];

function SparkleIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>; }
function CalendarIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>; }

export default function App() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Welcome to Harborlight Hotel. I can answer questions about the property or check room availability.' }]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ checkIn: '2026-10-10', checkOut: '2026-10-12', adults: 2 });
  const [availability, setAvailability] = useState(null);

  async function ask(text = question) {
    const value = text.trim();
    if (!value || loading) return;
    setError(''); setQuestion(''); setMessages(prev => [...prev, { role: 'user', content: value }]); setLoading(true);
    try {
      const data = await sendChat({ question: value, history: messages.slice(-10) });
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, grounded: data.grounded, sources: data.sources }]);
      if (data.intent === 'availability' && data.availability) setAvailability(data.availability);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  async function check() {
    setError(''); setLoading(true);
    try {
      const data = await getAvailability(form); setAvailability(data);
      setMessages(prev => [...prev, { role: 'user', content: `Check availability for ${form.adults} guest${form.adults > 1 ? 's' : ''}, ${form.checkIn} to ${form.checkOut}.` }, { role: 'assistant', content: data.message, grounded: true }]);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  function reset() { setMessages([{ role: 'assistant', content: 'How can I help with your stay?' }]); setAvailability(null); setError(''); }

  return <main className="app">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <nav className="topbar"><div className="brand"><span className="brand-mark"><span>H</span></span><span><b>Harborlight</b><small>HOTEL & RESIDENCES</small></span></div><div className="topbar-right"><span className="secure-label"><span className="pulse-dot"/> Digital concierge</span><button className="reset-button" onClick={reset}>New conversation <span>↗</span></button></div></nav>
    <section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line"/> GUEST SERVICES <span className="eyebrow-line"/></p><h1>A softer way<br/><em>to stay.</em></h1><p className="lede">Your private digital concierge for thoughtful answers, local details, and an effortless Harborlight experience.</p><div className="hero-meta"><span><strong>24/7</strong> Available anytime</span><span className="meta-divider"/><span><strong>Instant</strong> Helpful answers</span></div></div><div className="hero-orbit"><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-core"><SparkleIcon/><span>HL</span></div><span className="orbit-label label-top">thoughtful</span><span className="orbit-label label-bottom">by design</span></div></section>
    <div className="layout"><section className="chat-card" aria-label="Hotel assistant conversation"><div className="chat-header"><div className="assistant-identity"><div className="assistant-avatar"><SparkleIcon/></div><div><h2>Harborlight concierge</h2><p><span className="online-dot"/> Usually replies instantly</p></div></div><span className="conversation-count">{messages.length - 1 || 0} {messages.length - 1 === 1 ? 'message' : 'messages'}</span></div><div className="messages" aria-live="polite">{messages.map((m, i) => <div className={`message ${m.role}`} key={i}><div className="avatar">{m.role === 'assistant' ? <SparkleIcon/> : 'You'}</div><div className="bubble"><p>{m.content}</p>{m.sources?.length ? <small><span>✓</span> Grounded in hotel information</small> : null}</div></div>)}{loading && <div className="message assistant"><div className="avatar"><SparkleIcon/></div><div className="typing"><span/><span/><span/></div></div>}</div>{error && <div className="error" role="alert"><span className="error-icon">!</span><span>{error}</span><button onClick={() => setError('')}>Dismiss</button></div>}<div className="suggestions"><div className="suggestion-label">Try asking</div><div className="suggestion-grid">{suggestions.map(s => <button key={s.prompt} onClick={() => ask(s.prompt)}><span className="suggestion-icon">{s.icon}</span><span>{s.label}</span><span className="suggestion-arrow">↗</span></button>)}</div></div><form className="composer" onSubmit={e => { e.preventDefault(); ask(); }}><div className="input-wrap"><span className="input-spark"><SparkleIcon/></span><input aria-label="Ask a hotel question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask anything about your stay..." maxLength={1000}/></div><button className="send" disabled={loading || !question.trim()} aria-label="Send question"><span>Send</span><b>↗</b></button></form></section>
      <aside className="availability"><div className="availability-top"><div className="section-kicker">PLAN YOUR STAY</div><div className="card-heading"><span className="icon"><CalendarIcon/></span><div><h2>Find your room</h2><p>Let’s make space for what matters.</p></div></div></div><div className="field-row"><label>Check-in<span className="field-hint">Arrival</span><div className="date-input"><CalendarIcon/><input type="date" value={form.checkIn} onChange={e => setForm({...form, checkIn: e.target.value})}/></div></label><span className="date-arrow">→</span><label>Check-out<span className="field-hint">Departure</span><div className="date-input"><CalendarIcon/><input type="date" value={form.checkOut} onChange={e => setForm({...form, checkOut: e.target.value})}/></div></label></div><label className="guest-field">Guests<span className="field-hint">Who’s joining you?</span><select value={form.adults} onChange={e => setForm({...form, adults: Number(e.target.value)})}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>)}</select></label><button className="primary" aria-label="Find rooms" onClick={check} disabled={loading}><span>{loading ? 'Finding your room...' : 'Find available rooms'}</span><b>↗</b></button>{availability && <div className="results"><div className="results-title"><h3>{availability.rooms?.length || 0} room types found</h3><span>For your stay</span></div>{availability.rooms?.map((room, index) => <article className="room" key={room.code} style={{ '--delay': `${index * 80}ms` }}><div className="room-art"><span>{index === 0 ? '✦' : '◒'}</span></div><div className="room-copy"><strong>{room.name}</strong><span>{room.beds} · Sleeps {room.capacity}</span></div><div className="room-rate"><b>${room.rate}</b><small>/ night</small></div></article>)}</div>}<div className="availability-note"><span>✦</span> Rates are indicative and subject to availability</div></aside></div><footer><span>Harborlight Hotel · A little more considered</span><span><i/> Demo experience · No reservations are created</span></footer>
  </main>;
}
