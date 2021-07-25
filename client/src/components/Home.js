import '../styles/Home.css';
import React, {useContext} from 'react'
import axios from "axios";
import {useEffect, useState} from "react";
import {useHistory, Link} from "react-router-dom";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatRounded from '@material-ui/icons/ChatRounded';
import Eject from '@material-ui/icons/Eject';
import {AuthContext} from '../helpers/AuthContext';
import DayJS from 'react-dayjs';


function Home(){
    
    const [listOfPosts, setListOfPosts] = useState ([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("")
    const {authState} = useContext(AuthContext);
    let history = useHistory()


    /*Récupération des posts en BDD */

    useEffect(() => {
        if(!localStorage.getItem("accessToken")){
            history.push('/login');
        }else{
        axios.get("http://localhost:3001/posts",
            {headers: {accessToken: localStorage.getItem("accessToken")}}
            ).then((response) => {
                setListOfPosts(response.data.listOfPosts);
                setLikedPosts(
                    response.data.likedPosts.map((like) => {
                        return like.PostId;
                    })
                );
            });
        }
    }, []);

    /*Récupération des likes liés aux posts pour affichage*/

    const likePost = (postId) => {
        axios.post(
            "http://localhost:3001/likes", 
            {PostId: postId}, 
            {headers: {accessToken: localStorage.getItem("accessToken")}}
        ).then((response) => {
            setListOfPosts(listOfPosts.map((post) => {
                if(post.id === postId){
                    if(response.data.liked){
                        return {...post, Likes: [...post.Likes, 0]};
                    }
                    else{
                        const likesArray = post.Likes;
                        likesArray.pop();
                        return {...post, Likes: likesArray};
                    }
                    
                }else{
                    return post;
                }
            }));
            if(likedPosts.includes(postId)) {
                setLikedPosts(
                    likedPosts.filter((id) => {
                        return id !== postId;
                    })
                );
            }else{
                setLikedPosts([...likedPosts, postId]);
            }
        });
    };
  
    /*Mise en place d'un filtre pour rechercher les utilisateurs actifs*/

    const handleSearchTerm = (event) => {
        let value = event.target.value;
        setSearchTerm(value);
    };

    

    return (
        <div className="homePage">
            <div className="searchBar">
                <button onClick={() => {
                    document.getElementById("postsResearch").style.display = "none";
                    document.getElementById("profileResearch").style.display = "block";
                    document.getElementById("contentResearch").style.display = "none";
                    document.getElementById("searchBar").style.border = "solid #ED9F9F 4px";
                    document.getElementById("profileSearchLabel").style.display = "block";
                    document.getElementById("postsSearchLabel").style.display = "none";
                    document.getElementById("contentSearchLabel").style.display = "none";
                    document.getElementById("closeResearch").style.display = "block";
                }}>Rechercher un utilisateur</button>
                <button onClick={() => {
                    document.getElementById("profileResearch").style.display = "none";
                    document.getElementById("postsResearch").style.display = "block";
                    document.getElementById("contentResearch").style.display = "none";
                    document.getElementById("searchBar2").style.border = "solid #ED9F9F 4px";
                    document.getElementById("profileSearchLabel").style.display = "none";
                    document.getElementById("postsSearchLabel").style.display = "block";
                    document.getElementById("contentSearchLabel").style.display = "none";
                    document.getElementById("closeResearch").style.display = "block";
                }}>Rechercher une publication</button>
                    <button onClick={() => {
                    document.getElementById("profileResearch").style.display = "none";
                    document.getElementById("postsResearch").style.display = "none";
                    document.getElementById("contentResearch").style.display = "block";
                    document.getElementById("searchBar3").style.border = "solid #ED9F9F 4px";
                    document.getElementById("profileSearchLabel").style.display = "none";
                    document.getElementById("postsSearchLabel").style.display = "none";
                    document.getElementById("contentSearchLabel").style.display = "block";
                    document.getElementById("closeResearch").style.display = "block";
                }}>Rechercher du contenu</button>
                <label id="profileSearchLabel">Rechercher un utilisateur</label>
                <div id="profileResearch">
                    <input
                        type="text"
                        name="searchBar"
                        id="searchBar"
                        placeholder="Rechercher un profil utilisateur"
                        onChange = {handleSearchTerm}
                    />
                    <div className="search_results">
                        {listOfPosts
                        .filter((val) => {
                            return val.userName.toLowerCase().includes(searchTerm.toLowerCase());
                        })
                        
                        .map((val) => {
                            return <div className="search_result" key={val.id} onClick={() => {
                                history.push(`/profile/${val.UserId}`)
                            }}>@{val.userName}</div>;
                        })}
                        
                    </div>
                </div>
                <label id="postsSearchLabel">Rechercher une publication</label>
                <div id="postsResearch">
                    <input
                        type="text"
                        name="searchBar"
                        id="searchBar2"
                        placeholder="Rechercher une publication"
                        onChange = {handleSearchTerm}
                    />
                    <div className="search_results">
                        {listOfPosts
                        .filter((val) => {
                            return val.title.toLowerCase().includes(searchTerm.toLowerCase());
                        })
                        
                        .map((val) => {
                            return <div className="search_result" key={val.id} onClick={() => {
                                history.push(`/post/${val.id}`)
                            }}>{val.title}</div>;
                        })}
                        
                    </div>
                </div>
                <label id="contentSearchLabel">Rechercher un contenu</label>
                <div id="contentResearch">
                    <input
                        type="text"
                        name="searchBar"
                        id="searchBar3"
                        placeholder="Rechercher une publication"
                        onChange = {handleSearchTerm}
                    />
                    <div className="search_results">
                        {listOfPosts
                        .filter((val) => {
                            return val.title.toLowerCase().includes(searchTerm.toLowerCase());
                        })
                        
                        .map((val) => {
                            return <div className="search_result" key={val.id} onClick={() => {
                                history.push(`/post/${val.id}`)
                            }}>{val.postText}</div>;
                        })}
                    </div>
                </div>
                <div id="closeResearch" onClick={() => {
                    document.getElementById("postsResearch").style.display = "none";
                    document.getElementById("contentResearch").style.display = "none";
                    document.getElementById("profileResearch").style.display = "none";
                    document.getElementById("profileSearchLabel").style.display = "none";
                    document.getElementById("postsSearchLabel").style.display = "none";
                    document.getElementById("contentSearchLabel").style.display = "none";
                    document.getElementById("closeResearch").style.display = "none";
                }}><Eject></Eject></div>
            </div>
            <div className="post-list">
                {listOfPosts.map((value, key) =>  { 
                    return (
                        <div
                            key={key}
                            className="post" 
                        >
                            <span className="datePost">
                                <DayJS format="DD-MM-YYYY à HH:mm">{value.createdAt}</DayJS>
                            </span>
                            <div 
                                className="title"
                                onClick={() => {
                                    history.push(`/post/${value.id}`)
                                }}
                            >
                                {value.title}
                                </div>
                            <div 
                                className="postText"
                                onClick={() => {
                                    history.push(`/post/${value.id}`)
                                }}
                            >
                                {value.postText}
                            </div>
                            <div className="postPicture">  
                                <img 
                                    onClick={() => {
                                        history.push(`/post/${value.id}`)
                                    }}
                                    src={value.image}>
                                </img>
                            </div>
                            <div className="footer">
                                <div className="username">
                                    <Link to={`/profile/${value.UserId}`}> @ {value.userName}</Link>
                                </div>
                                <div className="comments">
                                    <ChatRounded
                                        onClick={() => {
                                            history.push(`/post/${value.id}`)
                                        }}
                                />
                                </div>
                                <div className="buttons">
                                    <ThumbUpAltIcon
                                        onClick={() => {
                                            likePost(value.id);
                                        }}
                                        className={likedPosts.includes(value.id) ? "unlikeBtn" : "likeBtn"}
                                    />
                                    <label>{value.Likes.length}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home