import axios from 'axios';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function IstoricScreen(){
  const SERVER_URL = "https://beckend-medical.onrender.com/api/date-pacient/pacient_1";
  const [date, setDate]= useState(null);
  const incarcaDate = async () => {
    try {
      const res = await axios.get(SERVER_URL);
      setDate(res.data); 
    } catch (err: any) {
      console.log("Eroare:", err.message);
    }
  };
  useEffect(() => {
    incarcaDate();
  }, []);

  return(
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Pagina de istoric</Text>
        <Text style={styles.text}>Introduceti date</Text>
        <TextInput style={styles.input}></TextInput>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center', alignItems:'center', backgroundColor:'red',},
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd', fontSize: 16 },
  text:{fontSize:20 , fontWeight:'bold', color:'white'}
})