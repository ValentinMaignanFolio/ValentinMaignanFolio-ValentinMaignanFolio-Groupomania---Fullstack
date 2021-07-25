import '../styles/CreatePost.css';
import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useHistory, Link} from "react-router-dom";
import Visibility from '@material-ui/icons/Visibility';


function CreatePost(){
    
    const [title, setTitle] = useState("");
    const [postText, setPostText] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    /*Upload des images via le service en ligne cloudinary*/

    const uploadImage = e => {
        const files = e.target.files[0];
        const formData = new FormData();
        formData.append("upload_preset", "bb95dr82");
        formData.append("file", files);
        setLoading(true);

        axios.post(`https://api.cloudinary.com/v1_1/opcprojet7-socialmedia/image/upload`, formData)
            .then(res => setImage(res.data.secure_url))
            .then(setLoading(false))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        if(!localStorage.getItem("accessToken")){
            history.push("/login");
        }
    }, []);
 
    
    /*Au submit vérification de la validité des différents champs du formulaire*/

    const post = () => {
        axios.post(
            "http://localhost:3001/posts", 
            {
                title: title, 
                postText: postText,
                image: image,
            },
            {
                headers: {accessToken: localStorage.getItem('accessToken'),
            },
        }).then((response) => {
            alert("Votre actualité a été ajoutée");
            document.getElementById('formPost').style.display = "none";
            document.getElementById('linkBackHome').style.display = "block";
        });
    }

    const submit = e => {
        
        let count = 0;

        if(title.length > 15 || title.length < 5){
            document.getElementById('titleMessage').style.color = "red";
            e.preventDefault();
           
        }else{
            count++;
            console.log(count);
            document.getElementById('titleMessage').style.color = "green";
        }

        if(postText.length > 300 || postText.length < 30){
            document.getElementById('postTextMessage').style.color = "red";
            e.preventDefault();
           
        }else{
            count++;
            console.log(count);
            document.getElementById('postTextMessage').style.color = "green";
        }


        if(count === 2){
            e.preventDefault();
            post();
        }
    }

    let history = useHistory();

   
    return (
    
    <div className="createPostPage">
        <Link to="/"> Retour Accueil</Link>
        <form className="formPost" id="formPost">
            <label>Image ou Gif (optionnel)</label>
            <p id="uploadMessage">Attendre que la photo apparaisse pour valider</p>
            {loading ? <h1>Loding...</h1>:<img className="settings-image" src={image}/>}
            <input className="uploadImage" type="file" name="file" onChange={uploadImage}/>
            
            <label>Title :</label>
            <p id="titleMessage">Entre 5 et 15 caractères</p>
            <input
                type="text"
                placeholder="title"
                onChange={(event) => {
                    setTitle(event.target.value);
                }}
            />
            <label>Poste :</label>
            <p id="postTextMessage">Décrivez votre contenu (30 à 300 caractères)</p>
            <input
                type="text"
                placeholder="postText"
                onChange={(event) => {
                    setPostText(event.target.value);
                }}
            />
            
            <button onClick={submit}>Submit</button>
        </form>
        <div id="linkBackHome">
        
            <Link to='/'>
                <Visibility></Visibility>
                <p>Voir le poste</p>
            </Link>
        </div>
    </div>
    );
}

export default CreatePost;

