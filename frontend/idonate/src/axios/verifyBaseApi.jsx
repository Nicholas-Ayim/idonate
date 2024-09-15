import axios from "axios";

const verifyBaseApi = axios.create({
    baseURL:"http://localhost:5000/verify",
    timeout:5000,
    // method:"POST",
    headers:{'Content-Type': 'application/json'}
})


export default verifyBaseApi