import React, { useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import TouchID from 'react-native-touch-id';
import LoginPage from './src/screens/LoginPage';
import RegisterPage from './src/screens/RegisterPage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

const App = () => {
  
    const [deviceID, setID] = useState("");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [initroute,setInitRoute] = useState("Registration Page");
    const [isLoaded, setisLoaded] = useState(false);
    

    useEffect(()=>{
        const getdata = async() => {
            try{
              // SplashScreen.show();
                const jsonData = await AsyncStorage.getItem('UserData');
                if(jsonData){/* If userdata exist in local storage */
                  const userData =jsonData !=null ? JSON.parse(jsonData): null;
                  console.log('Retrieved data:', userData);
                  setName(userData["name"]);
                  setEmail(userData["email"]);
                  setInitRoute('Login Page');
                  console.log('Login page should be run', name);
                  
                } else{/* if userdata does not exist in local storage */
                  setInitRoute('Registration Page');
                  console.log('Registration page should be run',name);
                }
                setisLoaded(true);
            } catch(error){
                console.log('Error encountered while retrieval:',error);
            }
        };
       
        getdata();

       
    },[]);

if(isLoaded){ /* Data from local storage is loaded */
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName={initroute}>
        <Stack.Screen name='Login Page' component={LoginPage} options={{title: 'Home' }}/>
        <Stack.Screen name='Registration Page' component={RegisterPage} options={{title: 'New User Registration'}} />
       </Stack.Navigator>
      </NavigationContainer>
    
  );} 
else{ /* While data is being loaded from local storage */
    return(
    <View style={styles.loader}><ActivityIndicator size="large"  color="#0000ff"/>
    <Text>Please Wait</Text>
    </View>
    
  );}
};

/* CSS styles */
const styles = StyleSheet.create({
  loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#FF1493",
      },
    loader:{
      minHeight: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    });

export default App;
