import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import CreateNewSpot from './components/CreateNewSpot/CreateNewSpot';
import HomePage from './components/Homepage/HomePage';
import SpotDetails from './components/SpotDetails/SpotDetails';
import UserSpots from './components/UserSpots/UserSpots';
import EditSpot from './components/EditSpot/EditSpot';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('Layout mounting, starting session restore...');
    
    dispatch(sessionActions.restoreUser())
      .then(() => {
        console.log('Session restored successfully');
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Session restore failed:', error);
        setIsLoaded(true);
      });
  }, [dispatch]);

  // Add immediate logging
  console.log('Layout render:', { isLoaded });

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: '/spots/new',
        element: <CreateNewSpot />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots/current',
        element: <UserSpots />
      },
      {
        path: '/spots/:spotId/edit',
        element: <EditSpot />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
