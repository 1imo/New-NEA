import { useState, useEffect, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMutation } from '@apollo/client';
import { LIKE_POST, VIEW_POST } from '../GraphQL/Mutations';
import { Context } from '../context/Context';



function Post(props) {
    const { ref, inView } = useInView();
    const [ out, setOut ] = useState(true)

    const Ctx = useContext(Context)

    const [ postViewed, { data, error, loading } ] = useMutation(VIEW_POST)
    const [ postLiked, { dataLike, errorLike, loadingLike } ] = useMutation(LIKE_POST)

    
    async function call(id, secretkey, post) {
        const res = await postViewed({
            variables: {
                post,
                secretkey,
                id,
            }
        })

       
    }
  
    useEffect(() => {
        if(inView) {
            call(Ctx.id, Ctx.secretkey, props.data.id)
        }
           
    }, [inView]);
   

    if(error) console.log(error)

    useEffect(() => {
        console.log(data)
    }, [data])

    async function like() {
        const res = await postLiked({
            variables: {
                id: Ctx.id,
                secretkey: Ctx.secretkey,
                post: props.data.id
            }
        })

        
    }



    return <>
        <section style={styles.section} ref={ref} onDoubleClick={() => like()}>
            <div>
                <img src="/shoe_collective.jpg" height="80px" width="80px" style={{"borderRadius": "40px"}}/>
            </div>
            <div style={{"paddingBottom": "8px"}}>
                <h3 style={{"textAlign": "left"}}>{props?.data?.author?.firstName} {props?.data?.author?.lastName}</h3>
                <h5 style={{"textAlign": "left"}}>@{props?.data?.author?.username}</h5>
                <p style={{"textAlign": "left", "padding": "8px 0px"}}>{props?.data?.content}</p>
                <img src="/render_image.jpg" height="auto" width="100%" style={styles.imagecontent}/>
            </div>
        </section>
    </>
}

const styles = {
    section: {
        "display": "flex",
        "width": "calc(100vw - 32px)",
        "boxSizing": "border-box",
        "maxWidth": "400px",
        "columnGap": "8px"
    },
    imagecontent: {
        "borderRadius": "8px",
        "marginBottom": "8px"
    }
}
export default Post