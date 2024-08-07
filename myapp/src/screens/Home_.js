import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { getUser } from "../utils/getUser";
import useLocation from '../hooks/useLocation';
import { base_url } from '../utils/constants';
import io from 'socket.io-client';
import postData from '../helpers/postData';
import FastImage from "expo-fast-image";

const Home = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const { location: myLocation, error } = useLocation();

    useEffect(() => {
        const fetchUserData = async () => {
            const user = await getUser();
            if (user) {
                setUserData(user);
            } else {
                navigation.navigate('Login'); // Navigate to login if no user data
            }
            setLoading(false); // Stop loading user data
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const socketInstance = io(base_url, {
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        });

        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        socketInstance.on('disconnect', (reason) => {
            console.log('Disconnected from Socket.IO server:', reason);
            if (reason === 'io server disconnect') {
                console.log('Attempting to reconnect to the Socket.IO server...');
                socketInstance.connect();
            }
        });

        socketInstance.on('reconnect', (attemptNumber) => {
            console.log('Reconnected to Socket.IO server after', attemptNumber, 'attempts');
        });

        socketInstance.on('connect_error', (error) => {
            console.error('Error connecting to Socket.IO server:', error);
        });

        socketInstance.on('helpOnTheWay', (data) => {
            if(data["emergencyId"]["email"] !== userData?.user?.email) return;
            Alert.alert("Found Help", 'Help is coming!');
        });

        return () => {
            console.log('Disconnecting from Socket.IO server...');
            socketInstance.disconnect();
        };
    }, []);

    useEffect(() => {
        if (myLocation || error) {
            setLocationLoading(false); // Stop loading location data
        }
    }, [myLocation, error]);

    const isLoading = loading || locationLoading;

    const handleAlarmPress = (type) => {
        setSelectedType(type);
        if (type === 'station') {
            setDropdownOptions(['Theft', 'Armed Robbery', 'Rape', 'Domestic Violence', 'Kidnap']);
        } else if (type === 'hospital') {
            setDropdownOptions(['Road Accident', 'Pregnancy', 'Heart Attack', 'Severe Injury', 'Other']);
        }
        setDropdownVisible(true);
    };

    const handleOptionSelect = (index, value) => {
        setDropdownVisible(false);
        sendAlarm(selectedType, value);
    };

    const sendAlarm = (type, e_type) => {
        if (socket && myLocation) {
            Alert.alert(
                'Confirmation',
                `You will be arrested if you send a false alarm to the ${type}.`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: async () => {
                            console.log(`Attempting to create issue with location:`, myLocation);
                            
                            try {
                                const response = await postData('/issues', {
                                    location: {
                                        latitude: myLocation.latitude,
                                        longitude: myLocation.longitude
                                    },
                                    type: type,
                                    e_type: e_type
                                }, userData?.token);
                
                                if (!response._id) {                
                                    Alert.alert("Error", 'Failed to notify the authorities. Please try again.');
                                    return;
                                }
                
                                // Emit the location data only if the issue is created successfully
                                socket.emit("sendLocation", {
                                    latitude: myLocation.latitude,
                                    longitude: myLocation.longitude,
                                    type: type,
                                    e_type: e_type,
                                    user: userData.user // Send the socket ID
                                });
                                {
                                    type === 'station' ?
                                    Alert.alert("Success", 'Nearest Police Station has been notified!') :
                                    Alert.alert("Success", 'Nearest Hospital has been notified!');
                                }
                
                            } catch (error) {
                                console.error('Error creating issue:', error);
                                Alert.alert("Error", 'Failed to notify the authorities. Please try again.');
                            }
                        },
                    },
                ],
                { cancelable: false }
            );
        } else {
            Alert.alert("Error", 'Couldn\'t get your location');
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#800020" />
            ) : (
                <View style={styles.innerContainer}>
                    <View style={styles.up}>
                        <FastImage
                            source={require("../../assets/police.jpeg")}
                            style={styles.police}
                        />
                        <View style={styles.btnContainer}>
                            <TouchableOpacity style={styles.btn} onPress={() => handleAlarmPress("station")}>
                                <Text style={styles.btnText}>Alarm Police!</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.down}>
                        <View style={styles.downLeft}>
                            <FastImage
                                source={require("../../assets/hospital.jpeg")}
                                style={styles.police}
                            />
                            <View style={styles.btnContainer}>
                                <TouchableOpacity style={styles.btn} onPress={() => handleAlarmPress("hospital")}>
                                    <Text style={styles.btnText}>Alarm Hospital!</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.downLeft}>
                            <FastImage
                                source={require("../../assets/write.jpeg")}
                                style={styles.police}
                            />
                            <View style={styles.btnContainer}>
                                <TouchableOpacity style={styles.btn}>
                                    <Text style={styles.btnText}>Write message!</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}
            {dropdownVisible && (
                <TouchableOpacity 
                    style={styles.overlay} 
                    onPress={() => setDropdownVisible(false)}
                    activeOpacity={1}
                >
                    <View style={styles.dropdownContainer}>
                        <ModalDropdown
                            options={dropdownOptions}
                            defaultValue="Select an emergency type"
                            onSelect={handleOptionSelect}
                            style={styles.dropdown}
                            textStyle={styles.dropdownText}
                            dropdownStyle={styles.dropdownList}
                        />
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        flex: 1,
        padding: 30,
        width: '100%',
    },
    police: {
        flex: 1,
        width: "100%",
        height: null,
    },
    up: {
        flex: 0.5,
        borderRadius: 10,
        borderColor: "#800020",
        borderWidth: 5,
        overflow: 'hidden',
        marginBottom: 5
    },
    downLeft: {
        borderRadius: 10,
        borderColor: "#800020",
        borderWidth: 5,
        overflow: 'hidden',
        flex: 1,
        marginTop: 5,
        width: "50%",
        margin: 3
    },
    down: {
        flex: 0.5,
        flexDirection: "row"
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    btn: {
        backgroundColor: "#800020",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        width: "70%",
    },
    btnText: {
        color: "#fff"
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },
    dropdown: {
        width: 200,
    },
    dropdownText: {
        fontSize: 16,
        padding: 10,
    },
    dropdownList: {
        width: '100%',
        borderRadius: 10,
    }
});

export default Home;
