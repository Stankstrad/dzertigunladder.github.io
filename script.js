// script.js

let players = [
    { name: "Akuroi", points: 0, matches: 0, history: [], character: "Akuma" },
    { name: "Baardack", points: 0, matches: 0, history: [], character: "JP" },
    { name: "8kmh", points: 0, matches: 0, history: [], character: "Dhalsim" },
    { name: "Momo", points: 0, matches: 0, history: [], character: "Rashid" },
    { name: "TomScro", points: 0, matches: 0, history: [], character: "Blanka" },
    { name: "Skull", points: 0, matches: 0, history: [], character: "Deejay" },
    { name: "Dims", points: 0, matches: 0, history: [], character: "Juri" },
    { name: "Tooru", points: 0, matches: 0, history: [], character: "Kimberly" },
    { name: "Muda", points: 0, matches: 0, history: [], character: "Marisa" },
    { name: "Oden", points: 0, matches: 0, history: [], character: "Akuma" },
    { name: "Mochidess", points: 0, matches: 0, history: [], character: "Deejay" },
    { name: "Vezmo", points: 0, matches: 0, history: [], character: "Juri" },
    { name: "Bolognaise", points: 0, matches: 0, history: [], character: "Akuma" },
    { name: "Amms", points: 0, matches: 0, history: [], character: "Deejay" },
    { name: "Dawnblade", points: 0, matches: 0, history: [], character: "Ryu" },
    { name: "Itona", points: 0, matches: 0, history: [], character: "Jamie" },
    { name: "Boyskor", points: 0, matches: 0, history: [], character: "Blanka" },
    { name: "Yuzeko", points: 0, matches: 0, history: [], character: "Ken" }
];

// Initialisation des joueurs au démarrage
initializePlayers();

function saveToLocalStorage() {
    localStorage.setItem('players', JSON.stringify(players));
    localStorage.setItem('matchHistory', JSON.stringify(matchHistory));
}

function loadFromLocalStorage() {
    const savedPlayers = localStorage.getItem('players');
    const savedMatchHistory = localStorage.getItem('matchHistory');

    if (savedPlayers) {
        players = JSON.parse(savedPlayers);
    }

    if (savedMatchHistory) {
        matchHistory = JSON.parse(savedMatchHistory);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Si l'utilisateur est déjà admin, afficher l'onglet Admin
    if (isAdmin) {
        document.getElementById('adminTab').style.display = 'inline-block';
    }

    // Par défaut, affiche l'onglet du classement
    showTab('ranking');
});

let isAdmin = false; // Indique si l'utilisateur est connecté en tant qu'administrateur

// Fonction pour authentifier un administrateur
function authenticate() {
    if (isAdmin) return true; // Si déjà connecté en tant qu'administrateur, on continue.

    const password = prompt("Entrez le mot de passe pour accéder à cette action :");
    if (password === "123") { // Remplacez par votre mot de passe sécurisé
        isAdmin = true;
        alert("Vous êtes maintenant connecté en tant qu'administrateur.");

        // Afficher l'onglet Admin
        document.getElementById('adminTab').style.display = 'inline-block';

        toggleAdminControls(true); // Afficher les options administrateur
        document.body.classList.add("admin"); // Ajoute la classe 'admin' pour afficher les boutons
        return true;
    } else {
        alert("Mot de passe incorrect. Vous ne pouvez pas modifier ou ajouter des matchs.");
        return false;
    }
}

// Fonction pour afficher/masquer les contrôles administrateur
function toggleAdminControls(isVisible) {
    const addMatchSection = document.getElementById("add-match-section");
    addMatchSection.style.display = isVisible ? "block" : "none";
}

// Afficher le tableau du classement au chargement
updateTable();

// Tableau des matchs
let matchHistory = [];

loadFromLocalStorage();
updateTable();
updateHistoryTable();

