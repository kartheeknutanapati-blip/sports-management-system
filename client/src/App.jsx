import { useState } from 'react';
import Teams from './pages/Teams.jsx';
import Players from './pages/Players.jsx';
import Matches from './pages/Matches.jsx';

const tabs = { Teams, Players, Matches };

export default function App() {
  const [active, setActive] = useState('Teams');
  const Page = tabs[active];

  return (
    <div className="container">
      <h1>Sports Management System</h1>
      <nav>
        {Object.keys(tabs).map(t => (
          <button key={t} className={t === active ? 'tab active' : 'tab'} onClick={() => setActive(t)}>
            {t}
          </button>
        ))}
      </nav>
      <Page />
    </div>
  );
}
