// import React, { useEffect, useState } from 'react';
// import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
// import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
// import Paper from '@mui/material/Paper';
// import axios from 'axios';

// const initialRows = [
//     { id: 1, name: 'Jon Snow', email: 'jon.snow@example.com' },
//     { id: 2, name: 'Cersei Lannister', email: 'cersei.lannister@example.com' },
//     { id: 3, name: 'Jaime Lannister', email: 'jaime.lannister@example.com' },
//     { id: 4, name: 'Arya Stark', email: 'arya.stark@example.com' },
//     { id: 5, name: 'Daenerys Targaryen', email: 'daenerys.targaryen@example.com' },
// ];


// const authToken = 'YOUR_AUTH_TOKEN_HERE';

// useEffect(() => {
//     const fetchUsers = async () => {
//         try {
//             const response = await axios.get('http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000/api/v1/users', {
//                 headers: {
//                     Authorization: `Bearer ${authToken}`,
//                 },
//             });
//             // Assuming API response data has a structure matching our rows
//             setRows(response.data.users || []);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//         }
//     };

//     fetchUsers();
// }, [])


// export const SuperAdminPage = () => {
//     const [rows, setRows] = useState(initialRows);
//     const [open, setOpen] = useState(false);
//     const [formData, setFormData] = useState({ name: '', email: '' });

//     // Add user handler
//     const handleAddUser = () => {
//         setRows([
//             ...rows,
//             { id: rows.length + 1, name: formData.name, email: formData.email },
//         ]);
//         setOpen(false); // Close the dialog
//         setFormData({ name: '', email: '' }); // Reset form data
//     };

//     // Delete user handler
//     const handleDeleteUser = (id: number) => {
//         setRows(rows.filter((row) => row.id !== id));
//     };

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // Table columns
//     const columns: GridColDef[] = [
//         { field: 'id', headerName: 'ID', width: 70 },
//         { field: 'name', headerName: 'Name', width: 200 },
//         { field: 'email', headerName: 'Email', width: 250 },
//         {
//             field: 'actions',
//             headerName: 'Actions',
//             type: 'actions',
//             width: 150,
//             renderCell: (params) => (
//                 <Button
//                     variant="contained"
//                     color="error"
//                     onClick={() => handleDeleteUser(params.row.id)}
//                 >
//                     Delete
//                 </Button>
//             ),
//         },
//     ];

//     return (
//         <>
//             <div className="w-4/12 bg-white/60 overflow-y-hidden overflow-x-hidden pt-2 px-9">
//                 <div className="text-2xl py-4">SUPER ADMIN</div>
//                 <div>
//                     <Button
//                         variant="contained"
//                         size="large"
//                         onClick={() => setOpen(true)} // Open the dialog
//                     >
//                         ADD Manager
//                     </Button>
//                 </div>
//             </div>
//             <Box
//                 sx={{
//                     display: 'flex',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     backgroundColor: '#f4f4f4',
//                 }}
//             >
//                 <Paper sx={{ height: 400, width: '60%' }} style={{ textAlign: 'center' }}>
//                     <DataGrid
//                         rows={rows}
//                         columns={columns}
//                         pageSizeOptions={[5, 10]}
//                         checkboxSelection
//                         sx={{ border: 0 }}
//                     />
//                 </Paper>
//             </Box>

//             {/* Dialog for Adding User */}
//             <Dialog open={open} onClose={() => setOpen(false)}>
//                 <DialogTitle>Add New User</DialogTitle>
//                 <DialogContent>
//                     <TextField
//                         autoFocus
//                         margin="dense"
//                         label="Name"
//                         name="name"
//                         fullWidth
//                         value={formData.name}
//                         onChange={handleInputChange}
//                     />
//                     <TextField
//                         margin="dense"
//                         label="Email"
//                         name="email"
//                         fullWidth
//                         value={formData.email}
//                         onChange={handleInputChange}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={() => setOpen(false)}>Cancel</Button>
//                     <Button onClick={handleAddUser} variant="contained">
//                         Add
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </>
//     );
// };
// export default SuperAdminPage;



import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


// Define the type for a row
interface UserRow {
    _id: number;
    name: string;
    email: string;
}

export const SuperAdminPage = () => {
    const navigate = useNavigate()
    const [rows, setRows] = useState<UserRow[]>([]); // Specify rows as an array of UserRow
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const authToken = localStorage.getItem("token"); // Replace with the actual token

    // Fetch users from the API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000/api/v1/users/getUsers', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });

                const filteredUsers = response.data.users.filter((user: UserRow) => user.email !== "admin@admin.com");
                setRows(filteredUsers);

                // setRows(response.data.users || []);

            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [authToken]);

    const headers = {
        Authorization: `Bearer ${authToken}`
    }
    // Add user handler
    const handleAddUser = async () => {
        await axios.post("http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000/api/v1/users/createUser", {
            "email": formData.email,
            "password": "temp-pass",
            "name": formData.name,
            "role": "Manager",
        }, { headers }).then((res) => {
            setTimeout(() => {
                toast.success("Manager Added Successfully")
            }, 1000);

            setTimeout(() => {
                toast.success("Email to Manager Sent !")
            }, 3000);
        })
        setRows([
            ...rows,
            { _id: 0, name: formData.name, email: formData.email },
        ]);
        setOpen(false); // Close the dialog
        setFormData({ name: '', email: '' });

//         await axios.post("http://ec2-18-118-238-67.us-east-2.compute.amazonaws.com:8000/api/v1/users/mail",
//             {
//                 "to": formData.email,
//                 "subject": "Access to WOLFJOBS Portal for Job Postings",
//                 "text": `Dear ${formData.name},
// I hope you're doing well. I wanted to inform you that you have now been successfully added to the WOLFJOBS portal. You can now post any job openings or opportunities you wish to share through the portal.

// Should you need any assistance or have questions on how to use the portal, please don't hesitate to reach out.

// Best Regards,  
// Wolfjobs team`

        //     }
        // )

        setTimeout(() => {
            navigate('/add_manager')
        }, 1000);
    };

    // Delete user handler
    const handleDeleteUser = (id: number | string) => {
        // window.alert(id)
        axios.delete("")
        setRows((prevRows) => prevRows.filter((row) => row._id !== id));
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Table columns
    const columns: GridColDef[] = [
        { field: '_id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'actions',
            width: 150,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteUser(params.row._id)} // Pass the correct id
                >
                    Delete
                </Button>
            ),
        }
        ,
    ];

    return (
        <>
            <div className="w-4/12 bg-white/60 overflow-y-hidden overflow-x-hidden pt-2 px-9">
                <div className="text-2xl py-4">SUPER ADMIN</div>
                <div>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => setOpen(true)} // Open the dialog
                    >
                        ADD Manager
                    </Button>
                </div>
            </div>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f4f4f4',
                }}
            >
                <Paper sx={{ height: 400, width: '60%' }} style={{ textAlign: 'center' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        sx={{ border: 0 }}
                        getRowId={(row) => row._id || ""}
                    // columnVisibilityModel={{
                    //     id: false,
                    // }}
                    />
                </Paper>
            </Box>

            {/* Dialog for Adding User */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        name="name"
                        fullWidth
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        name="email"
                        fullWidth
                        value={formData.email}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddUser} variant="contained">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SuperAdminPage;
