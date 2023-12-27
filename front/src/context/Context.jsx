import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';




export const Context = createContext()

export const ContextProvider = ({ children }) => {

    const [ id, setId ] = useState(Cookies.get('id'))
    const [ secretkey, setSecretKey ] = useState(Cookies.get('secretkey'))
    
    useEffect(() => {
        setSecretKey(Cookies.get('secretkey'))
        setId(Cookies.get('id'))
    }, [id, secretkey])

    const contextValue = {
        id: parseInt(id),
        secretkey: secretkey,
        setId,
        setSecretKey
    }
  
    return (
      <Context.Provider value={contextValue}>
        {children}
      </Context.Provider>
    );
  };