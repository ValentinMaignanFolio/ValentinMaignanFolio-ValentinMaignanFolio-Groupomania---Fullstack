import '../styles/PageNotFound.css';
import React from 'react'
import {Link} from "react-router-dom";
import Error from '@material-ui/icons/Error';

/*Si page introuvable redirection vers la page d'accueil proprosée*/

function PageNotFound(){
    return (
        <div className="pageNotFound">
            <Error></Error>
            <h1>Erreur 404 - Page non trouvée :/</h1>
            <h3>
                {""}
                Retournez à la page d'accueil : <Link to="/">Page d'accueil</Link>
            </h3>
        </div>
    )
}

export default PageNotFound