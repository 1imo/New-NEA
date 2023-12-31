import { useContext, useEffect } from "react";
import Nav from "../components/Nav";
import { Context } from "../context/Context";
import { useMutation, useQuery } from "@apollo/client";
import { GET_PENDING_REQUESTS } from "../GraphQL/Queries";
import { BEFRIEND_PENDING } from "../GraphQL/Mutations";
import ProfileInsight from "../components/ProfileInsight";

function Settings() {

    const { socket } = useContext(Context)
    const Ctx = useContext(Context)

    const { data, err, loading } = useQuery(GET_PENDING_REQUESTS, {
        variables: {
            id:Ctx.id,
            secretkey: Ctx.secretkey
        }
    })


    useEffect(() => {
        socket.on("followed", data => {
            console.log(data, "FOLLOWED")
          })
      
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
            <p>Change Name</p>
            <p>Change Username</p>
            <p>Change Password</p>
            <p>Log Out</p>
        </section>
    </>
}

export default Settings