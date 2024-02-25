import { useContext, useEffect, useState } from "react"
import Input from "../components/Input"
import { CREATE_USER_MUTATION } from "../GraphQL/Mutations"
import { useMutation } from "@apollo/client"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import { Context } from "../context/Context"
import Loading from "../components/Loading";


function Onboarding() {
    const Ctx = useContext(Context)
    const [ fn, setFn ] = useState("")
    const [ ln, setLn ] = useState("")
    const [ username, setUsername ] = useState("")
    const [ pass, setPass ] = useState("")
    const [ profile, setProfile ] = useState("")

    const [ position, setPosition ] = useState(0)

    const [ load, setLoading ] = useState(false)


    const [ createUser, { data, error, loading } ] = useMutation(CREATE_USER_MUTATION)
    if(loading) return <Loading />
    if(error) alert("Error Creating Profile")

    const navigate = useNavigate()

    async function call() {
        setLoading(true)
        const res = await createUser({
                        variables: {
                            firstName: fn,
                            lastName: ln,
                            username: username,
                            password: pass
                        }
                    })

        if(res.data.createUser.secretkey && res.data.createUser.id) {
            Cookies.set('secretkey', res.data.createUser.secretkey, { expires: 7 })
            Cookies.set('id', res.data.createUser.id, { expires: 7 })

            if(profile) {
                await fetch(Ctx.imageServer + "/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "id": res.data.createUser.id,
                        "image": String(profile),
                        "correlation": "Profile",
                    })
                })
            }

            navigate("/")
        }
    }


    useEffect(() => {
        switch(position){
            case 0:
                if(fn !== "") {
                    setPosition(1)
                    break;
                }
            case 1:
                if(ln !== "") {
                    setPosition(2)
                    break;
                }
            case 2:
                if(username !== "") {
                    setPosition(3)
                    break;
                }
            case 3:
                if(pass !== "") {
                    setPosition(4)
                    break;
                }
            case 4:
                if(profile !== "") {
                    call()
                    break;
                }

        }
    }, [fn, ln, username, pass, profile])

    const screens = [
        <Input type="text" placeholder="|What's Your Name?" value={setFn} referer="/portal"/>,
        <Input type="text" placeholder="|What's Your Last Name?" value={setLn} last={fn} referer={null}/>,
        <Input type="text" placeholder="|What Will Your Username Be?" value={setUsername} last={ln} referer={null}/>,
        <Input type="password" placeholder="|Choose a Good Password" value={setPass} last={username} referer={null} />,
        <Input type="file" value={setProfile} last={pass} referer={null} />,
    ]
    return <>
        {!load && (screens[position])}
    </>
}

export default Onboarding