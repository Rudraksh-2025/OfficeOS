import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Container,
    Alert,
    CircularProgress, FormControl
} from "@mui/material";
import MarkEmailUnreadIcon from "@mui/icons-material/MarkEmailUnread";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useFormik } from "formik";
import axios from "axios";
import { Stack } from "@mui/material";
import { BootstrapInput } from "../../common/custom/BootstrapInput";

const VerifyEmailReminder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const loginForm = useFormik({
        initialValues: {
            email: "",
        },
        onSubmit: async (values) => {
            try {
                setLoading(true);

                await axios.post(
                    `${import.meta.env.VITE_BASEURL}/auth/resend-email`,
                    { email: values.email },
                );
                setSuccess(true);
            } catch (err) {
                toast.error(
                    err?.response?.data?.message || "Failed to resend email"
                );
            } finally {
                setLoading(false);
            }
        },
    });

    const handleLogout = () => {
        navigate("/");
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <MarkEmailUnreadIcon
                    sx={{ fontSize: 80, color: "primary.main", mb: 2 }}
                />

                <Typography variant="h4" fontWeight={600}>
                    Verify Your Email
                </Typography>

                <form style={{ minWidth: '300px' }} onSubmit={(e) => {
                    e.preventDefault();
                }}>
                    {/* Email */}
                    <FormControl variant="standard" fullWidth sx={{ py: 2, width: '100%' }}>
                        <BootstrapInput
                            id='email'
                            name='email'
                            type="email"
                            placeholder="Enter your email"
                            value={loginForm.values.email}
                            onChange={loginForm.handleChange}
                            onBlur={loginForm.handleBlur}
                        />
                    </FormControl>
                </form>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mt: 1, maxWidth: 400 }}
                >
                    You haven’t verified your email yet. Please check your inbox and
                    click the verification link to continue using your account.
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mt: 3 }}>
                        Verification email resent successfully!
                    </Alert>
                )}

                <Button
                    variant="contained"
                    size="large"
                    sx={{ mt: 4, borderRadius: 2, maxWidth: '150px' }}
                    onClick={loginForm.submitForm}
                    disabled={loading}
                    fullWidth
                >
                    {loading ? <CircularProgress size={24} /> : "Resend Email"}
                </Button>

                <Button
                    variant="text"
                    sx={{ mt: 2 }}
                    onClick={handleLogout}
                >
                    Back To Login
                </Button>
            </Box>
        </Container>
    );
};

export default VerifyEmailReminder;