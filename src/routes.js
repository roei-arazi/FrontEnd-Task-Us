import { Home } from './pages/Home.jsx'
import { Board } from './pages/Board.jsx'
import { Boards } from './pages/Boards.jsx'
import { Login } from './pages/Login.jsx';
import { Signup } from './pages/Signup.jsx';
import { UserProfile } from './pages/UserProfile.jsx';
import { MyWeek } from './pages/MyWeek.jsx';
import { mobActivities } from './mobile-pages/mobActivities.jsx';


export default [
    {
        path: '/',
        component: Home
    },
    {
        path: '/boards',
        component: Boards
    },
    {
        path: '/board/:id',
        component: Board
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/signup',
        component: Signup
    },
    {
        path: '/user/:id',
        component: UserProfile
    },
    {
        path: '/myweek',
        component: MyWeek
    },
    {
        path: '/activities/:id',
        component: mobActivities
    }
]