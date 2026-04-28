 const bibliotheque = [];

    document.getElementById("ajouter").addEventListener("click", () => {
        window.open("ajouter.html", "_blank", "width=500,height=750");
    });

    
    function afficher(filtres = bibliotheque) {
        const listes = document.getElementById("listeslivres");
        listes.innerHTML = filtres.length === 0 
            ? "<p style='text-align:center; color:#800; font-size:2rem; grid-column:1/-1; padding:50px;'>No grimoire found in the darkness.....</p>"
            : "";

        filtres.forEach(livre => {
            const carte = document.createElement("div");
            carte.className = "carte";

           const img = livre.image; 

            carte.innerHTML = `
                <img src="${img}" alt="Couverture">
                <h2>${livre.titre}</h2>
                <p><strong>Author :</strong> ${livre.auteur}</p>
                <p><strong>Year :</strong> ${livre.annee}</p>
                <p><strong>Price :</strong> ${livre.prix}</p>
                <p><strong>Status :</strong> <span style="color:${livre.checkbox ? '#0f0' : '#f00'}; text-shadow:0 0 10px currentColor;">
                    ${livre.checkbox ? "Available" : "unavailable"}
                </span></p>
            `;

            const btn = document.createElement("button");
            btn.textContent = "remove";
            btn.onclick = () => supprimer(livre.code);
            carte.appendChild(btn);
            listes.appendChild(carte);
        });

        statistic();
    }

   function supprimer(code) {
    // Step 1: Nsowlo luser wach bgha y7yd had lktab
    // confirm() katdir popup f navigateur li fih "Are you sure you want to delete the book?" w 2 boutons: OK w Cancel
    if (confirm("Are you sure you want to delete the book?")) {
        
        // Step 2: kan9albo 3la lktab li bghina nms7oh mn larrey
        // findIndex kat9aleb 3la Index dyal awel elemnt fel array condition dyalo s7i7
        //ida L9ina lkab y3tina ra9em dyl balas ( 0, 1, 2...) ida mal9inax index = -1
        const index = bibliotheque.findIndex(l => l.code === code);
        
        // step 3: nxofo wax kayna Lktab
        //ida kan 3adna ya3ni index !== -1 nms7oh
        //ida ma3adnaxi ya3ni index = -1 mayw9a3 walo
        if (index !== -1) {
            
            // Step 4: N7ydo lktab mn list
            // splice kat7yd 1 item mn larray
            //kat3ni ra9em lplace dyal elemnt fel array
            bibliotheque.splice(index, 1); 
            afficher();
        }
    }
}



    document.getElementById("search").addEventListener("input", function () {
        const text = this.value.toLowerCase().trim();
        const filtres = text ? bibliotheque.filter(l => l.titre?.toLowerCase().includes(text)) : bibliotheque;
        afficher(filtres);
    });

    function statistic() {
        const dispo = bibliotheque.filter(l => l.checkbox).length;
        document.getElementById("statistic").innerText =
            `Available in the darkness : ${dispo} | Total of grimoires : ${bibliotheque.length}`;
    }
    window.ajouterLivre = function(livre) {
        livre.code = Date.now().toString();
        bibliotheque.push(livre);
        afficher();
    };
    afficher(); 