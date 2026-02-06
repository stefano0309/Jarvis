
window.onload = function(){
    loadChat()
}

async function Message() {
    const textInput = document.getElementById("prompt");
    const chatContainer = document.getElementById("chat");
    const sendBtn = document.getElementById("invia");

    const promptValue = textInput.value.trim();
    if (!promptValue) return; 

    // --- STATO LOADING: Disabilita interfaccia ---
    textInput.value = "";
    textInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.innerText = "...";

    // 1. Visualizzazione messaggio utente
    let userMsgP = document.createElement("p");
    userMsgP.classList.add("message");
    userMsgP.textContent = promptValue; 
    chatContainer.appendChild(userMsgP);

    // 2. Preparazione contenitore risposta Jarvis
    let responseContainer = document.createElement("div");
    responseContainer.classList.add("responce"); 
    let responseMessage = document.createElement("p");
    responseContainer.appendChild(responseMessage);
    chatContainer.appendChild(responseContainer);

    // Scroll verso il basso
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        // 3. Chiamata a Ollama
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "Jarvis",
                prompt: promptValue,
                stream: true
            })
        });

        if (!response.ok) throw new Error("Errore nella comunicazione con Ollama");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(Boolean);

            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json.response) {
                        // Usiamo += per aggiungere i pezzi di testo man mano che arrivano
                        responseMessage.innerText += json.response;
                        chatContainer.scrollTop = chatContainer.scrollHeight;
                    }
                } catch (e) { 
                    console.error("Errore parsing chunk", e); 
                }
            }
        }

        // 4. Aggiunta tasto copia a fine generazione
        let btnCopy = document.createElement('button');
        btnCopy.innerHTML = "Copia 📋";
        btnCopy.classList.add("copy-btn");
        responseContainer.appendChild(btnCopy);

        // 5. Salvataggio su Database (Server Node.js locale)
        // Usiamo un percorso relativo perché il frontend è servito dallo stesso server
        await fetch("/save-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                domanda: promptValue,
                risposta: responseMessage.innerText
            })
        });

        console.log("✅ Chat salvata con successo");

    } catch (error) {
        console.error("❌ Errore:", error);
        responseMessage.innerText = "Errore: Assicurati che Ollama sia attivo e il server sia connesso.";
        responseContainer.style.borderColor = "red";
    } finally {
        // --- RIPRISTINO INTERFACCIA ---
        textInput.disabled = false;
        sendBtn.disabled = false;
        sendBtn.innerText = "Invia";
        textInput.focus();
    }
}

function loadChat(){
    fetch('http://localhost:3000/load-chat')
        .then(response => response.json())
        .then(data => {
            console.log(data.chats)
            const chatContainer = document.getElementById("chat");
            const historyContainer = document.getElementById("container");
            let dates = []
            data.chats.forEach(chat => {
                // 2. Visualizzazione messaggio utente
                let userMsgP = document.createElement("p");
                userMsgP.classList.add("message");
                userMsgP.textContent = chat.domanda; // Usa textContent per sicurezza XSS
                chatContainer.appendChild(userMsgP);

                // 3. Preparazione contenitore risposta
                let responseContainer = document.createElement("div");
                responseContainer.classList.add("responce"); // Mantengo il tuo spelling "responce"
                let responseMessage = document.createElement("p");
                responseMessage.innerHTML = chat.risposta
                responseContainer.appendChild(responseMessage);
                chatContainer.appendChild(responseContainer);

                // 5. Aggiunta tasto copia a fine generazione
                let btnCopy = document.createElement('button');
                btnCopy.innerHTML = "Copy";
                btnCopy.classList.add("copy-btn");
                responseContainer.appendChild(btnCopy);

                if (!dates.includes(chat.dateTime)){
                    let btn = document.createElement("button");
                    btn.classList.add("history");
                    btn.innerText = chat.dateTime;
                    historyContainer.appendChild(btn);
                    dates.push(chat.dateTime)
                }
            })
            chatContainer.scrollTop = chatContainer.scrollHeight;                    
        })
        .catch(err => console.error("Errore:", err));
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("copy-btn")) {
        const parent = e.target.parentElement
        const text = parent.firstChild.textContent.trim()

        navigator.clipboard.writeText(text)
            .then(() => console.log("Testo copiato!"))
            .catch(err => console.error("Errore:", err))
    }
})

function saveChat(){
    const today = new Date().toLocaleDateString("it-IT")
    console.log("Inizio salvataggio")
    const nomeFile = today+".txt"
    const contenuto = document.getElementById("chat").innerText
    const blob = new Blob([contenuto], { typr: 'text/plain;charset=utf-8'})
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url
    link.download = nomeFile

    document.body.appendChild(link);
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
}

function hideSection(){
    console.log("Nascosta sezione")
    let sezione = document.getElementById("historyContainer")

    if (sezione.style.display == "none")
        sezione.style.display = ""
    else
        sezione.style.display = "none"
}