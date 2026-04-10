const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Setare CORS explicita pentru a primi cereri de pe web si mobil (scapam de eroarea cu rosu)
app.use(cors({ origin: '*' }));
app.use(express.json()); 

// ==========================================
// CONECTARE BAZA DE DATE (MONGODB)
// ==========================================

// LINK MODIFICAT: Varianta "Old School" fara +srv, care rezolva ETIMEOUT pe Render
const mongoURI = "mongodb://ProiectIS:ProiectIS1234@cluster0-shard-00-00.7dqbppa.mongodb.net:27017,cluster0-shard-00-01.7dqbppa.mongodb.net:27017,cluster0-shard-00-02.7dqbppa.mongodb.net:27017/MedicalDB?ssl=true&authSource=admin&retryWrites=true&w=majority";

// Conectare cu setari de siguranta si Timeout mai scurt
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000 // Incearca sa se reconecteze rapid, nu asteapta blocat
})
  .then(() => console.log('✅ Conectare la MongoDB reușită!'))
  .catch(err => console.error('❌ Eroare la conectare MongoDB:', err));


// ==========================================
// 1. SCHEME BAZA DE DATE (MODELE)
// ==========================================

// Schema Senzori (IoT)
const SenzorSchema = new mongoose.Schema({
  id_pacient: { type: String, required: true },
  puls_mediu: Number,
  temperatura_medie: Number,
  timestamp: { type: Date, default: Date.now }
});
const Masuratoare = mongoose.model('Masuratoare', SenzorSchema, 'masuratori');

// Schema Utilizatori (Auth)
const UserSchema = new mongoose.Schema({
  nume: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  parola: { type: String, required: true },
  rol: { type: String, enum: ['medic', 'pacient'], required: true },
  data_creare: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema, 'utilizatori');

// Schema Pacienti (Fisa Medicala)
const PacientSchema = new mongoose.Schema({
  nume: String,
  prenume: String,
  varsta: Number,
  cnp: { type: String, unique: true },
  telefon: String,
  email: String,
  strada: String,
  oras: String,
  judet: String,
  profesie: String,
  locMunca: String,
  istoricMedical: String,
  alergii: String,
  consultatiiCardiologice: String,
  pulsMin: Number,
  pulsMax: Number,
  tempMin: Number,
  tempMax: Number,
  puls: { type: Number, default: 0 },
  temperatura: { type: Number, default: 0 },
  ecg: { type: String, default: 'Normal' },
  status: { type: String, default: 'ok' },
  medicUid: String,    // Cine a creat fisa
  pacientUid: String   // Contul de pacient asociat (dupa introducerea CNP-ului)
});
const Pacient = mongoose.model('Pacient', PacientSchema, 'pacienti');

// Schema Recomandari Medicale
const RecomandareSchema = new mongoose.Schema({
  pacientId: { type: String, required: true },
  medicUid: { type: String, required: true },
  tip: String,
  durata: String,
  indicatii: String,
  timestamp: { type: Date, default: Date.now }
});
const Recomandare = mongoose.model('Recomandare', RecomandareSchema, 'recomandari');


// ==========================================
// 2. RUTE PENTRU IOT (SENZORI ARDUINO)
// ==========================================

// Preia ultima masuratoare (pentru o interogare rapida hardware daca e cazul)
app.get('/api/date-pacient/:id', async (req, res) => {
  try {
    const idPacient = req.params.id;
    const ultimaMasuratoare = await Masuratoare.findOne({ id_pacient: idPacient }).sort({ timestamp: -1 });
    
    if (ultimaMasuratoare) {
      res.json(ultimaMasuratoare);
    } else {
      res.json({ puls_mediu: "--", temperatura_medie: "--", mesaj: "Nu există date încă." });
    }
  } catch (error) {
    res.status(500).json({ error: "Eroare la preluarea datelor senzorilor" });
  }
});

// Salvare date trimise de Arduino
app.post('/api/senzori', async (req, res) => {
  try {
    const dateNoi = new Masuratoare(req.body);
    await dateNoi.save();
    console.log("📥 Date noi salvate de la senzor:", req.body);
    res.status(201).json({ mesaj: "Date salvate cu succes!" });
  } catch (error) {
    res.status(500).json({ error: "Eroare la salvarea datelor de la senzor" });
  }
});

// Preia tot istoricul de masuratori pentru a desena graficele in React
app.get('/api/masuratori/:pacientId', async (req, res) => {
  try {
    const masuratori = await Masuratoare.find({ id_pacient: req.params.pacientId }).sort({ timestamp: 1 });
    res.json(masuratori);
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la preluarea istoricului de măsurători." });
  }
});


// ==========================================
// 3. RUTE PENTRU AUTENTIFICARE (REACT)
// ==========================================

// Inregistrare
app.post('/api/register', async (req, res) => {
  try {
    const { nume, email, parola, rol } = req.body;
    
    const userExistent = await User.findOne({ email });
    if (userExistent) {
      return res.status(400).json({ mesaj: "Email-ul este deja folosit!" });
    }

    const userNou = new User({ nume, email, parola, rol });
    await userNou.save();
    
    res.status(201).json({ mesaj: "Cont creat cu succes!", utilizator: userNou });
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la crearea contului." });
  }
});

// Logare
app.post('/api/login', async (req, res) => {
  try {
    const { email, parola, rol_cerut } = req.body;
    
    const user = await User.findOne({ email, parola });
    if (!user) {
      return res.status(401).json({ mesaj: "Email sau parolă greșite!" });
    }

    if (user.rol !== rol_cerut) {
      return res.status(403).json({ mesaj: `Acest cont este de tip "${user.rol}", nu "${rol_cerut}".` });
    }

    res.json({ mesaj: "Logare reușită!", utilizator: user });
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la logare." });
  }
});


// ==========================================
// 4. RUTE PENTRU PACIENTI (FISA MEDICALA)
// ==========================================

// Medicul preia lista cu toti pacientii lui
app.get('/api/pacienti/:medicUid', async (req, res) => {
  try {
    const pacienti = await Pacient.find({ medicUid: req.params.medicUid });
    res.json(pacienti);
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la preluarea listei de pacienți." });
  }
});

// Medicul creaza o fisa noua pentru pacient
app.post('/api/pacienti', async (req, res) => {
  try {
    const pacientNou = new Pacient(req.body);
    await pacientNou.save();
    res.status(201).json({ mesaj: "Fișă pacient creată!", pacient: pacientNou });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mesaj: "Există deja un pacient cu acest CNP în sistem!" });
    }
    res.status(500).json({ mesaj: "Eroare la crearea fișei." });
  }
});

