import React from "react";
import { FormControl, InputLabel, FormHelperText } from "@mui/material";
import { BootstrapInput } from "./BootstrapInput";

const CustomInput = ({ label, placeholder, name, formik, readOnly = false, type = "text", apiError = '' }) => {
    return (
        <FormControl variant="standard" fullWidth>
            {label && (
                <InputLabel
                    shrink
                    htmlFor={name}
                    sx={{
                        fontSize: "1.1rem",
                        fontWeight: 500,
                        color: "#94A3B8",
                        '&.Mui-focused': { color: '#A29BFE' }
                    }}
                >
                    {label}
                </InputLabel>
            )}

            <BootstrapInput
                id={name}
                name={name}
                type={type}
                placeholder={placeholder}
                value={formik.values[name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly={readOnly}
            />

            {formik.touched[name] && formik.errors[name] ? (
                <FormHelperText error>{formik.errors[name]}</FormHelperText>
            ) : apiError ? (
                <FormHelperText error>{apiError}</FormHelperText>
            ) : null}
        </FormControl>
    );
};

export default CustomInput;
