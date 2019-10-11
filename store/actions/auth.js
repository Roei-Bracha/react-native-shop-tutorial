export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGUT'
import { AsyncStorage } from 'react-native'

let timer

export const authenticate = (userId, token, expiryTime) => {
  return async dispatch => {
    dispatch(setLogoutTimer(expiryTime))
    dispatch({
      type: AUTHENTICATE,
      userId,
      token
    })
  }
}

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCVBthWBrdp27KUJna0ttdcNsb2zUfiNfo',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
        const errorResData = await response.json();
        const errorId = errorResData.error.message;
        let message = 'Something went wrong!';
        if (errorId === 'EMAIL_EXISTS') {
          message = 'This email exists already!';
        }
        throw new Error(message);
      }

    const resData = await response.json();
    const expirationDate =  new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
    saveDataToStorage(resData.idToken, resData.localId, expirationDate)
    dispatch(authenticate(resData.localId,resData.idToken,parseInt(resData.expiresIn)*1000))
  };
};


export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCVBthWBrdp27KUJna0ttdcNsb2zUfiNfo',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    dispatch(authenticate(resData.localId,resData.idToken,parseInt(resData.expiresIn) * 1000))
    const expirationDate =  new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000)
    saveDataToStorage(resData.idToken,resData.localId,expirationDate)
  };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer)
  }
}

export const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout())
    },expirationTime)
  }
}

export const logout = () => {
  clearLogoutTimer()
  AsyncStorage.removeItem('userData')
  return {type:LOGOUT}
}

const saveDataToStorage = (token, userId,expirationDate) => {
  AsyncStorage.setItem('userData',JSON.stringify({token,userId,expiryDate:expirationDate.toISOString}))
}