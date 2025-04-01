import { http } from "../../core"
import { Reservation } from "../../types"

export const queryHttpReservations = (): Promise<Reservation[]> => {
	return http.get("/reservations")
}

export const createHttpReservation = (data: Reservation) => {
	return http.post("/reservations", data)
}

export const updateHttpReservation = (data: Reservation) => {
	return http.put(`/reservations/${data.id}`, data)
}

export const queryHttpReservation = (id: string) => {
	return http.get(`/reservations/${id}`)
}
