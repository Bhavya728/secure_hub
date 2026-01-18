import { useEffect, useState} from 'react';
import api from '../services/api';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
//From import to setError, 
// the code only sets up dependencies and
//  local UI state required for handling the login process
export default function Login(){
    const {login, user }= useAuth();
    const navigate = useNavigate();
     //if logged in user visits login page, redirect to dashboard
     //if we used useState it would cause an infinite loop
    useEffect(() => {
        if (user) navigate('/dashboard');
    }, [user]);
    const [form , setForm] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");


try {
    const res =await api.post('/auth/login', form);
    login(res.data);
    navigate('/dashboard');
}   
catch (err) {
    setError(
        err.response?.data?.message || "Error");
     } finally 
        {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input 
            type="email"
            placeholder="Email"
            required
            onChange={(e) => setForm({...form, email: e.target.value})}
            />
            <input 
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({...form, password: e.target.value})}
            />
            {error && <p>{error}</p>}
            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
} 