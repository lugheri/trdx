import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { PrivateProps } from '../contexts/Dtos/auth.dto';
//Templates
import { Template, TemplateAdm } from '../components/Template';
import { Login, LoginAdm, Logoff } from '../pages/Login';
import { ForgotPass } from '../pages/forgotPass';
import { Error } from '../pages/Error';
//Pages Students
import { Home } from '../pages/Students/Home';
import { CoursesGallery } from '../pages/Students/CoursesGallery';
import { CourseModules } from '../pages/Students/CourseModules';
import { ClassRoom} from '../pages/Students/ClassRoom/index';
import { Profile } from '../pages/Students/Profile';
import { CommunityStudent } from '../pages/Students/CommunityStudent';
//Page Admin
//Dashboard
import { Dashboard } from '../pages/Admin/Dashboard';
import { Welcome } from '../pages/Admin/Dashboard/Welcome';
//Content
import { Content } from '../pages/Admin/Content';
import { HomePage } from '../pages/Admin/Content/HomePage';
import { Catalog } from '../pages/Admin/Content/Catalog';
import { Teachers } from '../pages/Admin/Content/Teachers';
import { Library } from '../pages/Admin/Content/Library';
import { SatisfactionContent } from '../pages/Admin/Content/Satisfaction';
//Community
import { Community } from '../pages/Admin/Community';
//Students
import { Students } from '../pages/Admin/Students';
import { ActiveStudents } from '../pages/Admin/Students/Actives/index.tsx';
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
//Metrics
import { Reports } from '../pages/Admin/Reports';
import { StudentsReports } from '../pages/Admin/Reports/StudentsReports/index.tsx';
import { AccessPerHour } from '../pages/Admin/Reports/AccessPerHour/index.tsx';
import { CoursesStatistics } from '../pages/Admin/Reports/CoursesStatistics/index.tsx';
//Settings
import { Settings } from '../pages/Admin/Settings';
import { Users } from '../pages/Admin/Settings/Users';
import { LoadingPage } from '../pages/LoadingPage';
import { Levels } from '../pages/Admin/Settings/Levels';
import { Credentials } from '../pages/Admin/Settings/Credentials';
import { FolderGallery } from '../pages/Admin/Platform/Gallery/components/FolderGallery';
import { Comments } from '../pages/Admin/Content/Comments.tsx';
import { OpenStudent } from '../pages/Admin/Students/components/OpenStudent/index.tsx';





//Validate Auths
const Private: React.FC<PrivateProps> = ({Item,typeAccess}) => {
  const authenticate = useAuth();  
  return(
    authenticate === undefined ? <LoadingPage/> 
    : authenticate.authenticated === null ? <LoadingPage/> 
      : authenticate.authenticated ? //If Authenticated
          typeAccess == 'Adm' ? //Check if type access is adm and typeAuthUser is compatible or logout
            authenticate.typeAccess=='Adm' ? <Item/> : <LoginAdm/>
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
              path:'/coursesGallery',
              element:<CoursesGallery/>, 
            },
            {
              path:'/classRoom',
              children:[
                { index: true, element:<CoursesGallery/>},
                { path: '/classRoom/course/:course_id', element:<CourseModules/>},
                { path: '/classRoom/course/lesson/:lesson_id', element:<ClassRoom/>},
              ]             
            },
            {
              path:'/communityStudent',
              element:<CommunityStudent/>,
            },          
            {
              path:'/Profile',
              element:<Profile/>,
            },{
              path:'/Logoff',
              element:<Logoff/>,
            }
          ]
        }
      ],     
    },
    {
      path: '/forgotPass',
      element:<ForgotPass/>,
      errorElement:<Error/>,
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
                { path: '/admin/dashboard/welcome', element:<Welcome/>},
              ]
            }, 
            { //CONTENT
              path: '/admin/content',
              children:[
                { index: true, element:<Content/>},
                
                { path: '/admin/content/homepage', element:<HomePage/>},
                { path: '/admin/content/catalog', element:<Catalog/>},
                { path: '/admin/content/comments', element:<Comments/>},
                { path: '/admin/content/teachers', element:<Teachers/>},
                { path: '/admin/content/library', element:<Library/>},
                { path: '/admin/content/satisfaction', element:<SatisfactionContent/>},
              ]
            }, 
            { //COMMUNITY
              path: '/admin/community',
              children:[
                { index: true, element:<Community/>}
              ]
            }, 
            { //STUDENTS
              path: '/admin/students',
              children:[
                { index: true, element:<Students/>},
                { path: '/admin/students/actives', element:<ActiveStudents/>},
                { path: '/admin/students/actives/info/:student_id', element:<OpenStudent/>},
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
                {
                  path:'/admin/platform/gallery',
                  children:[
                    { index: true, element:<Gallery/>},
                    { path: '/admin/platform/gallery/folder/:folder_id', element:<FolderGallery/>}
                  ]
                },
                { path: '/admin/platform/emails', element:<Emails/>},
                { path: '/admin/platform/advertising', element:<Advertising/>},
                { path: '/admin/platform/integrations', element:<Integrations/>},
                { path: '/admin/platform/gamification', element:<Gamification/>},
              ]
            }, 
            { //MÉTRICS
              path: '/admin/reports',
              children:[
                { index: true, element:<Reports/>},
                { path: '/admin/reports/students', element:<StudentsReports/>},
                { path: '/admin/reports/access_per_hour', element:<AccessPerHour/>},
                { path: '/admin/reports/courses_statistics', element:<CoursesStatistics/>},
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