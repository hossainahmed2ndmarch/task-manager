import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://task-manager-server-0x8m.onrender.com",
});

const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;