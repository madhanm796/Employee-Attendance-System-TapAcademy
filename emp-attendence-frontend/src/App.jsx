import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {

    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(()=> {

        try {
            const getUser = localStorage.getItem('user');
            if (!getUser) {
                setLoggedIn(false);
                navigate('')
            }else {
                setLoggedIn(true);
            }
        }catch(e) {
            console.log(e.message)
        }

    }, []);
}

export default App;