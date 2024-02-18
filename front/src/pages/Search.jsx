import { useEffect, useState } from "react"
import { useQuery, gql, useMutation, useApolloClient } from "@apollo/client"
import Input from "../components/Input"
import { useNavigate, useLocation } from "react-router-dom"
import { GET_SEARCH_INSIGHTDATA } from "../GraphQL/Queries"
import ProfileInsight from "../components/ProfileInsight"

function Search() {
    const [ searchTerm, setSearchTerm ] = useState("")
    const navigate = useNavigate()

    const location = useLocation();
    const state = location.state;

    const { loading, error, data } = useQuery(GET_SEARCH_INSIGHTDATA, {
        variables: {
            username: searchTerm,
            type: state.searchType || "main"
        }
    })

    useEffect(() => {
        console.log(data)
    }, [data])


    

    return <>
        <input type="text" className="normInputScreen" placeholder={`|Search`} onChange={(e) => setSearchTerm(e.target.value)}/>
        <section style={{ "marginTop": 24, "display": "flex", "flexDirection": "column", "rowGap": 16 }}>
            {data && !loading ? data?.getUserSearchResults.map((res, index) => {
                return <ProfileInsight 
                username={res.username} 
                name={res.name} id={res.id} key={index} reference={state.searchType || "main"}/>
            }) : null}
        </section>
    </>
}


export default Search