import { Box, Typography } from "@mui/material";

function DashboardPage() {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "grid",
                placeItems: "center",
            }}
        >
            <Typography variant="h3">
                SafeRide Dashboard
            </Typography>
        </Box>
    );
}

export default DashboardPage;