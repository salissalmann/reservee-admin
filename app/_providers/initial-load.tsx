import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { IUser } from "../_types/_auth/auth";
import { getLoggedInUserClient } from "@/app/_utils/auth";
import { LoaderIcon } from "lucide-react";
import { InvitedOrganizationData } from "@/app/_types/organization-types";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../_utils/redux/store";
import {
  clearOrganizationThunk,
  selectOrganizationId,
} from "@/app/_utils/redux/organizationSlice";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  user: IUser;
  setUserInfo: (user: IUser) => Promise<void>;
  allowedRoutes: string[];
  organizations: InvitedOrganizationData[];
}

// Initial default user state to prevent null/undefined issues
const INITIAL_USER_STATE: IUser = {
  id: null,
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  city: null,
  state: null,
  country: null,
  countryCode: "92",
  dob: null,
  gender: null,
  phone_no: "",
  image: null,
  emailVerified: false,
  is_google: false,
  isDeleted: false,
  isDisabled: false,
  createdAt: null,
  updatedAt: null,
  createdBy: null,
  updatedBy: null,
  is_public: true,
  country_code: "92",
};

// Add these to the existing AUTH_PAGES constant
const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/accept-invitation",
  "/reset-password",
  
];

// Authentication pages that should redirect if logged in
const AUTH_PAGES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
};

// Add this constant near the top with other constants
const SUPER_ADMIN_EMAILS = [
  // "salisbinsalman0@gmail.com",
  "superuser@example.com",
]; // Add your authorized emails here

