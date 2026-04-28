 const form = document.getElementById("formLivre");

    form.addEventListener("submit", function(e) {
        e.preventDefault();

        const titre = document.getElementById("titre").value.trim();
        const image = document.getElementById("image").value.trim();

        if (!titre || !image) {
            alert("The title and the image are mandatory!");
            return;
        }

        
        const livre = {
            titre: titre,
            auteur: document.getElementById("auteur").value || "Inconnu",
            annee: Number(document.getElementById("annee").value) || null,
            prix: Number(document.getElementById("prix").value) || 0,
            image: image,
            checkbox: document.getElementById("disponible").checked
        };

        if (window.opener && !window.opener.closed && window.opener.ajouterLivre) {
            window.opener.ajouterLivre(livre);
            alert("Grimoire added successfully!");
            form.reset();
            setTimeout(() => window.close(), 300);
        } else {
            alert("The door to the main library is closed...");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") window.close();
    });