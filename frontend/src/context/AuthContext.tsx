import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type AuthUser = {
	id: string;
	name: string;
	email: string;
	phone?: string;
	location?: string;
	bio?: string;
	preferences?: any;
	points?: number;
	discountPercent?: number;
};

type AuthContextValue = {
	isAuthenticated: boolean;
	user: AuthUser | null;
	signInWithToken: (user: AuthUser, token: string) => void;
	updateUser: (user: AuthUser) => void;
	signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [token, setToken] = useState<string | null>(null);

	useEffect(() => {
		const storedUser = localStorage.getItem("auth:user");
		const storedToken = localStorage.getItem("auth:token");
		if (storedUser) {
			try { setUser(JSON.parse(storedUser)); } catch {}
		}
		if (storedToken) setToken(storedToken);
	}, []);

	useEffect(() => {
		if (user) localStorage.setItem("auth:user", JSON.stringify(user));
		else localStorage.removeItem("auth:user");
		if (token) localStorage.setItem("auth:token", token);
		else localStorage.removeItem("auth:token");
	}, [user, token]);

	const signInWithToken = (u: AuthUser, t: string) => {
		setUser(u);
		setToken(t);
	};

	const updateUser = (u: AuthUser) => {
		setUser(u);
	};

	const signOut = () => { setUser(null); setToken(null); };

	const value = useMemo(
		() => ({ isAuthenticated: !!user, user, signInWithToken, updateUser, signOut }),
		[user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};

