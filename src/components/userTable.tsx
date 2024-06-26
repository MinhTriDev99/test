import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeleteUserApi, EditUserApi, GetUserApi } from "../api/userApi";
import useFetchData from "../hooks/useFetchData";
import { UserType } from "../types/userType";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

const UserTable = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const { data, error, loading } = useFetchData<UserType>(GetUserApi);

  useEffect(() => {
    setUsers(data);
  }, [data]);

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };
  const handleDelete = async (user: UserType) => {
    try {
      await axios.delete(DeleteUserApi(user.id));
      setUsers(users.filter((u) => u.id !== user.id));
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleProcessRowUpdate = async (newRow: UserType) => {
    try {
      await axios.put(EditUserApi(newRow.id), newRow);
      setUsers((prev) =>
        prev.map((user) => (user.id === newRow.id ? newRow : user))
      );
      return newRow;
    } catch (error) {
      console.error(error);
      return newRow; // Trả về dữ liệu cũ nếu có lỗi
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100, editable: false },
    { field: "name", headerName: "Name", width: 200, editable: true },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      editable: true,
    },
    { field: "phone", headerName: "Phone", width: 150, editable: true },
    {
      field: "birthday",
      headerName: "Birthday",
      width: 150,
      type: "date",
      editable: true,
      valueGetter: (params: any) => new Date(params),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div>
          <Button color="primary" onClick={() => handleEdit(params.row)}>
            Edit
          </Button>
          <Button color="error" onClick={() => handleDelete(params.row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={handleAdd}>Thêm Người Dùng</Button>
      <DataGrid
        autoHeight
        editMode="row"
        rows={users}
        columns={columns}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={(error) => console.error(error)}
      />
      {/* show loading when fetch data user  */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Typography color={"red"}>
          *Fetch data error, please reload page
        </Typography>
      )}
      <AddUserModal
        setUsers={setUsers}
        isAddModalOpen={isAddModalOpen}
        handleCloseAddModal={handleCloseAddModal}
      />
      <EditUserModal
        data={editingUser}
        setUsers={setUsers}
        isEditModalOpen={isEditModalOpen}
        handleCloseEditModal={handleCloseEditModal}
      />
    </div>
  );
};

export default UserTable;
