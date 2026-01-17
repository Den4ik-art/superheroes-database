import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const App = () => {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand__badge">Neo-Heroes DB</span>
          <h1>Superhero Roster</h1>
          <p>Catalog the legends. Flip to reveal the lore.</p>
        </div>
        <nav className="app-nav">
          <Link to="/">Home</Link>
                    <Link className="button" to="/create">Add Hero</Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
};
