import { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Context } from "../context/Context";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PENDING_REQUESTS } from "../GraphQL/Queries";
import { BEFRIEND_PENDING, EDIT_DATA } from "../GraphQL/Mutations";
import ProfileInsight from "../components/ProfileInsight";
import Cookies from "js-cookie";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

function Settings() {

    const { socket } = useContext(Context)
    const Ctx = useContext(Context)

    const [ optn, setOptn ] = useState(0)
    const [ value, setValue ] = useState(null)
    const [ view, setView ] = useState(0)
    const [ picked, setPicked ] = useState("")
    const [ placeholder, setPlaceholder ] = useState("")
    const [ render, setRender ] = useState([])

    const navigate = useNavigate()

    const feedOptns = ["Recommended", "Date", "Friends", "Following"]

    const { data, err, loading } = useQuery(GET_PENDING_REQUESTS, {
        variables: {
            id:Ctx.id,
            secretkey: Ctx.secretkey
        }
    })

    useEffect(() => {
        setRender(data?.getPending)
    }, [data])

    const [ createEdit, { d, e, l } ] = useMutation(EDIT_DATA)

    function changeFeed() {
        if(optn != feedOptns.length - 1) {
            setOptn(optn + 1)
            Cookies.set("feed", feedOptns[optn + 1])
        } else {
            setOptn(0)
            Cookies.set("feed", feedOptns[0])
        }

    }

    


    useEffect(() => {
        socket.on("followed", da => {
            if(render?.length == 0 || render?.length >= 0 && render[0].id != da?.follower?.id) {

                const f = da?.follower

                const format = {
                    pendingId: da?.id,
                    ...f
                }
                setRender([ format, ...render ])
                console.log(format)
            }
        })
    
        const original = Cookies.get("feed")
        const index = feedOptns.findIndex(op => op == original)
        setOptn(index)
      
    }, [])

    let content = [
        <>
            <Nav icons={true} />

            {render && (
                <section style={{marginBottom: 24}}>
                    <h4 style={{marginBottom: 16}}>Pending</h4>
                    {render?.map((info, index) => {
                        console.log(info)
                        return <ProfileInsight reference={"pending"} key={index} name={info.name} username={info.username} pendingId={info?.pendingId} id={info?.id} />
                    })}
                </section>
            )}
            <section>
                <h4 style={{marginBottom: 16}}>Settings</h4>
                <p style={{marginBottom: 8}} onClick={() =>  changeFeed()}>Tap to change feed: {feedOptns[optn]}</p>
                <p style={{marginBottom: 8}} onClick={() => edit("New Name..", "name")}>Change Name</p>
                <p style={{marginBottom: 8}} onClick={() => edit("New Username..", "username")}>Change Username</p>
                <p style={{marginBottom: 8}} onClick={() => edit("New Password..", "password")}>Change Password</p>
                <p style={{marginBottom: 8}} onClick={() => logout()}>Log Out</p>
            </section>
        </>,
        <Input type={picked != "password" ? "text" : "password"} placeholder={placeholder} value={setValue} referer="/settings" />
    ]

    function edit(placeholder, type) {
        setPlaceholder(placeholder)
        setPicked(type)
        setView(1)
    }

    function logout() {
        Cookies.remove("id")
        Cookies.remove("secretkey")
        navigate("/portal")
    }

    async function around() {
        let res = await createEdit({
            variables: {
                id: Ctx.id,
                secretkey: Ctx.secretkey,
                request: picked,
                data: value
            }
        })

        if(res?.data?.editDetails?.secretkey) {
            console.log("SECRET KEY", res?.data?.editDetails?.secretkey)
            Cookies.set("secretkey", res?.data?.editDetails?.secretkey, { expires: 7 })
        }

        console.log(res?.data)
        return res
    }

    useEffect(() => {
        if(value) {
            console.log(value, picked)
            console.log(around())
            setView(0)
        }
    }, [value])


    return content[view]
}

export default Settings