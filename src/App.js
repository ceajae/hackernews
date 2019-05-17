import React from 'react';
import Home from './components/home';
import './App.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
library.add(faSearch);

function App() {
  return (
    <div className="App  container-fluid">
      <Home />
    </div>
  );
}

export default App;
