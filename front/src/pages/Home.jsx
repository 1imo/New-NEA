import Nav from "../components/Nav"
import Post from "../components/Post"
import {
    useQuery,
    gql
} from "@apollo/client"
import { LOAD_USERS } from "../GraphQL/Queries";
import { useEffect } from "react";

function Home() {
    const { error, loading, data } = useQuery(LOAD_USERS)

    useEffect(() => {
        // if(data)
        console.log(data)
    }, [data])
    return <>
        <Nav icons={true}/>
        <Post />
    </>
}
export default Home