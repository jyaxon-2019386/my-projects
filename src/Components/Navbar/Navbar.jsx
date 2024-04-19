import './Navbar.css'

export const Navbar = () => {
  return (
    <div className='nav'>
      <div className='nav-logo'>Stay Sure</div>
      <ul className='nav-menu'>
        <li>Home</li>
        <li>Events</li>
        <li>Hotels</li>
        <li>Reservation</li>
        <li className='nav-contact'>Contact us</li>
      </ul>

    </div>
  )
}

export default Navbar