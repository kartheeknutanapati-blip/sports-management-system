import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api.js';

const empty = { name: '', age: '', position: '', jerseyNo: '', team: '' };

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    setPlayers((await api.get('/players')).data);
    setTeams((await api.get('/teams')).data);
  };
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/players/${editId}`, form);
      else await api.post('/players', form);
      setForm(empty); setEditId(null); setError('');
      load();
    } catch (err) { setError(errorMessage(err)); }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, age: p.age, position: p.position || '', jerseyNo: p.jerseyNo ?? '', team: p.team?._id || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this player?')) return;
    await api.delete(`/players/${id}`);
    load();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Player name" value={form.name} onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
        <input name="position" placeholder="Position" value={form.position} onChange={handleChange} />
        <input name="jerseyNo" type="number" placeholder="Jersey no." value={form.jerseyNo} onChange={handleChange} />
        <select name="team" value={form.team} onChange={handleChange}>
          <option value="">Select team</option>
          {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
        <button type="submit">{editId ? 'Update player' : 'Add player'}</button>
      </form>
      {error && <p className="error">{error}</p>}

      <table>
        <thead><tr><th>Name</th><th>Age</th><th>Position</th><th>Jersey</th><th>Team</th><th></th></tr></thead>
        <tbody>
          {players.length === 0 && <tr><td colSpan="6">No players yet. Add one above.</td></tr>}
          {players.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td><td>{p.age}</td><td>{p.position}</td><td>{p.jerseyNo}</td><td>{p.team?.name}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
