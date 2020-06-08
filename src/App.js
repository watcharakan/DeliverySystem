import React from 'react';
import MultiStep   from 'react-multistep';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Map from './Map/Map1'
import Map2 from './Map/Map2'
import Line from './Liff/Line'
import Complete from './Map/Complete'
import { Navbar  } from 'react-bootstrap';
import Map1 from "./Map/Map1";
const App = () => {
  React.useEffect(()=>{
    document.title = "Delevery System"
  })
    const steps = [
        { component: <Map /> },
        { component: <Map2 /> },

    ]
  return (

    <div className="app">
        <>

            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">
                    <img
                        alt=""
                        src="/logo.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />{' '}
                    Sprout Story
                </Navbar.Brand>
            </Navbar>
        </>

      <Router>
        <Switch>
          <div>
            <Route exact path="/" component={Map} />
            <Route path="/map2" component={Map2} />
            <Route path="/complete" component={Complete} />
          </div>
        </Switch>
      </Router>
    </div>
  );
}

export default App;