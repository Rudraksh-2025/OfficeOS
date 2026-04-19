import React from "react";
import { Box } from "@mui/material";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const addCustomISOString = (date) => {
    if (!date) return date;
    const newDate = new Date(date);
    newDate.toISOString = function () {
        const pad = (n) => (n < 10 ? "0" + n : n);
        return `${this.getFullYear()}-${pad(this.getMonth() + 1)}-${pad(this.getDate())}T00:00:00.000Z`;
    };
    return newDate;
};

const CustomDateRangePicker = ({ value, onChange }) => {
    return (
        <Box
            sx={{
                background: "#0b1220",
                borderRadius: "16px",
                p: 2,
            }}
        >
            <DateRange
                editableDateInputs
                onChange={(item) => {
                    const processed = {
                        ...item.selection,
                        startDate: addCustomISOString(item.selection.startDate),
                        endDate: addCustomISOString(item.selection.endDate),
                    };
                    onChange([processed]);
                }}
                moveRangeOnFirstSelection={false}
                ranges={value}
                rangeColors={["#22d3ee"]}
            />
        </Box>
    );
};

export default CustomDateRangePicker;