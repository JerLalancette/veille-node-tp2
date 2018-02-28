const express = require('express');
const i18n = require("i18n");
const cookieParser = require("cookie-parser");
const app = express();
const fs = require('fs');
app.use(express.static('public'));
app.use(cookieParser());

i18n.configure({ 
    locales : ['fr', 'en'],
    cookie : 'langueChoisie', 
    directory : __dirname + '/locales' });

app.use(i18n.init);

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var util = require("util");

app.set('view engine', 'ejs'); // générateur de template


app.get('/:locale(en|fr)',  (req, res) => {
    // on récupère le paramètre de l'url pour enregistrer la langue
    console.log(req.params.locale)
    res.cookie('langueChoisie' , req.params.locale)
    res.setLocale(req.params.locale);
    // on peut maintenant traduire
    console.log(res.__('courriel'));

    res.redirect("/");
  })

const peupler = require('./mes_modules/peupler');

app.get("/peupler", (req, res) => {

    let resultat = peupler();

    console.log("debut boucle");
    db.collection('adresse').insert(resultat, (err, result) => {
        if (err) return console.log(err);
        res.redirect('/');
    })
})

app.get('/formulaire', (req, res) => {
    console.log(__dirname);
    res.render("formulaire");
})

app.get('/accueil', (req, res) => {
    console.log(__dirname);
    res.render("Accueil");
})

app.get("/vider", (req, res) => {
    db.collection('adresse').drop((err, result) => {
        if (err) return console.log(err);
        res.redirect('/');
    })
})

app.post('/ajouter', (req, res) => {
    db.collection('adresse').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('sauvegarder dans la BD')
    res.redirect('/')
    })
})

app.get('/detruire/:_id', (req, res) => {

    db.collection('adresse').findOneAndDelete( {_id: ObjectID(req.params._id)} ,(err, resultat) => {

        if (err) return console.log(err)

        res.redirect('/')
    }) 
})

/*---------------profil----------------*/ 
app.get('/profil/:id', (req, res) => {

	db.collection('adresse').find( {_id: ObjectID(req.params.id)} ).toArray((err, resultat) =>{
		if (err) return console.log(err)
		res.render('profil.ejs', {adresses: resultat[0]})
	})
})


/*---------------rechercher----------------*/ 
app.post('/recherche', (req, res) => {

	db.collection('adresse').find( {prenom: req.body.prenom} ).toArray((err, resultat) =>{
		if (err) return console.log(err)
		res.render('gabarit.ejs', {adresses: resultat,  ordre:'asc'})
	})
})

app.get('/trier/:clef/:ordre', (req, res) => {

    let clef = req.params.clef
    let ordre = (req.params.ordre == 'asc' ? 1 : -1)
    let cursor = db.collection('adresse').find().sort(clef,ordre).toArray(function(err, resultat){

        if (err) return console.log(err)
        ordre = (req.params.ordre == 'asc' ? 'des' : 'asc');
        res.render('gabarit.ejs', {adresses: resultat, clef, ordre:ordre});
    })
})

app.post('/modifier', (req, res) => {
    console.log('req.body' + req.body)

        if (req.body['_id'] != undefined) { 
            console.log('sauvegarde') 
            var oModif = {
                "_id": ObjectID(req.body['_id']), 
                prenom:req.body.prenom, 
                nom: req.body.nom,
                telephone:req.body.telephone,
                email:req.body.email
            }
            
            
        }
    db.collection('adresse').save(oModif, (err, result) => {
        if (err) return console.log(err)
        console.log('sauvegarder dans la BD')
        res.redirect('/')
    })
})

app.get('/', (req, res) => {
    let cursor = db.collection('adresse')
                .find().toArray(function(err, resultat){
        if (err) return console.log(err)
        // transfert du contenu vers la vue index.ejs (renders)
        // affiche le contenu de la BD
        res.render('gabarit.ejs', {adresses: resultat, ordre:'asc'})
        console.log(req.cookies.langueChoisie);
 }) 
})

let db // variable qui contiendra le lien sur la BD

MongoClient.connect('mongodb://127.0.0.1:27017/carnet_adresse', (err, database) => {
    if (err) return console.log(err)
        db = database.db('carnet_adresse')
        // lancement du serveur Express sur le port 8081
        app.listen(8081, () => {
        console.log('connexion à la BD et on écoute sur le port 8081')
    })
})