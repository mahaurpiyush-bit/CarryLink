import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './style.css';

const api = axios.create({ baseURL: '/api' });

class AppErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <main className="card room-error"><p className="eyebrow">CARRYLINK</p><h2>Something went wrong loading this page.</h2><p>{this.state.error?.message || 'Please refresh the page and try again.'}</p><button onClick={() => window.location.reload()}>Refresh page</button></main>;
    }
    return this.props.children;
  }
}

function formatKg(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0';
}

function displayDate(value) {
  return typeof value === 'string' ? value.slice(0, 16).replace('T', ' ') : 'Not scheduled';
}

function DeliveryRoom({ booking, auth, messages, chatText, setChatText, onBack, onAccept, onPay, onUpdate, onCancel, onProof, onSendMessage, onReview, onReport }) {
  const request = booking?.request || {};
  const trip = booking?.trip || {};
  const status = typeof booking?.status === 'string' ? booking.status : 'PENDING';
  const chat = Array.isArray(messages) ? messages : [];
  const steps = [['PENDING', 'Request sent'], ['ACCEPTED', 'Traveller accepted'], ['PAID', 'Payment confirmed'], ['HANDED_OVER', 'Package collected'], ['IN_TRANSIT', 'Departed'], ['DELIVERED', 'Delivered']];
  const currentStep = steps.findIndex(([stepStatus]) => stepStatus === status);
  const isSender = auth.userId === booking.sender?.id;
  const isTraveller = auth.userId === booking.traveller?.id;
  const [chatOpen, setChatOpen] = useState(false);
  const [proof, setProof] = useState({ receiverName: '', note: '' });
  return <main>
    <nav><div className="logo"><span className="mark">&gt;</span> CarryLink</div><button className="ghost" onClick={onBack}>Back to dashboard</button></nav>
    <section className="room-header"><p className="eyebrow">DELIVERY ROOM</p><h1>{request.origin || 'Pickup'} <span>-&gt;</span> {request.destination || 'Drop-off'}</h1><p>One shared space for the sender and traveller to coordinate every step.</p></section>
    <section className="room-grid">
      <div className="card person-card"><p className="eyebrow">SENDER</p><h2>{booking.sender?.name || 'Sender'}</h2><p>{booking.sender?.email || 'Contact details available to both parties'}</p><span>{request.description || 'Package details'}</span><dl><div><dt>Package</dt><dd>{formatKg(request.weight || 0)} kg</dd></div><div><dt>Pickup</dt><dd>{request.pickupPoint || request.origin || 'Not provided'}</dd></div><div><dt>Drop-off</dt><dd>{request.dropPoint || request.destination || 'Not provided'}</dd></div></dl></div>
      <div className="card person-card traveller-card"><p className="eyebrow">TRAVELLER</p><h2>{booking.traveller?.name || 'Traveller'}</h2><p>{booking.traveller?.email || 'Contact details available to both parties'}</p><span>{trip.transportType || 'Journey'} route - {trip.origin || request.origin || 'Origin'} to {trip.destination || request.destination || 'Destination'}</span><dl><div><dt>Departure</dt><dd>{displayDate(trip.departureTime)}</dd></div><div><dt>Arrival</dt><dd>{displayDate(trip.expectedArrivalTime)}</dd></div><div><dt>Offer</dt><dd>INR {request.offeredAmount || 0}</dd></div></dl></div>
    </section>
    <section className="card progress-card"><div className="booking-heading"><div><p className="eyebrow">LIVE STATUS</p><h2>Delivery progress</h2></div><strong>{status.replace('_', ' ')}</strong></div>{status === 'DELIVERED' && <div className="delivery-thanks"><p className="eyebrow">DELIVERY CONFIRMED</p><h2>Thank you for trusting CarryLink.</h2><p>Your package has reached its destination successfully. We appreciate you choosing us to help move what matters.</p></div>}<div className="route-map"><span>{request.origin || 'Pickup'}</span><i></i><span>{request.destination || 'Drop-off'}</span><small>{trip.transportType || 'Journey'} route - {trip.pickupPoint || trip.origin || 'Origin'} to {trip.dropPoint || trip.destination || 'Destination'}</small></div><div className="room-timeline">{steps.map(([stepStatus, label], index) => <div className={currentStep >= index ? 'room-step done' : 'room-step'} key={stepStatus}><span>{index + 1}</span><b>{label}</b><small>{stepStatus.replace('_', ' ')}</small></div>)}</div><div className="room-actions">
      {status === 'PENDING' && ((isSender && booking.proposedBy === 'TRAVELLER') || (isTraveller && booking.proposedBy === 'SENDER')) && <button onClick={() => onAccept(booking.id)}>Accept request</button>}
      {status === 'ACCEPTED' && isSender && <button onClick={() => onPay(booking.id)}>Confirm payment</button>}
      {status === 'PAID' && isSender && <button onClick={() => onUpdate(booking.id, 'HANDED_OVER')}>Confirm package collected</button>}
      {status === 'HANDED_OVER' && isTraveller && <button onClick={() => onUpdate(booking.id, 'IN_TRANSIT')}>Mark departed</button>}
      {status === 'IN_TRANSIT' && isTraveller && <button onClick={() => onUpdate(booking.id, 'DELIVERED')}>Mark delivered</button>}
      {(status === 'PENDING' || status === 'ACCEPTED' || status === 'PAID') && <button className="outline" onClick={() => onCancel(booking.id)}>Cancel delivery</button>}
    </div></section>
    {status === 'DELIVERED' && isTraveller && !booking.receiverName && <form className="card proof-card" onSubmit={(event) => { event.preventDefault(); onProof(booking.id, proof); }}><p className="eyebrow">DELIVERY PROOF</p><h2>Confirm handover</h2><div className="two"><label>Receiver name<input value={proof.receiverName} onChange={(event) => setProof({ ...proof, receiverName: event.target.value })} required /></label><label>Delivery note<input value={proof.note} onChange={(event) => setProof({ ...proof, note: event.target.value })} placeholder="Where was it handed over?" required /></label></div><button>Save delivery proof</button></form>}
    {booking.receiverName && <section className="card proof-card"><p className="eyebrow">DELIVERY PROOF</p><h2>Handover confirmed</h2><p>Received by {booking.receiverName}. {booking.deliveryNote}</p></section>}
    <section className="room-lower">
      <div className="card trust-card"><p className="eyebrow">TRUST & SUPPORT</p><h2>Travel with confidence</h2><div className="trust-row"><span>Verified profiles</span><b>Active</b></div><div className="trust-row"><span>Protected handover</span><b>Included</b></div><div className="trust-row"><span>CarryLink fee</span><b>INR 0</b></div>{status === 'DELIVERED' && <button className="outline" onClick={() => onReview(booking.id)}>Rate this delivery</button>}<button className="outline" onClick={() => onReport(booking.id)}>Report an issue</button><button className="chat-open-button" onClick={() => setChatOpen(true)}>Open chat</button></div>
    </section>
    {chatOpen && <div className="chat-overlay" role="dialog" aria-modal="true" aria-label="Private chat"><div className="card chat-card"><div className="section-heading"><div><p className="eyebrow">PRIVATE CHAT</p><h2>Coordinate safely</h2></div><button className="chat-close-button" onClick={() => setChatOpen(false)} aria-label="Close chat">Close</button></div><span className="verified-badge">VERIFIED USERS</span><div className="chat-list">{chat.length === 0 ? <p className="muted">No messages yet. Confirm pickup details here.</p> : chat.map((item) => <div className={item?.sender?.id === auth.userId ? 'chat-message mine' : 'chat-message'} key={item?.id || `${item?.createdAt}-${item?.body}`}><b>{item?.sender?.name || 'Member'}</b><p>{item?.body || ''}</p><small>{displayDate(item?.createdAt)}</small></div>)}</div><form className="chat-form" onSubmit={onSendMessage}><input value={chatText} onChange={(event) => setChatText(event.target.value)} placeholder="Write a message..." maxLength="1000" required /><button>Send</button></form></div></div>}
  </main>;
}

