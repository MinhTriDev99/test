import { Box, Button, CircularProgress, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  AddUserApi,
  DeleteUserApi,
  EditUserApi,
  GetUserApi,
} from "../api/userApi";
import useFetchData from "../hooks/useFetchData";
import { UserType } from "../types/userType";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";

import AddIcon from "@mui/icons-material/Add";
interface EditToolbarProps {
  setUsers: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel
  ) => void;
}

const UserTable = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const { data, error, loading } = useFetchData<UserType>(GetUserApi);

  useEffect(() => {
    setUsers(data);
    //? add new row (add item) when fecth api success
    setUsers((prev) => [
      ...prev,
      {
        id: "editnewrow",
        name: "",
        address: "",
        phone: "",
        birthday: "1/1/2000",
        gender: "male",
      },
    ]);
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
      const originalUser = users.find((user) => user.id === newRow.id);
      //?check row add item and call api to add new user
      if (newRow.id === "editnewrow") {
        if (
          newRow.name !== "" &&
          newRow.address !== "" &&
          newRow.phone !== ""
        ) {
          const response = await axios.post(AddUserApi, newRow);
          setUsers((prevUsers) => [...prevUsers, response.data]);
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== "editnewrow")
          );
          setUsers((prev) => [
            ...prev,
            {
              id: "editnewrow",
              name: "",
              address: "",
              phone: "",
              birthday: "1/1/2000",
              gender: "male",
            },
          ]);
        }
        return newRow;
      }
      //?update user if not have id add user
      if (
        originalUser &&
        (originalUser.name !== newRow.name ||
          originalUser.address !== newRow.address ||
          originalUser.phone !== newRow.phone ||
          new Date(originalUser.birthday).toISOString() !==
            new Date(newRow.birthday).toISOString())
      ) {
        await axios.put(EditUserApi(newRow.id), newRow);
        setUsers((prev) =>
          prev.map((user) => (user.id === newRow.id ? newRow : user))
        );
      }
      return newRow;
    } catch (error) {
      console.error(error);
      return newRow;
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 200, editable: true },
    {
      field: "address",
      headerName: "Address",
      width: 200,
      editable: true,
    },
    {
      field: "gender",
      headerName: "Gender (Male)",
      width: 200,
      editable: true,
      type: "boolean",
      valueGetter: (params) => (params === "male" ? true : false),
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
      renderCell: (params) => {
        if (params.id === "editnewrow") return;
        return (
          <div>
            <Button color="primary" onClick={() => handleEdit(params.row)}>
              Edit
            </Button>
            <Button color="error" onClick={() => handleDelete(params.row)}>
              Delete
            </Button>
          </div>
        );
      },
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
