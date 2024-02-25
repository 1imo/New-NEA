// Singular post page

import Nav from "../components/Nav"
import Post from "../components/Post"
import {
    useQuery,
    gql
} from "@apollo/client"
import { LOAD_POST } from "../GraphQL/Queries";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../context/Context";

        
function PostView() {
    const { id } = useParams()
    const Ctx = useContext(Context)
    
    const [ vars, setVars ] = useState(parseInt(id))

    const { loading, error, data } = useQuery(LOAD_POST, {
        variables: {
            id: vars
        }
    })

    useEffect(() => {
        setVars(parseInt(id))
    }, [id])

    
    return <>
        {Ctx?.id && <Nav />}
        {data?.getPost ? 
            <Post data={data?.getPost} />
            : <h4>Post Not Found</h4>}
    </>
}
export default PostView