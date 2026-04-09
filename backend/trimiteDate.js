const axios = require('axios');

const dateSimulate = {
  id_pacient: "pacient_1",
  puls_mediu: 82,
  temperatura_medie: 37.1
};
//date catre server
axios.post('http://localhost:3000/api/senzori', dateSimulate)
  .then(() => console.log("✅Merge"))
  .catch(err => console.log("❌Eroare:", err.message));