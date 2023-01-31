import { useState, useEffect } from "react"
import { BrowserRouter as Router } from 'react-router-dom';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { AppRoutes } from "./app.routes"
import { SignIn } from "../screens/SignIn"
import { Loading } from "../screens/Loading"

export function Routes() {
    const [user, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        onAuthStateChanged(getAuth(), (userFirebase: any) => {
            setIsLoading(false);

            if (userFirebase) {
                setUser(userFirebase)
            }
        });
    }, [])

    if (isLoading) {
        return (
            <div>
                <Loading />
            </div>
        )
    }

    return (
        <div>
            {user ? <AppRoutes /> : <Router><SignIn /></Router>}
        </div>
    )
}