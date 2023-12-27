import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client"
import { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { GET_PUBLICDATA } from "../GraphQL/Queries";
import { useParams } from "react-router-dom"
import { FOLLOW_UNFOLLOW } from "../GraphQL/Mutations";

        

    



function ProfileInfo() {

    const client = useApolloClient();

    const { id } = useParams()
    const [ d, setD ] = useState("")

    const Ctx = useContext(Context)

    const { loading, error, data } = useQuery(GET_PUBLICDATA, {
        variables: {
            username: d
        }
    })

    const [ followUnfollow, { dataMut, errorMut, loadingMut } ] = useMutation(FOLLOW_UNFOLLOW)

    async function call() {
        console.log({
            id: Ctx.id,
            secretkey: Ctx.secretkey,
            username: d
        })
        const res = await followUnfollow({
                        variables: {
                            id: Ctx.id,
                            secretkey: Ctx.secretkey,
                            username: d
                        }
                    })
        console.log(res)

        
    }

    

    useEffect(() => {
        setD(id)
    }, [id])

    useEffect(() => {
        console.log(data)
    }, [data])
   

    if(error) console.log(error)
    

    useEffect(() => {
        const followBtn = document.querySelector(".followBtn")
    
        followBtn.addEventListener('mousedown', e => {
            e.preventDefault()
            console.log("CLICK")
        })

        followBtn.addEventListener('touchstart', e => {
            e.preventDefault()
        })

    })


    return <>
        <section style={{"display": "flex", "width": "100%", "columnGap": "16px", "justifyContent": "space-between", marginBottom: 32}}>
            <div>
                <div style={{display: "flex", columnGap: 8}}>
                    <img src="/profile.jpg" height="40px" width="40px" style={{"borderRadius": "40px"}} />
                    <div>
                        <h3>{data?.getPublicInfo?.firstName} {data?.getPublicInfo?.lastName}</h3>
                        <h5>@{data?.getPublicInfo?.username}</h5>
                    </div>
                </div>
                <div style={styles.info}>
                    <p style={{fontWeight: 600}}>
                        {data?.getPublicInfo?.followerCount > 1000 ? 
                        `${data?.getPublicInfo?.followerCount / 1000}k` : 
                        data?.getPublicInfo?.followerCount}<br/><h5 style={{fontWeight: 500}}>Followers</h5>
                    </p>
                    <p style={{fontWeight: 600}}>
                        {data?.getPublicInfo?.followingCount > 1000 ? 
                        `${data?.getPublicInfo?.followingCount / 1000}k` : 
                        data?.getPublicInfo?.followingCount}<br/><h5 style={{fontWeight: 500}}>Following</h5>
                    </p>
                    <p style={{fontWeight: 600}}>
                        {data?.getPublicInfo?.friendCount > 1000 ? 
                        `${data?.getPublicInfo?.friendCount / 1000}k` : 
                        data?.getPublicInfo?.friendCount}<br/><h5 style={{fontWeight: 500}}>Friends</h5>
                    </p>
                </div>
                <button className="followBtn" style={styles.btn} onClick={() => call()}>
                    <span style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", "zIndex": "10", color: "#0B0A07", fontWeight: 600, fontSize: 15, lineHeight: 24, userSelect: "none"}}>Follow</span>
                    <div style={styles.btnDecContainer}>
                        <div style={styles.btnDec}>&nbsp;</div>
                        <div style={styles.btnDec}>&nbsp;</div>
                        <div style={styles.btnDec}>&nbsp;</div>
                        <div style={styles.btnDec}>&nbsp;</div>
                        {/* <div style={styles.btnDec}>&nbsp;</div> */}
                    </div>
                </button>
            </div>
            <img src="/shoe_collective.jpg" height="160px" width="160px" style={{borderRadius: 800}} />
        </section>
    </>
}

const styles = {
    info: {
        "display": "flex",
        "columnGap": "16px",
        "margin": "16px 0px 24px"
    },
    btn: {
        width: "100%",
        maxWidth: 240,
        height: 40,
        backgroundColor: "#ffffff",
        borderRadius: 24,
        border: "1px solid #0B0A07",
        boxShadow: "0px 2px 0px 0px #0B0A07",
        position:"relative",
        overflow: "hidden",
        userSelect: "none"
    },
    btnDec: {
        width: 16,
        height: 80,
        background: "#F7F6F3",
        transform: "translate(-16px, -16px) rotate(45deg)"
    },
    btnDecContainer: {
        position: "absolute",
        // zIndex: -1,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        columnGap: 32
    }
}

export default ProfileInfo