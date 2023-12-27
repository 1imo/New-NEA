import { useEffect, useState, useRef } from "react"
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useNavigate } from "react-router-dom";

function Input(props) {
    const [ val, setVal ] = useState("")
    const navigate = useNavigate()
    

    return <>
        <section style={styles.overlay}>
            <input type={props.type} className="normInputScreen" placeholder={`${props.placeholder}`} onChange={(e) => setVal(e.target.value)}/>

            
            <section style={styles.input}>
                <button className="accentBtn" style={styles.main} onClick={() => props.value(val)} onTouchStart={() => props.value(val)}>
                    {props.btnPlaceholder}
                </button>
                <button className="accentBtn" style={styles.second} onClick={() => navigate(`/${props.referer}`)} onTouchStart={() => props.referer ? navigate(`${props.referer}`) : setVal("")}>
                    <img src="/arrow-back-circle.svg" alt="Back" />
                </button>
            </section>
        </section>
    </>
}

const styles = {
    overlay: {
        position: "absolute",
        // height: "100vh",
        width: "calc(100vw - 32px)",
        zIndex: 10
    },
    
    main: {
        width: "100%",
        height: 40,
        borderRadius: 24,
        border: "1px solid #0B0A07",
        background: "#FFF",
        boxShadow: "0px 2px 0px 0px #0B0A07",
        color: "#0B0A07",
        fontWeight: 700,
        fontSize: 15,
        fontWeight: 24,
        fontFamily: "'Poppins', sans-serif"
    },
    second: {
        height: 40,
        width: 40,
        borderRadius: 24,
        border: "1px solid #0B0A07",
        background: "#FFF",
        boxShadow: "0px 2px 0px 0px #0B0A07"
    },
    input: {
        width: "calc(100vw - 32px)",
        display: "flex",
        flexDirection: "row-reverse",
        columnGap: 16,
        position: "fixed",
        top: "100%",
        transform: "translateY(calc(-100% - 8px)"
    }
}

export default Input