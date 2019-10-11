import React , { useEffect, useRef}from 'react'
import ShopNavigator from './ShopNavigator'
import { useSelector} from 'react-redux'
import { NavigationActions} from 'react-navigation'


export default (props) => {
    const isAuth = useSelector(state => !!state.auth.token)
    const nevRef = useRef()
    useEffect(() => {
        if (!isAuth) {
            nevRef.current.dispatch(NavigationActions.navigate({routeName:'Auth'}))
        }
    },[isAuth])
    return (
        <ShopNavigator ref={nevRef} />
    )
}