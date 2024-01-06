import React, { useEffect, useRef } from 'react'
import { AudioWorkletNode } from 'web-audio-api'

function Call(props) {

    
    return <>
        <section style={{position: "absolute", top: "0%", left: "0%", zIndex: 10, width: "100vw", height: "100svh", background: "#fff"}}>
            <img src="/profile.jpg" height={80} width={80} style={{borderRadius: 80, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} />
            <a onClick={() => props?.setCall(false)} style={{height: 48, width: 48, borderRadius: 48, background: "#F7604C", position: "absolute", top: "100%", transform: "translateY(-64px)", display: "flex", alignItems: "center", justifyContent: "center"}} href="#"><img src="/endCall.svg" alt="End Call" /></a>
        </section>
    </>
}