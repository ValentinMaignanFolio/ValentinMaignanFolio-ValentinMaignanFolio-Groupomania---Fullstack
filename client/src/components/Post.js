import '../styles/Post.css';
import React, {useContext, useEffect, useState} from 'react';
import {useParams, useHistory, Link} from "react-router-dom";
import axios from 'axios';
import {AuthContext} from '../helpers/AuthContext';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Send from '@material-ui/icons/Send';
import DayJS from 'react-dayjs';

function Post(){
    
    let{id} = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const {authState} = useContext(AuthContext);
    const [newImage, setNewImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newPostText, setNewPostText] = useState("");


    /* Upload de l'image et envoi de l'url à cloudinary*/

    const uploadImage = e => {
        const files = e.target.files[0];
        const formData = new FormData();
        formData.append("upload_preset", "bb95dr82");
        formData.append("file", files);
        setLoading(true);

        axios.post(`https://api.cloudinary.com/v1_1/opcprojet7-socialmedia/image/upload`, formData)
            .then(res => setNewImage(res.data.secure_url))
            .then(setLoading(false))
            .catch(err => console.log(err));
    }


    let history = useHistory();

    /* Récupération des composants du post sur la BDD ainsi que les commentaires liés*/

    useEffect(() => {
        if(!localStorage.getItem("accessToken")){
            history.push('/login');
        }else{
            axios.get(`http://localhost:3001/posts/${id}`).then((response) => {
            setPostObject(response.data);
        });

            axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
        });
        }
    }, []);

    /*Définition de la logique pour l'ajout d'un commentaire*/

    const addComment = () => {
        axios
            .post("http://localhost:3001/comments", {
                commentBody: newComment, 
                PostId: id,
            },
            {
                headers: {
                    accessToken: localStorage.getItem("accessToken"),
                },
            }
            )
            .then((response) => {
                if(response.data.error){
                    alert("Vous devez être connecté");
                } else{
                    const commentToAdd = {commentBody: newComment, userName: response.data.userName};
                    setComments([...comments, commentToAdd]);
                    setNewComment("");
                }
            });
    };

    /*Définition de la logique pour la suppression d'un commentaire*/

    const deleteComment = (id) => {
        axios
            .delete(`http://localhost:3001/comments/${id}`, {
                headers: {accessToken: localStorage.getItem('accessToken')},
            })
            .then(() => {
                setComments(comments.filter((val) => {
                    return val.id != id;
                })
            );
        });
    };


    /*Définition de la logique pour la suppression d'un poste'*/

    const deletePost = (id) => {
        alert("Votre post sera définitivement supprimé");
        axios.delete(`http://localhost:3001/posts/${id}`, {
            headers: {accessToken: localStorage.getItem('accessToken')},
        }).then(() => {
            history.push("/");
        });
    };

    /*Définition de la logique pour l'édition d'un poste'*/

    const editPost = (option) => {
        if(option === "title"){
            if(newTitle.length < 5 || newTitle > 15){
                alert("Le titre doit comporter entre 5 et 15 caractères");
            }else{
                axios.put(
                    "http://localhost:3001/posts/title", 
                    {
                        newTitle: newTitle, 
                        id: id,
                    },
                    {
                        headers: {accessToken: localStorage.getItem('accessToken')},
                    }
                );
            }
            

        setPostObject({...postObject, title: newTitle});

        }else if(option === "postText"){
            if(newPostText.length < 300 || newPostText > 30){
                alert("Le descriptif doit comporter entre 30 et 300 caractères");
            }else{
                axios.put(
                    "http://localhost:3001/posts/postText", 
                    {
                        newText: newPostText, 
                        id: id,
                    },
                    {
                        headers: {accessToken: localStorage.getItem('accessToken')},
                    }
                );
            } 
        
        setPostObject({...postObject, postText: newPostText});

        }else{
            axios.put(
                "http://localhost:3001/posts/image", 
                {
                    newImage: newImage, 
                    id: id,
                },
                {
                    headers: {accessToken: localStorage.getItem('accessToken')},
                }
            );
        
        setPostObject({...postObject, image: newImage});
        document.getElementById("uploadImageView").style.display = "none";
        }
    };

    /*Si la personne connectée est la même que la personne qui souhaite éditée ou qu'il s'agit de l'Admin alors options d'édition et de suppression possibles*/
    /*Sinon seulement possibilité de regarder le poste, de le commenter ou retirer un de ses commentaires précédents*/

    if(authState.userName === postObject.userName || authState.userName === "Admin"){
        return(
        <div className="postPage">
            <div className="topPost">
                <span className="datePost">
                    <DayJS format="DD-MM-YYYY à HH:mm">{postObject.createdAt}</DayJS>
                </span>
                <div className="title">
                    {postObject.title}
                </div>
                <div className="updatePost">
                    <input 
                        className="newtitle"
                        type="text"
                        placeholder="Modifier le titre ici (5 à 15 caractères)..."
                        onChange={(event) => {
                            setNewTitle(event.target.value);
                        }}
                    >   
                    </input>
                    <button className="updateBtn" onClick={() => {
                        editPost("title");
                    }}>Ok</button>
                </div>
                <div className="postText">{postObject.postText}</div>
                <div className="updatePost">
                    <input 
                        className="newpostText"
                        type="text"
                        placeholder="Modifier le texte de la publication ici (30 à 300 caractères)..."
                        onChange={(event) => {
                            setNewPostText(event.target.value);
                        }}
                    > 
                    </input>
                    <button className="updateBtn" onClick={() => {
                        editPost("postText")
                    }}>Ok</button>
                </div>
                
                <div className="postPicture">
                    <img id="postImage" src={postObject.image}/>
                    <div className="updatePostPicture">
                        <input className="uploadImage" id="uploadImage" type="file" name="Nouvelle image" onChange={uploadImage} onClick={() => {
                        document.getElementById("uploadImageView").style.display = "block"}}/>
                        {loading ? <h1>Loding...</h1>:<img id="uploadImageView" className="settings-image" src={newImage}/>}
                        <button onClick={() => {
                                editPost("image")
                        }}>Remplacer l'image</button>
                    </div>
                </div>

                <div className="userName">
                    @ {postObject.userName} 
                </div>
            </div>
            <div className="bottomPost">
                <div className="addComment">
                    <input 
                        type="text" 
                        placeholder="Votre commentaire..." 
                        autoComplete="off" 
                        value={newComment} 
                        onChange={(event) => {
                            setNewComment(event.target.value);
                        }}
                    />
                    <button className="send" onClick={addComment}>Envoyer <Send/></button>
                </div>
                <div className="listofComment">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment">
                                <div className="bodycomment">
                                <label>{comment.userName} : </label>
                                {comment.commentBody}
                                </div>
                                    <DeleteForever onClick={() => {deleteComment(comment.id)}}/>
                            </div>
                        );
                    })};
                </div>
            </div>
            <div className="deletePost">
            <Link to="/"><button className="postButtons postBtn-1">Retour Accueil</button></Link>
            <button className="postButtons postBtn-2"
                onClick={() => {
                    deletePost(postObject.id);
                }}
                >Supprimer le post
            </button>
            </div>
        </div>
    )

    /*Contenu si la personne connectée n'est pas celle ayant créé le post*/
    
    }else{
        return(
            <div className="postPage">
                <div className="topPost">
                    <span className="datePost">
                        <DayJS format="DD-MM-YYYY à HH:mm">{postObject.createdAt}</DayJS>
                    </span>
                    <div className="title">     
                        {postObject.title}
                    </div>
                    <div className="postText">
                        {postObject.postText}
                    </div>
                    
                    <div className="postPicture">
                        <img src={postObject.image}/>
                    </div>
                    <div className="userName">
                        @ {postObject.userName} 
                    </div>
                </div>
                <div className="bottomPost">
                    <div className="addComment">
                        <input 
                            type="text" 
                            placeholder="Votre commentaire..." 
                            autoComplete="off" 
                            value={newComment} 
                            onChange={(event) => {
                                setNewComment(event.target.value);
                            }}
                        />
                        <button className="send" onClick={addComment}>Envoyer <Send/></button>
                    </div>
                    <div className="listofComment">
                        {comments.map((comment, key) => {
                            return (
                                <div key={key} className="comment">
                                    <div className="bodycomment">
                                    <label>{comment.userName} : </label>
                                    {comment.commentBody}
                                    </div>
                                    {authState.userName === comment.userName && (
                                        <DeleteForever onClick={() => {deleteComment(comment.id)}}/>
                                    )}
                                </div>
                            );
                        })};
                    </div>
                </div>
                <Link to="/"><button className="postButtons postBtn-1">Retour Accueil</button></Link>
            </div>
        )
    }
}

export default Post
