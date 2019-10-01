import React, { useReducer, useCallback} from 'react'
import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Button } from 'react-native';
import Colors from '../../constants/Colors'
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card'
import { LinearGradient } from 'expo-linear-gradient'
import {useDispatch} from 'react-redux'
import { signUp } from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value
      };
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid
      };
      let updatedFormIsValid = true;
      for (const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
      }
      return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
      };
    }
    return state;
  };


const AuthScreen = props => {

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password:''
        },
        inputValidities: {
            email: false,
            password:false
        },
        formIsValid: false
      });

      const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
          });
        },
        [dispatchFormState]
      );
    const dispatch = useDispatch()

    const signUpHandler = () => {
        dispatch(signUp(formState.inputValues.email,formState.inputValues.password))
    }

    return (
        <KeyboardAvoidingView behavior={"padding"} keyboardVerticalOffset={50} style={styles.screen}>
            <LinearGradient style={styles.gradient} colors={['#ffedff','#ffe3ff']}>
            <Card style={styles.authContainer}>
                <ScrollView>
                    <Input id='email' label='E-mail' keyboardType={'email-address'} required email autoCapitalize={"none"} errorText={"please enter a valid email address"} onInputChange={inputChangeHandler} initialValue={""}/>
                    <Input id='password' label='Password' keyboardType={'default'} secureTextEntry required minLength={5} autoCapitalize={"none"} errorText={"please enter a valid password"} onInputChange={inputChangeHandler} initialValue={""}/>
                    <View style={styles.buttonContainer}>
                        <Button title="Log In" color={Colors.primary} onPress={signUpHandler} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Switch to sign up" color={Colors.accent} onPress={signUpHandler} />
                    </View>
                </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}
AuthScreen.navigationOptions = {
    headerTitle:'Authenticate'
}
const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth:400,
        maxHeight: 400,
        padding:20
    },
    gradient: {
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
    buttonContainer: {
        marginTop:10,
    }
});

export default AuthScreen