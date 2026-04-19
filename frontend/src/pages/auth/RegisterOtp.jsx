import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Stack, Typography, Button, Box, CircularProgress } from "@mui/material";
import { useOtpRegister, useSendOtp } from '../../Api/Api'
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { requiresEmailVerification } from "../../common/Gaurd";

const OTP_LEN = 6;

const parseStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
};

const RegisterOtp = () => {
    const RESEND_TIME = 180;

    const [timeLeft, setTimeLeft] = useState(RESEND_TIME);
    const [canResend, setCanResend] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const initialSendDone = useRef(false);
    const resendDeadlineMs = useRef(null);
    const registerCooldownStarted = useRef(false);

    const email =
        location.state?.email ?? parseStoredUser()?.email ?? "";

    const fromLogin = useMemo(() => {
        if (location.state?.fromLogin === true) return true;
        return Boolean(localStorage.getItem("accessToken") && requiresEmailVerification());
    }, [location.state?.fromLogin]);

    const [otp, setOtp] = useState(() => Array(OTP_LEN).fill(""));

    const focusOtpIndex = (i) => {
        requestAnimationFrame(() => {
            document.getElementById(`otp-${i}`)?.focus();
        });
    };

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        const digits = value.replace(/\D/g, "").slice(0, OTP_LEN);
        if (digits.length > 1) {
            setOtp((prev) => {
                const merged = [...prev];
                for (let j = 0; j < digits.length && index + j < OTP_LEN; j++) {
                    merged[index + j] = digits[j];
                }
                return merged;
            });
            focusOtpIndex(Math.min(index + digits.length - 1, OTP_LEN - 1));
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = digits.slice(-1) || "";
        setOtp(newOtp);

        if (digits && index < OTP_LEN - 1) {
            focusOtpIndex(index + 1);
        }
    };

    const handlePaste = (e, startIndex) => {
        const text = e.clipboardData?.getData("text") ?? "";
        const digits = text.replace(/\D/g, "").slice(0, OTP_LEN);
        if (!digits) return;
        e.preventDefault();
        setOtp((prev) => {
            const next = [...prev];
            for (let i = 0; i < digits.length && startIndex + i < OTP_LEN; i++) {
                next[startIndex + i] = digits[i];
            }
            return next;
        });
        focusOtpIndex(Math.min(startIndex + digits.length, OTP_LEN - 1));
    };

    const handleBackspace = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };
    const onSuccess = () => {
        toast.success("OTP verified successfully");
        if (fromLogin) {
            const user = parseStoredUser() || {};
            localStorage.setItem(
                "user",
                JSON.stringify({ ...user, email_verified: true })
            );
            navigate("/home");
            return;
        }
        navigate("/sign-in");
    };
    const onError = (error) => {
        toast.error(error.message)
        console.log(error)
    }

    const { mutate, isPending } = useOtpRegister(onSuccess, onError);

    const syncResendFromDeadline = useCallback(() => {
        const deadline = resendDeadlineMs.current;
        if (deadline == null) {
            return;
        }
        const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        setTimeLeft(left);
        setCanResend(left <= 0);
    }, []);

    const startResendCooldown = useCallback(() => {
        resendDeadlineMs.current = Date.now() + RESEND_TIME * 1000;
        syncResendFromDeadline();
    }, [syncResendFromDeadline]);

    const onResendSuccess = () => {
        toast.success("OTP resent successfully");
        startResendCooldown();
    };

    const onResendError = (err) => {
        toast.error(err.message);
    };

    const { mutate: resendOtp } = useSendOtp(onResendSuccess, onResendError);

    const onInitialSendSuccess = () => {
        toast.success("We sent a verification code to your email");
        startResendCooldown();
    };

    const onInitialSendError = (err) => {
        toast.error(err?.message || "Could not send verification code");
        initialSendDone.current = false;
        resendDeadlineMs.current = null;
        setTimeLeft(0);
        setCanResend(true);
    };

    const { mutate: sendInitialOtp } = useSendOtp(onInitialSendSuccess, onInitialSendError);

    const handleResend = () => {
        resendOtp({ email });
    };

    useEffect(() => {
        if (!email) {
            navigate("/sign-in", { replace: true });
            return;
        }
        if (!fromLogin || initialSendDone.current) return;
        initialSendDone.current = true;
        startResendCooldown();
        sendInitialOtp({ email });
    }, [email, fromLogin, navigate, sendInitialOtp, startResendCooldown]);

    const handleSubmit = () => {
        const otpValue = otp.join("");

        if (otpValue.length < otp.length) {
            toast.error("Please enter complete OTP");
            return;
        }

        mutate({
            email,
            otp: otpValue,
        });
    };
    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    useEffect(() => {
        if (!email || fromLogin || registerCooldownStarted.current) return;
        registerCooldownStarted.current = true;
        startResendCooldown();
    }, [email, fromLogin, startResendCooldown]);

    useEffect(() => {
        syncResendFromDeadline();
        const id = setInterval(syncResendFromDeadline, 1000);
        const onVisible = () => {
            if (document.visibilityState === "visible") {
                syncResendFromDeadline();
            }
        };
        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("focus", syncResendFromDeadline);
        return () => {
            clearInterval(id);
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("focus", syncResendFromDeadline);
        };
    }, [syncResendFromDeadline]);

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
                <Box className="auth-form-wrapper" sx={{ textAlign: 'center' }}>
                    <Stack spacing={3}>
                        {/* Icon */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 1,
                        }}>
                            <Box sx={{
                                width: 72,
                                height: 72,
                                borderRadius: '20px',
                                background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(162, 155, 254, 0.1))',
                                border: '1px solid rgba(108, 92, 231, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '32px',
                                animation: 'float 3s ease-in-out infinite',
                            }}>
                                ✉️
                            </Box>
                        </Box>

                        <Typography sx={{
                            fontSize: '24px',
                            fontWeight: 800,
                            color: '#F1F5F9',
                            letterSpacing: '-0.5px',
                        }}>
                            Confirmation Code
                        </Typography>

                        <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>
                            A 6-digit code has been sent to <br />
                            <span style={{ color: '#A29BFE', fontWeight: 600 }}>{email}</span>
                        </Typography>

                        {/* OTP Inputs */}
                        <Box display="flex" justifyContent="center" gap={1.5}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    value={digit}
                                    maxLength={OTP_LEN}
                                    inputMode="numeric"
                                    autoComplete={i === 0 ? "one-time-code" : "off"}
                                    onChange={(e) => handleChange(e.target.value, i)}
                                    onPaste={(e) => handlePaste(e, i)}
                                    onKeyDown={(e) => handleBackspace(e, i)}
                                    style={{
                                        width: '52px',
                                        height: '56px',
                                        borderRadius: '14px',
                                        textAlign: 'center',
                                        border: digit
                                            ? '1.5px solid #6C5CE7'
                                            : '1px solid rgba(255,255,255,0.10)',
                                        background: digit
                                            ? 'rgba(108, 92, 231, 0.08)'
                                            : 'rgba(255, 255, 255, 0.04)',
                                        color: '#F1F5F9',
                                        fontSize: '22px',
                                        fontWeight: 700,
                                        fontFamily: '"Inter", sans-serif',
                                        outline: 'none',
                                        transition: 'all 0.2s ease',
                                        boxShadow: digit ? '0 0 0 3px rgba(108, 92, 231, 0.1)' : 'none',
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#6C5CE7';
                                        e.target.style.background = 'rgba(108, 92, 231, 0.08)';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(108, 92, 231, 0.1)';
                                    }}
                                    onBlur={(e) => {
                                        if (!digit) {
                                            e.target.style.borderColor = 'rgba(255,255,255,0.10)';
                                            e.target.style.background = 'rgba(255, 255, 255, 0.04)';
                                            e.target.style.boxShadow = 'none';
                                        }
                                    }}
                                />
                            ))}
                        </Box>

                        <Button
                            disabled={isPending}
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
                            onClick={() => handleSubmit()}
                        >
                            {isPending ? <CircularProgress size={22} sx={{ color: 'white' }} /> : "Verify"}
                        </Button>
                    </Stack>

                    <Typography sx={{ fontSize: "13px", color: '#94A3B8', mt: 3 }}>
                        Didn't receive a code?{" "}
                        {canResend ? (
                            <span
                                onClick={handleResend}
                                style={{
                                    color: "#A29BFE",
                                    cursor: "pointer",
                                    fontWeight: 700,
                                    transition: 'color 0.2s ease',
                                }}
                            >
                                Resend
                            </span>
                        ) : (
                            <span style={{ color: "#64748B" }}>
                                Resend in {formatTime(timeLeft)}
                            </span>
                        )}
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default RegisterOtp;