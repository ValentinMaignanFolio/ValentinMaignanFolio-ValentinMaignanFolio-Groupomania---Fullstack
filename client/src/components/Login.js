import '../styles/Login.css';
import React, {useState, useContext} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../helpers/AuthContext';

function Login(){
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext)

    let history = useHistory();


    /* Récupération du pseudo et du mot de passe pour comparaison*/
    
    const login = () => {
        const data = {userName: userName, password: password};
        axios.post("http://localhost:3001/auth/login", data).then((response) => {
            if(response.data.error) {
                alert(response.data.error);
            }else{
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({userName: response.data.userName, id: response.data.id, status:true});
                history.push("/");
            }
        });
    };
    return (
        <div className="loginPage">
            <div className="loginForm">
                <label>Nom utilisateur :</label>
                <input 
                    type="text"
                    placeholder="Nom utilisateur (ex: Charlie)"
                    onChange={(event) => {
                        setUsername(event.target.value);
                    }}
                />
                <label>Mot de passe :</label>
                <input 
                    type="password"
                    placeholder="Votre mot de passe"
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />

                <button onClick={login}>Connexion</button>
            </div>
        </div>
    );
}

export default Login;