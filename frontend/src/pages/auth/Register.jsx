import { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Stack,
    Checkbox,
    FormControlLabel, IconButton,
    Link, FormControl, InputLabel, CircularProgress, FormHelperText
} from "@mui/material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { BootstrapInput } from "../../common/custom/BootstrapInput";
import CustomInput from "../../common/custom/CustomInput";
import AppleIcon from "@mui/icons-material/Apple";
import { useFormik } from "formik";
import googleIcon from "../../assets/images/googleIcon.svg";
import facebookIcon from "../../assets/images/facebookIcon.svg";
import { useCreateAdmin, useSendOtp } from "../../Api/Api";
import { toast } from "react-toastify";
import { useNavigate, Link as LinkRouter } from "react-router-dom";

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            full_name: "",
            email: "",
            password: "",
            surname: "",
            user_type: 1,
        },
        onSubmit: (values) => {
            if (!checked) {
                toast.error("Please accept terms");
                return;
            }
            console.log(values)
            mutate(values)
        },
    });


    const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;


    const handleGoogleLogin = () => {
        try {
            window.location.href = `${BASE_URL}/auth/google?role=user`;
        } catch (err) {
            console.error("Google login error:", err);
        }
    };

    const handleFacebookLogin = () => {
        try {
            window.location.href = `${BASE_URL}/auth/facebook?role=user`;
        } catch (err) {
            console.error("Facebook login error:", err);
        }
    };

    const handleAppleLogin = () => {
        try {
            window.location.href = `${BASE_URL}/auth/apple?role=user`;
        } catch (err) {
            console.error("Apple login error:", err);
        }
    };


    const onSuccess = (res) => {
        toast.success("Admin created successfully")
        sendOtp({ email: formik.values.email })
    }
    const onError = (error) => {
        toast.error(error.message)
        console.log(error)
    }
    const { mutate, isPending } = useCreateAdmin(onSuccess, onError)

    const onSendOtpSuccess = () => {
        navigate('/verification', { state: { email: formik.values.email } })
        toast.success("OTP sent successfully")
    }
    const onSendOtpError = (error) => {
        toast.error(error.message)
        console.log(error)
    }

    const { mutate: sendOtp } = useSendOtp(onSendOtpSuccess, onSendOtpError)

    return (
        <Box className="auth-container" sx={{ justifyContent: 'center', alignItems: 'center' }}>
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
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
                        fontSize: '26px',
                        fontWeight: 800,
                        color: '#F1F5F9',
                        letterSpacing: '-0.5px',
                        mb: 0.5,
                    }}>
                        Create your account
                    </Typography>

                    <Typography sx={{ fontSize: '14px', color: '#64748B', mb: 4 }}>
                        Start your journey with OfficeOS — for free.
                    </Typography>

                    {/* Form */}
                    <form onSubmit={formik.handleSubmit}>
                        <Stack spacing={2.5}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <CustomInput label="First Name *" name="full_name" placeholder={"Enter your name"} formik={formik} />
                                <CustomInput label="Surname *" name="surname" placeholder={"Enter your surname"} formik={formik} />
                            </Box>
                            <CustomInput label="Email *" name="email" placeholder={"Enter your email"} formik={formik} />

                            {/* Password */}
                            <FormControl variant="standard" fullWidth sx={{ mb: 2, position: 'relative' }}>
                                <InputLabel shrink htmlFor="password" sx={{
                                    fontSize: '1.1rem',
                                    fontWeight: 500,
                                    color: '#94A3B8',
                                    '&.Mui-focused': { color: '#A29BFE' }
                                }}>
                                    Password *
                                </InputLabel>
                                <BootstrapInput
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
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
                                {formik.touched.password && <FormHelperText error>{formik.errors.password}</FormHelperText>}
                            </FormControl>

                            {/* Password hint */}
                            <Typography fontSize={12} sx={{ color: '#64748B' }}>
                                Must be at least 8 characters.
                            </Typography>

                            {/* Checkbox */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={() => setChecked(!checked)}
                                        sx={{
                                            color: "rgba(255,255,255,0.2)",
                                            '&.Mui-checked': { color: '#6C5CE7' },
                                        }}
                                    />
                                }
                                label={
                                    <Typography fontSize={12} sx={{ color: '#94A3B8' }}>
                                        I accept the{" "}
                                        <span style={{ color: "#A29BFE", fontWeight: 600, cursor: 'pointer' }}>
                                            Privacy Policy
                                        </span>{" "}
                                        and{" "}
                                        <span style={{ color: "#A29BFE", fontWeight: 600, cursor: 'pointer' }}>
                                            User Agreement
                                        </span>
                                    </Typography>
                                }
                            />

                            <FormControlLabel
                                control={<Checkbox sx={{
                                    color: "rgba(255,255,255,0.2)",
                                    '&.Mui-checked': { color: '#6C5CE7' },
                                }} />}
                                label={
                                    <Typography fontSize={12} sx={{ color: '#94A3B8' }}>
                                        I consent to processing my data
                                    </Typography>
                                }
                            />

                            {/* Button */}
                            <Button
                                fullWidth
                                type="submit"
                                disabled={!checked || isPending}
                                sx={{
                                    py: 1.5,
                                    borderRadius: "10px",
                                    background: checked
                                        ? "linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)"
                                        : "rgba(108, 92, 231, 0.2)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: '15px',
                                    textTransform: "none",
                                    boxShadow: checked ? '0 4px 20px rgba(108, 92, 231, 0.3)' : 'none',
                                    transition: 'all 0.3s ease',
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #5A4BD1 0%, #8B7EFC 100%)",
                                        boxShadow: '0 6px 28px rgba(108, 92, 231, 0.4)',
                                        transform: 'translateY(-1px)',
                                    },
                                    "&:disabled": {
                                        background: 'rgba(108, 92, 231, 0.15)',
                                        color: 'rgba(255,255,255,0.3)',
                                    },
                                }}
                            >
                                {isPending ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Get Started'}
                            </Button>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 0.5 }}>
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                                <Typography sx={{ color: '#64748B', fontSize: '12px', fontWeight: 500 }}>or sign up with</Typography>
                                <Box sx={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                            </Box>

                            {/* Social buttons */}
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                <Button
                                    fullWidth
                                    onClick={() => handleGoogleLogin()}
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
                                <Button
                                    fullWidth
                                    onClick={handleFacebookLogin}
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
                                    <img src={facebookIcon} alt="Facebook" style={{ width: 18, marginRight: 8 }} />
                                    Facebook
                                </Button>
                                <Button
                                    fullWidth
                                    onClick={handleAppleLogin}
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
                                    <AppleIcon sx={{ fontSize: 20, mr: 0.5 }} />
                                    Apple
                                </Button>
                            </Box>

                            {/* Footer */}
                            <Typography textAlign="center" sx={{ color: '#64748B', fontSize: '14px' }}>
                                Already have an account?{" "}
                                <Link component={LinkRouter} to="/sign-in" sx={{
                                    color: "#A29BFE",
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    '&:hover': { color: '#6C5CE7' },
                                }}>
                                    Log in
                                </Link>
                            </Typography>
                        </Stack>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default Register;
