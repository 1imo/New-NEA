import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/Input"
import { useMutation } from "@apollo/client"
import { SIGN_IN } from "../GraphQL/Mutations"
import Cookies from "js-cookie"
import Loading from "../components/Loading";

export default function SignIn() {
    const [ username, setUsername ] = useState("")
    const [ pass, setPass ] = useState("")
    const [ position, setPosition ] = useState(0)
    const [ load, setLoading ] = useState(false)

    const navigate = useNavigate()

    const [ signIn, { data, loading, error } ] = useMutation(SIGN_IN)
    if(loading) return <Loading />
    if(error) alert("Error Signing In")

    async function call() {
        const res = await signIn({ variables: { username, pass }})        

        if(res.data.signIn.secretkey && res.data.signIn.id) {
            Cookies.set('secretkey', res.data.signIn.secretkey, { expires: 7 })
            Cookies.set('id', res.data.signIn.id, { expires: 7 })
            navigate("/")
        }
    }

    useEffect(() => {
        switch(position){
            case 0:
                if(username !== "") {
                    setPosition(1)
                    break;
                }
            case 1:
                if(pass !== "") {
                    setLoading(true)
                    call()
                    break;
                }

        }
    }, [username, pass])

    const screens = [
        <Input type="text" placeholder="|What's your username?" value={setUsername} referer={null}/>,
        <Input type="password" placeholder="|What's your password?" value={setPass} last={username} referer={null} />,
    ]
    
    return <>
        {!load && (screens[position])}
    </>
} 