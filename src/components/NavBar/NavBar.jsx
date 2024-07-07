import './NavBar.css'

function NavBar({ setLoggedIn }) {

    function signOut() {
        localStorage.removeItem('jwt');
        setLoggedIn(false);
    }

    return (
        <>
            {/* <button onClick={signOut}>exit</button> */}
        </>
    )
}

export default NavBar;