import { ReservationStatus } from "../enums"

export interface ReservationType {
	id?: string
	guestName?: string
	guestContact?: string
	arrivalTime?: string
	tableSize?: number
	status?: ReservationStatus
	userId?: string
}
