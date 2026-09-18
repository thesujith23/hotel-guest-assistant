import { useEffect, useRef, useState } from 'react';
import { sendChat, getAvailability } from './services/api.js';
import './styles.css';

const quickQuestions = ['What time is check-in?', 'Is breakfast included?', 'Does the hotel have a pool?'];

function Mark() { return <span className="mark" aria-hidden="true"><span>H</span></span>; }
function Spark() { return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z"/></svg>; }

export default function App() {
  const welcomeMessage = 'Welcome to Harborlight Hotel. I’m your concierge—how can I make your stay easier?';
  const [messages, setMessages] = useState([{ role: 'assistant', content: welcomeMessage }]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ checkIn: '2026-10-10', checkOut: '2026-10-12', adults: 2 });
  const [availability, setAvailability] = useState(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    const list = messagesRef.current;
    if (!list) return;
    requestAnimationFrame(() => { list.scrollTop = list.scrollHeight; });
  }, [messages, loading]);

  async function ask(text = question) {
    const value = text.trim();
    if (!value || loading) return;
    setQuestion(''); setError(''); setMessages(prev => [...prev, { role: 'user', content: value }]); setLoading(true);
    try {
      const data = await sendChat({ question: value, history: messages.slice(-10) });
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, sources: data.sources }]);
      if (data.availability) setAvailability(data.availability);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  async function checkAvailability() {
    setError(''); setLoading(true);
    try {
      const data = await getAvailability(form); setAvailability(data);
      setMessages(prev => [...prev, { role: 'user', content: `Check availability for ${form.adults} guest${form.adults > 1 ? 's' : ''}.` }, { role: 'assistant', content: data.message }]);
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }

  function reset() { setMessages([{ role: 'assistant', content: welcomeMessage }]); setAvailability(null); setQuestion(''); setError(''); }

  return <main className="app">
    <header className="header"><div className="brand"><Mark/><div><strong>Harborlight</strong><small>HOTEL CONCIERGE</small></div></div><div className="header-right"><span className="status"><i/> Online now</span><button onClick={reset}>New chat <b>＋</b></button></div></header>
    <section className="intro"><div><span className="overline">WELCOME TO HARBORLIGHT</span><h1>Stay curious.<br/><em>We’ll help.</em></h1><p>Ask about your room, the hotel, or anything you need during your visit.</p></div><div className="intro-art"><div className="sun"><Spark/></div><span>thoughtful<br/>hospitality</span></div></section>
    <section className="workspace"><div className="chat-panel"><div className="panel-top"><div className="concierge"><div className="concierge-icon"><Spark/></div><div><h2>Digital concierge</h2><span>Here to help with your stay</span></div></div><span className="secure">PRIVATE CHAT</span></div><div className="messages" ref={messagesRef} aria-live="polite">{messages.map((message, index) => <div className={`message ${message.role}`} key={index}><div className="message-avatar">{message.role === 'assistant' ? <Spark/> : 'You'}</div><div className="message-content"><div className="message-name">{message.role === 'assistant' ? 'Harborlight' : 'You'}</div><div className="bubble">{message.content}</div>{message.sources?.length ? <small className="grounded">✓ From hotel information</small> : null}</div></div>)}{loading && <div className="message assistant"><div className="message-avatar"><Spark/></div><div className="message-content"><div className="message-name">Harborlight</div><div className="bubble typing"><i/><i/><i/></div></div></div>}</div>{error && <div className="error" role="alert">{error}<button onClick={() => setError('')}>×</button></div>}<div className="quick"><span>Quick questions</span>{quickQuestions.map(item => <button key={item} onClick={() => ask(item)}>{item} <b>↗</b></button>)}</div><form className="composer" onSubmit={e => { e.preventDefault(); ask(); }}><input aria-label="Ask a hotel question" value={question} onChange={e => setQuestion(e.target.value)} placeholder="Type your question..." maxLength={1000}/><button disabled={loading || !question.trim()} aria-label="Send question">Send <b>↗</b></button></form></div>
      <aside className="stay-panel"><span className="overline">PLAN YOUR VISIT</span><h2>Find your room</h2><p className="aside-copy">Tell us when you’re coming and we’ll show what fits.</p><div className="dates"><label>CHECK-IN<input type="date" value={form.checkIn} onChange={e => setForm({...form, checkIn: e.target.value})}/></label><span>→</span><label>CHECK-OUT<input type="date" value={form.checkOut} onChange={e => setForm({...form, checkOut: e.target.value})}/></label></div><label className="guests">GUESTS<select value={form.adults} onChange={e => setForm({...form, adults: Number(e.target.value)})}>{[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} guest{n === 1 ? '' : 's'}</option>)}</select></label><button className="find" aria-label="Find rooms" onClick={checkAvailability} disabled={loading}>{loading ? 'Checking...' : 'Check availability'} <b>↗</b></button>{availability && <div className="rooms"><div className="rooms-heading"><strong>{availability.rooms?.length || 0} rooms available</strong><span>For your dates</span></div>{availability.rooms?.map(room => <div className="room" key={room.code}><div className="room-symbol">✦</div><div><strong>{room.name}</strong><span>{room.beds} · Sleeps {room.capacity}</span></div><b>${room.rate}<small>/night</small></b></div>)}</div>}<p className="note">Rates are indicative. No reservation is created.</p></aside></section>
    <footer>Harborlight Hotel <span>•</span> A little more considered</footer>
  </main>;
}
