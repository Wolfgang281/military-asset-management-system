import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AUTH_ROUTES } from "../constants/endpoints";
import axiosInstance from "../lib/axios";
import { clearUser, setUserData } from "../redux/slices/userSlice";

function useGetCurrentUser() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(AUTH_ROUTES.CURRENT_USER);
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get(AUTH_ROUTES.CURRENT_USER);
        // console.log("res: ", res);
        dispatch(setUserData(res.data.user));
      } catch (err) {
        console.log("err: ", err.response);
        dispatch(clearUser());
      }
    };

    fetchUser();
  }, [dispatch]);
}

export default useGetCurrentUser;
