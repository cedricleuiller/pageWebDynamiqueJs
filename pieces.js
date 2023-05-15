import { ajoutListenersAvis } from "./avis.js";

// Récupération des pièces depuis le fichier JSON
const fetchPieces = async () => {
    const reponse = await fetch("pieces-autos.json");
    const pieces = await reponse.json();

    return pieces;
}

const pieces = await fetchPieces();

// Création d'une boucle pour la création de balise et l'attachement au DOM

const genererPieces = async (pieces) => {
  
    for (let i = 0; i < pieces.length; i++) {

        const article = pieces[i];
        // Récuperation de l'élément DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".fiches");
        // Création d'une balise dédié à une pièce automobile
        const pieceElement = document.createElement("article");
        // On crée l'élément image 
        const imageElement = document.createElement("img");
        // On accède à l'indice i de la liste pièce pour configurer la source de l'image
        imageElement.src = pieces[i].image;
        // Idem pour le nom, le prix et la catégorie
        const nomElement = document.createElement("h2");
        nomElement.innerText = pieces[i].nom;
    
        const prixElement = document.createElement("p");
        prixElement.innerText = `${pieces[i].prix} € (${pieces[i].prix < 35 ? "€" : "€€€"})`;
    
        const categorieElement = document.createElement("p");
        categorieElement.innerText = pieces[i].categorie ?? "(aucune catégorie)";
    
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = pieces[i].description ?? "(aucune description)";
    
        const stockElement = document.createElement("p");
        stockElement.innerText = pieces[i].disponibilite ? "En stock" : "Rupture de stock";
    
        //ajout des boutons Avis
        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "afficher les avis";
    
        // On attache une balise article à la section fiches
        sectionFiches.appendChild(pieceElement);
        // On attache chaque élément à la balise article parent
        pieceElement.appendChild(imageElement,);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(stockElement);
        pieceElement.appendChild(avisBouton);
    };
    ajoutListenersAvis();
};

genererPieces(pieces);

// Gestion des boutons de filtrages
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener('click', function(){
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function(a, b){
        return a.prix - b.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    const titreTrier = document.createElement("h4");
    titreTrier.innerText = "Pièces triées par prix croissant :";
    document.querySelector(".fiches").appendChild(titreTrier);
    genererPieces(piecesOrdonnees);
});

const boutonDecroissant = document.querySelector(".btn-trier-dec");
boutonDecroissant.addEventListener("click", function(){
    const piecesDecroissantes = Array.from(pieces);
    piecesDecroissantes.sort(function(a,b){
        return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    const titreDesc = document.createElement("h4");
    titreDesc.innerText = "Pièces triées par prix décroissant :";
    document.querySelector(".fiches").appendChild(titreDesc);
    genererPieces(piecesDecroissantes);
});

const boutonFiltrer = document.querySelector(".btn-filtrer");
boutonFiltrer.addEventListener("click", function(){
    const piecesFiltrees = pieces.filter(function(pieces){
        return pieces.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    const titreAbordable = document.createElement("h4");
    titreAbordable.innerText = "Pièces abordables :";
    document.querySelector(".fiches").appendChild(titreAbordable);
    genererPieces(piecesFiltrees);
    console.log(piecesFiltrees);
});

const boutonDescription = document.querySelector(".btn-description");
boutonDescription.addEventListener("click", function(){
    const piecesDescription = pieces.filter(function(pieces){
        return pieces.description;
    });
    document.querySelector(".fiches").innerHTML = "";
    const titreSansDescription = document.createElement("h4");
    titreSansDescription.innerText = "Pièces sans description précise :";
    document.querySelector(".fiches").appendChild(titreSansDescription);
    genererPieces(piecesDescription);
    console.log(piecesDescription);
});

// Récupération des pièces abordables
const noms = pieces.map(piece => piece.nom);
for(let i = pieces.length-1; i >= 0; i--){
    if(pieces[i].prix > 35){
        noms.splice(i, 1);
    };
};

// création de l'en-tête
const pElement = document.createElement("p");
pElement.innerText = "Pièces abordables :";

// Création de la liste
const abordablesElements = document.createElement("ul");
// Ajout de chaques noms à la liste
for(let i = 0; i < noms.length; i++){
    const nomElement = document.createElement("li");
    nomElement.innerText = noms[i];
    abordablesElements.appendChild(nomElement);
};

// Ajout de l'en-tête puis de la liste au bloc resultat filtre
document.querySelector(".abordables").appendChild(pElement).appendChild(abordablesElements);

// Création de la liste des éléments disponible
const nomDisponible = pieces.map(piece => piece.nom);
const prixDisponible = pieces.map(piece => piece.prix);

for(let i = pieces.length-1; i >= 0; i--){
    if(pieces[i].disponibilite === false){
        nomDisponible.splice(i, 1);
        prixDisponible.splice(i, 1);
    };
};

const disponibleElement = document.createElement("ul");

for (let i = 0; i < nomDisponible.length; i++){
    const nomElement = document.createElement("li");
    nomElement.innerText = `${nomDisponible[i]} - ${prixDisponible[i]} €`;
    disponibleElement.appendChild(nomElement);
}

const pElementDisponible = document.createElement("p");
pElementDisponible.innerText = "Pièces disponibles :";

document.querySelector(".disponible").appendChild(pElementDisponible).appendChild(disponibleElement);


// Fonction de filtre de la balise Input range 
const prixMaxInput = document.querySelector('#prix-max');
prixMaxInput.addEventListener('input', function(){

    const rangeResult = document.querySelector(".range-result");
    rangeResult.innerText = `${prixMaxInput.value} €`;
    const piecesFiltreesMax = pieces.filter(function(pieces){
        return pieces.prix <= prixMaxInput.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltreesMax);
});
