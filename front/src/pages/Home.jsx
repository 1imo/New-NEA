import Nav from "../components/Nav"
import Post from "../components/Post"
import {
    useQuery,
    gql,
    useMutation
} from "@apollo/client"
import { DISCOVER_PEOPLE, GET_FEED, LOAD_USERS } from "../GraphQL/Queries";
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import Cookies from "js-cookie";
import DiscoverProfile from "../components/DiscoverProfile";


function Home() {
    const Ctx = useContext(Context)
    // const [ vars, setVars ] = useState(Cookies.get('feed') )
    const [ id, setId ] = useState(Ctx.id)

    const { err, load, dat } = useQuery(DISCOVER_PEOPLE, {
        fetchPolicy: 'network-only',
        variables: {
            id: id || 1
        }
    })

    // const { error, loading, data } = useQuery(GET_FEED, {
    //     variables: {
    //         id: Ctx.id,
    //         secretkey: Ctx.secretkey,
    //         type: vars || "Recommended"
    //     }
    // })

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

    useEffect(() => {
        
        console.log(dat)
    }, [dat])


    console.log(dat?.recommendedUsers)

    
   


    return <>
        <Nav icons={true}/>
        {/* { data?.getFeed.map((da, index) => {
            return <Post data={da} key={index} />
        })} */}
    </>
}
export default Home