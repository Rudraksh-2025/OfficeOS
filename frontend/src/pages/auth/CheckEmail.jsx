import { Box, Typography, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CheckEmail = () => {
    const location = useLocation();
    const email = location.state?.email;
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        try {
            setLoading(true);

            await axios.post(
                `${import.meta.env.VITE_BASEURL}/auth/resend-email`,
                { email }
            );

            toast.success("Verification email resent");
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to resend email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="h5" fontWeight={700}>
                Verify your email
            </Typography>

            <Typography sx={{ mt: 2 }}>
                A verification link has been sent to <b>{email}</b>
            </Typography>

            <Typography sx={{ mt: 1, color: "#888" }}>
                Please check your inbox and click the link to continue.
            </Typography>

            <Button
                onClick={handleResend}
                disabled={loading}
                sx={{ mt: 4 }}
            >
                {loading ? "Sending..." : "Resend Email"}
            </Button>
        </Box>
    );
};

export default CheckEmail;