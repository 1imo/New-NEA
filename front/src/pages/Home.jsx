import Nav from "../components/Nav"
import Post from "../components/Post"
import {
    useQuery,
    gql
} from "@apollo/client"
import { GET_FEED, LOAD_USERS } from "../GraphQL/Queries";
import { useContext, useEffect } from "react";
import { Context } from "../context/Context";

function Home() {
    const Ctx = useContext(Context)
    const { error, loading, data } = useQuery(GET_FEED, {
        variables: {
            id: Ctx.id,
            secretkey: Ctx.secretkey
        }
    })

    useEffect(() => {
        // if(data)
        console.log(data)
    }, [data])
    return <>
        <Nav icons={true}/>
        { data?.getFeed.map((dat, index) => {
            return <Post data={dat} key={index} />
        })}
    </>
}
export default Home