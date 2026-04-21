import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import { toast } from "sonner";
import axios from "axios";

const RegisterOtp = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyInvite = async () => {
            try {
                const token = params.get("token");

                if (!token) {
                    throw new Error("Invalid invite link");
                }

                const res = await axios.get(
                    `${import.meta.env.VITE_BASEURL}/auth/verify-email?token=${token}`
                );

                toast.success(res.data.message || "Invite accepted successfully");

                // redirect after success
                navigate("/");
            } catch (err) {
                const message =
                    err?.response?.data?.message || err.message || "Something went wrong";

                toast.error(message);

                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        verifyInvite();
    }, [params, navigate]);

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
            }}
        >
            {loading ? (
                <>
                    <CircularProgress />
                    <Typography mt={2}>Verifying invite...</Typography>
                </>
            ) : (
                <Typography>Redirecting...</Typography>
            )}
        </Box>
    );
};

export default RegisterOtp;