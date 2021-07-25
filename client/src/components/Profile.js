import '../styles/Profile.css';
import React, { useEffect, useState, useContext } from 'react';
import {useParams, useHistory} from 'react-router-dom';
import axios from 'axios';
import {AuthContext} from '../helpers/AuthContext';
import DayJS from 'react-dayjs';


function Profile(){

    let {id} = useParams();
    let history = useHistory();
    const [userName, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const {authState} = useContext(AuthContext);
    const [image, setImage] = useState("");

    /*Récupération des infos du profil et de la liste de ses posts effectués pour affichage*/

    useEffect(() => {
        if(!localStorage.getItem("accessToken")){
            history.push('/login');
        }else{
            axios.get(`http://localhost:3001/auth/basicInfo/${id}`).then((response) => {
                setUserName(response.data.userName);
                setBio(response.data.bio);
                setImage(response.data.image);
            });
    
            axios.get(`http://localhost:3001/posts/byuserId/${id}`).then((response) => {
                setListOfPosts(response.data);
            });
        }
    }, []);
        
        

    /*Possibilité de supprimer son profil si connecté*/

    const deleteProfile = (id) => {
        axios.delete(`http://localhost:3001/auth/${id}`);
        localStorage.removeItem("accessToken");
        history.push("/login");
    }
    
    
    return (
        <div className="profilepage">
            <div className="profileInformations">
                <h1>Découvrez le profil de @{userName} </h1>
                <div className="basicInfo">
                    {""}
                    <img className="profilePicture" src={image}></img>
                    <p>{bio}</p>
                </div>
                <div className="updateDeleteProfile">
                    {authState.userName === userName && (
                        <button onClick={() => {deleteProfile(id)}}>Supprimer mon profil</button>
                    )}
                    {authState.userName === userName && (
                        <button onClick={() => {
                            history.push("/updateprofile");
                        }}>Modifier mon profil</button>
                    )}
                </div>
            </div>
            <div className="listOfPosts">
                {listOfPosts.map((value, key) =>  { 
                    return (
                        <div
                            key={key}
                            className="post" 
                        >
                            <span className="datePost">
                                <DayJS format="DD-MM-YYYY à HH:mm">{value.createdAt}</DayJS>
                            </span>
                            <div className="title">{value.title}</div>
                            <div 
                                className="postText"
                                onClick={() => {
                                    history.push(`/post/${value.id}`)
                                }}
                            >
                                {value.postText}
                            </div>
                            <div className="postPicture"
                                onClick={() => {
                                    history.push(`/post/${value.id}`)
                                }}
                            >
                                <img src={value.image}></img>
                            </div>
                            <div className="footer">
                                <div className="username">
                                    @ {value.userName}
                                </div>
                                <div className="buttons">
                                    <label>Nombre de likes : {value.Likes.length}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Profile;