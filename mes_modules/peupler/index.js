function randomXToY(minVal, maxVal) {
    let ranVal = minVal+(Math.random()*(maxVal-minVal));
    return Math.round(ranVal);
}


let creerListe = () => {

    const tableau = require('./tableaux');
    let liste = [];
    for(i=0; i<10; i++) {
        let personne = {};
        personne.prenom = tableau.prenom[Math.floor(Math.random() * tableau.prenom.length)];

        personne.nom = tableau.nom[Math.floor(Math.random() * tableau.nom.length)];
        
        personne.telephone = tableau.telephone[Math.floor(Math.random() * tableau.telephone.length)] + " " + randomXToY(100, 999).toString() + "-" + randomXToY(1000, 9999).toString() ;

        personne.courriel = personne.nom + personne.prenom + tableau.courriel[Math.floor(Math.random() * tableau.courriel.length)];        

        liste.push(personne);
    }

    return liste;

}

module.exports = creerListe;