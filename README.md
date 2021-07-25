# Groupomania---Fullstack

Création d'un réseau social pour l'entreprise Groupomania

<b>1/ Cloner le projet</b>

<b>2/ Créer un dossier config à la racine du dossier server contenant un fichier config.json contenant le code ci-dessous :<b> 

<p>
  {</br>
    "development": {</br>
      "username": "votre identifiant",</br>
      "password": "votre mot de passe",</br>
      "database": "nom de votre BDD",</br>
      "host": "hebergement de votre BDD",</br>
      "dialect": "mysql"</br>
    },</br>
    "test": {</br>
      "username": "root",</br>
      "password": null,</br>
      "database": "database_test",</br>
      "host": "127.0.0.1",</br>
      "dialect": "mysql"</br>
    },</br>
    "production": {</br>
      "username": "root",</br>
      "password": null,</br>
      "database": "database_production",</br>
      "host": "127.0.0.1",</br>
      "dialect": "mysql"</br>
    }</br>
  }</br>
</p>
</br>
<b>3/ Créer un fichier .env à la racine du dossier server et préciser la valeur de la variable d'environnement TOKEN<b></br></br>

  --> SECRET_TOKEN ="votre valeur"

<b>4/ Côté serveur <b></br></br>
  --> npm install express</br>
  --> npm start</br>
  

<b>5/ Côté client<b></br></br>
  --> npm install --save-dev nodemon</br>
  --> npm start</br>
