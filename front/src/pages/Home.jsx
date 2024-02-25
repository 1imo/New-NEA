import Nav from "../components/Nav"
import Post from "../components/Post"
import {
    useQuery,
} from "@apollo/client"
import { GET_FEED } from "../GraphQL/Queries";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import Cookies from "js-cookie";
import DiscoverProfile from "../components/DiscoverProfile";
import { useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";
import { removeClientSetsFromDocument } from "@apollo/client/utilities";
import Loading from "../components/Loading";


function Home() {
    const Ctx = useContext(Context)
    const [ vars, setVars ] = useState(Cookies.get('feed'))
    const [ load, setLoading ] = useState(true)
    const navigate = useNavigate("/")

    const { error, loading, data } = useQuery(GET_FEED, {
        variables: {
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            type: vars || "Recommended"
        }
    })
    

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("u")
        const key = urlParams.get("k")

        if(user && key) {
            Cookies.set("id", user)
            Cookies.set("secretkey", key)
        }
    }, [])

    
    if (error) alert("Error Loading Feed")
    if(loading) return <Loading />


    const Feed = () => {
        return data?.getFeed?.length > 0 ? data?.getFeed?.map((da, index) => {
            if(index != 2) {
                return <Post data={da} key={da.id || index} />
            } else {
                return <>
                        <Post data={da} key={da.id || index} />
                        <DiscoverProfile />
                    </>
            }
        }) : <div style={{position: "absolute", textAlign: "center", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
            <h4 style={{color: "#CECECD"}} >Go Follow Someone Active</h4> 
            <DiscoverProfile animation={true} />
        </div>
    }
   


    return (
        <>
            <Nav icons={true} load={setLoading} style={load ? {opacity: 0} : null} />
          {!load && (
            <div style={{boxSizing: "border-box", width: "100%", maxWidth: 640, overflowX: "hidden"}}>
                <Feed />
            </div>
          )}
        </>
      );
}
export default Home