import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import VideogameCreate from "./components/VideogameCreate";
import VideogameDetail from "./components/VideogameDetail";
import { Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <h2>My Videogames Catalog</h2>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/home/:id" component={VideogameDetail} />
          <Route exact path="/create" component={VideogameCreate} />
          <Route path="/">
            <div>
              <h1> Ups!! Seems this page doesn't exists...</h1>
              <Link to="/home">
                <button>Back to Home</button>
              </Link>
            </div>
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
