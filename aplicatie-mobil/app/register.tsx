import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [parola, setParola] = useState('');

  // Link-ul tău de backend
  const SERVER_URL = "https://beckend-medical.onrender.com/api/register";

  const handleRegister = async () => {
    if (!nume || !email || !parola) {
      Alert.alert("Atenție", "Completează toate câmpurile!");
      return;
    }

    try {
      // MODIFICARE: Trimitem și câmpul 'rol' setat pe 'pacient'
      const response = await axios.post(SERVER_URL, { 
        nume, 
        email, 
        parola, 
        rol: 'pacient' 
      });

      // Serverul tău trimite mesajul în "mesaj"
      Alert.alert("Cont Creat!", response.data.mesaj);
      
      // După succes, trimitem utilizatorul la Login
      router.replace('/login' as any);
    } catch (error: any) {
      // MODIFICARE: Citim "mesaj" din eroare, nu "error"
      const mesajEroare = error.response?.data?.mesaj || "Eroare la creare cont";
      Alert.alert("Eroare", mesajEroare);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.titlu}>Creare Cont</Text>
      <Text style={styles.subtitlu}>Înregistrare Pacient Nou</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Nume Complet" 
        value={nume} 
        onChangeText={setNume} 
      />
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

      <TouchableOpacity style={styles.buton} onPress={handleRegister}>
        <Text style={styles.textButon}>Înregistrează-te</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/login' as any)}>
        <Text style={styles.link}>Ai deja cont? Loghează-te aici.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7f6', justifyContent: 'center', padding: 20 },
  titlu: { fontSize: 32, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center' },
  subtitlu: { fontSize: 16, color: '#7f8c8d', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  buton: { backgroundColor: '#2ecc71', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  textButon: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  link: { color: '#7f8c8d', textAlign: 'center', marginTop: 20, fontSize: 16 }
});