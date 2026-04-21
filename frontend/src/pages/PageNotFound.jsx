import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
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
                <Typography
                    variant="h1"
                    sx={{ fontWeight: 800, color: "primary.main", fontSize: { xs: "5rem", md: "8rem" } }}
                >
                    404
                </Typography>

                <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
                    Page Not Found
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 400 }}>
                    Sorry, the page you are looking for doesn’t exist or has been moved.
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    sx={{ mt: 4, borderRadius: 2 }}
                    onClick={() => navigate("/home")}
                >
                    Go Back Home
                </Button>
            </Box>
        </Container>
    );
};

export default PageNotFound;