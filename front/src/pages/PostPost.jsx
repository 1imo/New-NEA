import { GET_NAVINFO, CREATE_NEWPOST } from "../GraphQL/Mutations"
import { useMutation } from "@apollo/client"
import Cookies from "js-cookie"
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import Nav from "../components/Nav";

function PostPost() {

    // const [ getNavInfo, { data, error, loading } ] = useMutation(GET_NAVINFO)
    const [ createPost, { dataMain, errorMain, loadingMain } ] = useMutation(CREATE_NEWPOST)



    const postRef = useRef()
    const navigate = useNavigate()

    const Ctx = useContext(Context)


    

    async function post() {
    
        const res = await createPost({
            variables: {
                id: Ctx.id,
                secretkey: Ctx.secretkey,
                content: postRef.current.value
            }
        })

        if(res?.data?.createPost?.id) {
            navigate(`/post/id/${res.data.createPost.id}`)
        }

        if(errorMain) console.log(errorMain)
    }

    


    return <>
        <section style={{height: "calc(100dvh - 136px)"}}>
            <Nav icons={false} />
            
            
            <div style={styles.input}>
                <img src="/send.svg" onTouchEnd={() => post()} onClick={() => post()}/>
                <input type="text" placeholder="|Message" style={styles.inputBox} ref={postRef} />
            </div>

        </section>
    </>
}

const styles = {
    input: {
        width: "calc(100vw - 32px)",
        display: "flex",
        flexDirection: "row-reverse",
        columnGap: 8,
        position: "fixed",
        bottom: 0,
        transform: "translateY(calc(-8px)"
    }
}

export default PostPost