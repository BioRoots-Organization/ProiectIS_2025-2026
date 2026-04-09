import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DateSenzori {
  puls_mediu: number | string;
  temperatura_medie: number | string;
  mesaj?: string;
}

export default function HomeScreen() {
  const [dateSenzori, setDateSenzori] = useState<DateSenzori | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const handleLogOut=()=>{
    router.replace('/login');
  };
  const SERVER_URL = "https://beckend-medical.onrender.com/api/date-pacient/pacient_1";

  const fetchDate = async () => {
    try {
      const response = await axios.get(SERVER_URL);
      setDateSenzori(response.data);
    } catch (error: any) { 
      console.log("Eroare server:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDate();
    const interval = setInterval(fetchDate, 5000); // Se actualizeaza automat la 5 secunde
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titlu}>Monitorizare Pacient</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.icon}>❤️</Text>
          <View>
            <Text style={styles.label}>Puls Cardiac</Text>
            {}
            <Text style={styles.valoare}>{dateSenzori?.puls_mediu ?? '--'} bpm</Text>
          </View>
        </View>

        <View style={[styles.row, { marginTop: 30 }]}>
          <Text style={styles.icon}>🌡️</Text>
          <View>
            <Text style={styles.label}>Temperatură Corp</Text>
            <Text style={styles.valoare}>{dateSenzori?.temperatura_medie ?? '--'} °C</Text>
          </View>
        </View>
        
        {dateSenzori?.mesaj && <Text style={styles.info}>{dateSenzori.mesaj}</Text>}
      </View>

      <TouchableOpacity style={styles.buton} onPress={fetchDate}>
        <Text style={styles.textButon}>Refresh</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buton} onPress={handleLogOut}>
        <Text style={styles.textButon}>LogOut</Text>
      </TouchableOpacity>
        

      {loading && <ActivityIndicator style={{marginTop: 20}} color="#3498db" />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f4f7f6', alignItems: 'center', justifyContent: 'center', padding: 20 },
  titlu: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, color: '#2c3e50', marginTop: 50 },
  card: { backgroundColor: '#fff', padding: 30, borderRadius: 25, width: '100%', elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 45, marginRight: 20 },
  label: { fontSize: 16, color: '#7f8c8d' },
  valoare: { fontSize: 30, fontWeight: 'bold', color: '#2c3e50' },
  info: { marginTop: 20, color: '#3498db', fontStyle: 'italic', textAlign: 'center' },
  buton: { marginTop: 40, backgroundColor: '#3498db', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 15 },
  textButon: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});