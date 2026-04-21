import React, { useState } from "react";
import { Box, Typography, Button, Stack, Link, Divider, InputLabel, IconButton, FormControl, FormHelperText, CircularProgress } from "@mui/material";
import { BootstrapInput } from "../../common/custom/BootstrapInput";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CustomInput from '../../common/custom/CustomInput'
import { useFormik } from "formik"
import googleIcon from '../../assets/images/googleIcon.svg'
import { useLogin, useSocialLogin } from '../../Api/Api'
import { toast } from "react-toastify";
import { useNavigate, Link as LinkRouter } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [apiError, setApiError] = useState("");
    const navigate = useNavigate()

    const loginForm = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        onSubmit: (values) => {
            console.log("Submitting:", values);
            login(values);
        },

    });
    const onSuccess = (res) => {
        const user = res?.data?.user;

        localStorage.setItem("accessToken", res?.data?.authToken?.access?.token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user?.id);

        toast.success("Login Successfully");
        navigate("/home");
    };
    const onError = (error) => {
        const message = error?.response?.data?.message || "Login failed";
        setApiError(message);
    };
    const { mutate: login, isPending } = useLogin(onSuccess, onError);
    const { mutate: socialLoginMutate, isPending: socialPending } = useSocialLogin(onSuccess, onError);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: tokenResponse => {
            socialLoginMutate({ provider: 'google', token: tokenResponse.access_token });
        },
        onError: () => setApiError("Google Login Failed"),
    });

    return (
        <Box className="auth-container" sx={{ justifyContent: 'center', alignItems: 'center' }}>
            {/* Left: Form */}
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 3,
                py: 4,
                position: 'relative',
                zIndex: 1,
            }}>
                <Box className="auth-form-wrapper">
                    {/* Logo */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 5 }}>
                        <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 18,
                            color: '#fff',
                        }}>
                            O
                        </Box>
                        <Typography sx={{
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#F1F5F9',
                            letterSpacing: '-0.5px',
                        }}>
                            OfficeOS
                        </Typography>
                    </Box>

                    {/* Heading */}
                    <Typography sx={{
                        fontSize: '28px',
                        fontWeight: 800,
                        color: '#F1F5F9',
                        letterSpacing: '-0.5px',
                        mb: 0.5,
                    }}>
                        Welcome back
                    </Typography>

                    <Typography sx={{ fontSize: '14px', color: '#64748B', mb: 4 }}>
                        Sign in to your workspace to continue.
                    </Typography>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        loginForm.handleSubmit(e);
                    }}>
                        <Stack spacing={2.5}>
                            {/* Email */}
                            <CustomInput
                                label="Email"
                                placeholder="Enter your email"
                                type="email"
                                name="email"
                                formik={loginForm}
                            />

                            {/* Password */}
                            <FormControl variant="standard" fullWidth sx={{ mb: 2, position: 'relative' }}>
                                <InputLabel shrink htmlFor="password" sx={{
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    color: '#94A3B8',
                                    '&.Mui-focused': { color: '#A29BFE' }
                                }}>
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
                                        setApiError("");
                                    }}
                                />
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    sx={{
                                        position: 'absolute',
                                        right: 10,
                                        top: '68%',
                                        transform: 'translateY(-50%)',
                                        padding: 0,
                                        zIndex: 2,
                                        color: '#64748B',
                                        '&:hover': { color: '#A29BFE' },
                                    }}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Link
                                    component={LinkRouter}
                                    to="/resend-email"
                                    underline="none"
                                    sx={{
                                        color: "#A29BFE",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        '&:hover': { color: '#6C5CE7' },
                                    }}
                                >
                                    Verify Email
                                </Link>
                                <Link
                                    component={LinkRouter}
                                    to="/forgot-password"
                                    underline="none"
                                    sx={{
                                        color: "#A29BFE",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        '&:hover': { color: '#6C5CE7' },
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>

                            </Box>

                            {/* Sign In */}
                            <Button
                                fullWidth
                                disabled={isPending}
                                type="submit"
                                sx={{
                                    py: 1.5,
                                    borderRadius: "10px",
                                    background: "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    textTransform: "none",
                                    boxShadow: '0 4px 20px rgba(108, 92, 231, 0.3)',
                                    transition: 'all 0.3s ease',
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #5A4BD1 0%, #8B7EFC 100%)",
                                        boxShadow: '0 6px 28px rgba(108, 92, 231, 0.4)',
                                        transform: 'translateY(-1px)',
                                    },
                                    "&:disabled": {
                                        background: 'rgba(108, 92, 231, 0.3)',
                                        color: 'rgba(255,255,255,0.5)',
                                    },
                                }}
                            >
                                {isPending ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Sign In'}
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 0.5 }}>
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                <Typography sx={{ color: '#64748B', fontSize: '12px', fontWeight: 500 }}>or continue with</Typography>
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                            </Box>

                            {/* Social buttons */}
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Button
                                    fullWidth
                                    onClick={() => handleGoogleLogin()}
                                    disabled={socialPending}
                                    sx={{
                                        py: 1.3,
                                        borderRadius: '10px',
                                        bgcolor: "rgba(255,255,255,0.04)",
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        color: "#F1F5F9",
                                        fontWeight: 600,
                                        fontSize: '13px',
                                        textTransform: 'none',
                                        transition: 'all 0.2s ease',
                                        "&:hover": {
                                            bgcolor: "rgba(255,255,255,0.08)",
                                            borderColor: 'rgba(255,255,255,0.15)',
                                        },
                                    }}
                                >
                                    <img src={googleIcon} alt="Google" style={{ width: 18, marginRight: 8 }} />
                                    Google
                                </Button>

                            </Box>

                            {/* Signup */}
                            <Typography sx={{ mt: 2, color: '#64748B', textAlign: "center", fontSize: '14px' }}>
                                Don't have an account?{" "}
                                <Link component={LinkRouter} to="/sign-up" sx={{
                                    color: "#A29BFE",
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    '&:hover': { color: '#6C5CE7' },
                                }}>
                                    Sign up
                                </Link>
                            </Typography>
                        </Stack>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Login;