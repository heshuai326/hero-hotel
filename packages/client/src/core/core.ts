import axios from "axios"

export const core = axios.create({
	baseURL: "/",
	withCredentials: true,
})

core.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token")
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	(error) => {
		return error
	},
)

core.interceptors.response.use(
	(response) => {
		return response.data
	},
	(error) => {
		console.log(`require fail:`)
		console.log(error)
		const { response } = error
		switch (response?.status) {
			case 401:
				localStorage.removeItem("token")
				window.location.href = "/login"
		}
	},
)
