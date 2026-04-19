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
import logo2 from "../../assets/images/icons.svg";
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
            // dob: "",
            surname: "",
            user_type: 1,
            // mobile_number: "",
            // mobile_code: ""
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
            setApiError("Failed to initiate Google login");
        }
    };

    const handleFacebookLogin = () => {
        try {
            window.location.href = `${BASE_URL}/auth/facebook?role=user`;
        } catch (err) {
            console.error("Facebook login error:", err);
            setApiError("Failed to initiate Facebook login");
        }
    };

    const handleAppleLogin = () => {
        try {
            window.location.href = `${BASE_URL}/auth/apple?role=user`;
        } catch (err) {
            console.error("Apple login error:", err);
            setApiError("Failed to initiate Apple login");
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
        <Box sx={container}>
            <Box sx={card}>
                {/* Logo */}
                <Box textAlign="center">
                    <img src={logo2} alt="logo" style={{ width: 140 }} />
                </Box>

                {/* Heading */}
                <Typography variant="h5" fontWeight={600} mt={3} mb={1}>
                    Create an User Account
                </Typography>

                <Typography sx={{ opacity: 0.7, mb: 3 }}>
                    Start for free.
                </Typography>

                {/* Form */}
                <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={2}>
                        <CustomInput label="Name *" name="full_name" placeholder={"Enter your name"} formik={formik} />
                        <CustomInput label="Surname *" name="surname" placeholder={"Enter your Surname"} formik={formik} />
                        <CustomInput label="Email *" name="email" placeholder={"Enter your email"} formik={formik} />
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
                                value={formik.values.password}
                                onChange={formik.handleChange}
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
                            {formik.touched.password && <FormHelperText error>{formik.errors.password}</FormHelperText>}
                        </FormControl>

                        {/* Password hint */}
                        <Typography fontSize={12} sx={{ opacity: 0.6 }}>
                            Must be at least 8 characters.
                        </Typography>

                        {/* Checkbox */}
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={() => setChecked(!checked)}
                                    sx={{ color: "#fff" }}
                                />
                            }
                            label={
                                <Typography fontSize={12}>
                                    I accept the{" "}
                                    <span style={{ color: "#22d3ee" }}>
                                        Private Policy
                                    </span>{" "}
                                    and{" "}
                                    <span style={{ color: "#22d3ee" }}>
                                        User Agreement
                                    </span>
                                </Typography>
                            }
                        />

                        <FormControlLabel
                            control={<Checkbox sx={{ color: "#fff" }} />}
                            label={
                                <Typography fontSize={12}>
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
                                borderRadius: "8px",
                                background: checked ? "var(--Blue)" : "#555",
                                color: "#000",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": { background: "var(--Blue)" },
                            }}
                        >
                            {isPending ? <CircularProgress size={20} color="white" /> : 'Get Started'}
                        </Button>

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

                        {/* Footer */}
                        <Typography textAlign="center" fontSize={13}>
                            Already have an account?{" "}
                            <Link component={LinkRouter} to="/sign-in" sx={{ color: "var(--Blue)", textDecoration: 'none' }}>
                                Log in
                            </Link>
                        </Typography>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
};

export default Register;

const container = {
    minHeight: "100vh",
    p: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
        "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
};

const card = {
    width: "100%",
    maxWidth: 400,
    color: "#fff",
};

