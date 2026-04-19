import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Stack, Typography, Button, Box, CircularProgress } from "@mui/material";
import EmailSentIcon from '../../assets/images/icons.svg'
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
        <Box sx={containerStyle}>
            <Box sx={cardStyle}>
                <Stack spacing={3}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={EmailSentIcon} alt="forgot password" style={{ width: "12%" }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>Confirmation Code</Typography>

                    <Typography sx={{ opacity: 0.7 }}>
                        A 6-digit code has been sent to <br />  <b>{email}</b>
                    </Typography>

                    <Box display="flex" justifyContent="center" gap={1}>
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
                                style={otpStyle}
                            />
                        ))}
                    </Box>

                    <Button disabled={isPending} sx={btnStyle} onClick={() => handleSubmit()}>
                        {isPending ? <CircularProgress size={20} sx={{ color: 'white' }} /> : "Verify"}
                    </Button>
                </Stack>

                <Typography sx={{ fontSize: "14px", opacity: 0.8, mt: 3 }}>
                    Didn’t receive a code?{" "}
                    {canResend ? (
                        <span
                            onClick={handleResend}
                            style={{ color: "#22d3ee", cursor: "pointer", fontWeight: 600 }}
                        >
                            Resend
                        </span>
                    ) : (
                        <span style={{ color: "#aaa" }}>
                            Resend in {formatTime(timeLeft)}
                        </span>
                    )}
                </Typography>
            </Box>
        </Box>

    );
};


const containerStyle = {
    height: "100vh",
    padding: '20px',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#1C2533",
};

const cardStyle = {
    width: "100%",
    maxWidth: "400px",
    color: "#fff",
    textAlign: "center",
};
const otpStyle = {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    textAlign: "center",
    border: "none",
};
const btnStyle = {
    py: 1,
    borderRadius: "8px",
    background: "var(--Blue)",
    color: "#000",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": { background: "var(--Blue)" },
}


export default RegisterOtp;