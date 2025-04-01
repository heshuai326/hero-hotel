import React, { useEffect } from "react"
import { Reservation, ReservationStatus } from "../../types"
import { ReservationDetailForm } from "../reservation-form"
import { queryGraphqlReservation, queryGraphqlReservations, updateGraphqlReservation } from "../../services"
export const EmployeePanel: React.FC = () => {
	const [reservations, setReservations] = React.useState<Reservation[]>([])
	const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString().split("T")[0])
	const [statusFilter, setStatusFilter] = React.useState<string>("ALL")
	const [selectedReservation, setSelectedReservation] = React.useState<Reservation | null>(null)
	const [isDetailsOpen, setIsDetailsOpen] = React.useState<boolean>(false)

	const handleViewDetails = (reservation: Reservation): void => {
		setSelectedReservation(reservation)
		setIsDetailsOpen(true)
	}

	const handleUpdateStatus = async (reservationId: string, newStatus: ReservationStatus) => {
		console.log(reservationId, newStatus)
		const updatedReservations = reservations.map((res) => (res.id === reservationId ? { ...res, status: newStatus } : res))
		setReservations(updatedReservations)

		console.log(selectedReservation, selectedReservation?.id, reservationId)

		if (selectedReservation && selectedReservation.id === reservationId) {
			setSelectedReservation({ ...selectedReservation, status: newStatus })
		}
		await updateGraphqlReservation({ id: reservationId, status: newStatus })
		await queryGraphqlReservations()
	}

	const handleUpdateReservation = async (updatedReservation: Reservation) => {
		const updatedReservations = reservations.map((res) => (res.id === updatedReservation.id ? updatedReservation : res))
		setReservations(updatedReservations)
		setSelectedReservation(updatedReservation)
		await updateGraphqlReservation(updatedReservation)
		await queryGraphqlReservations()
	}

	const changeStatus = async (value: string) => {
		setStatusFilter(value)
		await getReservationsData(value)
	}

	const changeDate = async (value: string) => {
		setSelectedDate(value)
		await getReservationsData(statusFilter, value)
	}

	const getReservationsData = async (status: string = "", arrivalTime: string = "") => {
		if (status === "ALL") {
			status = ""
		}
		const {
			data: { reservations },
		} = await queryGraphqlReservations({ status, arrivalTime })
		setReservations(reservations)
	}

	useEffect(() => {
		getReservationsData()
	}, [])

	return (
		<div className="max-w-6xl mx-auto">
			<div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
				<h2 className="text-xl font-bold mb-4">预订筛选</h2>
				<div className="flex flex-col sm:flex-row flex-wrap gap-4">
					<div className="w-full sm:w-auto">
						<label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
						<input
							type="date"
							value={selectedDate}
							onChange={(e) => changeDate(e.target.value)}
							className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
					<div className="w-full sm:w-auto">
						<label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
						<select
							value={statusFilter}
							onChange={(e) => changeStatus(e.target.value)}
							className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
						>
							<option value="ALL">全部</option>
							<option value={ReservationStatus.PENDING}>{ReservationStatus.PENDING}</option>
							<option value={ReservationStatus.CONFIRMED}>{ReservationStatus.CONFIRMED}</option>
							<option value={ReservationStatus.COMPLETED}>{ReservationStatus.COMPLETED}</option>
							<option value={ReservationStatus.CANCELED}>{ReservationStatus.CANCELED}</option>
						</select>
					</div>
				</div>
			</div>

			<div className="bg-white rounded-lg shadow-md overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200 responsive-table">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系方式</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">到达时间</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">人数</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{reservations.length > 0 ? (
							reservations.map((reservation) => (
								<tr key={reservation.id} className="bg-white">
									<td data-label="姓名" className="px-6 py-4">
										{reservation.guestName}
									</td>
									<td data-label="联系方式" className="px-6 py-4">
										{reservation.guestContact}
									</td>
									<td data-label="到达时间" className="px-6 py-4">
										{new Date(reservation.arrivalTime).toLocaleTimeString([], {
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
										<div className="flex flex-col sm:flex-row gap-2">
											<button
												onClick={() => handleViewDetails(reservation)}
												className="text-indigo-600 hover:text-indigo-900 font-medium"
											>
												详情
											</button>
											{reservation.status === ReservationStatus.PENDING && (
												<button
													onClick={() => handleUpdateStatus(reservation.id, ReservationStatus.CONFIRMED)}
													className="text-green-600 hover:text-green-900 font-medium"
												>
													确认
												</button>
											)}
											{(reservation.status === ReservationStatus.CONFIRMED ||
												reservation.status === ReservationStatus.PENDING) && (
												<>
													<button
														onClick={() => handleUpdateStatus(reservation.id, ReservationStatus.COMPLETED)}
														className="text-blue-600 hover:text-blue-900 font-medium"
													>
														完成
													</button>
													<button
														onClick={() => handleUpdateStatus(reservation.id, ReservationStatus.CANCELED)}
														className="text-red-600 hover:text-red-900 font-medium"
													>
														取消
													</button>
												</>
											)}
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={6} className="px-6 py-4 text-center text-gray-500">
									暂无符合条件的预订
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{isDetailsOpen && selectedReservation && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold">预订详情</h2>
							<button onClick={() => setIsDetailsOpen(false)} className="text-gray-500 hover:text-gray-700">
								✕
							</button>
						</div>

						<ReservationDetailForm
							reservation={selectedReservation}
							onUpdate={handleUpdateReservation}
							onUpdateStatus={handleUpdateStatus}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
