import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage/Home";
import AboutPage from "./Pages/AboutPage/AboutPage";
import ChatBot from "./Pages/HomePage/Components/ChatBot/ChatBot.jsx";
import ProtectedRoute from "./ProtectedRoute"; // Protected route for role-based access

// ==================== MANAGEMENT PAGES & COMPONENTS ====================
import ManagementLogin from "./Pages/Management/ManagementLogin"; // Management login page
import ManagementPage from "./Pages/Management/ManagementPage"; // Management's main page
import AddManagementAuth from "./Pages/Management/Components/AddManagement/AddManagementAuth.jsx"; // Add Management Auth
import ThrAttendanceAuth from "./Pages/Management/Components/Teacherattendance/ThrAttendanceAuth.jsx"; // Check Teacher Attendance
import StdAttendanceAuth from "./Pages/Management/Components/Studentattendance/StdAttendanceAuth.jsx"; // Check Student Attendance
import StdProgressAuth from "./Pages/Management/Components/Studentprogress/StdProgressAuth.jsx"; // Check Student Progress
import MarkTchrAttendanceAuth from "./Pages/Management/Components/MarkTeacherAttendance/MarkTchrAttendancAuth.jsx"; // Mark Teacher Attendance
import AddTchrAuth from "./Pages/Management/Components/Addteacher/AddTchrAuth.jsx"; // Add Teacher
import TeacherInfoAuth from "./Pages/Management/Components/TeacherInfo/TeacherInfoAuth.jsx"; // Teacher Info
import EditTeacherInfo from "./Pages/Management/Components/TeacherInfo/EditTeacherInfo.jsx"; // Edit Teacher Info
import StudentInfo from "./Pages/Management/Components/Studentinfo/StudentInfo.jsx"; // Student Info
import CreateEventsAuth from "./Pages/Management/Components/Eventss/CreateEventsAuth.jsx"; // Create Events
import ClassaRoomAuth from "./Pages/Management/Components/ClassRoom/ClassaRoomAuth.jsx"; // Class Room Auth
import AddMemorial from "./Pages/Management/Components/Memorial/AddMemorial.jsx";
import AddParents from "./Pages/Management/Components/Parents/AddParents/AddParents.jsx";
import ParentsDetails from "./Pages/Management/Components/Parents/ParentsDetails/ParentsDetails.jsx";

// ==================== PRINCIPAL PAGES & COMPONENTS ====================
import PrincipalPage from "./Pages/PrinciPage/PrincipalPage"; // Principal's main page
import PrinciLogin from "./Pages/PrinciPage/Components/Login/PrinciLogin.jsx"; // Principal login
import AddStudent from "./Pages/PrinciPage/Components/Add Student/AddStudent.jsx"; // Add Student
import MarkTchrAtte from "./Pages/PrinciPage/Components/Mark Tchr Attendnance/MarkTchrAtte.jsx"; // Mark Teacher Attendance
import CheckStdAttePrinci from "./Pages/PrinciPage/Components/Check std atte/CheckStdAttePrinci.jsx"; // Check Student Attendance

import CheckProgressPrinci from "./Pages/PrinciPage/Components/Check Progress/CheckProgressPrinci.jsx"; // Check Progress
import MarkStdAttePrinci from "./Pages/PrinciPage/Components/Marak std attendance/MarkStdAttePrinci.jsx"; // Mark Student Attendance
import CheckTchrAttePrinci from "./Pages/PrinciPage/Components/Teacher Attendnace/CheckTchrAttePrinci.jsx"; // Check Teacher Attendance
import ClassRoomsPrinci from "./Pages/PrinciPage/Components/ClassRooms/ClassRoomsPrinci.jsx"; // Classrooms
import EventsPrinci from "./Pages/PrinciPage/Components/Eventss/EventsPrinci.jsx"; // Events
import HandleNotificationPrinci from "./Pages/PrinciPage/Components/Notification/HandleNotificationPrinci.jsx"; // Handle Notification
import SetClasses from "./Pages/PrinciPage/Components/ClassRooms/SetClasses.jsx"; // Set Classes
import EditClasses from "./Pages/PrinciPage/Components/ClassRooms/EditClasses.jsx"; // Edit Classes
import DailyRoutinePrinci from "./Pages/PrinciPage/Components/DailyRoutinPrinci/DailyRoutinePrinci.jsx"; // Daily Routine
import PassStudents from "./Pages/PrinciPage/Components/PassStudents/PassStudents.jsx"; // Pass Students
import ParentsDetailsPrinci from "./Pages/PrinciPage/Components/Parents/ParentsDetails/ParentsDetailsPrinci.jsx";
import AddParentsPrinci from "./Pages/PrinciPage/Components/Parents/AddParents/AddParentsPrinci.jsx";
import StudentsDetails from "./Pages/PrinciPage/Components/Check std info/StudentsDetails.jsx";
import EditStudentInfo from "./Pages/PrinciPage/Components/Check std info/EditStudentInfo.jsx";

