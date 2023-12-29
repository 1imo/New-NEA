import { GET_PUBLICDATA, GET_USERPOSTS } from "../GraphQL/Queries"
import Post from "../components/Post"
import ProfileInfo from "../components/ProfileInfo"
import { useQuery, gql } from "@apollo/client"
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom"

function Profile() {

    const { id } = useParams()
    const [ d, setD ] = useState("")

    const [ reversed, setReversed ] = useState([])

    const { loading, error, data } = useQuery(GET_USERPOSTS, {
        variables: {
            username: d
        }
    })

    useEffect(() => {
        setD(id)
    }, [id])

    

   

    useEffect(() => {
        console.log(data, "DATA")

        if(data?.getAllPosts) {
            const posts = data?.getAllPosts.map((vals, index) => {
                return <Post data={vals} key={index} />
            })

            setReversed(posts.reverse())
        }

        console.log("CHANGE")
    }, [data])
   

    if(error) console.log(error)


    return <>
        <ProfileInfo />
        {reversed?.map((vals, index) => {return vals})}
    </>
}
export default Profile