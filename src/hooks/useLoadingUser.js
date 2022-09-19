import { onAuthStateChanged } from 'firebase/auth';

//hooks
import { useState, useEffect } from 'react';
import { useAuthentication } from './useAuthentication';

export const useLoadingUser = () =>{
 const [user, setUser] = useState(undefined)
 const { auth } = useAuthentication()

 const loadingUser = user === undefined

 useEffect(()=>{
     onAuthStateChanged(auth,
     user => setUser(user))    
 },[auth])


 return {user, loadingUser}
}