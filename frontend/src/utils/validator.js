import { toast } from "react-toastify";

// ✅ Strict validation logic
export const validateForm = (requiredFields) => {

    for (const field of requiredFields) {
        if (!field.value || field.value === "" || field.value === null || field.value === undefined) {
            toast.error(`${field.label} is required`);
            return false;
        }
    }

    return true;
};