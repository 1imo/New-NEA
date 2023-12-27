import { useLocation, useParams } from "react-router-dom"
import ProfileInsight from "../components/ProfileInsight"

function ResultList() {

    const { id } = useParams()

    const location = useLocation()
    // const data = location.data




    return <>
        <ProfileInsight />
    </>
}
export default ResultList