# Sports Management System (MERN)

React.js -> Express/Node.js -> MongoDB

## Run
1. Start MongoDB locally (or change MONGO_URI in server/.env to your Atlas URL).
2. Backend:   cd server && npm install && npm run dev      (http://localhost:5000)
3. Frontend:  cd client && npm install && npm run dev      (http://localhost:5173)

## API
| Resource | Endpoints |
|---|---|
| Teams   | GET/POST /api/teams,   GET/PUT/DELETE /api/teams/:id |
| Players | GET/POST /api/players, GET/PUT/DELETE /api/players/:id |
| Matches | GET/POST /api/matches, GET/PUT/DELETE /api/matches/:id |
