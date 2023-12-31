import { createContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import io from 'socket.io-client';


const socket = io('http://localhost:8000/');


export const Context = createContext()

export const ContextProvider = ({ children }) => {

    const [ id, setId ] = useState(Cookies.get('id'))
    const [ secretkey, setSecretKey ] = useState(Cookies.get('secretkey'))
    
    useEffect(() => {
        setSecretKey(Cookies.get('secretkey'))
        setId(Cookies.get('id'))

        if(id, secretkey) {
          socket.emit("initialConnection", {id, secretkey})
    
        }

    }, [id, secretkey])

    useEffect(() => {
      if(id, secretkey) {
        socket.emit("initialConnection", {id, secretkey})

      }
    }, [socket])

   


    const contextValue = {
        id: parseInt(id),
        secretkey: secretkey,
        setId,
        setSecretKey,
        socket
    }
  
    return (
      <Context.Provider value={contextValue}>
        {children}
      </Context.Provider>
    );
  };