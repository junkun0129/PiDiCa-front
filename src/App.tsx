import { appRoute, appStyle } from "./const";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import ReportRegisterPage from "./pages/ReportRegisterPage";
import ReportMangePage from "./pages/ReportMangePage";
import TaskManagePage from "./pages/TaskManagePage";
import ProjectManagePage from "./pages/ProjectManagePage";
import UserManagePage from "./pages/UserManagePage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
function App() {
  return (
    <>
      <Routes>
        <Route path={appRoute.signin} element={<SigninPage />} />
        <Route path={appRoute.signup} element={<SignupPage />} />

        <Route path="/" element={<AppLayout />}>
          <Route
            path={appRoute.reportRegister}
            element={<ReportRegisterPage />}
          />
          <Route path={appRoute.reportManage} element={<ReportMangePage />} />
          <Route path={appRoute.taskManage} element={<TaskManagePage />} />
          <Route
            path={appRoute.projectManage}
            element={<ProjectManagePage />}
          />

          <Route path={appRoute.userManage} element={<UserManagePage />} />
          <Route path={appRoute.attendManage} element={<UserManagePage />} />
          <Route path={appRoute.setting} element={<UserManagePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
