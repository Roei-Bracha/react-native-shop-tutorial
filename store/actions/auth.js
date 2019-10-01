export const SIGN_UP = 'SIGN_UP'

export const signUp = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCVBthWBrdp27KUJna0ttdcNsb2zUfiNfo', {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken:true
            })
        })
        
        if (!response.ok) {
            throw new Error('something went wrong')
        }
        const resData = await response.json();
        console.log(resData)
        dispatch({

        })
    }
}