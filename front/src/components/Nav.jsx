import {
    Link, useNavigate
  } from "react-router-dom";
import {
    useQuery,
    gql
} from "@apollo/client"
import Cookies from "js-cookie"
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { GET_NAVINFO } from "../GraphQL/Queries";
import Loading from "./Loading";

        

    



function Nav(props) {
    const navigate = useNavigate()
    const [ vars, setVars ] = useState({})
    const [ info, setInfo ] = useState(null)

    const Ctx = useContext(Context)

    const { loading, error, data } = useQuery(GET_NAVINFO, {
        fetchPolicy: "cache-first",
        variables: vars
    })
    if(loading) return <Loading />
    if(error) alert("Error Loading Nav Info")

    useEffect(() => {
        setVars({
            id: Ctx.id
        })
        setInfo(JSON.parse(localStorage.getItem('navData')))
    }, [])


    useEffect(() => {
        if (data) {
          localStorage.setItem('navData', JSON.stringify(data))
          setInfo(data)
        }
    }, [data])

    return <>
        <nav style={styles.nav}>
            <div style={styles.one}>
                <Link to={`/profile/${info?.navInfo?.username}`} style={styles.one}>
                <div style={{borderRadius:56, backgroundColor: "#F3F3F3", backgroundImage: `url(${Ctx.imageServer}/fetch/profile/${Ctx?.id})`, backgroundSize: "cover", height:56, width:56, backgroundPosition: "50% center"}}>&nbsp;</div>
                    <div>
                        <h3>{info?.navInfo?.name.split(" ")[0]} {info?.navInfo?.name.split(" ")[1]}</h3>
                        <h6>@{info?.navInfo?.username}</h6>
                    </div>
                </Link>
            </div>
            {props.icons === true ? <div style={styles.two}>
                <Link to="/post"><img src="/post.svg" /></Link>
                <Link to="#" onClick={(e) => {e.preventDefault();navigate("/search", { state: "main" })}}><img src="/search.svg" /></Link>
                <Link to="/messaging"><img src="/message.svg" /></Link>
                <Link to="/settings"><img src="/more.svg" /></Link>
            </div> : null}
        </nav>
    </>
}

const styles = {
    nav: {
        "display": "flex",
        "justifyContent": "space-between",
        "width": "calc(100vw - 32px)",
        "marginBottom": "32px",
        paddingTop: 32,
        width: "100%",
        maxWidth: 640,
        alignItems: "center",
        margin: "0 auto 32px"
    },
    one: {
        "display": "flex",
        "alignItems": "center",
        // paddingTop: -16,
        "columnGap": "8px"
    },
    two: {
        "display": "flex",
        "alignItems": "center",
        "columnGap": "16px"
    }
}
export default Nav