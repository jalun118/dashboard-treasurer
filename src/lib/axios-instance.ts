import { DOMAIN } from "@/configs/web-domain";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: DOMAIN + "/api",
});

export default axiosInstance;