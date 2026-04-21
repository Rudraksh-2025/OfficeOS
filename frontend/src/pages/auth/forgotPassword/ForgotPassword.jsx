import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    IconButton,
    CircularProgress,
    Stack,
    FormControl,
    InputLabel,
    Link,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useForgotPassword, useVerifyOtp, useResetPassword } from "../../../Api/Api";
import { BootstrapInput } from "../../../common/custom/BootstrapInput";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Step 0 — Send OTP
    const forgotPasswordMutation = useForgotPassword(
        (res) => {
            if (res?.success === false) {
                return toast.error(res?.message || "Failed to send code");
            }
            toast.success(res?.message || "Code sent to your email!");
            setStep(1);
        },
        (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to send code");
        }
    );

    const handleSendCode = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) return toast.error("Enter a valid email address");
        forgotPasswordMutation.mutate({ email });
    };

    // Step 1 — Verify OTP
    const verifyOtpMutation = useVerifyOtp(
        (res) => {
            if (res?.success === false) {
                return toast.error(res?.message || "Invalid code");
            }
            toast.success(res?.message || "Code verified!");
            setResetToken(res?.data?.resetToken || "");
            setStep(2);
        },
        (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Invalid code");
        }
    );

    const handleVerify = () => {
        if (!otp || otp.length < 6) return toast.error("Enter valid OTP");
        verifyOtpMutation.mutate({ email, otp });
    };

    // Step 2 — Reset Password
    const resetPasswordMutation = useResetPassword(
        (res) => {
            if (res?.success === false) {
                return toast.error(res?.message || "Failed to reset password");
            }
            toast.success(res?.message || "Password reset successful!");
            navigate("/");
        },
        (err) => {
            toast.error(err?.response?.data?.message || err?.message || "Failed to reset password");
        }
    );

    const handleReset = () => {
        if (!password) return toast.error("Enter password");
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return toast.error("Minimum 8 characters, at least one uppercase, one lowercase, one number, and one special character");
        }
        if (password !== confirmPassword) return toast.error("Passwords do not match");
        resetPasswordMutation.mutate({ otp, newPassword: password, email });
    };

    const handleResendCode = () => {
        forgotPasswordMutation.mutate({ email });
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
        else navigate("/");
    };

    const isLoading =
        forgotPasswordMutation.isPending ||
        verifyOtpMutation.isPending ||
        resetPasswordMutation.isPending;

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
                    {/* Header with back button */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Box sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '10px',
                                background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: 16,
                                color: '#fff',
                            }}>
                                O
                            </Box>
                            <Typography sx={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#F1F5F9',
                                letterSpacing: '-0.5px',
                            }}>
                                OfficeOS
                            </Typography>
                        </Box>
                    </Box>

                    {/* Heading */}
                    <Typography sx={{
                        fontSize: '28px',
                        fontWeight: 800,
                        color: '#F1F5F9',
                        letterSpacing: '-0.5px',
                        mb: 0.5,
                    }}>
                        {step === 0 ? "Forgot Password?" : step === 1 ? "Verify Code" : "Set New Password"}
                    </Typography>

                    <Typography sx={{ fontSize: '14px', color: '#64748B', mb: 4 }}>
                        {step === 0
                            ? "Enter your email address and we'll send you a recovery code."
                            : step === 1
                                ? `We've sent a 6-digit code to ${email}.`
                                : "Your new password must be different from previous passwords."}
                    </Typography>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (step === 0) handleSendCode();
                        else if (step === 1) handleVerify();
                        else handleReset();
                    }}>
                        <Stack spacing={2.5}>
                            {step === 0 && (
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel shrink htmlFor="email" sx={{
                                        fontSize: '1.1rem',
                                        fontWeight: 500,
                                        color: '#94A3B8',
                                        '&.Mui-focused': { color: '#A29BFE' }
                                    }}>
                                        Email
                                    </InputLabel>
                                    <BootstrapInput
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </FormControl>
                            )}

                            {step === 1 && (
                                <FormControl variant="standard" fullWidth>
                                    <InputLabel shrink htmlFor="otp" sx={{
                                        fontSize: '1.1rem',
                                        fontWeight: 500,
                                        color: '#94A3B8',
                                        '&.Mui-focused': { color: '#A29BFE' }
                                    }}>
                                        Verification Code
                                    </InputLabel>
                                    <BootstrapInput
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        inputProps={{ maxLength: 6 }}
                                    />
                                </FormControl>
                            )}

                            {step === 2 && (
                                <>
                                    <FormControl variant="standard" fullWidth sx={{ position: 'relative' }}>
                                        <InputLabel shrink htmlFor="password" sx={{
                                            fontSize: '1.1rem',
                                            fontWeight: 500,
                                            color: '#94A3B8',
                                            '&.Mui-focused': { color: '#A29BFE' }
                                        }}>
                                            New Password
                                        </InputLabel>
                                        <BootstrapInput
                                            id="password"
                                            type={showPass ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <IconButton
                                            onClick={() => setShowPass(!showPass)}
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
                                            {showPass ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                                        </IconButton>
                                    </FormControl>

                                    <FormControl variant="standard" fullWidth sx={{ position: 'relative' }}>
                                        <InputLabel shrink htmlFor="confirmPassword" sx={{
                                            fontSize: '1.1rem',
                                            fontWeight: 500,
                                            color: '#94A3B8',
                                            '&.Mui-focused': { color: '#A29BFE' }
                                        }}>
                                            Confirm Password
                                        </InputLabel>
                                        <BootstrapInput
                                            id="confirmPassword"
                                            type={showConfirmPass ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <IconButton
                                            onClick={() => setShowConfirmPass(!showConfirmPass)}
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
                                            {showConfirmPass ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
                                        </IconButton>
                                    </FormControl>
                                </>
                            )}

                            {step === 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                    <Typography sx={{ fontSize: 13, color: '#64748B', fontWeight: 500, display: 'flex', justifyContent: 'center', gap: 1, alignItems: 'center' }}>
                                        Didn't receive a code?{" "}
                                        <Link
                                            component="button"
                                            type="button"
                                            variant="body2"
                                            onClick={handleResendCode}
                                            underline="none"
                                            sx={{
                                                color: "#A29BFE",
                                                fontWeight: 600,
                                                '&:hover': { color: '#6C5CE7' },
                                            }}
                                        >
                                            Resend
                                        </Link>
                                    </Typography>
                                </Box>
                            )}

                            {/* Submit Button */}
                            <Button
                                fullWidth
                                disabled={isLoading}
                                type="submit"
                                sx={{
                                    mt: 1,
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
                                {isLoading ? (
                                    <CircularProgress size={22} sx={{ color: "white" }} />
                                ) : (
                                    <>
                                        {step === 0 && "Send Instructions"}
                                        {step === 1 && "Verify Account"}
                                        {step === 2 && "Reset Password"}
                                    </>
                                )}
                            </Button>

                            {/* Back to Login link */}
                            {step === 0 && (
                                <Box sx={{ textAlign: 'center', mt: 2 }}>
                                    <Link
                                        component={RouterLink}
                                        to="/"
                                        underline="none"
                                        sx={{
                                            color: "#64748B",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 0.5,
                                            '&:hover': { color: '#F1F5F9' },
                                        }}
                                    >
                                        <FaArrowLeft size={12} /> Back to Login
                                    </Link>
                                </Box>
                            )}
                        </Stack>
                    </form>
                </Box>
            </Box>
        </Box>
    );
};

export default ForgotPassword;