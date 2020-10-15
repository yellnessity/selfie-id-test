import React from 'react'
import EventsList from './components/EventsList'

function App() {
  return (
    <div className="App">
      <div className="container-fluid">
        <nav className="z-depth-0">
          <div className="nav-wrapper grey darken-4">
            <a href="#" className="brand-logo">SelfieID</a>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
              <li><a href="#">Сотрудники</a></li>
              <li><a href="#">События</a></li>
              <li><a href="#">Пользователи</a></li>
            </ul>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a href="#">EN</a></li>
              <li><a href="#">RU</a></li>
              <li><a href="#">Настройки</a></li>
              <li><a href="#">Выйти</a></li>
            </ul>
          </div>
        </nav>
        <div className="row">
          <EventsList />
        </div>
        
      </div>
      
    </div>
  );
}

export default App;
