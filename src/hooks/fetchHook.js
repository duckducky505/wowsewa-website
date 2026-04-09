import { useEffect, useState } from "react"
import { fetchAPI } from "../utils/fetchAPI";

export const fetchHook = (url) => {

    
    const [data, setData] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const getData = async() => {
            const info = await fetchAPI(url,"GET");
            setData(info);
            setLoading(false);
        }
        if(url){
            getData();
        }
    },[url]);
    return {data,loading};
}