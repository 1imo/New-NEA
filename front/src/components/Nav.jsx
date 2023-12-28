import {
    Link
  } from "react-router-dom";
import {
    useQuery,
    gql
} from "@apollo/client"
import Cookies from "js-cookie"
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { GET_NAVINFO } from "../GraphQL/Queries";

        

    



function Nav(props) {

    // const [ getNavInfo, { data, error, loading } ] = useMutation(GET_NAVINFO)

    const [ username, setUsername ] = useState("")
    const [ firstName, setFirstName ] = useState("")
    const [ lastName, setLastName ] = useState("")
    const [ vars, setVars ] = useState({})

    const Ctx = useContext(Context)

    const { loading, error, data } = useQuery(GET_NAVINFO, {
        variables: vars
    })

    useEffect(() => {
        setVars({
            id: Ctx.id
        })
    }, [])

    console.log(data)
    console.log(vars)

    

    


    return <>
        <nav style={styles.nav}>
            <div style={styles.one}>
                <Link to={`/profile/${data?.navInfo?.username}`} style={styles.one}>
                    <img src="/profile.jpg" height="40px" width="40px" style={{"borderRadius": "40px"}} />
                    <div>
                        <h3>{data?.navInfo?.firstName} {data?.navInfo?.lastName}</h3>
                        <h6>@{data?.navInfo?.username}</h6>
                    </div>
                </Link>
            </div>
            {props.icons === true ? <div style={styles.two}>
                <Link to="/post"><img src="/post.svg" /></Link>
                <Link to="/search"><img src="/search.svg" /></Link>
                <Link to="/messaging"><img src="/message.svg" /></Link>
            </div> : null}
        </nav>
    </>
}

const styles = {
    nav: {
        "display": "flex",
        "justifyContent": "space-between",
        "width": "100%",
        "marginBottom": "32px"
    },
    one: {
        "display": "flex",
        "columnGap": "8px"
    },
    two: {
        "display": "flex",
        "alignItems": "center",
        "columnGap": "16px"
    }
}
export default Nav