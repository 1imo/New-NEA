import { useMutation, useQuery } from "@apollo/client"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SIGN_IN } from "../GraphQL/Mutations"
import Cookies from "js-cookie"

function Portal() {

    const username = useRef()
    const pass = useRef()

    const [ usernameFocus, setUsernameFocus ] = useState(false)
    const [ passFocus, setPassFocus ] = useState(false)

    
    const navigate = useNavigate()

    const [ SignIn, { loading, data, error } ] = useMutation(SIGN_IN)
    
    async function signIn() {

        console.log(username.current.value, pass.current.value)

        const res = await SignIn({
            variables: {
                username: username.current.value,
                pass: pass.current.value
            }
        })

        if(res?.data?.signIn === null) {
            alert("Incorrect Info Enterered")
        } else {
            console.log(res)
            Cookies.set('secretkey', res.data.signIn.secretkey, { expires: 7 })
            Cookies.set('id', res.data.signIn.id, { expires: 7 })
            window.location.href = "/"
        }

    }

    return <>
    <section style={styles.section} className="authScreen">
        <div style={styles.heading} className="subheading">
            <h2>Hi There!</h2>
            <div style={styles.subheading}>
                <p>On Point?</p>
                <img src="/smiley.jpg" alt=":)" height={20} width={20} />
            </div>
        </div>
        <div style={styles.inputCont}>
            <div style={styles.input}>
                <img className="moveInImg" src="/circle-user-round.svg" alt="username" style={usernameFocus || username?.current?.value ? null : { display: "none" }} />
                <input ref={username} onFocus={() => setUsernameFocus(true)} onBlur={() => setUsernameFocus(false)} style={styles.inputBox} placeholder="Username" />
            </div>
            <div style={styles.input}>
                <img className="moveInImg" src="/lock.svg" alt="password" style={passFocus || pass?.current?.value ? null : {display: "none"}} />
                <input type="password" ref={pass} onFocus={() => setPassFocus(true)} onBlur={() => setPassFocus(false)} style={styles.inputBox} placeholder="*********" />
            </div>
        </div>

        <div style={styles.providers}>
            <div style={styles.provider} onClick={() => window.location.href="http://127.0.0.1:8000/auth/google"}>
                <img src="/apple.png" alt="Sign In w Google" />
            </div>
            <div style={styles.provider}>
                <img src="/google.png" alt="Sign In w Apple" />
            </div>
        </div>

        <div style={styles.buttons} className="buttons">
            <button style={styles.button} onClick={() => signIn()}>Sign In</button>
            <a href="/onboarding">Sign Up</a>
        </div>
    </section>
</>
}

const styles = {
    section: {
        width: "100vw !important",
        height: "100svh",
        // margin: "auto",
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
        justifyContent: "center",
        overflowY: "hidden"
    },
    heading: {
        display: "flex",
        flexDirection: "column",
        rowGap: 0
    },
    subheading: {
        display: "flex",
        alignItems: "center",
        columnGap: 8,
        marginBottom: 176
    },
    inputCont: {
        display: "flex",
        flexDirection: "column",
        rowGap: 16,
        marginBottom: 64,
    },
    input: {
        border: "1px solid #f7f7f7",
        height: 40,
        borderRadius: 8,
        boxSizing: "borderBox",
        padding: "4px 16px",
        display: "flex",
        flexDirection: "row",
        // justifyContent: "center",
        alignItems: "center",
        columnGap: 8
    },
    inputBox: {
        border: "none",
        outline: "none",
        width: "100%",
        height: "100%",
        padding: 0,
        margin: 0,
        height: 24
    },
    providers: {
        display: "flex",
        alignItems: "center",
        columnGap: 16,
        margin: "0 auto",
        marginBottom: 128,
    },
    provider: {
        width: 32,
        height: 32,
        borderRadius: 24,
        background: "#e7e7e6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    buttons: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        rowGap: 24,
        alignItems: "center",
        marginTop: 64,
        fontFamily: "'Poppins', sans-serif",
        fontSize: "15px",
        lineHeight: "24px"
    },
    button: {
        height: 40,
        borderRadius: 8,
        background: "#0B0A07",
        color: "#fff",
        width: "100%",
        border: "none",
        fontFamily: "'Poppins', sans-serif",
        fontSize: 15,
        lineHeight: "24px"
    }
}

export default Portal 