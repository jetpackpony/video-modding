import React from 'react';
import logo from './logo.svg';
import './App.css';
import reddit from './reddit-api';

function App() {
  reddit
    .init()
    .getVideos({
      subreddit: "WatchPeopleDieInside"
    })
    // .map((p) => p.title)
    .then((list) => list[1])
    .then((post) => {
      console.log(post);
    })
    .catch((e) => console.log("Error: ", e));

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to dd.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
