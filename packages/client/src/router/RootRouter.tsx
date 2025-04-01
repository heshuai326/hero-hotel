import { Route, Routes } from "react-router-dom"
import { Home, Login } from "../pages"

export const RootRouter = () => {
	return (
		<Routes>
			<Route path="*" element={<Home />} />
			<Route path="/login" element={<Login />} />
		</Routes>
	)
}
