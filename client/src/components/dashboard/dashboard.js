import {Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Container, Grid, Button, CardContent, Card, Typography, TextField, Paper, InputBase } from '@mui/material'
import { Box, AppBar, Toolbar, IconButton, Modal, FormControl, CssBaseline, Link, CircularProgress  } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useEffect } from 'react'
import { getAssets, logIn, updateAsset, deleteAsset, getAssetsValueOfUser, getHighestAssetValueOfUser, addAsset } from '../../api/api'
import { useState } from 'react'
import { InputUnstyled } from '@mui/base'
import Navbar from '../navbar/navbar.js'
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"
import LoadingButton from '@mui/lab/LoadingButton'

export default function Dashboard() {

    const [assets, setAssets] = useState([])
    const [totalAssetValue, setTotalAssetValue] = useState("$0")
    const [searchKey, setSearchKey] = useState('')
    const [highestAssetValue, setHighestAssetValue] = useState({})

    //Add Modal
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => {setOpen(false); setAddFormErr('')}
    const [cryptoId, setCryptoId] = useState('')
    const [label, setLabel] = useState('')
    const [publicAddress, setPublicAddress] = useState('')
    const [amount, setAmount] = useState('')
    const [addFormErr, setAddFormErr] = useState('')
    const [addLoading, setAddLoading] = useState(false)

    // Update and Delete Modal
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const handleOpenUpdateModal = (asset) => {
        setTargetAsset(asset)
        setOpenUpdateModal(true)
        setLabelUM(asset["label"])
        setPublicAddressUM(asset["publicaddress"])
        setAmountUM(asset["amount"])
    }
    const handleCloseUpdateModal = () => {setOpenUpdateModal(false); setUpdateFormErr('')}
    const [labelUM, setLabelUM] = useState('')
    const [publicAddressUM, setPublicAddressUM] = useState('')
    const [amountUM, setAmountUM] = useState('')
    const [updateFormErr, setUpdateFormErr] = useState('')
    const [targetAsset, setTargetAsset] = useState(null)
    const [updateLoading, setUpdateLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    let navigate = useNavigate()

    
    const handleAddAsset = async () => {
        const jwt = Cookies.get('jwt')
        const userId = parseInt(Cookies.get('userId'))

        setAddLoading(true)

        try {
            await addAsset(userId, {cryptoId, label, publicAddress, amount}, jwt)
            await fetchData(searchKey)
            handleClose()
            setCryptoId('')
            setLabel('')
            setPublicAddress('')
            setAmount('')
            setAddFormErr('')
        }
        catch (err) {
            console.log(err.response.data)
            setAddFormErr(err.response.data)
        }

        setAddLoading(false)
    }

    const handleUpdateAsset = async () => {
        const jwt = Cookies.get('jwt')
        const userId = parseInt(Cookies.get('userId'))

        setUpdateLoading(true)

        try {
            await updateAsset(userId, targetAsset.id, {label: labelUM, publicAddress: publicAddressUM, amount: amountUM}, jwt)

            const getAssetsRes = await getAssets(userId, jwt, searchKey)
            const getAssetsValRes = await getAssetsValueOfUser(userId, jwt)
            const getHighestValRes = await getHighestAssetValueOfUser(userId, jwt)

            setAssets(getAssetsRes.data)
            setTotalAssetValue(getAssetsValRes.data)
            setHighestAssetValue(getHighestValRes.data)

            handleCloseUpdateModal()
        }
        catch (err) {
            console.log(err.message)
            setUpdateFormErr(err.response.data)
        }

        setUpdateLoading(false)
    }

    const handleDeleteAsset = async () => {

        const jwt = Cookies.get('jwt')
        const userId = parseInt(Cookies.get('userId'))
        setDeleteLoading(true)

        try {
            await deleteAsset(userId, targetAsset.id, jwt)
            const getAssetsRes = await getAssets(userId, jwt, searchKey)
            const getAssetsValRes = await getAssetsValueOfUser(userId, jwt)
            const getHighestValRes = await getHighestAssetValueOfUser(userId, jwt)

            setAssets(getAssetsRes.data)
            setTotalAssetValue(getAssetsValRes.data)
            setHighestAssetValue(getHighestValRes.data)
            handleCloseUpdateModal()
        }
        catch (err) {
            console.log(err.message)
        }

        setDeleteLoading(false)
    }
    

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 420,
        bgcolor: 'background.paper',
        border: '0px solid #000',
        boxShadow: 24,
        p: 4,
      }

    function formatAddress(address) {
        if (address.length < 10) return address
        return address.slice(0, 6) + "..." + address.slice(-4)
    }

    async function fetchData(searchKey="") {

        const jwt = Cookies.get('jwt')
        const userId = parseInt(Cookies.get('userId'))

        try {
            
            const assetsResponse = await getAssets(userId, jwt, searchKey)
            setAssets(assetsResponse.data)
            
            const assetValueResponse = await getAssetsValueOfUser(userId, jwt)
            setTotalAssetValue(assetValueResponse.data)

            const highestAssetValue = await getHighestAssetValueOfUser(userId, jwt)
            setHighestAssetValue(highestAssetValue.data)

    
        }
        catch (error) {
            console.log(error.message)
            Cookies.set('jwt', "")
            Cookies.set('userId', "")
            navigate("/login")
        }
    }


    useEffect(() => fetchData(searchKey), [searchKey])


    return (

        <>
            <Navbar></Navbar>

            <Container align="center" sx={{border: 0}}>

                <Grid container spacing={2} sx={{mt: 2, border: 0}} >
                    <Grid item xs={12} lg={3} rowSpacing={2}>
                        <Card variant="outlined" sx={{ width: "100%", height: 100, borderRadius: 0}}>

                            <CardContent align="left">
                                <Typography sx={{fontSize: '14px'}}>Total Value</Typography>
                                <Typography sx={{fontSize: "36px"}}>{totalAssetValue}</Typography>
                            </CardContent>

                        </Card>

                        <Card variant="outlined" sx={{ width: "100%", height: 100, borderRadius: 0, mt: 1}}>

                            <CardContent align="left">
                                <Typography sx={{fontSize: '14px'}}>Highest Valued Asset ({highestAssetValue.assetId})</Typography>
                                <Typography sx={{fontSize: "36px"}}>{highestAssetValue.value}</Typography>
                            </CardContent>

                        </Card>
                    </Grid>

                    <Grid item xs={12} lg={9}>
                        <Container disableGutters sx={{border: 0, display: "flex", justifyContent: "space-between", height: 40}}>

                            <Paper elevation={0} square sx={{display: "flex", alignItems: "center", backgroundColor: 'rgb(238,241,244)', borderRadius: 3}}>
                                <InputBase onChange={e => setSearchKey(e.target.value)} sx={{border: 0, ml: 1, height: "25px", width: 360}} placeholder="Search...">

                                </InputBase>
                            </Paper>

                            <Paper elevation={0} sx={{display: "flex", alignItems: "center"}}>
                                <Button onClick={handleOpen} variant="contained" sx={{height: "100%", borderRadius: 2, backgroundColor: 'rgb(14, 60, 125)'}}>
                                    <Typography sx={{fontSize: 14, fontWeight: 'bold'}}>Add</Typography>
                                </Button>

                                <Modal
                                    open={open}
                                    onClose={handleClose}
                                >
                                    <Box sx={modalStyle}>
                                        <Typography sx={{mb: 0, fontSize: 20}} align="center">ADD AN ASSET</Typography>
                                        
                                        <Box sx={{border: '1px solid rgb(238,241,244)', padding: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',height: 250}}>
                                            <Typography variant="p" sx={{mt: -2, fontSize: 12, color:'red'}} align="center">{addFormErr}</Typography>
                                            <TextField required onChange={e => setCryptoId(e.target.value)} autoComplete="off" id="outlined-basic" label="Cryptocurrency Symbol (e.g. BTC)" variant="outlined" />
                                            <TextField required onChange={e => setLabel(e.target.value)} autoComplete="off" id="outlined-basic" label="Label" variant="outlined" />
                                            <TextField required onChange={e => setPublicAddress(e.target.value)} autoComplete="off" id="outlined-basic" label="Public Address" variant="outlined" />
                                            <TextField required onChange={e => setAmount(e.target.value)} autoComplete="off" id="outlined-basic" label="Amount Owned" variant="outlined" />
                                        </Box>

                                        <Box sx={{border: 0, pl: 10, pr: 10, height: 30, mt: 2,  display: 'flex', alignContents: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                            <Button sx={{width: 100, backgroundColor: 'rgb(14, 60, 125)'}} onClick={handleAddAsset} variant="contained">
                                                <Typography sx={{fontSize: 14, fontWeight: 'bold'}}>
                                                    {addLoading ? <CircularProgress sx={{color: 'white', mt: 1}} size={22} /> : "Add"}
                                                </Typography>
                                            </Button>
                                        </Box>
                                    </Box>
                                </Modal>
                            </Paper>
       

                        </Container>

                        <TableContainer align='center' sx={{ mt: 1, height: 600}}>
                            <Table sx={{border: 1, border: '0px solid rgb(238,241,244)'}}>
                                <TableHead>
                                    <TableRow sx={{}}>
                                        <TableCell sx ={{border: 0}}></TableCell>
                                        <TableCell sx ={{border: 0, color: 'rgb(154, 154, 156)', fontSize: '11px', fontWeight: 'bold'}}>Crypto</TableCell>
                                        <TableCell sx ={{border: 0, color: 'rgb(154, 154, 156)', fontSize: '11px', fontWeight: 'bold'}}>Label</TableCell>
                                        <TableCell sx ={{border: 0, color: 'rgb(154, 154, 156)', fontSize: '11px', fontWeight: 'bold'}}>Address</TableCell>
                                        <TableCell sx ={{border: 0, color: 'rgb(154, 154, 156)', fontSize: '11px', fontWeight: 'bold'}}>Amount</TableCell>
                                        <TableCell sx ={{border: 0, color: 'rgb(154, 154, 156)', fontSize: '11px', fontWeight: 'bold'}}>Value</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                
                                    {assets.map( (asset) => {

                                        return (
                                            <TableRow key={asset.name} >
                                                <TableCell sx ={{border: 0}}>{<img width="35" height="35" src={asset.logourl}></img>}</TableCell>
                                                <TableCell sx ={{border: 0}}>{asset.cryptoid}</TableCell>
                                                <TableCell sx ={{border: 0}}><Link component="button" onClick={() => handleOpenUpdateModal(asset)}>{asset.label}</Link></TableCell>
                                                <TableCell sx ={{border: 0}}>{formatAddress(asset.publicaddress)}</TableCell>
                                                <TableCell sx ={{border: 0}}>{asset.amount}</TableCell>
                                                <TableCell sx ={{border: 0}}>{asset.value}</TableCell>
                                            </TableRow>
                                        )

                                    })}

                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

                <Modal
                    open={openUpdateModal}
                    onClose={handleCloseUpdateModal}
                    >
                        <Box sx={modalStyle}>
                            <Typography sx={{mb: 0, fontSize: 20}} align="center">UPDATE/DELETE AN ASSET</Typography>
                                
                            <Box sx={{border: '1px solid rgb(238,241,244)', padding: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',height: 250}}>
                                <Typography variant="p" sx={{mt: -2, fontSize: 12, color:'red'}} align="center">{updateFormErr}</Typography>
                                <TextField required onChange={e => setLabelUM(e.target.value)} autoComplete="off" id="outlined-basic" label="Label" variant="outlined" defaultValue={labelUM}></TextField>
                                <TextField required onChange={e => setPublicAddressUM(e.target.value)} autoComplete="off" id="outlined-basic" label="Public Address" variant="outlined" defaultValue={publicAddressUM}/>
                                <TextField required onChange={e => setAmountUM(e.target.value)} autoComplete="off" id="outlined-basic" label="Amount Owned" variant="outlined" defaultValue={amountUM}/>
                            </Box>

                            <Box sx={{border: 0, height: 30, pl: 8, pr: 8, mt: 2,  display: 'flex', alignContents: 'center', justifyContent: 'space-between', flexDirection: 'row'}}>
                                <Button sx={{width: 100, backgroundColor: 'rgb(14, 60, 125)'}} onClick={handleUpdateAsset} variant="contained">
                                    <Typography sx={{fontSize: 14, fontWeight: 'bold'}}>
                                        {updateLoading ? <CircularProgress sx={{color: 'white', mt: 1}} size={22} /> : "Update"}
                                    </Typography>
                                </Button>
                                <Button sx={{width: 100, backgroundColor: 'red'}} onClick={handleDeleteAsset} variant="contained">
                                    <Typography sx={{fontSize: 14, fontWeight: 'bold'}}>
                                        {deleteLoading ? <CircularProgress sx={{color: 'white', mt: 1}} size={22} /> : "Delete"}
                                    </Typography>
                                </Button>
                            </Box>
                        </Box>
                </Modal>



            </Container>
        
        </>
    )
}