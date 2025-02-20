import React from "react";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { useNavigate } from "react-router";
import { FaGoogle } from "react-icons/fa";

const SignIn = () => {
  const { userLogIn, setUser, signUpWithGoogle, setResetEmail } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleGoogleSignUp = () => {
    signUpWithGoogle().then((res) => {
      const userInfo = {
        name: res?.user?.displayName,
        email: res?.user?.email,
        photo: res?.user?.photoURL,
      };
      axiosPublic.post("/users", userInfo).then((res) => {
        // console.log(res.data);
        navigate("/task-page");
      });
    });
  };
  return (
    <div className="form-control mt-6">
      <h5 className="text-3xl font-semibold text-blackLight text-center mb-6">
        Or
      </h5>
      <button
        type="button"
        onClick={handleGoogleSignUp}
        className="btn border-none bg-primary text-light rounded-none hover:text-primary  w-full"
      >
        <FaGoogle />
        <span className="ml-2">Sign Up With Google</span>
      </button>
    </div>
  );
};

export default SignIn;
