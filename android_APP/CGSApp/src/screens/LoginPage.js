import React, { useEffect, useState} from 'react';
import {View , Text, TouchableOpacity, StyleSheet, Image, Alert,ActivityIndicator} from 'react-native';
import TouchID from 'react-native-touch-id';
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DeviceInfo, { getAndroidId } from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

const LoginPage = () => {
    const navigation = useNavigation();

    const [authenticated, setAuthenticated] = useState(false);
    const [deviceID, setID] = useState("");
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [isLoaded, setisLoaded] = useState(false);

    useEffect(()=>{
        const getdata = async() => {
            try{
                const jsonData = await AsyncStorage.getItem('UserData');
                const userData = jsonData !=null ? JSON.parse(jsonData): null;
                console.log('Retrieved data:', userData);
                setName(userData["name"]);
                setEmail(userData["email"]);
            } catch(error){
                console.log('Error encountered while retrieval in login page:',error);
            }
            
        };
        getdata();
        setisLoaded(true);
    });

    const removeData = async() => {
        await AsyncStorage.removeItem('UserData');
        navigation.navigate('Registration Page')
    };

    const optionalConfigObject = {
        title: 'Authentication Required', // Android
        imageColor: '#a00606', // Android
        imageErrorColor: '#ff0000', // Android
        sensorDescription: 'Fingerprint sensor', // Android
        sensorErrorDescription: 'Failed', // Android
        cancelText: 'Cancel', // Android
        fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
        unifiedErrors: false, // use unified error messages (default false)
        passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
    };

    

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

    const handleLogin = async() => {
        try {
            const biometryType = await TouchID.isSupported(optionalConfigObject);
            if(biometryType) {/* if touchID is supported */
                console.log('TouchID is supported.');
                  const success = await TouchID.authenticate('Authenticate using your fingerprint to login into page', optionalConfigObject)
                  if(success) {/* Authentication successful */
                    console.log('Authenticated Successfully');
                    console.log(success);
                    setAuthenticated(true);
                    await getID();
                    const authReg = {
                        name: name,
                        email : email,
                        deviceUID: deviceID
                    };
                    const response = await fetch(/* URL */'https://authenticator-backend-production.up.railway.app/api/user/authenticate-user',{
                        method: 'PATCH',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(authReg)
                    })
                    // const res = await response.json()
                    console.log(response);
                  }
            }
            
        } catch (error) {
            console.log(error);
                Alert.alert(
                    'Authentication Failed!!',
                    'Biometric unidentified, please try again.',
                    [
                        {
                            text: 'OK',
                            onPress: () => console.log('OK Pressed'),
                            style: 'cancel'
                        },
                        
                    ],
                    {cancelable: true}
                );
        }
        
         
      };
    
      if(isLoaded){return (
        
        <View style = {styles.container}>
            <Text style={styles.UsernameText}> Welcome, {name}!</Text>
            <Image style={styles.image} source={require("../../images.png")} /> 
            {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}> */}
            {authenticated ? (
                <View>
                <Text>You have been authenticated!</Text>
                <TouchableOpacity onPress={() => setAuthenticated(false)}>
                    <Text> </Text>
                <Text>Relogin? Click here to reload.</Text>
                </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                    <Text style={styles.loginText}>LOGIN</Text> 
                </TouchableOpacity>
            )} 
                <TouchableOpacity onPress={async() => removeData()}>
                    <Text> </Text>
                <Text>Sign Out</Text>
                </TouchableOpacity>
                
                {/* <TouchableOpacity onPress={() => navigation.navigate('Registration Page')}>
                    <Text> </Text>
                <Text>New user? Register Here.</Text>
                </TouchableOpacity> */}
            {/* </View>  */}
        </View>
      );}
      else{
        return(
            <View style={styles.loader}><ActivityIndicator size="large"  color="#0000ff"/>
            <Text>Here</Text>
            </View>
            
          );
      }
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: "#fff",
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
        UsernameText: {
            height: 100,
            fontSize: 20,
            color: 'purple',
            fontWeight: 'bold',
        },
        });
    
    export default LoginPage;
    