// Fonction pour ajouter un match et mettre à jour les statistiques
function addMatch(player1, score1, player2, score2) {
    if (!isAdmin) {alert("Seul un administrateur peut ajouter un match.");
    return;
    }

    const p1 = players.find(player => player.name === player1);
    const p2 = players.find(player => player.name === player2);

    let p1Points = 0, p2Points = 0;

    // Calcul des points
    if (score1 === 5 && score2 <= 1) {
        p1Points = 3; // 5-0 ou 5-1
    } else if (score1 === 5 && score2 <= 3) {
        p1Points = 2; // 5-2 ou 5-3
    } else if (score1 === 5 && score2 === 4) {
        p1Points = 2; // 5-4
        p2Points = 1; // 5-4
    }

    if (score2 === 5 && score1 <= 1) {
        p2Points = 3; // 5-0 ou 5-1
    } else if (score2 === 5 && score1 <= 3) {
        p2Points = 2; // 5-2 ou 5-3
    } else if (score2 === 5 && score1 === 4) {
        p2Points = 2; // 5-4
        p1Points = 1; // 5-4
    }

    // Mettre à jour les points des joueurs
    p1.points += p1Points;
    p2.points += p2Points;

    // Mettre à jour le nombre de matchs joués
    p1.matches++;
    p2.matches++;

    // Mettre à jour l'historique des joueurs
    p1.history.unshift({ result: score1 > score2 ? 'V' : (score1 < score2 ? 'D' : 'N'), opponent: player2 });
    p2.history.unshift({ result: score2 > score1 ? 'V' : (score2 < score1 ? 'D' : 'N'), opponent: player1 });

    // Limiter l'historique à 5 matchs
    p1.history = p1.history.slice(0, 5);
    p2.history = p2.history.slice(0, 5);

    // Ajouter le match à l'historique global
    matchHistory.unshift({ player1, score1, player2, score2 });
    if (matchHistory.length > 50) matchHistory.pop();

    updateTable();
    updateHistoryTable();
    saveToLocalStorage(); // Sauvegarde après modification
}

function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none'); // Cache tous les onglets

    // Affiche l'onglet spécifié
    const activeTab = document.getElementById(tabId);
    activeTab.style.display = 'block';

    // Si l'onglet des matchs à venir est sélectionné, mettez à jour la table
    if (tabId === 'upcoming-matches') {
        updateUpcomingMatchesTable();
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Sélectionner toutes les lignes du tableau de classement (sauf les 5 derniers matchs)
    const rankingRows = document.querySelectorAll('#ranking-table tbody tr');
    
    rankingRows.forEach((row, index) => {
        // Appliquer la couleur aux 3 premiers rangs
        if (index === 0) {
            row.classList.add('gold-rank');
        } else if (index === 1) {
            row.classList.add('silver-rank');
        } else if (index === 2) {
            row.classList.add('bronze-rank');
        } else {
            row.classList.add('other-rank');
        }
    });
});




