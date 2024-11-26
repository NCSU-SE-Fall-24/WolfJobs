import axios from "axios";

const client = axios.create({ baseURL: "http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000" });

export default client;
