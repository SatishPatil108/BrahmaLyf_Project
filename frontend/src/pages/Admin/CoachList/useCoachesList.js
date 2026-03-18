import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addNewCoachAPI, deleteCoachAPI, fetchAllCoachesAPI, getAllDomains, updateCoachAPI } from "@/store/feature/admin";
import { toast } from "react-toastify";

const useCoachesList = (pageNo, pageSize) => {
  const dispatch = useDispatch();
  const { coachesDetails, loading, error, domainsDetails, subdomainsDetails } = useSelector(
    (state) => state.admin
  );

  // Fetch coaches with pagination
  useEffect(() => {
    dispatch(fetchAllCoachesAPI({ pageNo, pageSize }));
  }, [dispatch, pageNo, pageSize]);

  // Fetch all domains
  useEffect(() => {
    dispatch(getAllDomains({ pageNo: 1, pageSize: '*' }));// fetch all domains
  }, [dispatch]);

  // add new coach
  const addNewCoach = (formData) => {
    const toastId = toast.loading("adding new coach............");
    dispatch(addNewCoachAPI(formData)).then(() => {
      toast.update(toastId, {
        render: "New Coach is added successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }).catch((error) => {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to add new Coach!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    });
  }

  // updating the existing coach
  const updateCoachDetails = (coach_id, formData) => {
    const toastId = toast.loading("Updating new coach............");
    dispatch(updateCoachAPI({ coachId: coach_id, coachData: formData })).then(() => {
      toast.update(toastId, {
        render: "Coach is Updated Successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    }).catch((error) => {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to Update a Coach!",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      })
    });
  }

  // const deleteCoach
  const deleteCoach = (coachId) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      const toastId = toast.loading('Deleting a coache...');
      dispatch(deleteCoachAPI(coachId)).then(() => {
        toast.update(toastId, {
          render: "Coach is Deleted Successfully 🎉",
          type: "success",
          isLoading: false,
          autoClose: 3000,
        });
      }).catch((error) => {
        console.error(error);
        toast.update(toastId, {
          render: "Failed to Delete a Coach!",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        })
      });
    }
  }

  return { coachesDetails, loading, error, domainsDetails, subdomainsDetails, addNewCoach, updateCoachDetails, deleteCoach };
};

export default useCoachesList;