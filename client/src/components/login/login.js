import { Container, Typography, Box, Grid, TextField, Button } from '@mui/material'
import { logIn } from '../../api/api'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'

export default function Login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    let navigate = useNavigate()


    const handleLogin = async () => {
        try {
            const response = await logIn(email, password)
            Cookies.set('jwt', response.data.jwtToken)
            Cookies.set('userId', response.data.userId)
            navigate('/dashboard')
        }
        catch (err) {
            console.log(err.response.data)
            setErrMsg("*" + err.response.data + "*")
        }
    }

    useEffect( () => {
        const jwt = Cookies.get('jwt')
        const userId = Cookies.get('userId')

        if( !jwt || !userId || jwt.length == 0 || userId.length == 0) return

        navigate('/dashboard')
    }, [])

    return (
        <Container maxWidth='xs' sx={{}}>
            
            <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>

                <Typography align='center' sx={{ mb: 4, fontSize: 45, fontFamily: 'Patua One', fontWeight: 'bold', color: 'rgb(14, 60, 125)' }} >CryptoTracker</Typography>
                <Typography variant="p" sx={{mt: -2, color: 'red', fontSize: 14}}>{errMsg}</Typography>
                <Grid container spacing={2} alignItems='center'>

                    <Grid item xs={12}>
                        <TextField id="outlined-required" onChange={event => setEmail(event.target.value)} type="email" label="Email" name="email" autoComplete='off' required fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField id="outlined-required" onChange={event => setPassword(event.target.value)} type="password" label="Password" name="password" autoComplete='off' required fullWidth />
                    </Grid>
                </Grid>

                <Button onClick={handleLogin} type="submit" fullWidth variant="contained" sx={{ mt: 3, display: 'block', backgroundColor: 'rgb(14, 60, 125)'}}>Log In</Button>
            </Box>




        </Container>
    )
}