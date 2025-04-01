import React from "react"
import { Reservation, ReservationStatus } from "../../types"
import { ReservationForm } from "../reservation-form"
import { createHttpReservation, queryHttpReservations, updateHttpReservation } from "../../services"

export const GuestPanel: React.FC = () => {
	const [reservations, setReservations] = React.useState<Reservation[]>([])
	const [selectedReservation, setSelectedReservation] = React.useState<Reservation | null>(null)
	const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false)

	const getReservationsData = async () => {
		const res = await queryHttpReservations()
		setReservations(res)
	}

	React.useEffect(() => {
		getReservationsData()
	}, [])

	const handleNewReservation = (): void => {
		setSelectedReservation(null)
		setIsFormOpen(true)
	}

	const handleEditReservation = (reservation: Reservation): void => {
		setSelectedReservation(reservation)
		setIsFormOpen(true)
	}

	const handleCancelReservation = async (reservationId: string): Promise<void> => {
		if (window.confirm("确定要取消此预订吗？")) {
			const updatedReservations = reservations.map((res) => (res.id === reservationId ? { ...res, status: ReservationStatus.CANCELED } : res))
			setReservations(updatedReservations)
			const updatedReservation = { ...updatedReservations[0], status: ReservationStatus.CANCELED }
			delete updatedReservation.type
			await updateHttpReservation(updatedReservation)
			await queryHttpReservations()
		}
	}

	const handleFormSubmit = async (reservation: Reservation): Promise<void> => {
		if (selectedReservation) {
			const updatedReservations = reservations.map((res) => (res.id === reservation.id ? reservation : res))
			setReservations(updatedReservations)
			await updateHttpReservation(reservation)
		} else {
			const newReservation: Reservation = {
				...reservation,
				id: Date.now().toString(),
				arrivalTime: new Date(reservation.arrivalTime).toISOString(),
				status: ReservationStatus.PENDING,
			}

			setReservations([...reservations, newReservation])

			await createHttpReservation(newReservation)
		}
		setIsFormOpen(false)
		setSelectedReservation(null)
		await queryHttpReservations()
	}

	const handleCloseForm = (): void => {
		setIsFormOpen(false)
		setSelectedReservation(null)
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="flex flex-col sm:flex-row justify-between items-center mb-6">
				<h2 className="text-2xl font-bold mb-4 sm:mb-0">我的预订</h2>
				<button
					onClick={handleNewReservation}
					className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition w-full sm:w-auto"
				>
					新预订
				</button>
			</div>

			{isFormOpen && <ReservationForm reservation={selectedReservation || undefined} onSubmit={handleFormSubmit} onCancel={handleCloseForm} />}

			{reservations.length > 0 ? (
				<div className="bg-white rounded-lg shadow-md overflow-hidden">
					<table className="min-w-full divide-y divide-gray-200 responsive-table">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">到达时间</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">人数</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{reservations.map((reservation) => (
								<tr key={reservation.id} className="bg-white">
									<td data-label="姓名" className="px-6 py-4">
										{reservation.guestName}
									</td>
									<td data-label="到达时间" className="px-6 py-4">
										{new Date(reservation.arrivalTime).toLocaleString([], {
											year: "numeric",
											month: "2-digit",
											day: "2-digit",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</td>
									<td data-label="人数" className="px-6 py-4">
										{reservation.tableSize}人
									</td>
									<td data-label="状态" className="px-6 py-4">
										<span
											className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
							reservation.status === ReservationStatus.CONFIRMED
								? "bg-green-100 text-green-800"
								: reservation.status === ReservationStatus.PENDING
									? "bg-yellow-100 text-yellow-800"
									: reservation.status === ReservationStatus.COMPLETED
										? "bg-blue-100 text-blue-800"
										: "bg-red-100 text-red-800"
						}`}
										>
											{reservation.status}
										</span>
									</td>
									<td data-label="操作" className="px-6 py-4">
										{reservation.status !== ReservationStatus.CANCELED && reservation.status !== ReservationStatus.COMPLETED && (
											<div className="flex flex-col sm:flex-row gap-2">
												<button
													onClick={() => handleEditReservation(reservation)}
													className="text-indigo-600 hover:text-indigo-900 font-medium"
												>
													编辑
												</button>
												<button
													onClick={() => handleCancelReservation(reservation.id)}
													className="text-red-600 hover:text-red-900 font-medium"
												>
													取消
												</button>
											</div>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<div className="text-center py-12 bg-white rounded-lg shadow-md">
					<p className="text-lg text-gray-500">暂无预订记录</p>
				</div>
			)}
		</div>
	)
}
