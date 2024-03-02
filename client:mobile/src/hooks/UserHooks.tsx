
import { useEffect, useState } from 'react';
import { IUserData, IUserProps, useAppDispatch } from '../redux/type';
import { logoutUser, loginUser } from '../redux/reducer/userReducer';
import { getItemFromStorage, removeItemFromStorage, setItemToStorage } from '../utils/persistence';

const useCurrentUser = () => {
    const [_currentUser, _setCurrentUser] = useState<IUserData | null>(null);
    const [_userToken, _setuserToken] = useState<string | null>(null);

    const dispatch = useAppDispatch()

    useEffect(() => {
        const getCurrentUser = async () => {
            if (!_currentUser && !_userToken) {
                const _userFromStorage = await getItemFromStorage('user')
                const _userTokenFromStorage = await getItemFromStorage('userToken')
                if (!_userTokenFromStorage && !_userFromStorage) {
                    return
                }
                _setCurrentUser(_userFromStorage)
                _setuserToken(_userTokenFromStorage)
                dispatch(loginUser({ user: { ..._userFromStorage }, userToken: { ..._userTokenFromStorage } }))
                return
            }
            return
        }

        getCurrentUser()
    }, [])



    // Login New User
    const loginCurrentUser = (userData: IUserProps) => {
        // useState
        _setCurrentUser(userData.user)
        _setuserToken(userData.userToken)
        // Dispatch
        dispatch(loginUser({ ...userData }))
        // Storage
        setItemToStorage('user', userData.user)
        setItemToStorage('userToken', userData.userToken)
    }

    // Logout User
    const logoutCurrentUser = () => {
        // useState
        _setCurrentUser(null);
        _setuserToken(null)
        // Dispatch
        dispatch(logoutUser)
        // Storage 
        removeItemFromStorage('user')
        removeItemFromStorage('userToken')
    };



    return {
        currentUser: _currentUser,
        userToken: _userToken,
        loginCurrentUser,
        logoutCurrentUser
    };
};

export default useCurrentUser;