// ==================== TEACHER PAGES & COMPONENTS ====================
import TeachersPage from "./Pages/TeachersPage/TeachersPage"; // Teacher's main page
import TeachersLogin from "./Pages/TeachersPage/Components/Login/TeachersLogin"; // Teacher login page
import DailyRoutine from "./Pages/TeachersPage/Components/DailyRoutine/DailyRoutine.jsx"; // Daily Routine
import TeacherProfileTchr from "./Pages/TeachersPage/Components/Profile/TeacherProfileTchr.jsx"; // Teacher Profile
import MarkProgressTCH from "./Pages/TeachersPage/Components/Std Progress/MarkProgressTCH.jsx"; // Mark Student Progress
import TchrAttendanceTCH from "./Pages/TeachersPage/Components/Attendnace/TchrAttendanceTCH.jsx"; // Teacher Attendance
import StudentsInfoTCH from "./Pages/TeachersPage/Components/Students Info/StudentsInfoTCH.jsx"; // Students Info
import MarkStdAtteTCH from "./Pages/TeachersPage/Components/Mark Std Attendance/MarkStdAtteTCH.jsx"; // Mark Student Attendance
import CheckStdAtteTCH from "./Pages/TeachersPage/Components/Check Std Attendance/CheckStdAtteTCH.jsx"; // Check Student Attendance
import CheckStdProgrTCH from "./Pages/TeachersPage/Components/Std Progress/CheckStdProgrTCH.jsx"; // Check Student Progress
import AddTimeTables from "./Pages/TeachersPage/Components/Add TimeTables/AddTimeTables.jsx"; // Add Timetables
import TchrNotification from "./Pages/TeachersPage/Components/Notification/TchrNotification.jsx"; // Teacher Notification
import GivNotificaTHR from "./Pages/TeachersPage/Components/Giv Notification/GivNotificaTHR.jsx"; // Give Notification
import ClassRoomTeachr from "./Pages/TeachersPage/Components/ClassRoom/ClassRoomTeachr.jsx"; // Teacher Classroom

