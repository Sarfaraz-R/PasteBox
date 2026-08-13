import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutSession } from "../../redux/slice/auth/authThunk";
import { logoutUser } from "../../redux/slice/auth/authSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const logoutUserFromStorage = async () => {
      try {
        await dispatch(logoutSession()).unwrap();
      } catch (error) {
        // Even if the server session is already gone, clear local auth state so the UI is consistent.
      } finally {
        dispatch(logoutUser());
        navigate("/login", { replace: true });
      }
    };

    logoutUserFromStorage();
  }, [dispatch, navigate]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-[32px] border border-mid bg-white/80">
      <h1 className="text-3xl font-bold text-ink/80 animate-pulse">Logging out...</h1>
    </div>
  );
};

export default Logout;
