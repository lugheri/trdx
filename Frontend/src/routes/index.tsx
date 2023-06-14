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
//Dashboard
import { Dashboard } from '../pages/Admin/Dashboard';
import { Wellcome } from '../pages/Admin/Dashboard/Wellcome';
//Content
import { Content } from '../pages/Admin/Content';
import { Catalog } from '../pages/Admin/Content/Catalog';
import { Teachers } from '../pages/Admin/Content/Teachers';
import { Library } from '../pages/Admin/Content/Library';
import { SatisfactionContent } from '../pages/Admin/Content/Satisfaction';
//Community
import { Community } from '../pages/Admin/Community';
import { Members } from '../pages/Admin/Community/Members';
import { Relationship } from '../pages/Admin/Community/Relationship';
import { CommunitySettings } from '../pages/Admin/Community/CommunitySettings';
import { CommunityOthers } from '../pages/Admin/Community/Others';
//Students
import { Students } from '../pages/Admin/Students';
import { ActiveStudents } from '../pages/Admin/Students/Actives';
import { InactiveStudents } from '../pages/Admin/Students/Inactives';
//Support
import { Support } from '../pages/Admin/Support';
import { Calls } from '../pages/Admin/Support/Calls';
import { Channels } from '../pages/Admin/Support/Channels';
import { Satisfaction } from '../pages/Admin/Support/Satisfaction';
//Platform
import { Platform } from '../pages/Admin/Platform';
import { Gallery } from '../pages/Admin/Platform/Gallery';
import { Emails } from '../pages/Admin/Platform/Emails';
import { Advertising } from '../pages/Admin/Platform/Advertising';
import { Integrations } from '../pages/Admin/Platform/Integrations';
import { Gamification } from '../pages/Admin/Platform/Gamefication';
//Settings
import { Settings } from '../pages/Admin/Settings';
import { Users } from '../pages/Admin/Settings/Users';
import { LoadingPage } from '../pages/LoadingPage';
import { Levels } from '../pages/Admin/Settings/Levels';
import { Credentials } from '../pages/Admin/Settings/Credentials';











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
      path: '/admin',
      element:<Private Item={TemplateAdm} typeAccess={'Adm'}/>,
      errorElement:<Error/>,
      children:[
        {
          errorElement:<Error/>,       
          children:[           
            { //DASHBOARD
              path: '/admin/dashboard',
              children:[
                { index: true, element:<Dashboard/>},
                { path: '/admin/dashboard/wellcome', element:<Wellcome/>},
              ]
            }, 
            { //CONTENT
              path: '/admin/content',
              children:[
                { index: true, element:<Content/>},
                { path: '/admin/content/catalog', element:<Catalog/>},
                { path: '/admin/content/teachers', element:<Teachers/>},
                { path: '/admin/content/library', element:<Library/>},
                { path: '/admin/content/satisfaction', element:<SatisfactionContent/>},
              ]
            }, 
            { //COMMUNITY
              path: '/admin/community',
              children:[
                { index: true, element:<Community/>},
                { path: '/admin/community/members', element:<Members/>},
                { path: '/admin/community/relationship', element:<Relationship/>},
                { path: '/admin/community/others', element:<CommunityOthers/>},
                { path: '/admin/community/settings', element:<CommunitySettings/>},
              ]
            }, 
            { //STUDENTS
              path: '/admin/students',
              children:[
                { index: true, element:<Students/>},
                { path: '/admin/students/actives', element:<ActiveStudents/>},
                { path: '/admin/students/inactives', element:<InactiveStudents/>},
              ]
            }, 
            { //SUPPORT
              path: '/admin/support',
              children:[
                { index: true, element:<Support/>},
                { path: '/admin/support/calls', element:<Calls/>},
                { path: '/admin/support/channels', element:<Channels/>},
                { path: '/admin/support/satisfaction', element:<Satisfaction/>},
              ]
            }, 
            { //PLATFORM
              path: '/admin/platform',
              children:[
                { index: true, element:<Platform/>},
                { path: '/admin/platform/gallery', element:<Gallery/>},
                { path: '/admin/platform/emails', element:<Emails/>},
                { path: '/admin/platform/advertising', element:<Advertising/>},
                { path: '/admin/platform/integrations', element:<Integrations/>},
                { path: '/admin/platform/gamification', element:<Gamification/>},
              ]
            }, 

            
            {//SETTINGS
              path: '/admin/settings',
              children:[
                { index: true, element:<Settings/>},
                { path: '/admin/settings/users', element:<Users/>},
                { path: '/admin/settings/credentials', element:<Credentials/>},
                { path: '/admin/settings/levels', element:<Levels/>},
                { path: '/admin/settings/security', element:<Settings/>},
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