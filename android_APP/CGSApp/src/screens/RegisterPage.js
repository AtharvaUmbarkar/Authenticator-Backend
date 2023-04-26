import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, StatusBar,Image,Alert} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeviceInfo, { getAndroidId } from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNRestart from 'react-native-restart';



const Stack = createNativeStackNavigator();


const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("")
    const [deviceID, setID] = useState("");
    const navigation = useNavigation();
    
    const getID = async() => {
        const response = await DeviceInfo.getUniqueId();
        console.log(response);
        // Alert.alert(
        //     'Info',
        //     (response),
        //     [
        //         {
        //             text: 'ok',
        //         },
                
        //     ],
        //     {cancelable: true}
        // );
        // return response;
        setID(response)
    }

    const Registration = async() =>{
        const uniqueID = await getID();
        // setID(JSON.stringify(uniqueID));
        // var str = 'Id: '+deviceID;
        
        const authReg = {
            name:username,
            email : email,
            deviceUID: deviceID
        };
        if(username && email){
            /* Code to send data to page*/
            const response = await fetch(/* URL */'https://authenticator-backend-production.up.railway.app/api/user/create-user',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(authReg)
            })

            let res = await response.json();
            console.log(res);

            // Storing data in local storage
            const storedata = async() => {
                try{
                    const jsonVal = JSON.stringify(authReg);
                    await AsyncStorage.setItem('UserData',jsonVal);
                    console.log('User data stored in local storage');
                    // RNRestart.restart();
                    navigation.navigate('Login Page')
                }
                catch(error){
                    console.log('error occured during local storage',error);
                }
            };
            await storedata();

            // Retrieving data from local storage
            const getdata = async() => {
                try{
                    const jsonData = await AsyncStorage.getItem('UserData');
                    const userData = jsonData !=null ? JSON.parse(jsonData): null;
                    console.log('Retrieved data:', userData);
                    console.log(userData["email"]);
                } catch(error){
                    console.log('Error encountered while retrieval:',error);
                }
            };
            await getdata();

        } else{
            Alert.alert(
                'Username  or email not provided',
                'Username and email fields are mandatory, kindly provide a username',
                [
                    {
                        text: 'Ok',
                        style: 'cancel'
                    },
                ],
                {cancelable: false}
            );
        }
    };


    return (
        <ScrollView alignItems='center' justifyContent='center'>
        <View style = {styles.container}>
            <Image style={styles.image} source={require("../../register.png")} /> 
            <StatusBar style='auto' />
            <View style={styles.inputview}>
                <TextInput 
                    style={styles.TextInput}
                    placeholder='Username'
                    placeholderTextColor="#003f5c"
                    onChangeText={(username) => setUsername(username)}
                    backgroundColor='#D0D0D0'
                    width={300}
                    borderRadius = {25}
                    textAlign="center"                    
                />
                <Text></Text>
                <TextInput 
                    style={styles.TextInput}
                    placeholder='Email'
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                    backgroundColor='#D0D0D0'
                    width={300}
                    borderRadius = {25}
                    textAlign="center"
                    
                />
            </View>
            
            <TouchableOpacity style = {styles.loginBtn} onPress={() => Registration()} >
                <Text>Register</Text>
            </TouchableOpacity>
            <Text></Text>
            {/* <TouchableOpacity onPress={() => navigation.navigate('Login Page')}>
                <Text>Already registered? Login here.</Text>
            </TouchableOpacity> */}
            
        </View>
        </ScrollView>
    );

};

const styles = StyleSheet.create({
        container: {
            flex: 1,
            // backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          },
        loginBtn: {
            width: "80%",
            borderRadius: 25,
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 40,
            backgroundColor: "#FF1493",
            },
            image: {
                marginBottom: 40,
              },
        });
    
    export default RegisterPage;
    
