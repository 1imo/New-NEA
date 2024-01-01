import { useContext, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Context } from "../context/Context";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PENDING_REQUESTS } from "../GraphQL/Queries";
import { BEFRIEND_PENDING } from "../GraphQL/Mutations";
import ProfileInsight from "../components/ProfileInsight";
import Cookies from "js-cookie";

function Settings() {

    const { socket } = useContext(Context)
    const Ctx = useContext(Context)

    const [ optn, setOptn ] = useState(0)

    const feedOptns = ["Recommended", "Date", "Friends", "Following"]

    const { data, err, loading } = useQuery(GET_PENDING_REQUESTS, {
        variables: {
            id:Ctx.id,
            secretkey: Ctx.secretkey
        }
    })

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
        socket.on("followed", data => {
            console.log(data, "FOLLOWED")
          })

        const original = Cookies.get("feed")
        const index = feedOptns.findIndex(op => op == original)
        setOptn(index)
      
    }, [])

    useEffect(() => {
        if(data) {
            console.log(data)
        }

        console.log("CHANGE", data)
    }, [data])
    

    return <>
        <Nav icons={true} />

        <section>
            <h4>Pending</h4>
            {data?.getPending.map((info, index) => {
                return <ProfileInsight reference={"pending"} key={index} firstName={info.firstName} lastName={info.lastName} username={info.username} id={info.id} />
            })}
        </section>
        <section>
            <h4>Settings</h4>
            <p onClick={() =>  changeFeed()}>Tap to change feed: {feedOptns[optn]}</p>
            <p>Change Name</p>
            <p>Change Username</p>
            <p>Change Password</p>
            <p>Log Out</p>
        </section>
    </>
}

export default Settings