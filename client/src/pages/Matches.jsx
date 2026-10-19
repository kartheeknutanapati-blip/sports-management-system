import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api.js';

const empty = { teamA: '', teamB: '', date: '', venue: '', scoreA: 0, scoreB: 0, status: 'upcoming' };

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setMatches((await api.get('/matches')).data);
    setTeams((await api.get('/teams')).data);
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/matches/${editId}`, form);
      else await api.post('/matches', form);
      setForm(empty); setEditId(null); setError('');
      load();
    } catch (err) { setError(errorMessage(err)); }
  };

  const handleEdit = (m) => {
    setEditId(m._id);
    setForm({
      teamA: m.teamA?._id || '', teamB: m.teamB?._id || '',
      date: m.date.slice(0, 10), venue: m.venue,
      scoreA: m.scoreA, scoreB: m.scoreB, status: m.status
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this match?')) return;
    await api.delete(`/matches/${id}`);
    load();
  };

  const teamOptions = teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select name="teamA" value={form.teamA} onChange={handleChange}>
          <option value="">Team A</option>{teamOptions}
        </select>
        <select name="teamB" value={form.teamB} onChange={handleChange}>
          <option value="">Team B</option>{teamOptions}
        </select>
        <input name="date" type="date" value={form.date} onChange={handleChange} />
        <input name="venue" placeholder="Venue" value={form.venue} onChange={handleChange} />
        <input name="scoreA" type="number" min="0" placeholder="Score A" value={form.scoreA} onChange={handleChange} />
        <input name="scoreB" type="number" min="0" placeholder="Score B" value={form.scoreB} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">{editId ? 'Update match' : 'Add match'}</button>
      </form>
      {error && <p className="error">{error}</p>}

      <table>
        <thead><tr><th>Match</th><th>Date</th><th>Venue</th><th>Score</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {matches.length === 0 && <tr><td colSpan="6">No matches yet. Add two teams first, then schedule a match.</td></tr>}
          {matches.map(m => (
            <tr key={m._id}>
              <td>{m.teamA?.name} vs {m.teamB?.name}</td>
              <td>{new Date(m.date).toLocaleDateString()}</td>
              <td>{m.venue}</td>
              <td>{m.scoreA} - {m.scoreB}</td>
              <td>{m.status}</td>
              <td>
                <button onClick={() => handleEdit(m)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(m._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
