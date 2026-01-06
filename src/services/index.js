import { apiClient } from "@/api/apiClient"

export const loginService= async(email,password)=>{

    const {data} = await apiClient.post('/auth/login',{
        email,
        password
    });
    return data;
}