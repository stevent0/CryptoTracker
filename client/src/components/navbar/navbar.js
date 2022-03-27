import { Typography, Box, IconButton, Menu, MenuItem, Divider } from "@mui/material"
import SettingsIcon from '@mui/icons-material/Settings'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"

export default function Navbar() {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    let navigate = useNavigate()

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
      console.log(event.currentTarget)
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const handleLogout = () => {
        Cookies.set('jwt', '')
        Cookies.set('userId', '')
        navigate('/login')
    }

    return (
        <>
            <Box sx={{borderBottom: 2, borderColor: 'rgb(240,240,240)', minWidth: '100%', display: 'flex', alignContent: 'center', alignItems: 'center', justifyContent: 'space-between', height: 60}}>
                <Typography sx={{ml: 3, fontSize: 30, fontFamily: 'Patua One', fontWeight: 'bold', color: 'rgb(14, 60, 125)' }} >CryptoTracker</Typography>
                <Box sx={{mr: 3, border: 2, borderRadius: 2, borderColor: 'rgb(220,220,220)', display: 'flex', alignContents: 'center'}}>
                    <IconButton sx={{ width: 30, height: 30}} onClick={handleClick}>
                        <SettingsIcon sx={{color: 'rgb(14, 60, 125)' }}></SettingsIcon>
                    </IconButton>
                </Box>
            </Box>

            <Menu 
                open={open} 
                anchorEl={anchorEl} 
                onClick={handleClose} 
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 20,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                
            >
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
            </Menu>
        </>
    )
}