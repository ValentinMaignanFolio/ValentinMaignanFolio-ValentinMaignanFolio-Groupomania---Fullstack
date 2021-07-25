import '../styles/Registration.css';
import React from 'react';
import axios from 'axios';
import {useHistory, Link} from "react-router-dom";
import { useState, useEffect } from 'react';

function Registration(){
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [bio, setBio] = useState("");
    const [usersNameList, setUsersNameList] = useState("")

    /*Ajout d'une image de profil via cloudinary*/

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
            history.push("/registration");
        }
    }, []);

    const registration = () => {
        const data = {
            userName: userName, 
            password: password,
            image: image,
            bio: bio,
        }
        axios.post("http://localhost:3001/auth", data)
        .then((response) => {
            if(response.data.error){
                document.getElementById('pseudoMessage').style.color="red";
                alert(response.data.error);
                
            }else{
                history.push('/login');
                alert(response.data.message);
            }
        });
    }


    const submit = e => {

            let count = 0;

            

            // Vérification de la présence de l'ensemble des champs //
            if(!password || !userName || !bio || !image){
                alert("Ajouter tous les éléments au format requis");
                e.preventDefault();
            }else{
                count++;
                console.log(count);
            }

            // Vérification du niveau de complexité du mot de passe //
            if(password.length < 8 || 
                password.length > 25 ||
                !password.match(/[0-9]/g) ||
                !password.match(/[A-Z]/g) ||
                !password.match(/[a-z]/g) ||
                !password.match(/[^a-zA-Z\d]/g)){
                document.getElementById('passwordMessage').style.color="red";
                e.preventDefault();

            }else{
                count++;
                console.log(count);
                document.getElementById('passwordMessage').style.color="green";
            }


            // Vérification de la longueur du pseudo
            if(userName.length > 15 || userName.length < 5){
                document.getElementById('pseudoMessage').style.color = "red";
                e.preventDefault();
            }else{
                count++;
                console.log(count);
                document.getElementById('pseudoMessage').style.color = "green";
            }

            // Vérification de la longueur de la bio // 
            if(bio.length > 100 || bio.length < 30){
                document.getElementById('bioMessage').style.color = "red";
                e.preventDefault();
               
            }else{
                count++;
                console.log(count);
                document.getElementById('bioMessage').style.color = "green";
            }
            // Vérification de la présence de l'image // 

            if(!image){
                document.getElementById('imageMessage').style.color = "red";
                e.preventDefault();
            }else{
                count++;
                console.log(count);
                document.getElementById('imageMessage').style.color = "green";
            }

            // Si toutes les conditions de validité sont remplies --> envoi vers la BDD // 
            if(count === 5){
               registration()
               e.preventDefault();
            }
    }

    let history = useHistory();
   
    return (
    
    <div className="registrationPage">
        <div className="registrationForm">
            <form className="formProfile">
            <label>Photo de profil</label>
            <p id="imageMessage">Choisissez votre plus beau profil !</p>
                <div className="uploadProfileImage">
                    {loading ? <h1>Loding...</h1>:<img className="settings-image profilePicture" src={image}/>}
                    <input className="uploadImage" type="file" name="file" onChange={uploadImage}/>
                </div>
                <label>Pseudo</label>
                <p id="pseudoMessage">Doit contenir entre 5 et 15 caractères</p>
                <input
                    type="text"
                    placeholder="Pseudo"
                    required
                    onChange={(event) => {
                        setUserName(event.target.value);
                    }}
                />
                <label>Mot de passe :</label>
                <p id="passwordMessage">(Entre 8 et 25, 1 Majuscule, 1 Minuscule, 1 caractère spécial, 1 chiffre)</p>
                <input
                    type="password"
                    placeholder="Mot de passe"
                    required
                    onChange={(event) => {
                        setPassword(event.target.value);
                    }}
                />
                <label>Bio :</label>
                <p id="bioMessage">Entre 30 et 100 caractères demandés</p>
                <input
                    type="text"
                    id="bioInput"
                    placeholder="Bio"
                    required
                    onChange={(event) => {
                        setBio(event.target.value);
                    }}
                />
                <Link to='/'>
                <button onClick={submit}>Inscription</button>
                </Link>
            </form>
        </div>
    </div>
    );
}

export default Registration;


