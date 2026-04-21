import { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
    CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyOtp, useResetPassword } from "../../../Api/Api";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resetToken, setResetToken] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    // Step 2 — Verify OTP
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
        if (!otp || otp.length < 4) return toast.error("Enter valid OTP");
        verifyOtpMutation.mutate({ email, code: otp });
    };

    // Step 3 — Reset Password
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
        resetPasswordMutation.mutate({ resetToken, password, confirmPassword });
    };

    const handleResendCode = () => {
        forgotPasswordMutation.mutate({ email });
    };

    const isLoading =
        verifyOtpMutation.isPending ||
        resetPasswordMutation.isPending;

    const inputSx = {
        mb: 2,
        "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
        },
        "& .MuiInputBase-input": {
            padding: "14px 12px",
            fontSize: "16px",
        },
    };

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                bgcolor: "#2bb3c0", // teal background like image
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    maxWidth: "420px",
                    bgcolor: "#ffffff",
                    borderRadius: "16px",
                    p: 4,
                    boxShadow: "0px 20px 40px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box sx={{ height: '80vh' }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Typography
                            align="center"
                            fontSize="22px"
                            fontWeight={600}
                            sx={{ mb: 1 }}
                        >
                            {step === 1 ? "Verify Account" : "Create New Password"}
                        </Typography>

                        <Typography
                            align="center"
                            sx={{ color: "#7a7a7a", fontSize: "14px", mb: 3 }}
                        >
                            {step === 1
                                ? `Enter the code sent to ${email}`
                                : "Enter your new password below"}
                        </Typography>
                    </Box>


                    <Typography mb={3} mt={1} sx={{ color: '#878787', fontSize: '14px' }}>
                        {step === 1 && (
                            <>
                                Code has been sent to{" "}
                                <strong>{email}</strong>. Enter the code to verify your account.
                            </>
                        )}
                        {step === 2 &&
                            "Please enter and confirm your new password. You will need to login after you reset."}
                    </Typography>


                    {step === 1 && (
                        <>
                            <Typography fontWeight={500} mb={1}>
                                Enter Code
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="4 digit code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                inputProps={{ maxLength: 4 }}
                                sx={inputSx}
                            />

                            <Typography fontSize={13} sx={{ color: '#878787' }}>
                                Didn't Receive Code?{" "}
                                <span
                                    style={{ color: "#2bb3c0", cursor: "pointer", fontWeight: 500 }}
                                    onClick={handleResendCode}
                                >
                                    Resend Code
                                </span>
                            </Typography>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <Typography fontWeight={500} mb={1}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                type={showPass ? "text" : "password"}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={inputSx}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPass(!showPass)}
                                                edge="end"
                                            >
                                                {showPass ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Typography fontWeight={500} mb={1}>
                                Confirm Password
                            </Typography>
                            <TextField
                                fullWidth
                                type={showConfirmPass ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                sx={inputSx}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                                edge="end"
                                            >
                                                {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </>
                    )}
                </Box>
                <Button
                    fullWidth
                    disabled={isLoading}
                    sx={{
                        py: 1.5,
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 600,
                        color: 'white',
                        bgcolor: "#2bb3c0",
                        "&:hover": {
                            bgcolor: "#239aa5",
                        },
                        "&.Mui-disabled": {
                            bgcolor: "#2bb3c0",
                            opacity: 0.7,
                            color: "white",
                        },
                    }}
                    onClick={
                        step === 1
                            ? handleVerify
                            : handleReset
                    }
                >
                    {isLoading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                        <>
                            {step === 1 && "Verify Account"}
                            {step === 2 && "Reset Password"}
                        </>
                    )}
                </Button>
            </Box>
        </Box>
    );
};

export default ForgotPassword;

const inputSx = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    },
    "& .MuiInputBase-input": {
        padding: "14px",
        fontSize: "15px",
    },
};