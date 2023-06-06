import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PrivateProps } from '../contexts/Dtos/auth.dto';
//Templates
import { Template, TemplateAdm } from '../components/Template';
import { Login, LoginAdm } from '../pages/Login';
import { Error } from '../pages/Error';
//Pages Students
import { Home } from '../pages/Home';
import { ClassRoom } from '../pages/ClassRoom';
//Page Admin
import { Dashboard } from '../pages/Dashboard';
import { Users } from '../pages/Users';
import { LoadingPage } from '../pages/LoadingPage';
import { Levels } from '../pages/Levels';
import { Students } from '../pages/Students';
import { Settings } from '../pages/Settings';
import { Credentials } from '../pages/Credentials';


//Validate Auths
const Private: React.FC<PrivateProps> = ({Item,typeAccess}) => {
  const authenticate = useAuth();  
  return(
    authenticate === undefined ? <LoadingPage/> 
    : authenticate.authenticated === null ? <LoadingPage/> 
      : authenticate.authenticated ? //If Authenticated
          typeAccess == 'Adm' ? //Check if type access is adm and typeAuthUser is compatible or logout
            authenticate.typeAccess=='Adm' ? <Item/> : <Login/>  
          : <Item/> 
        : typeAccess == 'Adm' ? <LoginAdm/> : <Login/>
  );
}

const RoutesApp = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element:<Private Item={Template} typeAccess={'Student'}/>,
      errorElement:<Error/>,
      children:[
        {
          errorElement:<Error/>,
          children:[
            { index: true, element:<Home/>},
            {
              path:'/classRoom',
              element:<ClassRoom/>,
            }
          ]
        }
      ]
    },
    {
      path: '/Admin',
      element:<Private Item={TemplateAdm} typeAccess={'Adm'}/>,
      errorElement:<Error/>,
      children:[
        {
          errorElement:<Error/>,
          children:[
            { index: true, path: '/Admin/dashboard', element:<Dashboard/>},
            { path: '/Admin/students', element:<Students/>},
            
            
            {
              path: '/Admin/settings',
              children:[
                { index: true, element:<Settings/>},
                { path: '/Admin/settings/users', element:<Users/>},
                { path: '/Admin/settings/credentials', element:<Credentials/>},
                { path: '/Admin/settings/levels', element:<Levels/>},
                { path: '/Admin/settings/security', element:<Settings/>},
              ]
            }           
          ]
        }
      ]
    }
  ])

  return(
    <RouterProvider router={router}/>
  )
}
export default RoutesApp;