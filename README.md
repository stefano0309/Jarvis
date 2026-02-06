# 🧠 Jarvis: Personal AI Assistant

Jarvis è un assistente virtuale full-stack che utilizza modelli di linguaggio locali (tramite **Ollama**) per interagire con l'utente. Il progetto è progettato per essere leggero, veloce e privato, salvando l'intera cronologia delle chat in un database locale.

---

## 🚀 Caratteristiche
- **AI Locale**: Integrazione con Ollama per risposte intelligenti senza dipendere da cloud esterni.
- **Streaming UI**: Visualizzazione delle risposte in tempo reale (chunk-by-chunk).
- **Database Persistente**: Salvataggio automatico delle conversazioni tramite SQLite.
- **Interfaccia Moderna**: Design minimale con supporto per la cronologia laterale e modalità responsive.
- **Utility**: Copia rapida delle risposte e funzione di esportazione chat in formato `.txt`.

---

## 🛠️ Tecnologie Utilizzate
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (`better-sqlite3`)
- **AI Engine**: Ollama (Modello personalizzato Jarvis)

---

## 📦 Installazione e Avvio

### 1. Prerequisiti
Assicurati di avere installato:
- [Node.js](https://nodejs.org/) (versione 18 o superiore)
- [Ollama](https://ollama.ai/) con il modello "Jarvis" configurato.

### 2. Clonazione del progetto
```bash
git clone [https://github.com/stefano0309/Jarvis.git](https://github.com/stefano0309/Jarvis.git)
cd Jarvis