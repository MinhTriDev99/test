import { Box, Button, CircularProgress, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import React, { Dispatch, SetStateAction, useState } from "react";
import * as yup from "yup";
import { AddUserApi } from "../api/userApi";
import { UserType } from "../types/userType";

// Định nghĩa Props
interface EditUserModalProps {
  isAddModalOpen: boolean;
  handleCloseAddModal: () => void;
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

const AddUserModal: React.FC<EditUserModalProps> = ({
  isAddModalOpen,
  handleCloseAddModal,
  setUsers,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  // Định nghĩa validation schema
  const validationSchema = yup.object({
    name: yup.string().required("Please enter your name"),
    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Please enter your phone number"),
    birthday: yup.date().required("Please enter your birthday"),
    address: yup.string().required("Please enter your address"),
  });

  // Khởi tạo formik
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      birthday: "",
      address: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.post(AddUserApi, values);
        setUsers((prevUsers) => [...prevUsers, response.data]);
        formik.resetForm();
        setLoading(false);
        handleCloseAddModal();
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    },
  });

  return (
    <Modal open={isAddModalOpen} onClose={handleCloseAddModal}>
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
            inputProps={{ maxLength: 10 }}
            variant="outlined"
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
              Add user
            </Button>
            <Button
              onClick={() => {
                formik.resetForm();
                handleCloseAddModal();
              }}
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

export default AddUserModal;
