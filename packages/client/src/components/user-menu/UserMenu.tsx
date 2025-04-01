import React from "react"
import { UserMenuProps } from "../../types"
export const UserMenu: React.FC<UserMenuProps> = ({ user, isOpen, onClose, onLogout }) => {
	React.useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			const target = event.target as HTMLElement
			if (isOpen && !target.closest(".user-menu-container")) {
				onClose()
			}
		}

		document.addEventListener("mousedown", handleOutsideClick)
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick)
		}
	}, [isOpen, onClose])

	return (
		<div className="user-menu-container absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-1 text-gray-800">
			<div className="px-4 py-3 border-b border-gray-100">
				<p className="text-sm font-medium">{user.name}</p>
				<p className="text-xs text-gray-500 truncate">{user.role === "guest" ? user.memberLevel : user.position}</p>
			</div>

			{/* <a href="#profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
        个人资料
      </a>
      <a href="#settings" className="block px-4 py-2 text-sm hover:bg-gray-100">
        账户设置
      </a> */}

			{user.role === "employee" && (
				<a href="#admin" className="block px-4 py-2 text-sm hover:bg-gray-100">
					管理控制台
				</a>
			)}

			<button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
				退出登录
			</button>
		</div>
	)
}
