import { useState, useMemo, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import usePagination from "@/hooks";
import { toast } from "react-toastify";
import { getInquiriesAPI, sendReplyAPI } from "@/store/feature/admin";

const useInquiries = () => {
    const dispatch = useDispatch();

    // Pagination
    const { pageNo, pageSize, setPageNo, setPageSize } = usePagination(1,5);

    // Redux store fetch
    const { inquiriesDetails, loading, error } = useSelector(
        (state) => state.admin
    );

    useEffect(() => {
        dispatch(getInquiriesAPI({ pageNo, pageSize }));
    }, [dispatch, pageNo, pageSize]);

    // Local state for instant table updates
    const [localInquiries, setLocalInquiries] = useState([]);

    useEffect(() => {
        if (inquiriesDetails?.inquiries) {
            setLocalInquiries(inquiriesDetails.inquiries);
        }
    }, [inquiriesDetails]);

    const [selectedInquiry, setSelectedInquiry] = useState(null);

    // Refs for reply inputs
    const txtSubject = useRef();
    const txtMessage = useRef();

    // Sorting
    const [sortConfig, setSortConfig] = useState({
        key: "id",
        direction: "desc",
    });

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const sortedInquiries = useMemo(() => {
        const list = [...localInquiries];

        const sorted = list.sort((a, b) => {
            const { key, direction } = sortConfig;

            let valueA = a[key];
            let valueB = b[key];

            if (["created_on", "replied_on"].includes(key)) {
                valueA = valueA ? new Date(valueA).getTime() : 0;
                valueB = valueB ? new Date(valueB).getTime() : 0;
            }

            if (key === "user_id") {
                valueA = a.user_id ? 1 : 0;
                valueB = b.user_id ? 1 : 0;
            }

            if (valueA < valueB) return direction === "asc" ? -1 : 1;
            if (valueA > valueB) return direction === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [localInquiries, sortConfig]);

    const getArrow = (key) => {
        if (sortConfig.key !== key) return "↕";
        return sortConfig.direction === "asc" ? "↑" : "↓";
    };

    // Handle reply
    const handleReply = async () => {
        const subject = txtSubject.current.value.trim();
        const message = txtMessage.current.value.trim();

        if (!subject || !message) {
            alert("Please enter both subject and message.");
            return;
        }

        const formData = {
            reply_subject: subject,
            reply_message: message,
        };

        const toastId = toast.loading("Sending reply...");

        try {
            const res = await dispatch(
                sendReplyAPI({ inquiry_id: selectedInquiry.id, formData })
            ).unwrap();

            if (!res.success) throw new Error("Failed");

            // Update modal
            setSelectedInquiry(res.data);

            // Update table
            setLocalInquiries((prev) =>
                prev.map((inq) => (inq.id === res.data.id ? res.data : inq))
            );

            toast.update(toastId, {
                render: "Reply sent successfully!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
            });
        } catch (err) {
            toast.update(toastId, {
                render: "Error sending reply",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    return {
        loading,
        error,
        sortedInquiries,
        selectedInquiry,
        txtSubject,
        txtMessage,
        inquiriesDetails,
        pageNo,
        setPageNo,
        setSelectedInquiry,
        handleReply,
        handleSort,
        getArrow,
    };
};

export default useInquiries;