// Preia datele unei fise specifice (dupa _id)
app.get('/api/pacient-detalii/:id', async (req, res) => {
  try {
    const fisa = await Pacient.findById(req.params.id);
    if (!fisa) return res.status(404).json({ mesaj: "Fișa nu a fost gasită." });
    res.json(fisa);
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la preluarea detaliilor." });
  }
});

// Actualizeaza o fisa (Edit)
app.put('/api/pacienti/:id', async (req, res) => {
  try {
    const pacientActualizat = await Pacient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pacientActualizat);
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la actualizarea fișei." });
  }
});

// Sterge o fisa (Delete)
app.delete('/api/pacienti/:id', async (req, res) => {
  try {
    await Pacient.findByIdAndDelete(req.params.id);
    res.json({ mesaj: "Pacient șters cu succes." });
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la ștergerea fișei." });
  }
});

// Legarea unui cont de pacient de fisa lui medicala (dupa CNP)
app.post('/api/link-pacient', async (req, res) => {
  try {
    const { cnp, uid } = req.body;
    const pacient = await Pacient.findOne({ cnp });
    
    if (!pacient) {
      return res.status(404).json({ mesaj: "Nu s-a găsit nicio fișă medicală cu acest CNP." });
    }

    pacient.pacientUid = uid;
    await pacient.save();
    res.status(200).json({ mesaj: "Fișă asociată contului cu succes!" });
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la legarea fișei." });
  }
});

// Pacientul isi preia fisa folosind ID-ul contului lui (uid)
app.get('/api/pacient-fisa/:uid', async (req, res) => {
  try {
    const fisa = await Pacient.findOne({ pacientUid: req.params.uid });
    if (!fisa) {
      return res.status(404).json({ mesaj: "Nu ai nicio fișă asociată încă." });
    }
    res.json(fisa);
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la preluarea fișei." });
  }
});


// ==========================================
// 5. RUTE PENTRU RECOMANDARI
// ==========================================

// Adauga o recomandare
app.post('/api/recomandari', async (req, res) => {
  try {
    const recNoua = new Recomandare(req.body);
    await recNoua.save();
    res.status(201).json({ mesaj: "Recomandare salvata!", recomandare: recNoua });
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la salvarea recomandării." });
  }
});

// Preia recomandarile unui pacient
app.get('/api/recomandari/:pacientId', async (req, res) => {
  try {
    const recomandari = await Recomandare.find({ pacientId: req.params.pacientId }).sort({ timestamp: -1 });
    res.json(recomandari);
  } catch (error) {
    res.status(500).json({ mesaj: "Eroare la preluarea recomandărilor." });
  }
});


// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serverul rulează perfect pe portul ${PORT}`);
});