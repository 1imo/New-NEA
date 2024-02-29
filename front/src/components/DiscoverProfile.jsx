import { useQuery } from "@apollo/client"
import { DISCOVER_PEOPLE } from "../GraphQL/Queries"
import { useContext, useEffect, useState, useRef } from "react"
import { Context } from "../context/Context"
import { useNavigate } from "react-router-dom"

// import init, { Queue } from "../../public/pkg/web_module"
import Loading from "./Loading";


function DiscoverProfile(props) {
    const [ vars, setVars ] = useState([])
    const Ctx = useContext(Context)
    const navigate = useNavigate("/")

    const queue = useRef(null)
    const removeX = useRef(0)

    const { loading, data, err } = useQuery(DISCOVER_PEOPLE, {
        variables: {
            id: Ctx.id,
            secretkey: Ctx.secretkey
        },
        fetchPolicy: "cache-first"
    })

    if(loading) return <Loading />
    if(err) alert("Error Loading Recommended Users")
    
    useEffect(() => {
        setVars(JSON.parse(sessionStorage.getItem('recommendedUsers')))
    }, [])
    
    useEffect(() => {
        setVars(data?.recommendedUsers.map(user => {JSON.stringify(user)}))
    }, [data])

    // useEffect(() => {
    //     init().then((module) => {
    //         queue.current = Queue.new(10)
    //         data?.recommendedUsers.map(user => {
    //             queue.current.enqueue(JSON.stringify(user))
    //         })
    //         let count = 0
    //         const animationInterval = setInterval(() => {
    //             removeX.current = removeX.current + 1
    //             count += 1
    //             if(count == 96) {
    //                 queue.current.enqueue(queue.current.dequeue())
    //                 count -= 96
    //                 removeX.current = 0
    //             }

    //         }, 40)

    //         return () => {
    //             clearInterval(animationInterval)
    //         }
    //     })
    // }, [vars])

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
            transform: `translateX(-${removeX.current}px)`,
            transition: "transform 0.5s ease defer",
        }
    }

    function Profile(props) {
        const { user } = props
        return <div style={styles.card} onTouchStart={() => navigate(`/profile/${user.username}`)} onMouseDown={() => navigate(`/profile/${user.username}`)} className="carousel" >
            <div style={{borderRadius: 800, backgroundColor: "#F3F3F3", backgroundImage: `url(${Ctx.imageServer}/fetch/profile/${user.id})`, backgroundSize: "cover", height: 80, width: 80, backgroundPosition: "50% center"}}>&nbsp;</div>
            <h5 style={{marginTop: 4}}>{user?.name.split(" ")[0]}</h5>
            <h5 style={{opacity: "50%"}}>{user.username}</h5>
        </div>
    }

    return <div style={{display: "flex", flexDirection: "row", alignItems: "center", columnGap: 16, width: "100%", maxWidth: 640, overflowX: "hidden"}}>
        {queue?.current?.get_current_items()?.map((user, i) => {
            return <Profile key={i} user={JSON.parse(user)} />
        })}
    </div>
}

export default DiscoverProfile