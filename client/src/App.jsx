import { useEffect } from "react";
import Home from "./Home/Home";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard/Dashboard";
import FileDownload from "./FIleDownload";
import { useDispatch } from "react-redux";
import RequireAuth from "./components/Auth/RequireAuth";
import NoRequireAuth from "./components/Auth/NotRequireAuth";
import DownloadPage from "./components/DownloadPage";
import Download from "./components/Download";
import GuestHomePage from "./components/Guest/GuestHomePage";
import GuestHome from "./components/Guest/Download/GuestHome";
import BundleDownload from "./components/BundleDownload";
import GuestBundleHome from "./components/Guest/Download/GuestBundleHome";
import { hasStoredAuthTokens } from "./config/axiosInstance";
import { markAuthInitialized } from "./redux/slice/auth/authSlice";
import { getCurrentUser } from "./redux/slice/auth/authThunk";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (hasStoredAuthTokens()) {
      dispatch(getCurrentUser());
      return;
    }

    dispatch(markAuthInitialized());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route element={<NoRequireAuth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/" element={<GuestHomePage />} />
        <Route path="/f/:shortCode" element={<Download />} />
        <Route path="/g/:shortCode" element={<GuestHome />} />
        <Route path="/bundle/:bundleCode" element={<BundleDownload />} />
        <Route path="/guest-bundle/:bundleCode" element={<GuestBundleHome />} />
      </Routes>
    </>
  );
}

export default App;