// Fonction pour mettre à jour le tableau du classement avec les flèches
function updateTable() {
    const tableBody = document.querySelector('#ranking-table tbody');
    tableBody.innerHTML = '';

    // Tri des joueurs par points puis par nombre de matchs
    const sortedPlayers = players.sort((a, b) => {
        if (b.points === a.points) {
            return a.matches - b.matches; // Moins de matchs, mieux classé
        }
        return b.points - a.points; // Plus de points, mieux classé
    });

    sortedPlayers.forEach((player, index) => {
        // Déterminer le changement de rang
        const prevPosition = player.previousRank || index + 1;
        const rankChange = prevPosition - (index + 1);

        // Mettre à jour le rang précédent
        player.previousRank = index + 1;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.character}</td>
            <td>${player.points}</td>
            <td>${player.matches}</td>
            <td class="history-cell">
                ${player.history.map(match => {
                    // Déterminer la couleur du bloc en fonction du résultat
                    const bgColor = match.result === 'V' ? '#56c684' : '#cf0b0b'; // Vert clair pour victoire, rouge clair pour défaite
                    const borderColor = match.result === 'V' ? '#56c684' : '#cf0b0b'; // Vert foncé pour victoire, rouge foncé pour défaite

                    return `<div style="
                        display: inline-block;
                        padding: 5px 10px;
                        margin-right: 5px;
                        color: black;
                        font-style: normal;
                        font-weight: bold;
                        background-color: ${bgColor};
                        border: 2px solid ${borderColor};
                        border-radius: 5px;
                        " title="${match.opponent}">
                        ${match.result}
                    </div>`;
                }).join('')}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fonction pour mettre à jour le tableau de l'historique des matchs
function updateHistoryTable() {
    const historyTableBody = document.querySelector('#history-table tbody');
    historyTableBody.innerHTML = ''; // Réinitialiser le corps du tableau

    matchHistory.forEach(match => {
        const row = document.createElement('tr');

        // Déterminer le gagnant et le perdant
        let winner = '';
        let loser = '';

        if (match.score1 > match.score2) {
            winner = match.player1;
            loser = match.player2;
        } else if (match.score2 > match.score1) {
            winner = match.player2;
            loser = match.player1;
        }

        row.innerHTML = `
            <td><span class="${winner === match.player1 ? 'winner' : ''}">${match.player1}</span></td>
            <td><span class="${winner === match.player2 ? 'winner' : ''}">${match.player2}</span></td>
            <td>${match.score1}</td>
            <td>${match.score2}</td>
            <td class="edit-column">
                ${isAdmin ? `<button onclick="deleteMatch('${match.player1}', ${match.score1}, '${match.player2}', ${match.score2})">Supprimer</button>` : ''}
            </td>
        `;

        // Ajouter la ligne au tableau
        historyTableBody.appendChild(row);
    });
}



// Fonction pour supprimer un match de l'historique
function deleteMatch(player1, score1, player2, score2) {
    if (!authenticate()) return; // Vérifie si l'utilisateur est autorisé

    // Demander une confirmation avant de supprimer
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer le match entre ${player1} (${score1}) et ${player2} (${score2}) ?`);
    if (!confirmation) return; // Annuler la suppression si non confirmé

    // Supprimer le match de l'historique global
    matchHistory = matchHistory.filter(match => !(match.player1 === player1 && match.score1 === score1 && match.player2 === player2 && match.score2 === score2));

    // Trouver les joueurs dans la liste
    const p1 = players.find(player => player.name === player1);
    const p2 = players.find(player => player.name === player2);

    // Réinitialiser les points
    let p1Points = 0, p2Points = 0;

    // Calcul des points comme pour l'ajout d'un match
    if (score1 === 5 && score2 <= 1) {
        p1Points = 3; // 5-0 ou 5-1
    } else if (score1 === 5 && score2 <= 3) {
        p1Points = 2; // 5-2 ou 5-3
    } else if (score1 === 5 && score2 === 4) {
        p1Points = 2; // 5-4
        p2Points = 1; // 5-4
    }

    if (score2 === 5 && score1 <= 1) {
        p2Points = 3; // 5-0 ou 5-1
    } else if (score2 === 5 && score1 <= 3) {
        p2Points = 2; // 5-2 ou 5-3
    } else if (score2 === 5 && score1 === 4) {
        p2Points = 2; // 5-4
        p1Points = 1; // 5-4
    }

    // Réduire le nombre de matchs et les points
    p1.points -= p1Points;
    p2.points -= p2Points;

    // Réduire le nombre de matchs joués
    p1.matches--;
    p2.matches--;

    // Recalculer l'historique des joueurs : retirer le match supprimé
    p1.history = p1.history.filter(match => !(match.opponent === player2 && match.result === (score1 > score2 ? 'V' : (score1 < score2 ? 'D' : 'N'))));
    p2.history = p2.history.filter(match => !(match.opponent === player1 && match.result === (score2 > score1 ? 'V' : (score2 < score1 ? 'D' : 'N'))));

    // Mettre à jour les affichages
    updateTable();
    updateHistoryTable();
    saveToLocalStorage(); // Sauvegarde après modification
}

// Fonction pour initialiser les joueurs dans le formulaire
function initializePlayers() {
    const playerSelect1 = document.getElementById('player1');
    const playerSelect2 = document.getElementById('player2');

    players.forEach(player => {
        const option1 = document.createElement('option');
        option1.value = player.name;
        option1.textContent = player.name;
        playerSelect1.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = player.name;
        option2.textContent = player.name;
        playerSelect2.appendChild(option2);
    });
}

// Initialisation des joueurs au démarrage
initializePlayers();

// Ajouter un événement au formulaire pour enregistrer un match
document.getElementById('match-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const player1 = document.getElementById('player1').value;
    const score1 = parseInt(document.getElementById('score1').value);
    const player2 = document.getElementById('player2').value;
    const score2 = parseInt(document.getElementById('score2').value);

    addMatch(player1, score1, player2, score2);

    document.getElementById('match-form').reset();
});





// Fonction pour récupérer les matchs à venir
function getUpcomingMatches() {
    const upcomingMatches = {}; // Dictionnaire pour stocker les matchs à venir

    // Créer un tableau de tous les joueurs
    players.forEach(player => {
        upcomingMatches[player.name] = []; // Initialiser les adversaires à venir pour chaque joueur

        // Vérifier chaque joueur pour déterminer les adversaires restants
        players.forEach(opponent => {
            if (player.name !== opponent.name && !hasPlayed(player.name, opponent.name)) {
                upcomingMatches[player.name].push(opponent.name); // Ajouter l'adversaire s'ils ne se sont pas encore affrontés
            }
        });
    });

    return upcomingMatches;
}

// Fonction pour vérifier si deux joueurs se sont déjà affrontés
function hasPlayed(player1, player2) {
    // Vérifie si un des deux joueurs a ce match dans son historique
    const player1History = players.find(player => player.name === player1).history;
    const player2History = players.find(player => player.name === player2).history;

    // Vérifier si l'un ou l'autre a ce match dans son historique
    return player1History.some(match => match.opponent === player2) || player2History.some(match => match.opponent === player1);
}

// Fonction pour mettre à jour la table des matchs à venir
function updateUpcomingMatchesTable() {
    const upcomingMatches = getUpcomingMatches(); // Récupérer les matchs à venir
    const tableBody = document.querySelector('#upcoming-matches-table tbody');
    tableBody.innerHTML = ''; // Réinitialiser le contenu de la table

    // Trier les joueurs par ordre alphabétique
    const sortedPlayerNames = Object.keys(upcomingMatches).sort();

    // Ajouter chaque joueur et ses adversaires restants
    sortedPlayerNames.forEach(playerName => {
        const row = document.createElement('tr');
        const playerCell = document.createElement('td');
        const opponentsCell = document.createElement('td');

        // Remplir la cellule du joueur
        playerCell.textContent = playerName;

        // Remplir la cellule des adversaires restants
        if (upcomingMatches[playerName].length > 0) {
            opponentsCell.textContent = upcomingMatches[playerName].join(', ');
        } else {
            opponentsCell.textContent = 'Tous les matchs sont joués';
        }

        row.appendChild(playerCell);
        row.appendChild(opponentsCell);
        tableBody.appendChild(row);
    });
}


// Fonction pour afficher l'onglet Matchs à venir
function showUpcomingMatches() {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none'); // Masquer tous les onglets

    // Afficher l'onglet des matchs à venir
    const activeTab = document.getElementById('upcoming-matches');
    activeTab.style.display = 'block';

    // Mettre à jour la table des matchs à venir
    updateUpcomingMatchesTable();
}


// Fonction pour réinitialiser le tableau 
function reset() {
    // Demander une confirmation avant de réinitialiser
    const confirmation = confirm("Êtes-vous sûr de vouloir réinitialiser le tableau ? Toutes les données seront perdues.");

    if (confirmation) {
        // Réinitialisation des joueurs à leurs valeurs par défaut
        players.forEach(player => {
            player.points = 0;
            player.matches = 0;
            player.history = [];
        });

        // Réinitialisation de l'historique des matchs
        matchHistory = [];

        // Mise à jour des tableaux du classement et de l'historique
        updateTable();
        updateHistoryTable();

        // Sauvegarde dans le localStorage après réinitialisation
        saveToLocalStorage();
        
        alert("Le tableau a été réinitialisé.");
    } else {
        alert("Réinitialisation annulée.");
    }
}



