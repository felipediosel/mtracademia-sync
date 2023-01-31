import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from '../screens/Home'
import { SignIn } from '../screens/SignIn'

export function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<SignIn />} />
            </Routes>
        </Router>
    )
}