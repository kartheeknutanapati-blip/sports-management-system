import { useEffect, useState } from 'react';
import api, { errorMessage } from '../api.js';

const empty = { name: '', sport: '', coach: '', city: '' };

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => setTeams((await api.get('/teams')).data);
  useEffect(() => { load(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/teams/${editId}`, form);
      else await api.post('/teams', form);
      setForm(empty); setEditId(null); setError('');
      load();
    } catch (err) { setError(errorMessage(err)); }
  };

  const handleEdit = (t) => {
    setEditId(t._id);
    setForm({ name: t.name, sport: t.sport, coach: t.coach, city: t.city || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    await api.delete(`/teams/${id}`);
    load();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Team name" value={form.name} onChange={handleChange} />
        <input name="sport" placeholder="Sport" value={form.sport} onChange={handleChange} />
        <input name="coach" placeholder="Coach" value={form.coach} onChange={handleChange} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
        <button type="submit">{editId ? 'Update team' : 'Add team'}</button>
      </form>
      {error && <p className="error">{error}</p>}

      <table>
        <thead><tr><th>Name</th><th>Sport</th><th>Coach</th><th>City</th><th></th></tr></thead>
        <tbody>
          {teams.length === 0 && <tr><td colSpan="5">No teams yet. Add one above.</td></tr>}
          {teams.map(t => (
            <tr key={t._id}>
              <td>{t.name}</td><td>{t.sport}</td><td>{t.coach}</td><td>{t.city}</td>
              <td>
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
