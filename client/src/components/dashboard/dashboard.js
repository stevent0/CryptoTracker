import {Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Container, Grid, Button, CardContent, Card, Typography, TextField, Paper, InputBase } from '@mui/material'
import { Box, AppBar, Toolbar, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useEffect } from 'react'
import { getAssets, logIn, updateAsset, deleteAsset, getAssetsValueOfUser } from '../../api/api'
import { useState } from 'react'
import { InputUnstyled } from '@mui/base'
import Navbar from '../navbar/navbar.js'
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom"

export default function Dashboard() {

    const [assets, setAssets] = useState([])
    const [totalAssetValue, setTotalAssetValue] = useState("$0")
    let navigate = useNavigate()


    function formatAddress(address) {
        if (address.length < 10) return address
        return address.slice(0, 6) + "..." + address.slice(-4)
    }


    useEffect(() => {

        async function fetchData() {

            const jwt = Cookies.get('jwt')
            const userId = parseInt(Cookies.get('userId'))

            try {
                
                const assetsResponse = await getAssets(userId, jwt)
                setAssets(assetsResponse.data)
                
                const assetValueResponse = await getAssetsValueOfUser(userId, jwt)
                setTotalAssetValue(assetValueResponse.data)
        
            }
            catch (error) {
                console.log(error.message)
                Cookies.set('jwt', "")
                Cookies.set('userId', "")
                navigate("/login")
            }
        }

        fetchData()

    }, [])


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

                        {/* <Card variant="outlined" sx={{ width: "100%", height: 100, borderRadius: 0, mt: 1}}>

                            <CardContent align="left">
                                <Typography sx={{fontSize: '14px'}}>Total Value</Typography>
                                <Typography sx={{fontSize: "36px"}}>{totalAssetValue}</Typography>
                            </CardContent>

                        </Card> */}
                    </Grid>

                    <Grid item xs={12} lg={9}>
                        <Container disableGutters sx={{border: 0, display: "flex", justifyContent: "space-between", height: 40}}>

                            <Paper elevation={0} square sx={{display: "flex", alignItems: "center", backgroundColor: 'rgb(238,241,244)', borderRadius: 3}}>
                                <InputBase sx={{border: 0, ml: 1, height: "25px", width: 360}} placeholder="Search...">

                                </InputBase>
                            </Paper>

                            <Paper elevation={0} sx={{display: "flex", alignItems: "center"}}>
                                <Button variant="contained" sx={{height: "100%", borderRadius: 3}}>Add</Button>
                            </Paper>
       

                        </Container>

                        <TableContainer align='center' sx={{ mt: 1, backgroundColor: 'rgb(240,240,240)'}}>
                            <Table sx={{border: 0}}>
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
                                                <TableCell sx ={{border: 0}}>{asset.label}</TableCell>
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



            </Container>
        
        </>
    )
}