function DeliveryRoomFallback({ onBack }) {
  return <main><nav><div className="logo"><span className="mark">&gt;</span> CarryLink</div><button className="ghost" onClick={onBack}>Back to dashboard</button></nav><section className="card room-error"><p className="eyebrow">DELIVERY ROOM</p><h2>We could not load this delivery yet.</h2><p>Please go back to the dashboard and open it again. Your booking is still safe.</p></section></main>;
}

function App() {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem('carry-auth') || 'null'));
  const [mode, setMode] = useState('login');
  const [data, setData] = useState({ role: 'SENDER' });
  const [requests, setRequests] = useState([]);
  const [matchingRequests, setMatchingRequests] = useState([]);
  const [trips, setTrips] = useState([]);
  const [availableTrips, setAvailableTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatText, setChatText] = useState('');
  const [profile, setProfile] = useState(null);
  const [tripFilter, setTripFilter] = useState({ search: '', transport: 'ALL' });
  const [adminReports, setAdminReports] = useState([]);

  useEffect(() => {
    if (auth) {
      api.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
      load();
    }
  }, [auth]);

  useEffect(() => {
    if (activeBookingId) {
      loadChat(activeBookingId);
      const refresh = window.setInterval(() => loadChat(activeBookingId), 5000);
      return () => window.clearInterval(refresh);
    } else {
      setChatMessages([]);
    }
  }, [activeBookingId]);

  async function load() {
    try {
      const responses = await Promise.all([
        api.get('/requests'),
        api.get('/trips'),
        api.get('/bookings'),
        ...(auth?.role === 'SENDER' ? [api.get('/trips/available')] : []),
        ...(auth?.role === 'TRAVELLER' ? [api.get('/requests/matching-me')] : [])
      ]);
      setRequests(responses[0].data);
      setTrips(responses[1].data);
      setBookings(responses[2].data);
      setAvailableTrips(auth?.role === 'SENDER' ? responses[3].data : []);
      setMatchingRequests(auth?.role === 'TRAVELLER' ? responses[3].data : []);
      if (!profile) {
        const profileResponse = await api.get('/profile');
        setProfile(profileResponse.data);
      }
      if (auth?.role === 'ADMIN') {
        const reportsResponse = await api.get('/admin/reports');
        setAdminReports(reportsResponse.data);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function loadChat(id) {
    try {
      const response = await api.get(`/bookings/${id}/messages`);
      setChatMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setChatMessages([]);
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  function updateData(event) {
    setData((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, data);
      localStorage.setItem('carry-auth', JSON.stringify(response.data));
      setAuth(response.data);
      setMessage('Welcome to CarryLink.');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function createRequest(event) {
    event.preventDefault();
    if (!data.requiredBy || new Date(data.requiredBy) <= new Date()) {
      setMessage('Choose a future required-by time.');
      return;
    }
    if (!Number.isFinite(Number(data.weight)) || Number(data.weight) <= 0 || Number(data.weight) > 20) {
      setMessage('Weight must be between 0 and 20 kg.');
      return;
    }
    if (!Number.isFinite(Number(data.offeredAmount)) || Number(data.offeredAmount) <= 0) {
      setMessage('Enter an offer greater than zero.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/requests', {
        ...data,
        weight: Number(data.weight),
        offeredAmount: Number(data.offeredAmount),
        requiredBy: new Date(data.requiredBy).toISOString(),
        itemCategory: 'CLOTHING'
      });
      setData({ role: auth.role });
      setMessage('Delivery request published.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function createTrip(event) {
    event.preventDefault();
    try {
      if (new Date(data.expectedArrivalTime) <= new Date(data.departureTime)) {
        throw new Error('Expected arrival must be after departure.');
      }
      if (!Number.isFinite(Number(data.totalCapacity)) || Number(data.totalCapacity) <= 0) {
        throw new Error('Enter a capacity greater than zero.');
      }
      await api.post('/trips', {
        ...data,
        departureTime: new Date(data.departureTime).toISOString(),
        expectedArrivalTime: new Date(data.expectedArrivalTime).toISOString(),
        totalCapacity: Number(data.totalCapacity),
        transportType: data.transportType || 'CAR',
        pickupPoint: data.origin,
        dropPoint: data.destination,
        stops: [
          {
            location: data.origin,
            expectedArrival: new Date(data.departureTime).toISOString(),
            expectedDeparture: new Date(data.departureTime).toISOString()
          },
          {
            location: data.destination,
            expectedArrival: new Date(data.expectedArrivalTime).toISOString(),
            expectedDeparture: new Date(data.expectedArrivalTime).toISOString()
          }
        ]
      });
      setData({ role: auth.role });
      setMessage('Trip published. Senders can now find your route.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function find(id) {
    try {
      const response = await api.get(`/requests/${id}/matches`);
      setSelectedRequest(id);
      setMatches(response.data);
      setMessage(`${response.data.length} compatible travellers found.`);
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function book(tripId) {
    try {
      const response = await api.post('/bookings', { requestId: selectedRequest, tripId });
      setBookings((current) => [response.data, ...current]);
      setMessage('Request sent to the traveller.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function offerToCarry(requestId, tripId) {
    try {
      const response = await api.post('/bookings', { requestId, tripId });
      setBookings((current) => [response.data, ...current]);
      setMessage('Request sent to the sender.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function pay(id) {
    try {
      await api.post(`/bookings/${id}/payment`, { idempotencyKey: `web-${id}` });
      setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status: 'PAID' } : booking));
      setMessage('Payment authorized and booking confirmed.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function acceptBooking(id) {
    try {
      await api.patch(`/bookings/${id}/accept`);
      setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status: 'ACCEPTED' } : booking));
      setActiveBookingId(id);
      setMessage('Proposal accepted. The sender can now authorize payment.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function updateBooking(id, status) {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      setBookings((current) => current.map((booking) => booking.id === id ? { ...booking, status } : booking));
      setMessage(status === 'HANDED_OVER' ? 'Package marked as collected.' : status === 'IN_TRANSIT' ? 'Delivery marked as departed.' : 'Delivery marked as reached.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function cancelBooking(id) {
    if (!window.confirm('Cancel this delivery?')) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setActiveBookingId(null);
      setMessage('Delivery cancelled and available capacity restored.');
      load();
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function addDeliveryProof(id, proof) {
    try {
      const response = await api.post(`/bookings/${id}/proof`, proof);
      setBookings((current) => current.map((booking) => booking.id === id ? response.data : booking));
      setMessage('Delivery proof saved.');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function resolveReport(id) {
    try {
      await api.patch(`/admin/reports/${id}`, { status: 'RESOLVED' });
      setAdminReports((current) => current.filter((report) => report.id !== id));
      setMessage('Report marked as resolved.');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
      }
  }

  async function sendMessage(event) {
    event.preventDefault();
    if (!activeBookingId || !chatText.trim()) return;
    try {
      const response = await api.post(`/bookings/${activeBookingId}/messages`, { body: chatText.trim() });
      setChatMessages((current) => [...current, response.data]);
      setChatText('');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function reviewBooking(id) {
    const rating = window.prompt('Rate this delivery from 1 to 5');
    const comment = window.prompt('Share a short review');
    if (!rating || !comment) return;
    try {
      await api.post(`/bookings/${id}/reviews`, { rating: Number(rating), comment });
      setMessage('Thank you for reviewing this delivery.');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  async function reportBooking(id) {
    const description = window.prompt('Describe the issue for CarryLink support');
    if (!description) return;
    try {
      await api.post(`/bookings/${id}/reports`, { description });
      setMessage('Support request submitted. Our team will review it.');
    } catch (error) {
      setMessage(error.response?.data?.message || error.response?.data?.error || error.message);
    }
  }

  function signOut() {
    localStorage.removeItem('carry-auth');
    delete api.defaults.headers.common.Authorization;
    setAuth(null);
  }

  const activeBooking = bookings.find((booking) => String(booking.id) === String(activeBookingId));
  if (auth && activeBooking) {
    return <DeliveryRoom booking={activeBooking} auth={auth} messages={chatMessages} chatText={chatText} setChatText={setChatText} onBack={() => setActiveBookingId(null)} onAccept={acceptBooking} onPay={pay} onUpdate={updateBooking} onCancel={cancelBooking} onProof={addDeliveryProof} onSendMessage={sendMessage} onReview={reviewBooking} onReport={reportBooking} />;
  }
  if (auth && activeBookingId !== null) {
    return <DeliveryRoomFallback onBack={() => setActiveBookingId(null)} />;
  }

  if (!auth) {
    return (
      <main className="auth">
        <section className="brand">
          <div className="logo brand-logo"><span className="mark">&gt;</span> CarryLink</div>
          <h1>Send it forward.<br /><em>Travel lighter.</em></h1>
          <p>Make room on the journeys already happening. Send less, trust more, and keep every handoff moving.</p>
          <div className="brand-points"><span>01 / Real people, real routes</span><span>02 / A smarter way to send</span><span>03 / Every handoff tracked</span></div>
        </section>
        <form className="card auth-card" onSubmit={submit}>
          <div className="auth-heading">
            <p className="eyebrow">{mode === 'login' ? 'BACK ON THE MOVE' : 'START HERE'}</p>
            <h2>{mode === 'login' ? 'Pick up where you left off.' : 'Let’s get your first delivery moving.'}</h2>
            <p>{mode === 'login' ? 'Your routes, requests, and handoffs are waiting.' : 'One account for sending, travelling, and staying in the loop.'}</p>
          </div>
          {mode === 'register' && <input name="name" placeholder="Full name" required onChange={updateData} />}
          <input name="email" type="email" placeholder="Email address" required onChange={updateData} />
          {mode === 'register' && <input name="phone" placeholder="Phone number" required onChange={updateData} />}
          {mode === 'register' && <select name="role" value={data.role} onChange={updateData}><option value="SENDER">I need to send a package</option><option value="TRAVELLER">I am travelling</option></select>}
          <input name="password" type="password" placeholder="Password (8+ characters)" required onChange={updateData} />
          <button className="primary-button">{mode === 'login' ? 'Take me in' : 'Create my account'} <span>&gt;</span></button>
          <button type="button" className="switch-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(''); }}>
            {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in'}
          </button>
          {message && <div className="notice">{message}</div>}
        </form>
      </main>
    );
  }

  const isTraveller = auth.role === 'TRAVELLER';
  const filteredTrips = availableTrips.filter((trip) => {
    const search = tripFilter.search.trim().toLowerCase();
    const routeMatches = !search || `${trip.origin} ${trip.destination} ${trip.traveller}`.toLowerCase().includes(search);
    return routeMatches && (tripFilter.transport === 'ALL' || trip.transportType === tripFilter.transport);
  });
  return (
    <main>
      <nav><div className="logo"><span className="mark">&gt;</span> CarryLink</div><div><span className="pill">{auth.role === 'TRAVELLER' ? 'TRAVELLER' : auth.role === 'SENDER' ? 'SENDER' : auth.role}</span><button className="ghost" onClick={signOut}>Leave desk</button></div></nav>
      <section className="hero">
        <div><p className="eyebrow">{isTraveller ? 'TRAVELLER MODE / ON' : 'SENDER MODE / ON'}</p><h1>{isTraveller ? 'Your route can carry more.' : 'Your package has places to go.'}</h1><p>{isTraveller ? 'Turn your everyday journey into useful extra capacity.' : 'Find someone already heading your way and send it with confidence.'}</p></div>
        <div className="route-card"><b>{isTraveller ? 'READY TO CARRY?' : 'READY TO SEND?'}</b><span>-&gt;</span><small>{isTraveller ? 'Drop your route. We’ll bring the right requests to you.' : 'Drop your details. We’ll surface the right journeys.'}</small></div>
      </section>
      <section className="stats-grid">
        <div className="stat-card"><small>ACTIVE DELIVERIES</small><strong>{bookings.filter((booking) => !['DELIVERED', 'CANCELLED'].includes(booking.status)).length}</strong><span>Live bookings</span></div>
        <div className="stat-card"><small>{isTraveller ? 'COMPLETED TRIPS' : 'DELIVERED PACKAGES'}</small><strong>{bookings.filter((booking) => booking.status === 'DELIVERED').length}</strong><span>Trusted handovers</span></div>
        <div className="stat-card"><small>{isTraveller ? 'TOTAL EARNINGS' : 'TOTAL SPEND'}</small><strong>INR {bookings.filter((booking) => booking.status === 'DELIVERED').reduce((total, booking) => total + Number(booking.request?.offeredAmount || 0), 0).toLocaleString()}</strong><span>Across your history</span></div>
      </section>
      {auth.role === 'ADMIN' && <section className="card admin-panel"><p className="eyebrow">ADMIN DASHBOARD</p><h2>Open reports</h2>{adminReports.length === 0 ? <p className="muted">No open reports.</p> : adminReports.map((report) => <article className="request" key={report.id}><div><b>Booking #{report.booking?.id || report.id}</b><p>{report.description}</p></div><button className="outline" onClick={() => resolveReport(report.id)}>Resolve</button></article>)}</section>}
      <section className="grid">
        {isTraveller ? (
          <div className="card form-card traveller-form"><p className="eyebrow">NEW JOURNEY</p><h2>Put your route on the map.</h2><p className="form-intro">Tell us where you are already going and how much extra you can carry.</p><form onSubmit={createTrip}>
            <div className="two"><label>Leaving from<input name="origin" placeholder="City you are leaving" required onChange={updateData} /></label><label>Going to<input name="destination" placeholder="City you are travelling to" required onChange={updateData} /></label></div>
            <label>How are you travelling<select name="transportType" defaultValue="CAR" onChange={updateData}><option value="CAR">Car</option><option value="TRAIN">Train</option><option value="BUS">Bus</option><option value="FLIGHT">Flight</option></select></label>
            <label>Space available for packages (kg)<input name="totalCapacity" type="number" min="0.1" step="0.1" placeholder="How much can you carry?" required onChange={updateData} /></label>
            <div className="two"><label>Departure<input name="departureTime" type="datetime-local" required onChange={updateData} /></label><label>Expected arrival<input name="expectedArrivalTime" type="datetime-local" required onChange={updateData} /></label></div>
            <button className="primary-button">Put it on the map <span>&gt;</span></button>
          </form></div>
        ) : (
          <div className="card form-card sender-form"><p className="eyebrow">NEW DELIVERY</p><h2>Give your package a route.</h2><p className="form-intro">Add the essentials and we’ll match it with a verified traveller already going that way.</p><form onSubmit={createRequest}>
            <div className="two"><label>Send from<input name="origin" placeholder="Where is the package now?" required onChange={updateData} /></label><label>Send to<input name="destination" placeholder="Where should it arrive?" required onChange={updateData} /></label></div>
            <div className="two"><label>Pickup address<input name="pickupPoint" placeholder="Full pickup address" required onChange={updateData} /></label><label>Delivery address<input name="dropPoint" placeholder="Full delivery address" required onChange={updateData} /></label></div>
            <label>What are you sending?<textarea name="description" placeholder="Describe the permitted item" required onChange={updateData} /></label>
            <div className="two"><label>Package weight<input name="weight" type="number" step=".1" max="20" placeholder="Weight in kg" required onChange={updateData} /></label><label>Your offer<input name="offeredAmount" type="number" placeholder="Amount in INR" required onChange={updateData} /></label></div>
            <label>Package needed by<input name="requiredBy" type="datetime-local" required onChange={updateData} /></label>
            <button className="primary-button" disabled={submitting}>{submitting ? 'Getting it moving...' : 'Send this request'} <span>&gt;</span></button>
          </form></div>
        )}
        <div>
          {!isTraveller && <div className="card"><h2>What you’ve set in motion</h2>{requests.length === 0 ? <p className="muted">Your delivery requests will land here.</p> : requests.map((request) => <article className="request" key={request.id}><div><b>{request.origin} -&gt; {request.destination}</b><p>{request.description}</p><span>{request.weight} kg · INR {request.offeredAmount} · {request.status}</span></div><button className="outline" onClick={() => find(request.id)}>See who’s going</button></article>)}</div>}
          {!isTraveller && <div className="card"><h2>People already on the move</h2><p className="form-intro">Explore live routes and find the journey that fits your delivery.</p><div className="trip-filters"><input value={tripFilter.search} onChange={(event) => setTripFilter({ ...tripFilter, search: event.target.value })} placeholder="Search a route or name" /><select value={tripFilter.transport} onChange={(event) => setTripFilter({ ...tripFilter, transport: event.target.value })}><option value="ALL">Every transport</option><option value="CAR">Car</option><option value="TRAIN">Train</option><option value="BUS">Bus</option><option value="FLIGHT">Flight</option></select></div>{filteredTrips.length === 0 ? <p className="muted">No live routes match that search yet.</p> : filteredTrips.map((trip) => <article className="match" key={trip.tripId}><div><b>{trip.traveller}</b><span>{trip.origin} -&gt; {trip.destination} · {formatKg(trip.availableCapacity)} kg free</span><small>{trip.transportType} · {trip.pickupPoint} to {trip.dropPoint}</small><small>Leaves {trip.departureTime?.slice(0, 16).replace('T', ' ')} · Rating {trip.rating}/5 · {trip.completedTrips} completed</small></div></article>)}</div>}
          {isTraveller && <div className="card"><h2>Your routes in the wild</h2>{trips.length === 0 ? <p className="muted">Your published journeys will show up here.</p> : trips.map((trip) => <article className="request" key={trip.id}><div><b>{trip.origin} -&gt; {trip.destination}</b><p>{trip.transportType} · {trip.departureTime?.slice(0, 16).replace('T', ' ')}</p><span>{formatKg(trip.availableCapacity)} kg open · {trip.status}</span></div></article>)}</div>}
          {isTraveller && <div className="card"><h2>Good matches, heading your way</h2><p className="form-intro">These requests line up with one of your routes.</p>{matchingRequests.length === 0 ? <p className="muted">Put a journey on the map and matching requests will find you.</p> : matchingRequests.map((request) => <article className="request" key={request.id}><div><b>{request.sender} needs a lift</b><p>{request.origin} -&gt; {request.destination} · {request.description}</p><span>{formatKg(request.weight)} kg · INR {request.offeredAmount} · Needed by {request.requiredBy?.slice(0, 16).replace('T', ' ')}</span></div><button className="outline" onClick={() => offerToCarry(request.id, request.tripId)}>Offer a lift</button></article>)}</div>}
          <div className="card"><h2>Delivery history</h2>{bookings.filter((booking) => ['DELIVERED', 'CANCELLED'].includes(booking.status)).length === 0 ? <p className="muted">Completed and cancelled deliveries will appear here.</p> : bookings.filter((booking) => ['DELIVERED', 'CANCELLED'].includes(booking.status)).map((booking) => <article className="request" key={`history-${booking.id}`}><div><b>{booking.request?.origin || 'Pickup'} -&gt; {booking.request?.destination || 'Drop-off'}</b><p>{booking.request?.description || 'Package'} - {booking.status}</p><span>{booking.request?.offeredAmount || 0} INR</span></div><button className="outline" onClick={() => setActiveBookingId(booking.id)}>Open room</button></article>)}</div>
          {!isTraveller && selectedRequest !== null && <div className="card"><h2>Travellers for this request</h2>{matches.length === 0 ? <p className="muted">No compatible traveller yet. Check that the route, required-by time, and package weight fit a published trip.</p> : matches.map((match) => { const existingBooking = bookings.find((booking) => String(booking.request?.id) === String(selectedRequest)); return <article className="match" key={match.tripId}><div><b>{match.traveller}</b><span>{match.origin} -&gt; {match.destination} - {formatKg(match.availableCapacity)} kg free</span><small>{match.transportType} - {match.pickupPoint} -&gt; {match.dropPoint}</small><small>Leaves {match.departureTime?.slice(0, 16).replace('T', ' ')} - Rating {match.rating}/5</small></div>{existingBooking ? <button className="outline" onClick={() => setActiveBookingId(existingBooking.id)}>Open delivery room</button> : <button className="outline" onClick={() => book(match.tripId)}>Request booking</button>}</article>; })}</div>}
          <div className="card"><h2>Delivery progress</h2><p className="form-intro">Both people see the same live delivery timeline.</p>{bookings.length === 0 ? <p className="muted">Your accepted proposals and delivery updates will appear here.</p> : bookings.map((booking) => {
            const isSender = auth.userId === booking.sender?.id;
            const isTraveller = auth.userId === booking.traveller?.id;
            const steps = ['PENDING', 'ACCEPTED', 'PAID', 'HANDED_OVER', 'IN_TRANSIT', 'DELIVERED'];
            const currentStep = steps.indexOf(booking.status);
            return <article className="booking" key={booking.id}>
              <div className="booking-heading"><div><b>{booking.request?.origin || 'Pickup'} -&gt; {booking.request?.destination || 'Drop-off'}</b><p>{booking.request?.description || 'Package details'}</p><span>{booking.request?.weight || 0} kg - INR {booking.request?.offeredAmount || 0}</span></div><strong>{(booking.status || 'PENDING').replace('_', ' ')}</strong></div>
              <div className="timeline">{steps.slice(1).map((step, index) => <span className={currentStep >= index + 1 ? 'done' : ''} key={step}>{step.replace('_', ' ')}</span>)}</div>
              <div className="booking-actions">
                <button className="outline" onClick={() => setActiveBookingId(booking.id)}>Open delivery room</button>
                {booking.status === 'PENDING' && ((isSender && booking.proposedBy === 'TRAVELLER') || (isTraveller && booking.proposedBy === 'SENDER')) && <button onClick={() => acceptBooking(booking.id)}>Accept proposal</button>}
                {booking.status === 'ACCEPTED' && isSender && <button onClick={() => pay(booking.id)}>Authorize payment</button>}
                {booking.status === 'PAID' && isSender && <button onClick={() => updateBooking(booking.id, 'HANDED_OVER')}>Mark stuff collected</button>}
                {booking.status === 'HANDED_OVER' && isTraveller && <button onClick={() => updateBooking(booking.id, 'IN_TRANSIT')}>Mark departed</button>}
                {booking.status === 'IN_TRANSIT' && isTraveller && <button onClick={() => updateBooking(booking.id, 'DELIVERED')}>Mark reached</button>}
              </div>
            </article>;
          })}</div>
        </div>
      </section>
      {message && <div className="toast">{message}</div>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<AppErrorBoundary><App /></AppErrorBoundary>);
