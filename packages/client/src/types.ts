import { User } from "shared"
export interface UserMenuProps {
	user: User
	isOpen: boolean
	onClose: () => void
	onLogout: () => void
}

export enum ReservationStatus {
	ALL = "ALL",
	PENDING = "待确认",
	CONFIRMED = "已确认",
	COMPLETED = "已完成",
	CANCELED = "已取消",
}

export interface Reservation {
	id: string
	guestName: string
	guestContact: string
	arrivalTime: string
	tableSize: number
	status: ReservationStatus
	type?: string
}

export interface ReservationFormProps {
	reservation?: Reservation
	onSubmit: (reservation: Reservation) => void
	onCancel: () => void
}

export interface ReservationDetailFormProps {
	reservation: Reservation
	onUpdate: (updatedReservation: Reservation) => void
	onUpdateStatus: (reservationId: string, newStatus: ReservationStatus) => void
}

export interface FormErrors {
	[key: string]: string | null
}

export interface LoginFormProps {
	onToggleForm: () => void
	onForgotPassword: () => void
}

export interface RegisterFormProps {
	onToggleForm: () => void
}

export interface ForgotPasswordFormProps {
	onBack: () => void
}
