import React, { useEffect } from "react"
import { EmployeePanel, GuestPanel } from "../../components"
import { UserMenu } from "../../components/user-menu"
import { User } from "shared"

export const Home = () => {
	const [isEmployee, setIsEmployee] = React.useState<boolean>(false)
	const [currentUser, setCurrentUser] = React.useState<User | null>({
		phone: "17858968657",
		id: "1",
		name: "张三",
		avatar: "",
		role: "guest",
		memberLevel: "金卡会员",
	})
	const [isUserMenuOpen, setIsUserMenuOpen] = React.useState<boolean>(false)

	const toggleUserRole = (): void => {
		if (isEmployee) {
			setCurrentUser({
				phone: "17858968657",
				id: "1",
				name: "张三",
				avatar: "",
				role: "guest",
				memberLevel: "金卡会员",
			})
		} else {
			setCurrentUser({
				phone: "17858968657",
				id: "2",
				name: "李经理",
				avatar: "",
				role: "employee",
				position: "餐厅经理",
			})
		}
		setIsEmployee(!isEmployee)
	}

	const generateAvatar = (name: string): React.ReactNode => {
		if (!currentUser) return null

		if (currentUser.avatar) {
			return <img src={currentUser.avatar} alt={name} className="h-full w-full rounded-full object-cover" />
		}

		// 如果没有头像URL，则生成一个包含用户名首字母的圆形头像
		const initials = name.charAt(0).toUpperCase()
		const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500", "bg-yellow-500"]
		// 使用用户ID来确定颜色，保证同一用户总是获得相同的颜色
		const colorIndex = parseInt(currentUser?.phone) % colors.length
		const bgColor = colors[colorIndex]

		return <div className={`h-full w-full rounded-full flex items-center justify-center text-white font-bold ${bgColor}`}>{initials}</div>
	}

	const handleLogout = (): void => {
		alert("用户登出功能将在后续版本实现")
		setIsUserMenuOpen(false)
	}

	return (
		<div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
			<header className="bg-blue-800 text-white shadow-lg">
				<div className="container mx-auto px-4 py-4 flex justify-between items-center">
					<h1 className="text-2xl font-bold text-center sm:text-left">希尔顿餐厅预订系统</h1>

					<div className="flex items-center space-x-4">
						<button
							onClick={toggleUserRole}
							className="bg-white text-blue-800 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 transition hidden sm:block"
						>
							切换至{isEmployee ? "顾客" : "员工"}界面
						</button>

						<div className="relative">
							{currentUser && (
								<>
									<button
										onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
										className="flex items-center space-x-2 focus:outline-none"
									>
										<div className="h-10 w-10 rounded-full overflow-hidden">
											{generateAvatar(currentUser?.name ?? currentUser.phone)}
										</div>
										<div className="hidden sm:block text-left">
											<p className="font-semibold">{currentUser.name}</p>
											<p className="text-xs opacity-80">{isEmployee ? currentUser.position : currentUser.memberLevel}</p>
										</div>
										<svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
										</svg>
									</button>
									{isUserMenuOpen && (
										<UserMenu
											user={currentUser}
											isOpen={isUserMenuOpen}
											onClose={() => setIsUserMenuOpen(false)}
											onLogout={handleLogout}
										/>
									)}
								</>
							)}
						</div>
					</div>
				</div>

				{/* 移动设备上的切换按钮 */}
				<div className="sm:hidden container mx-auto px-4 pb-3">
					<button
						onClick={toggleUserRole}
						className="bg-white text-blue-800 px-4 py-2 rounded-md font-semibold hover:bg-blue-100 transition w-full"
					>
						切换至{isEmployee ? "顾客" : "员工"}界面
					</button>
				</div>
			</header>

			<main className="container mx-auto px-4 py-8 flex-1">{isEmployee ? <EmployeePanel /> : <GuestPanel />}</main>

			<footer className="bg-gray-800 text-white py-4">
				<div className="container mx-auto px-4 text-center">&copy; 2025 希尔顿餐厅预订系统</div>
			</footer>
		</div>
	)
}
