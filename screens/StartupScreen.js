import React, {useEffect} from 'react'
import { View, ActivityIndicator,StyleSheet,AsyncStorage} from 'react-native'
import Colors from '../constants/Colors'
import { authenticate } from '../store/actions/auth'
import { useDispatch } from 'react-redux'

const StartupScreen = props => {
    const dispatch = useDispatch()
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData')
            if (!userData) {
                props.navigation.navigate('Auth');
                return;
            }
            const { token, userId, expiryDate } = JSON.parse(userData);
            const expirationDate = new Date(expiryDate);

            if (expirationDate <= new Date() || !token || !userId) {
                return;
            }

            const expirationTime = expirationDate.getTime() - new Date().getTime()

            await dispatch(authenticate(userId, token, expirationTime))
            props.navigation.navigate('Shop');
        }
        tryLogin()
    },[dispatch])
    return (
        <View style={styles.screen}>
            <ActivityIndicator size={"large"} color={Colors.primary}/>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center'
    }
})
export default StartupScreen