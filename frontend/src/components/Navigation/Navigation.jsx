import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  // Add immediate console log on every render
  console.log('Navigation Render:', {
    isLoaded,
    sessionUser,
    hasUser: Boolean(sessionUser),
    timestamp: new Date().toISOString(),
  });

  // Add effect to log state changes
  useEffect(() => {
    console.log('Auth State Changed:', {
      isLoaded,
      sessionUser,
      hasUser: Boolean(sessionUser),
      timestamp: new Date().toISOString(),
    });
  }, [isLoaded, sessionUser]);

  // Add this console log
  console.log('TEST UPDATE:', { 
    time: new Date().toISOString(),
    isLoaded,
    hasUser: !!sessionUser 
  });

  return (
    <nav>
      <ul>
        <li className="logo-container">
        <NavLink to="/">
          <img 
            // Fix the image path - remove 'public' from the path
            src="/favicons/cozy-icon-96.png" 
            alt="Cozy Cribs" 
            onError={(e) => {
              console.log('Image failed to load:', e);
              // Optionally set a fallback image
              // e.target.src = '/fallback-image.png';
            }}
          />
          <h1 className="logo">Cozy Cribs</h1>
        </NavLink>
      </li>
      {/* Add debug comment */}
      {/* Auth Debug: isLoaded=${isLoaded}, hasUser=${Boolean(sessionUser)} */}
      {isLoaded && sessionUser && (
        <li>
          <NavLink to="/spots/new">
            <button 
              className="create-spot-button"
              onClick={() => console.log('Create Spot clicked, user:', sessionUser)}
            >
              Create a New Spot
            </button>
          </NavLink>
        </li>
      )}
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
