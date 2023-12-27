import { useEffect, useState } from "react"
import Input from "../components/Input"
import { CREATE_USER_MUTATION } from "../GraphQL/Mutations"
import { useMutation } from "@apollo/client"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"


function Onboarding() {
    const [ fn, setFn ] = useState("")
    const [ ln, setLn ] = useState("")
    const [ username, setUsername ] = useState("")
    const [ pass, setPass ] = useState("")

    const [ position, setPosition ] = useState(0)

    const [ createUser, { data, error, loading } ] = useMutation(CREATE_USER_MUTATION)

    const navigate = useNavigate()

    async function call() {
        const res = await createUser({
                        variables: {
                            firstName: fn,
                            lastName: ln,
                            username: username,
                            password: pass
                        }
                    })
        console.log(res)

        if(res.data.createUser.secretkey && res.data.createUser.id) {
            console.log("SET")
            Cookies.set('secretkey', res.data.createUser.secretkey, { expires: 7 })
            Cookies.set('id', res.data.createUser.id, { expires: 7 })
            navigate("/")
        }
    }


    useEffect(() => {
        console.log("HEARD")
        switch(position){
            case 0:
                if(fn !== "") {
                    console.log("reached")
                    setPosition(1)
                    break;
                }
            case 1:
                if(ln !== "") {
                    console.log("reached")
                    setPosition(2)
                    break;
                }
            case 2:
                if(username !== "") {
                    console.log("reached")
                    setPosition(3)
                    break;
                }
            case 3:
                if(pass !== "") {
                    console.log("reached")
                    console.log(fn, ln, username, pass)
                    call()

                    

                    if(error) {
                        console.log("error")
                    }
                    break;
                }

        }
    }, [fn, ln, username, pass])

    const screens = [
        <Input type="text" placeholder="|What's Your Name?" value={setFn} btnPlaceholder="Continue" referer="/portal"/>,
        <Input type="text" placeholder="|What's Your Last Name?" value={setLn} btnPlaceholder="Continue" referer={null}/>,
        <Input type="text" placeholder="|What Will Your Username Be?" value={setUsername} btnPlaceholder="Continue" referer={null}/>,
        <Input type="password" placeholder="|Choose a Good Password" value={setPass} btnPlaceholder="Continue" referer={null}/>,
    ]
    return <>
        {screens[position]}

    </>
}

export default Onboarding