import './styles/Global.css';
import Logo from './images/logo.png'
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import Home from "./components/Home";
import CreatePost from "./components/CreatePost";
import Post from './components/Post';
import Registration from './components/Registration';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import Profile from "./components/Profile";
import UpdateProfile from "./components/UpdateProfile";
import {AuthContext} from './helpers/AuthContext';
import {useState, useEffect} from 'react';
import axios from 'axios';
import ExitToApp from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import PostAdd from '@material-ui/icons/PostAdd';
import AccountCircle from '@material-ui/icons/AccountCircle';

function App() {
  const [authState, setAuthState] = useState({
    userName:"", 
    id:0,
    status:false,
  });

  window.onscroll = function () {
    if(document.documentElement.scrollTop > 1) {
      document.getElementById("navbar").style.padding = "0px";
    }else{
      document.getElementById("navbar").style.padding = "20px";
    }
  }

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({userName:"", id:0, status: false});
  };

  useEffect(() => {
    axios.get('http://localhost:3001/auth/auth', { 
      headers: {
        accessToken: localStorage.getItem("accessToken"),
      },
    })
    .then((response) => {
      if(response.data.error){
        setAuthState({...authState, status: false});
        logout();
      }else{
        setAuthState({
          userName: response.data.userName, 
          id: response.data.id,
          status: true,
        });
      }
    });
  }, []);

  

  return <div className="App">
    <AuthContext.Provider value={{authState, setAuthState}}>
      <Router>
        <div className="navbar" id="navbar">
          <div className="leftSide">
            <div className="logoDiv">
              <Link to="/"><img src={Logo} alt="My logo" className="logo"/></Link>
            </div>
            <div className="links">
              {!authState.status || localStorage.getItem("") ? (
                <>
                  <Link to="/login">Connexion</Link>
                  <Link to="/registration">Inscription</Link>
                </>
              ) : (
                <>
                  <Link to="/"><HomeIcon></HomeIcon></Link>
                  <Link to="/createpost"><PostAdd></PostAdd></Link>
                </>
              )}
            </div>
          </div>
          <div className="loggedIn">
            {!authState.status || localStorage.getItem("") ? (
              <>
              </>
            ) : (
              <>
                <h1>{authState.userName}</h1>
                <Link to={`/profile/${authState.id}`}>
                  <AccountCircle></AccountCircle>
                </Link>
                <Link to={'/login'}>
                  {authState.status && <ExitToApp onClick={logout}></ExitToApp>}
                </Link>
              </>
            )}
            
          </div>
        </div>
        
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/createpost" exact component={CreatePost}/>
          <Route path="/post/:id" exact component={Post}/>
          <Route path="/registration" exact component={Registration}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/profile/:id" exact component={Profile}/>
          <Route path="/updateprofile" exact component={UpdateProfile}/>
          <Route path="*" exact component={PageNotFound}/>
        </Switch>
        <div className="footerDiv">
          <Link to="/"><img src={Logo} alt="logo-groupomania"></img></Link>
        </div>

      </Router>
    </AuthContext.Provider>
  </div>;
}

export default App;
