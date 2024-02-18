import { CREATE_NEWPOST } from "../GraphQL/Mutations"
import { useMutation } from "@apollo/client"
import Cookies from "js-cookie"
import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import Nav from "../components/Nav";

function PostPost() {

    const [ createPost, { dataMain, errorMain, loadingMain } ] = useMutation(CREATE_NEWPOST)



    const postRef = useRef()
    const [ photo, setPhoto ] = useState(null)
    const navigate = useNavigate()

    const Ctx = useContext(Context)


    

    async function post() {
        console.log("PHOTO", photo)
        
        const res = await createPost({
            variables: {
                id: Ctx.id,
                secretkey: Ctx.secretkey,
                content: postRef.current.value,
                photo: photo !== null ? true : false
            }
        })

        if(res?.data?.createPost?.id && photo !== null) {
            const response = await fetch(photo)
            const imageBlob = await response.blob()
            const reader = new FileReader()
            reader.readAsArrayBuffer(imageBlob)
            reader.onload = async (event) => {
                const uint8Array = new Uint8Array(event.target.result)
                
                const r = await fetch(Ctx.imageServer + "/upload", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "id": res?.data?.createPost?.id,
                        "image": String(uint8Array),
                        "correlation": "Post",
                    })
                })
            }
        }

        if(res?.data?.createPost?.url) {
            navigate(res?.data?.createPost?.url)
        }

        if(errorMain) console.log(errorMain)
    }

    function addPhoto() {
        const inp = document.querySelector(".fileInput")
        inp.click()
    }

    async function addedPhoto(e) {
        const display = URL.createObjectURL(e.target.files[0])
        setPhoto(display)
    }
    


    return <>
        <section style={{height: "calc(100dvh - 136px)"}}>
            <Nav icons={false} />
            
            
            <div style={styles.input}>
                <img style={{cursor: "pointer"}} src="/send.svg" onTouchEnd={() => post()} onClick={() => post()}/>
                <input type="text" placeholder="|Message" style={styles.inputBox} ref={postRef} />
                <img style={{cursor: "pointer"}} src="/image.svg" onTouchEnd={() => addPhoto()} onClick={() => addPhoto()}/>
                <input onChange={(e) => addedPhoto(e)} type="file" className="fileInput" style={{display: "none"}} accept="image/*" />
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