import { apiClient } from "@/api/apiClient"

export const loginService= async(email,password)=>{

    const {data} = await apiClient.post('/auth/login',{
        email,
        password,
    })
    return data
}

export const getMeService = async () => {
    const { data } = await apiClient.get("/usuarios/me")
    return data
}

export const getUsersService = async () => {
    const { data } = await apiClient.get("/usuarios")
    return data
}

export const updateUserService = async (id, payload) => {
    const { data } = await apiClient.put(`/usuarios/${id}`, payload)
    return data
}

export const deleteUserService = async (id) => {
    const { data } = await apiClient.delete(`/usuarios/${id}`)
    return data
}