// ==================== STUDENT PAGES & COMPONENTS ====================
import StudentsPage from "./Pages/StudentsPge/StudentsPage"; // Student's main page
import StudentsProfile from "./Pages/StudentsPge/Components/StudentsProfile/StudentsProfile"; // Student's profile page
import StudentsAttendance from "./Pages/StudentsPge/Components/Attendance/StudentsAttendnace"; // Student attendance page
import StudentLogin from "./Pages/StudentsPge/Components/Login/StudentLogin"; // Student login page
import StudentsProgressSTD from "./Pages/StudentsPge/Components/Progress/StudentsProgressSTD.jsx"; // Student progress page
import ContactTeacher from "./Pages/StudentsPge/Components/Contact Teacher/ContactTeacher.jsx"; // Contact teacher
import TimeTable from "./Pages/StudentsPge/Components/Time Table/TimeTable.jsx"; // Time table
import ClassRoom from "./Pages/StudentsPge/Components/Class Room/ClassRoom.jsx"; // Class Room
import Notification from "./Pages/StudentsPge/Components/Notification/Notification.jsx"; // Notification
import MyRoutine from "./Pages/StudentsPge/Components/DailuRoutine/MyRoutine.jsx"; // My Routine
import MarkMyRoutine from "./Pages/StudentsPge/Components/DailuRoutine/MarkMyRoutine.jsx"; // Mark My Routine
import SupportPage from "./Pages/SupportPage/SupportPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* // ==================== General PAGES & COMPONENTS ==================== */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        {/* // ==================== MANAGEMENT PAGES & COMPONENTS ==================== */}
        <Route path="/management-login" element={<ManagementLogin />} />{" "}
        <Route
          path="/management-details"
          element={
            <ProtectedRoute role="authority">
              <ManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-management"
          element={
            <ProtectedRoute role="authority">
              <AddManagementAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-teachers-attendance"
          element={
            <ProtectedRoute role="authority">
              <ThrAttendanceAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-students-attendance"
          element={
            <ProtectedRoute role="authority">
              <StdAttendanceAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-students-info"
          element={
            <ProtectedRoute role="authority">
              <StudentInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-students-progress"
          element={
            <ProtectedRoute role="authority">
              <StdProgressAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark-teacher-attendance"
          element={
            <ProtectedRoute role="authority">
              <MarkTchrAttendanceAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-teacher"
          element={
            <ProtectedRoute role="authority">
              <AddTchrAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-teacher-info"
          element={
            <ProtectedRoute role="authority">
              <TeacherInfoAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-gallery"
          element={
            <ProtectedRoute role="authority">
              <CreateEventsAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-teacher-info"
          element={
            <ProtectedRoute role="authority">
              <EditTeacherInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classroom-auth"
          element={
            <ProtectedRoute role="authority">
              <ClassaRoomAuth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-parents-management"
          element={
            <ProtectedRoute role="authority">
              <AddParents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-parents-management"
          element={
            <ProtectedRoute role="authority">
              <ParentsDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-memorial"
          element={
            <ProtectedRoute role="authority">
              <AddMemorial />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-bot-management"
          element={
            <ProtectedRoute role="authority">
              <ChatBot />
            </ProtectedRoute>
          }
        />
        {/* // ==================== PRINCIPAL PAGES & COMPONENTS ==================== */}
        {/*Principal Routes */}
        <Route path="/principal-login" element={<PrinciLogin />} />
        <Route
          path="/principalpage"
          element={
            <ProtectedRoute role="principal">
              <PrincipalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-student"
          element={
            <ProtectedRoute role="principal">
              <AddStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-tchr-attendnace"
          element={
            <ProtectedRoute role="principal">
              <CheckTchrAttePrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark-tchr-attendnace"
          element={
            <ProtectedRoute role="principal">
              <MarkTchrAtte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-std-atte-princi"
          element={
            <ProtectedRoute role="principal">
              <CheckStdAttePrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-std-Info-princi"
          element={
            <ProtectedRoute role="principal">
              <StudentsDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-std-progress-princi"
          element={
            <ProtectedRoute role="principal">
              <CheckProgressPrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark-std-atte-princi"
          element={
            <ProtectedRoute role="principal">
              <MarkStdAttePrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-gallery-princi"
          element={
            <ProtectedRoute role="principal">
              <EventsPrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classrooms-princi"
          element={
            <ProtectedRoute role="principal">
              <ClassRoomsPrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification-princi"
          element={
            <ProtectedRoute role="principal">
              <HandleNotificationPrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-std-princi"
          element={
            <ProtectedRoute role="principal">
              <SetClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-std-princi"
          element={
            <ProtectedRoute role="principal">
              <EditClasses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-routin-princi"
          element={
            <ProtectedRoute role="principal">
              <DailyRoutinePrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passstudents"
          element={
            <ProtectedRoute role="principal">
              <PassStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parents-details-princi"
          element={
            <ProtectedRoute role="principal">
              <ParentsDetailsPrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-parents"
          element={
            <ProtectedRoute role="principal">
              <AddParentsPrinci />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-student-princi"
          element={
            <ProtectedRoute role="principal">
              <EditStudentInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-bot-principal"
          element={
            <ProtectedRoute role="principal">
              <ChatBot />
            </ProtectedRoute>
          }
        />
        {/* // ==================== TEACHER PAGES & COMPONENTS ==================== */}
        {/* Teacher Routes */}
        <Route path="/teacherlogin" element={<TeachersLogin />} />
        <Route
          path="/teacherspage"
          element={
            <ProtectedRoute role="teacher">
              <TeachersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacherprofile"
          element={
            <ProtectedRoute role="teacher">
              <TeacherProfileTchr />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-attendnace"
          element={
            <ProtectedRoute role="teacher">
              <TchrAttendanceTCH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students-info-teacher"
          element={
            <ProtectedRoute role="teacher">
              <StudentsInfoTCH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark-attendance-teacher"
          element={
            <ProtectedRoute role="teacher">
              <MarkStdAtteTCH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-std-attendance-teacher"
          element={
            <ProtectedRoute role="teacher">
              <CheckStdAtteTCH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-std-progress-teacher"
          element={
            <ProtectedRoute role="teacher">
              <CheckStdProgrTCH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-timetable-teacher"
          element={
            <ProtectedRoute role="teacher">
              <AddTimeTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher-notification"
          element={
            <ProtectedRoute role="teacher">
              <TchrNotification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/give-notification-teacher"
          element={
            <ProtectedRoute role="teacher">
              <GivNotificaTHR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/daily-routine"
          element={
            <ProtectedRoute role="teacher">
              <DailyRoutine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classroom-teacher"
          element={
            <ProtectedRoute role="teacher">
              <ClassRoomTeachr />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-prgrss-teacher"
          element={
            <ProtectedRoute role="teacher">
              <MarkProgressTCH />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-bot-teacher"
          element={
            <ProtectedRoute role="teacher">
              <ChatBot />
            </ProtectedRoute>
          }
        />
        {/* // ==================== STUDENT PAGES & COMPONENTS ==================== */}
        <Route path="/studentlogin" element={<StudentLogin />} />{" "}
        <Route
          path="/chat-bot-student"
          element={
            <ProtectedRoute role="student">
              <ChatBot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studentspage"
          element={
            <ProtectedRoute role="student">
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studentsprofile"
          element={
            <ProtectedRoute role="student">
              <StudentsProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studentattendance"
          element={
            <ProtectedRoute role="student">
              <StudentsAttendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studentprogress"
          element={
            <ProtectedRoute role="student">
              <StudentsProgressSTD />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contact-teacher"
          element={
            <ProtectedRoute role="student">
              <ContactTeacher />
            </ProtectedRoute>
          }
        />
        <Route
          path="/time-table"
          element={
            <ProtectedRoute role="student">
              <TimeTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classroom"
          element={
            <ProtectedRoute role="student">
              <ClassRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-notification"
          element={
            <ProtectedRoute role="student">
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-my-routine"
          element={
            <ProtectedRoute role="student">
              <MyRoutine />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mark-my-routine"
          element={
            <ProtectedRoute role="student">
              <MarkMyRoutine />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
