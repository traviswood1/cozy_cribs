import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import CreateNewSpot from './components/CreateNewSpot/CreateNewSpot';
import HomePage from './components/Homepage/HomePage';
import SpotDetails from './components/SpotDetails/SpotDetails';
import UserSpots from './components/UserSpots/UserSpots';
import EditSpot from './components/EditSpot/EditSpot';
import DeleteSpotModal from './components/DeleteSpotModal/DeleteSpotModal';
import * as sessionActions from './store/session';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

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
