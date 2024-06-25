import { Box, Button, Modal, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeleteUserApi, GetUserApi } from "../api/userApi";
import { UserType } from "../types/userType";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

interface Props {}

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

const UserTable = (props: Props) => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const userFetching = await axios.get(GetUserApi);
        setUsers(userFetching.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, []);

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };
  const handleDelete = async (user: UserType) => {
    try {
      await axios.delete(DeleteUserApi(user.id));
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    console.log(user)
    setIsEditModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
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
      <DataGrid editMode="row" rows={users} columns={columns} />
      <AddUserModal isAddModalOpen={isAddModalOpen} handleCloseAddModal={handleCloseAddModal}/>
      <EditUserModal isEditModalOpen={isEditModalOpen} handleCloseEditModal={handleCloseEditModal} />
      
    </div>
  );
};

export default UserTable;
