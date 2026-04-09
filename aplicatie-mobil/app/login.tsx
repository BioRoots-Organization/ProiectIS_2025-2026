import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');

  // Link-ul tău de Render (asigură-te că serverul e "Live" în dashboard)
  const SERVER_URL = "https://beckend-medical.onrender.com/api/login";

  const handleLogin = async () => {
    if (!email || !parola) {
      Alert.alert("Atenție", "Completează toate câmpurile!");
      return;
    }

    try {
      // MODIFICARE: Trimitem și rolul 'pacient' către server
      const response = await axios.post(SERVER_URL, { 
        email, 
        parola, 
        rol_cerut: 'pacient' 
      });

      // Serverul tău trimite "mesaj" în caz de succes
      Alert.alert("Succes!", response.data.mesaj);
      
      // Navigăm către ecranele principale
      router.replace('/(tabs)' as any);
    } catch (error: any) {
      // MODIFICARE: Citim "mesaj" din eroarea trimisă de server
      // Dacă serverul nu răspunde, afișăm eroarea generică
      const mesajEroare = error.response?.data?.mesaj || "Eroare la conectare. Verifică serverul.";
      Alert.alert("Eroare", mesajEroare);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.titlu}>Autentificare</Text>
      <Text style={styles.subtitlu}>Sistem Monitorizare Medicală</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Adresă Email" 
        value={email} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address" 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Parolă" 
        value={parola} 
        onChangeText={setParola} 
        secureTextEntry 
      />

      <TouchableOpacity style={styles.buton} onPress={handleLogin}>
        <Text style={styles.textButon}>Intră în cont</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register' as any)}>
        <Text style={styles.link}>Nu ai cont? Înregistrează-te aici.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', justifyContent: 'center', padding: 20 },
  titlu: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
  subtitlu: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  buton: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  textButon: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#3498db', textAlign: 'center', marginTop: 20, fontSize: 16 }
});