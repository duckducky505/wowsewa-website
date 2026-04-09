export const fetchAPI = async(url, method, body = null) => {

    const sideBody = {
        method : method,
        headers:{
            "Content-Type":"application/json"
        }
    }
    
    if(body) sideBody.body = JSON.stringify(body);

    const response = await fetch(url, sideBody);

    if(!response.ok){console.log("Error fetching from the api");}
    const data = await response.json();
    return data;
}