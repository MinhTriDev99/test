import { Box, Button, CircularProgress, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { Dispatch, SetStateAction, useState } from "react";
import * as yup from "yup";
import { EditUserApi } from "../api/userApi";
import { UserType } from "../types/userType";

interface EditUserModalProps {
  isEditModalOpen: boolean;
  handleCloseEditModal: () => void;
  data: UserType | null;
  setUsers: Dispatch<SetStateAction<UserType[]>>;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const EditUserModal: React.FC<EditUserModalProps> = ({
  isEditModalOpen,
  handleCloseEditModal,
  data,
  setUsers,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  // Define validation schema
  const validationSchema = yup.object({
    name: yup.string().required("Please enter your name"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Please enter your phone number"),
    birthday: yup.date().required("Please enter your birthday"),
    address: yup.string().required("Please enter your address"),
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      id: data?.id || "",
      name: data?.name || "",
      phone: data?.phone || "",
      birthday: data?.birthday
        ? new Date(data.birthday).toISOString().slice(0, 10)
        : "",
      address: data?.address || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await axios.put(EditUserApi(values.id), values);
        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((user) => {
            if (user.id === values.id) {
              return {
                ...user,
                name: values.name,
                phone: values.phone,
                birthday: values.birthday,
                address: values.address,
              };
            }
            return user;
          });
          return updatedUsers;
        });
        setLoading(false);
        formik.resetForm();
        handleCloseEditModal();
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    },
    enableReinitialize: true,
  });

  return (
    <Modal open={isEditModalOpen} onClose={handleCloseEditModal}>
      <Box sx={style}>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            id="phone"
            name="phone"
            label="Phone"
            type="string"
            variant="outlined"
            inputProps={{ maxLength: 10 }}
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <TextField
            fullWidth
            id="birthday"
            name="birthday"
            label="Birthday"
            type="date"
            variant="outlined"
            value={formik.values.birthday}
            onChange={formik.handleChange}
            error={formik.touched.birthday && Boolean(formik.errors.birthday)}
            helperText={formik.touched.birthday && formik.errors.birthday}
          />
          <TextField
            fullWidth
            id="address"
            name="address"
            label="Address"
            variant="outlined"
            value={formik.values.address}
            onChange={formik.handleChange}
            error={formik.touched.address && Boolean(formik.errors.address)}
            helperText={formik.touched.address && formik.errors.address}
          />

          <Box
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "end",
              marginTop: "10px",
            }}
          >
            <Button type="submit" disabled={loading}>
              {loading && (
                <CircularProgress size={"20px"} sx={{ marginRight: "5px" }} />
              )}
              Edit user
            </Button>
            <Button
              onClick={handleCloseEditModal}
              variant="contained"
              color="info"
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
