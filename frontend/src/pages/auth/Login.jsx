import React, { useState } from "react";
import { Box, Typography, Button, Stack, Link, Divider, InputLabel, IconButton, FormControl, FormHelperText, CircularProgress } from "@mui/material";
import { BootstrapInput } from "../../common/custom/BootstrapInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CustomInput from '../../common/custom/CustomInput'
import AppleIcon from "@mui/icons-material/Apple";
import logo2 from "../../assets/images/icons.svg";
import { useFormik } from "formik"
import googleIcon from '../../assets/images/googleIcon.svg'
import facebookIcon from '../../assets/images/facebookIcon.svg'
import { useLogin } from '../../Api/Api'
import { toast } from "react-toastify";
import { useNavigate, Link as LinkRouter } from "react-router-dom";
const generateDeviceId = () => {
    const id = Math.random().toString(36).substring(2) + Date.now();
    return id;
};
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate()

    const deviceId = generateDeviceId();

    const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;


    const handleGoogleLogin = () => {
        try {
            window.location.href = `${BASE_URL}/auth/google?role=user&device_type=WEB&device_id=${deviceId}`;
        } catch (err) {
            console.error("Google login error:", err);
            setApiError("Failed to initiate Google login");
        }
    };

    const handleFacebookLogin = () => {
        try {
            window.location.href = `${BASE_URL}/auth/facebook?role=user&device_type=WEB&device_id=${deviceId}`;
        } catch (err) {
            console.error("Facebook login error:", err);
            setApiError("Failed to initiate Facebook login");
        }
    };

    const handleAppleLogin = () => {
        try {
            window.location.href = `${BASE_URL}/auth/apple?role=user&device_type=WEB&device_id=${deviceId}`;
        } catch (err) {
            console.error("Apple login error:", err);
            setApiError("Failed to initiate Apple login");
        }
    };

    const loginForm = useFormik({
        initialValues: {
            email: "",
            password: "",
            role: 'user',
            device_type: "WEB",
            device_id: generateDeviceId(),
        },
        onSubmit: (values) => {
            console.log("Submitting:", values);
            login(values);
        },

    });
    const onSuccess = (res) => {
        const user = res?.data?.user;
        const needsEmailVerification = user?.email_verified === false;

        localStorage.setItem("accessToken", res?.data?.authToken?.access?.token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user?.id);

        if (needsEmailVerification) {
            toast.success("Login successful — verify your email to continue");
            navigate("/verification", {
                state: { email: user?.email, fromLogin: true },
            });
            return;
        }

        toast.success("Login Successfully");
        navigate("/home");
    };
    const onError = (error) => {
        const message = error?.response?.data?.message || "Login failed";
        if (message.toLowerCase().includes("role")) {
            setApiError("Please login with User account");
        }
        else {
            setApiError(message);
        }
    };
    const { mutate: login, isPending } = useLogin(onSuccess, onError)

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "#1C2533",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 3,
            }}
        >
            <Box sx={{ width: "100%", maxWidth: 400, color: "#fff" }}>

                {/* Logo */}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <img src={logo2} alt="logo" style={{ width: "50%" }} />
                </Box>

                {/* Heading */}
                <Typography variant="h4" fontWeight={600} mb={1} mt={3}>
                    Welcome Back
                </Typography>

                <Typography fontSize={'0.95rem'} sx={{ opacity: 0.7, mb: 3 }}>
                    Welcome back! Please enter your details.
                </Typography>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    loginForm.handleSubmit(e);
                }}>
                    <Stack spacing={2}>
                        {/* Email */}
                        <CustomInput
                            label="Email"
                            placeholder="Enter your Email"
                            type="email"
                            name="email"
                            formik={loginForm}
                        />
                        {/* Password */}
                        <FormControl variant="standard" fullWidth sx={{ mb: 2, position: 'relative' }}>
                            <InputLabel shrink htmlFor="password" sx={{ fontSize: '1.3rem', fontWeight: 500, color: '#757575', '&.Mui-focused': { color: '#757575' } }}>
                                Password
                            </InputLabel>
                            <BootstrapInput
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={loginForm.values.password}
                                onChange={(e) => {
                                    loginForm.handleChange(e);
                                    setApiError(""); // ✅ clear API error
                                }}
                            />
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '70%',
                                    transform: 'translateY(-50%)',
                                    padding: 0,
                                    zIndex: 2
                                }}
                                tabIndex={-1}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </IconButton>

                        </FormControl>
                        {loginForm.touched.password && loginForm.errors.password ? (
                            <FormHelperText error>
                                {loginForm.errors.password}
                            </FormHelperText>
                        ) : apiError ? (
                            <FormHelperText error>
                                {apiError}
                            </FormHelperText>
                        ) : null}

                        {/* Forgot Password */}
                        <Link component={LinkRouter} to="/forgot-password" underline="none" sx={{ color: "#2fd3c6", fontSize: 13, fontWeight: 600 }}>
                            Forgot Password
                        </Link>

                        {/* Sign In */}
                        <Button
                            fullWidth
                            disabled={isPending}
                            type="submit"
                            sx={{
                                py: 1.5,
                                borderRadius: "8px",
                                background: "var(--Blue)",
                                color: "#000",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": { background: "var(--Blue)" },
                            }}
                        >
                            {isPending ? <CircularProgress size={20} color="white" /> : 'Sign In'}
                        </Button>

                        <Divider sx={{ color: "#aaa" }}>OR</Divider>

                        {/* Social buttons */}
                        <Button
                            fullWidth
                            onClick={() => handleGoogleLogin()}
                            startIcon={<img src={googleIcon} alt="Google Icon" />}
                            sx={{ bgcolor: "#fff", color: "#000", fontWeight: 600 }}
                        >
                            Sign In with Google
                        </Button>

                        <Button
                            fullWidth
                            onClick={handleFacebookLogin}
                            startIcon={<img src={facebookIcon} alt="facebookIcon" />}
                            sx={{ bgcolor: "#fff", color: "#000", fontWeight: 600 }}
                        >
                            Continue with Facebook
                        </Button>

                        <Button
                            fullWidth
                            onClick={handleAppleLogin}
                            startIcon={<AppleIcon />}
                            sx={{ bgcolor: "#fff", color: "#000", fontWeight: 600 }}
                        >
                            Continue with Apple
                        </Button>

                        {/* Signup */}
                        <Typography textAlign="center" sx={{ mt: 2, opacity: 0.8 }}>
                            Don’t have an account?{" "}
                            <Link component={LinkRouter} to="/sign-up" sx={{ color: "var(--Blue)", textDecoration: 'none' }}>
                                Sign up
                            </Link>
                        </Typography>

                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default Login;