import { useTheme } from "next-themes"
import { useSelector, useDispatch } from "react-redux"
import { setTheme } from "@/app/_utils/context-management/rtk/features/theme-slice"

const useThemeManagement = () => {
    const { setTheme: setNextTheme } = useTheme()
    const { theme } = useSelector((state: any) => state.theme)
    const dispatch = useDispatch()

    const handleThemeToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        dispatch(setTheme(newTheme))
        setNextTheme(newTheme)
    }

    return { theme, handleThemeToggle }
}


export default useThemeManagement;