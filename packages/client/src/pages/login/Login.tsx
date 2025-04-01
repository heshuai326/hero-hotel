import React from "react"
import { ForgotPasswordForm, LoginForm, RegisterForm } from "../../components"

export const Login: React.FC = () => {
	const [showLoginForm, setShowLoginForm] = React.useState<boolean>(true)
	const [showForgotPassword, setShowForgotPassword] = React.useState<boolean>(false)

	const toggleForm = (): void => {
		setShowLoginForm(!showLoginForm)
		setShowForgotPassword(false)
	}

	const handleForgotPassword = (): void => {
		setShowForgotPassword(true)
	}

	const handleBackToLogin = (): void => {
		setShowForgotPassword(false)
	}

	return (
		<div className="min-h-screen flex flex-col md:flex-row">
			{/* 左侧品牌区域 - 在移动视图中隐藏 */}
			<div className="hidden md:flex md:w-1/2 bg-blue-900 text-white flex-col justify-center items-center p-8 relative overflow-hidden">
				<div className="relative z-10 max-w-md text-center">
					<div className="mb-8 logo-animation">
						<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
							<circle cx="50" cy="50" r="50" fill="#FFFFFF" />
							<path d="M30 40H70V60H30V40Z" fill="#004990" />
							<path d="M35 45H65V55H35V45Z" fill="#FFFFFF" />
							<path d="M40 25V75H60V25H40Z" fill="#004990" />
							<path d="M45 30H55V70H45V30Z" fill="#FFFFFF" />
						</svg>
					</div>

					<h1 className="text-4xl font-bold mb-2">希尔顿酒店</h1>
					<p className="text-xl mb-8">世界上最受认可的酒店品牌</p>

					<div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl font-bold mb-4">尊享会员福利</h2>
						<ul className="text-left space-y-3">
							<li className="flex items-start">
								<svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
								</svg>
								<span>独家会员优惠价格</span>
							</li>
							<li className="flex items-start">
								<svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
								</svg>
								<span>积分兑换免费住宿</span>
							</li>
							<li className="flex items-start">
								<svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
								</svg>
								<span>免费Wi-Fi和移动入住</span>
							</li>
							<li className="flex items-start">
								<svg className="h-6 w-6 text-blue-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
								</svg>
								<span>会员专享楼层和礼遇</span>
							</li>
						</ul>
					</div>
				</div>

				{/* 装饰性背景 */}
				<div className="absolute inset-0 bg-image opacity-10"></div>
				<div className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/70">&copy; 2025 希尔顿酒店集团。保留所有权利。</div>
			</div>

			{/* 右侧表单区域 */}
			<div className="flex-1 flex items-center justify-center p-8 bg-white">
				<div className="w-full max-w-md">
					{/* 移动端顶部Logo */}
					<div className="md:hidden mb-8 text-center">
						<svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
							<circle cx="50" cy="50" r="50" fill="#004990" />
							<path d="M30 40H70V60H30V40Z" fill="#FFFFFF" />
							<path d="M35 45H65V55H35V45Z" fill="#004990" />
							<path d="M40 25V75H60V25H40Z" fill="#FFFFFF" />
							<path d="M45 30H55V70H45V30Z" fill="#004990" />
						</svg>
						<h1 className="text-3xl font-bold mt-2 text-blue-900">希尔顿酒店</h1>
					</div>

					{showForgotPassword ? (
						<ForgotPasswordForm onBack={handleBackToLogin} />
					) : showLoginForm ? (
						<LoginForm onToggleForm={toggleForm} onForgotPassword={handleForgotPassword} />
					) : (
						<RegisterForm onToggleForm={toggleForm} />
					)}

					{/* 移动端底部版权信息 */}
					<div className="md:hidden mt-8 text-center text-sm text-gray-500">&copy; 2025 希尔顿酒店集团。保留所有权利。</div>
				</div>
			</div>
		</div>
	)
}
