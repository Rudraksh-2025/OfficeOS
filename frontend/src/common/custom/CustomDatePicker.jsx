import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import {
    Box, FormControl, InputLabel,
    TextField, IconButton, FormHelperText
} from "@mui/material";
import {
    LocalizationProvider,
    StaticDatePicker,

} from "@mui/x-date-pickers";
import InputAdornment from "@mui/material/InputAdornment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BootstrapInput } from "./BootstrapInput";

const CustomDatePicker = ({
    label,
    name,
    formik,
    minAge = null,
}) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const value = formik.values[name]
        ? dayjs(formik.values[name])
        : null;

    const maxDate = minAge
        ? dayjs().subtract(minAge, "year")
        : dayjs();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* INPUT + CALENDAR WRAPPED so click-outside doesn't close when selecting */}
            <Box ref={wrapperRef}>
                <FormControl sx={{ position: 'relative' }} variant="standard" fullWidth>
                    <InputLabel
                        shrink
                        htmlFor={name}
                        sx={{
                            fontSize: "1.3rem",
                            fontWeight: 450,
                            color: "#757575",
                            '&.Mui-focused': { color: '#757575' }
                        }}
                    >
                        {label}
                    </InputLabel>
                    <BootstrapInput
                        id={name}
                        name={name}
                        onClick={() => setOpen(!open)}
                        placeholder="Select date"
                        value={value ? value.format("DD MMMM YYYY") : ""}
                        // onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        readOnly
                    />
                    <IconButton
                        onClick={() => setOpen((prev) => !prev)}
                        style={{
                            position: 'absolute',
                            right: 8,
                            top: '70%',
                            transform: 'translateY(-50%)',
                            padding: 0,
                            zIndex: 2
                        }}
                        tabIndex={-1}
                    >
                        <CalendarTodayIcon
                            sx={{
                                fontSize: 18,
                                color: "#757575",
                                cursor: "pointer",
                            }}
                        />
                    </IconButton>

                    {formik.touched[name] && formik.errors[name] && (
                        <FormHelperText error>{formik.errors[name]}</FormHelperText>
                    )}
                </FormControl>

                {/* INLINE CALENDAR */}
                {open && (
                    <Box sx={calendarWrapper}>
                        <StaticDatePicker
                            displayStaticWrapperAs="desktop"
                            value={value}
                            onChange={(newValue) => {
                                formik.setFieldValue(name, newValue ? newValue.toISOString() : "");
                            }}
                            sx={{
                                "& .MuiPaper-root": {
                                    backgroundColor: "#1e293b",
                                    color: "#fff",
                                },
                            }}
                            maxDate={maxDate}
                            slotProps={{
                                actionBar: { actions: [] }, // remove buttons
                            }}
                        />
                    </Box>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default CustomDatePicker;

// ================= STYLES =================

const calendarWrapper = {
    mt: 1,
    borderRadius: "12px",
    overflow: "hidden",
    border: '1px solid #536276',

    // 🔥 MAIN ROOT FIX
    "& .MuiPickersLayout-root": {
        backgroundColor: "#0D121E !important",
        color: "#fff",
    },

    // 🔥 CALENDAR CONTAINER
    "& .MuiDateCalendar-root": {
        backgroundColor: "#0D121E",
    },

    // 🔥 HEADER (Month + arrows)
    "& .MuiPickersCalendarHeader-root": {
        color: "#fff",
    },

    // 🔥 WEEK DAYS (S M T...)
    "& .MuiDayCalendar-weekDayLabel": {
        color: "rgba(255,255,255,0.6)",
    },

    // 🔥 DAYS
    "& .MuiPickersDay-root": {
        color: "#fff!important",
    },
    "& .MuiPickersDay-root.Mui-disabled": {
        color: "rgba(255,255,255,0.3) !important",
    },

    // 🔥 SELECTED DAY (blue circle)
    "& .MuiPickersDay-root.Mui-selected": {
        backgroundColor: "#22d3ee !important",
        color: "#000",
    },

    // 🔥 TODAY BORDER
    "& .MuiPickersDay-root.MuiPickersDay-today": {
        border: "1px solid #22d3ee",
    },

    // 🔥 NAV ICONS
    "& .MuiSvgIcon-root": {
        color: "#fff",
    },
};