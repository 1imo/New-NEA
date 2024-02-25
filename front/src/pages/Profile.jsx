import { GET_USERPOSTS } from "../GraphQL/Queries"
import Loading from "../components/Loading";
import Post from "../components/Post"
import ProfileInfo from "../components/ProfileInfo"
import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react";
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
    if(error) alert("Error Loading Profile")
    if(loading) return <Loading />

    useEffect(() => {
        setD(id)
    }, [id])

    useEffect(() => {
        if(data?.getAllPosts) {
            const posts = data?.getAllPosts.map((vals, index) => {
                return <Post data={vals} key={index} />
            })
            setReversed(posts.reverse())
        }
    }, [data])
   
    return <>
        <ProfileInfo />
        {reversed?.length > 0 ? reversed?.map((vals, index) => {console.log("VALS", vals);return vals}) : <h4 style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "#CECECD"}} >No Posts to Display</h4>}
    </>
}
export default Profile