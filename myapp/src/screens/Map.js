import React, {useState, useEffect, useRef} from 'react'
import { View, Text, StyleSheet, Dimensions, Button, TouchableOpacity } from 'react-native'
import MapView, { Marker } from "react-native-maps"
import * as Location from "expo-location"

const Map = () => {
  const initialLocation = {
    latitude: 6.587290551862677,
    longitude: 3.996016893247818
  }
  [6.587290551862677,3.996016893247818]
  const [ myLocation, setMyLocation ] = useState(null)
  const [ pin, setPin ] = useState({})
  const [ region, setRegion ] = useState(null)
  const mapRef = useRef()

  const local = {
    latitude: "6.587290551862677",
    longitude: "3.996016893247818"
  }
  useEffect(() => {
    // setPin(local)
    getLocation()
  }, [])

  const getLocation = async() => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if( status !== "granted" ){
        console.warn("permission to access location was denied")
        return
      }
      let location = await Location.getCurrentPositionAsync({})
      console.log(location)
      setMyLocation(location.coords)
      
    } catch (error) {
      console.log(error)
    }
  }
  const focusOnLocation = () => {
    if(myLocation.latitude && myLocation.longitude){
      const region = {
        latitude: myLocation.latitude,
        longitude: myLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }
      if(mapRef.current){
        mapRef.current.animateToRegion(region, 1000)

      }
    }
  }
  return (
    <View style = {styles.container}>
      <MapView
        style = {styles.map}
        region = {region}
        onRegionChangeComplete={setRegion}
        ref = {mapRef}
        provide = "google"
      >
        {myLocation && (
          <Marker 
            coordinate = {{
              latitude: parseFloat(myLocation.latitude),
              longitude: parseFloat(myLocation.longitude)
            }}
            title = "Current Location"
            description='I am here'
          />
        )}
      </MapView>
      <TouchableOpacity style = {styles.buttonContainer} onPress={() => {focusOnLocation()}}>
        <Text style = {styles.btnText}>Get Location</Text>
      </TouchableOpacity>
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", 
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  buttonContainer: {
    position: "absolute",
    bottom : 20,
    padding: 17,
    alignItems: "center",
    backgroundColor: "#87CEEB"
  },
  btnText: {
    color: "#000"
  }
})

export default Map