// Create the authentication context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * Custom hook to access authentication context
 * Throws an error if used outside of AuthProvider
 * @returns {AuthContextProps} Authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/**
 * Authentication Provider Component
 * Manages user authentication state and provides context
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const selectedOrganizationId = useSelector(selectOrganizationId);

  // Add new states
  const [user, setUser] = useState<IUser>(INITIAL_USER_STATE);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [organizations, setOrganizations] = useState<InvitedOrganizationData[]>(
    []
  );
  const [allowedRoutes, setAllowedRoutes] = useState<string[]>([]);

  // Function to extract and set unique routes from organizations
  const processOrganizationRoutes = (orgs: InvitedOrganizationData[]) => {
    const uniqueRoutes = new Set<string>();

    // If user is a super admin, add all routes
    if (SUPER_ADMIN_EMAILS.includes(user.email)) {
      uniqueRoutes.add("*"); // Wildcard to allow all routes for super admin
    } else {
      // Regular user route processing
      PUBLIC_ROUTES.forEach((route) => uniqueRoutes.add(route));

      orgs?.forEach((org) => {
        org?.modules?.forEach((module) => {
          module?.front_end_routes?.forEach((route) => uniqueRoutes.add(route));
        });
      });
    }

    setAllowedRoutes(Array.from(uniqueRoutes));
  };

  /**
   * Check if user has completed onboarding
   * @param {IUser} user - User object to check
   * @returns {boolean} Whether onboarding is complete
   */
  const isOnboardingCompleted = (user: IUser): boolean => {
    // Comprehensive onboarding completion check
    return !!(
      user?.dob &&
      user?.dob.trim() !== "" &&
      user?.gender &&
      user?.gender.trim() !== "" &&
      user?.city &&
      user?.city.trim() !== "" &&
      user?.state &&
      user?.state.trim() !== "" &&
      user?.country
    );
  };

  /**
   * Determine if a route requires authentication
   * @param {string} path - Route path to check
   * @returns {boolean} Whether route is protected
   */
  const isProtectedRoute = (path: string): boolean => {
    return !PUBLIC_ROUTES.some((route) => path.startsWith(route));
  };

  /**
   * Login method to set authentication state
   */
  const login = () => {
    setIsAuthenticated(true);
  };

  /**
   * Logout method to clear user session and redirect
   */
  const logout = () => {
    dispatch(clearOrganizationThunk());
    localStorage.removeItem("access_token");
    localStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
    router.push(AUTH_PAGES.LOGIN);
  };

  /**
   * Update user information
   * @param {IUser} userData - User data to set
   * @returns {Promise<void>}
   */
  const setUserInfo = (userData: IUser): Promise<void> => {
    return new Promise((resolve) => {
      setUser(userData);
      resolve();
    });
  };  

  const [isDisabled, setIsDisabled] = useState(false);

  // Update the useEffect to handle route authorization
  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (!accessToken) {
        setIsAuthenticated(false);
        setIsLoading(false);

        if (isProtectedRoute(pathname)) {
          router.push(AUTH_PAGES.LOGIN);
          return;
        }
        return;
      }

      try {
        const loggedInUserResponse = await getLoggedInUserClient();

        if (
          loggedInUserResponse?.data &&
          loggedInUserResponse?.status === 200
        ) {
          setUser(loggedInUserResponse?.data?.user);
          setOrganizations(loggedInUserResponse?.data?.organizations || []);
          processOrganizationRoutes(
            loggedInUserResponse?.data?.organizations || []
          );
          setIsAuthenticated(true);

          // Super admins bypass route checking
          if (
            SUPER_ADMIN_EMAILS.includes(loggedInUserResponse?.data?.user?.email)
          ) {
            // Only redirect if on auth pages
            if (
              pathname === AUTH_PAGES?.LOGIN ||
              pathname === AUTH_PAGES?.REGISTER
            ) {
              router.push("/dashboard");
            }
            setIsLoading(false);
            return;
          }

          // Regular users continue with route checking
          const isRouteAllowed = allowedRoutes?.some((route) =>
            pathname?.startsWith(route)
          );

          if (
            pathname === AUTH_PAGES?.LOGIN ||
            pathname === AUTH_PAGES?.REGISTER
          ) {
            router.push("/dashboard");
          }

          //check ig user is isDisabled
          if (loggedInUserResponse?.data?.user?.isDisabled) {
            setIsDisabled(true);
          }


          // Check if organization is selected for non-public routes
          const isPublicRoute = PUBLIC_ROUTES.some((route) =>
            pathname?.startsWith(route)
          );
          const isAuthPage = Object.values(AUTH_PAGES).some((route) =>
            pathname?.startsWith(route)
          );
          console.log({ isPublicRoute, isAuthPage, selectedOrganizationId });
          if (!isPublicRoute && !isAuthPage && !selectedOrganizationId) {
            router.push("/select-organization");
            // setIsLoading(false);
            return;
          }
        } else {
          setUser(INITIAL_USER_STATE);
          if (isProtectedRoute(pathname)) {
            router.push(AUTH_PAGES.LOGIN);
          }
          logout();
        }
      } catch (error) {
        console.error("🚨 Authentication Error:", error);
        setUser(INITIAL_USER_STATE);
        if (isProtectedRoute(pathname)) {
          router.push(AUTH_PAGES.LOGIN);
        }
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [pathname]);

  // Update the context value
  const authContextValue = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      user,
      setUserInfo,
      allowedRoutes,
      organizations,
    }),
    [isAuthenticated, user, allowedRoutes, organizations]
  );
  

  return (
    <AuthContext.Provider value={authContextValue}>
      {isLoading ? (
        <FullScreenLogoLoader />
      ) : !isAuthenticated && isProtectedRoute(pathname) ? (
        <FullScreenLogoLoader />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

/**
 * Full screen loading component
 * Displays a centered loader while authentication state is being resolved
 */
const FullScreenLogoLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 dark:bg-tertiary bg-white bg-opacity-50 backdrop-blur">
      <div className="flex items-center space-x-2">
        <LoaderIcon className="text-black dark:text-white h-7 w-7 animate-spin" />
        <span className="text-black dark:text-white text-xl font-semibold">
          Loading...
        </span>
      </div>
    </div>
  );
};
