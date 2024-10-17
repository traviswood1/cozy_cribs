import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <ul>
      <li className="logo-container">
        <NavLink to="/">
          <img src="/public/favicons/cozy-icon-96.png" alt="Cozy Cribs" />
          <h1 className="logo">Cozy Cribs</h1>
        </NavLink>
      </li>
      <li>
        <NavLink to="/spots/new">
          <button className="create-spot-button">Create a New Spot</button>
        </NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
