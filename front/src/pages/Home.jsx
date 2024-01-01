import Nav from "../components/Nav"
import Post from "../components/Post"
import {
    useQuery,
    gql
} from "@apollo/client"
import { GET_FEED, LOAD_USERS } from "../GraphQL/Queries";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import Cookies from "js-cookie";

function Home() {
    const Ctx = useContext(Context)
    const [ vars, setVars ] = useState(Cookies.get('feed') )
    const { error, loading, data } = useQuery(GET_FEED, {
        variables: {
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            type: vars || "Recommended"
        }
    })

    useEffect(() => {
        // if(data)
        console.log(data)
    }, [data])

    useEffect(() => {
        console.log(Cookies.get('feed'), "FEED")
    }, [])
    return <>
        <Nav icons={true}/>
        { data?.getFeed.map((dat, index) => {
            return <Post data={dat} key={index} />
        })}
    </>
}
export default Home