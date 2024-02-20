import { useQuery } from "@apollo/client"
import { DISCOVER_PEOPLE } from "../GraphQL/Queries"
import { useContext, useEffect, useState } from "react"
import { Context } from "../context/Context"
import { useNavigate } from "react-router-dom"

function DiscoverProfile(props) {
    const [ vars, setVars ] = useState([])
    const Ctx = useContext(Context)
    const navigate = useNavigate("/")

    const { loading, data, err } = useQuery(DISCOVER_PEOPLE, {
        variables: {
            id: Ctx.id,
            secretkey: Ctx.secretkey
        },
        fetchPolicy: "cache-first"
    })

    useEffect(() => {
        setVars(JSON.parse(localStorage.getItem('recommendedUsers')))
    }, [])

    
    useEffect(() => {
        setVars(data?.recommendedUsers)
    }, [data])

    function Profile(props) {
        const { user } = props
        return <div style={styles.card} onClick={() => navigate(`/profile/${user.username}`)} >
            <div style={{borderRadius: 800, backgroundColor: "#F3F3F3", backgroundImage: `url(${Ctx.imageServer}/fetch/profile/${user.id})`, backgroundSize: "cover", height: 80, width: 80, backgroundPosition: "50% center"}}>&nbsp;</div>
            <h5>{user?.name.split(" ")[0]}</h5>
            <h5 style={{opacity: "50%"}}>{user.username}</h5>
        </div>
    }


    return <div style={{display: "flex", flexDirection: "row", alignItems: "center", columnGap: 16}}>
        {vars?.map((user, i) => {
            return <Profile key={i} user={user} />
        })}
    </div>
}

const styles = {
    card: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        padding: "24px 0 32px",
        cursor: "pointer",
        textAlign: "center",
    }
}

export default DiscoverProfile