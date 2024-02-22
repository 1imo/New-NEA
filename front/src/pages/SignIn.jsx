import { useContext, useState, useEffect } from "react"
import { Context } from "../context/Context"
import { useNavigate } from "react-router-dom"
import Input from "../components/Input"
import PuffLoader from "react-spinners/PuffLoader"
import { useMutation } from "@apollo/client"
import { SIGN_IN } from "../GraphQL/Mutations"
import Cookies from "js-cookie"

export default function SignIn() {
    const Ctx = useContext(Context)
    const [ username, setUsername ] = useState("")
    const [ pass, setPass ] = useState("")

    const [ position, setPosition ] = useState(0)

    const [ load, setLoading ] = useState(false)

    const navigate = useNavigate()

    const [ signIn, { data, loading, error } ] = useMutation(SIGN_IN)

    async function call() {
        console.log("CALL", username, pass)
        // setLoading(true)

        const res = await signIn({ variables: { username, pass }})

        console.log(res)
        

        if(res.data.signIn.secretkey && res.data.signIn.id) {
            console.log("SET")
            Cookies.set('secretkey', res.data.signIn.secretkey, { expires: 7 })
            Cookies.set('id', res.data.signIn.id, { expires: 7 })
            navigate("/")
        }
    }




    useEffect(() => {
        console.log("HEARD")
        switch(position){
            case 0:
                if(username !== "") {
                    console.log("reached")
                    setPosition(1)
                    break;
                }
            case 1:
                if(pass !== "") {
                    console.log("reached")
                    console.log(username, pass)
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
        <PuffLoader cssOverride={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}color="#eeeeee" loading={load} size={160} />
    </>
} 