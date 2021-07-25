const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const {validateToken} = require('../middlewares/AuthMiddleware');
const {sign} = require('jsonwebtoken');
require('dotenv').config()


router.post("/", async (req, res) => {
    const {userName, password, bio, image} = req.body;
    const user = await Users.findOne({where: {userName: userName}})

    if(user) res.json({error: "Utilisateur déjà existant"});

    if(!user){
        bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            userName: userName,
            password: hash,
            bio: bio,
            image: image,
        });
        res.json({message:"Félicitations ! Votre profil a été créé. Veuillez vous connecter pour accéder au réseau interne d'échange de Groupomania"});
        });
    }
});

/*router.get('/auth', async (req, res) => {
    const {userName} = req.body;
    const user = await Users.findOne({where: {userName: userName}});
    if(user) res.json({error: "L'utilisateur est déjà existant"});
});*/

router.post('/login', async (req, res) => {
    const {userName, password} = req.body;
    const user = await Users.findOne({where: {userName: userName}});

    if(!user) res.json({error: "L'utilisateur n'est pas existant"});

    bcrypt.compare(password, user.password).then((match) => {
        if(!match) res.json({error:"Mot de passe incorrect"});

        const accessToken = sign({userName: user.userName, id: user.id}, 
        "importantsecret"
        );
        res.json({token: accessToken, userName: userName, id: user.id});
    });
});

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user)
});

router.get("/basicInfo/:id", async (req, res) => {
    const id = req.params.id;
    const basicInfo = await Users.findByPk(id, 
        {attributes: {exclude: ['password']},
    });

    res.json(basicInfo);
})

router.put('/updatepassword', validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await Users.findOne({where: {userName: req.user.userName}});

    bcrypt.compare(oldPassword, user.password).then((match) => {
        if(!match) res.json({error:"Le mot de passe entré est incorrect !"});
        
        bcrypt.hash(newPassword, 10).then((hash) => {
            Users.update({password: hash}, {where: {userName: req.user.userName}})
            res.json("Le mot de passe a bien été mis à jour");
        });
    });
});


router.put('/updatebio', validateToken, async (req, res) => {
    const {newBio} = req.body;
    const user = await Users.findOne({where: {userName: req.user.userName}});
    console.log(user);
    Users.update({bio: newBio}, {where: {userName: req.user.userName}})
    res.json("Votre nom utilisateur a été modifié");
});

router.put('/updateimage', validateToken, async (req, res) => {
    const {newImage} = req.body;
    const user = await Users.findOne({where: {userName: req.user.userName}});
    console.log(user);
    Users.update({image: newImage}, {where: {userName: req.user.userName}})
    res.json("Votre nom utilisateur a été modifié");
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    await Users.destroy({
        where: {
            id: id,
        },
    });
    res.json("Commentaire supprimé !");
})

module.exports = router;