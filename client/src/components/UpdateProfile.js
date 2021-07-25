import '../styles/UpdateProfile.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Link, useHistory} from "react-router-dom";

function UpdateUser(){
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newBio, setNewBio] = useState("")
    const [newImage, setNewImage] = useState("")
    const [loading, setLoading] = useState("")
    let history = useHistory()

    useEffect(() => {
        if(!localStorage.getItem("accessToken")){
            history.push('/login');
        }
    }, []);

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
    
    /*Update du password existant et envoi pour comparaison */

    const updatePassword = () => {
        axios.put(
            "http://localhost:3001/auth/updatepassword", 
            {
                oldPassword: oldPassword, 
                newPassword: newPassword,
            },
            {
                headers: {accessToken: localStorage.getItem('accessToken'),
            },
        }).then((response) => {
            if(response.data.error){
                alert(response.data.error);
            }else{
                alert("Votre profil a été mis à jour");
                localStorage.removeItem("accessToken");
                history.push(`/`);
            }
        });
    }

    /*Update de la description du profil*/

    const updateBio = () => {
        if(newBio.length < 30 || newBio.length > 100){
            document.getElementById("bioMessage").style.color = "red";
        }else{
            axios.put(
                "http://localhost:3001/auth/updatebio", 
                {
                    newBio: newBio,
                },
                {
                    headers: {accessToken: localStorage.getItem('accessToken'),
                },
            }).then((response) => {
                if(response.data.error){
                    alert(response.data.error);
                }else{
                    alert("Votre profil a été mis à jour");
                    history.push(`/`);
                }
            });
        }
            
    }

    /*Update de la photo de profil*/

    const updateImage = () => {
        axios.put(
            "http://localhost:3001/auth/updateimage", 
            {
                newImage: newImage,
            },
            {
                headers: {accessToken: localStorage.getItem('accessToken'),
            },
        }).then((response) => {
            if(response.data.error){
                alert(response.data.error);
            }else{
                alert("Votre profil a été mis à jour");
                history.push(`/`);
            }
        });
    }
    
    return (
        <div className="updatePage">
            <div className="updateSection">
                <div className="profilePicture">
                    <label>Choisir une nouvelle photo de profil</label>
                    <p id="uploadMessage">Attendre que la photo apparaisse pour valider</p>
                    {loading ? <h1>Loding...</h1>:<img className="profilePicture" src={newImage}/>}
                    <input className="uploadImage" type="file" name="file" onChange={uploadImage}/>
                </div>
                <button onClick={updateImage} >Valider la nouvelle photo de profil</button>
                <div className="updateBio">
                    <label>Modifier votre bio</label>
                    <p id="bioMessage">Entre 30 et 100 caractères demandés</p>
                    <input 
                        type="text" 
                        placeholder="Votre nouvelle bio"
                        onChange={(event) => {
                            setNewBio(event.target.value);
                        }}
                    />
                </div>
                <button onClick={updateBio} >Valider les modifications</button>
                <div className="updatePassword">
                    <label>Modifier votre mot de passe</label>
                    <input 
                        type="password" 
                        placeholder="Ancien mot de passe..." 
                        onChange={(event) => {
                            setOldPassword(event.target.value);
                        }}
                    />
                    <input 
                        type="password" 
                        placeholder="Nouveau mot de passe..." 
                        onChange={(event) => {
                            setNewPassword(event.target.value);
                        }}
                    />
                </div>
                <button onClick={updatePassword} >Valider mon nouveau mot de passe</button>
            </div>
        </div>
    );
}

export default UpdateUser;
