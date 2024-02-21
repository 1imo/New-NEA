import Nav from "../components/Nav"
import Post from "../components/Post"
import {
    useQuery,
    gql,
    useMutation
} from "@apollo/client"
import { GET_FEED } from "../GraphQL/Queries";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import Cookies from "js-cookie";
import DiscoverProfile from "../components/DiscoverProfile";
import { useNavigate } from "react-router-dom";
import PuffLoader from "react-spinners/PuffLoader";


function Home() {
    const Ctx = useContext(Context)
    const [ vars, setVars ] = useState(Cookies.get('feed'))
    const [ id, setId ] = useState(Ctx.id)
    const [ load, setLoading ] = useState(true)
    const navigate = useNavigate("/")
    

    // // const { err, load, dat } = useQuery(DISCOVER_PEOPLE, {
    // //     fetchPolicy: 'network-only',
    // //     variables: {
    // //         id: id || 1
    // //     }
    // // })

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("u")
        const key = urlParams.get("k")

        console.log(user, key)

        if(user && key) {
            Cookies.set("id", user)
            Cookies.set("secretkey", key)
        }
    }, [])

    const { error, loading, data } = useQuery(GET_FEED, {
        variables: {
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            type: vars || "Recommended"
        }
    })

    if (error) {
        navigate("/portal")
    }

    useEffect(() => {
        setId(Ctx.id)
    }, [Ctx.id])



    // const [ discPeople, { er, lo, da }] = useMutation(DISCOVER_USERS)

    // useEffect(() => {
    //     async function discover() {
    //         const res = await discPeople({
    //             variables: {
    //                 id: Ctx.id
    //             }
    //         })

    //         console.log(res)
    //     }

    //     discover()
    // }, [])

    // useEffect(() => {
        
    //     console.log(dat)
    // }, [dat])


    // console.log(dat?.recommendedUsers)

    const Feed = () => {
        console.log(data?.getFeed, data?.getFeed != [])
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
            <div>
                <Feed />
            </div>
          )}
          <PuffLoader
            cssOverride={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
            color="#eeeeee"
            loading={load}
            size={160}
          />
        </>
      );
}
export default Home