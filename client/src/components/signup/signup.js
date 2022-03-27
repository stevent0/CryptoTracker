import { Container, Typography, Box, Grid, TextField, Button, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { signUp } from '../../api/api'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'

export default function Signup() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [signUpLoading, setSignUpLoading] = useState(false)
    let navigate = useNavigate()

    const handleSignUpClick = async () => {
        setSignUpLoading(true)
        try {
            await signUp(name, email, password, confirmPassword)
            Cookies.set('jwt', '')
            Cookies.set('userId', '')
            navigate('/login')
        }
        catch (err) {
            console.log(err.message)
            setErrMsg('*' + err.response.data + '*')
        }
        setSignUpLoading(false)
    }


    return (
        <Container maxWidth='xs' sx={{}}>
            
            <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>

                <Typography align='center' sx={{ mb: 4, fontSize: 45, fontFamily: 'Patua One', fontWeight: 'bold', color: 'rgb(14, 60, 125)' }} >CryptoTracker</Typography>
                <Typography variant="p" sx={{mt: -2, color: 'red', fontSize: 14}}>{errMsg}</Typography>
                <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={12}>
                        <TextField onChange={e => setName(e.target.value)} id="outlined-required" label="Name" name="name" autoComplete='off' required fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField onChange={e => setEmail(e.target.value)} id="outlined-required" type="email" label="Email" name="email" autoComplete='off' required fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField onChange={e => setPassword(e.target.value)} id="outlined-required" type="password" label="Password" name="password" autoComplete='off' required fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField onChange={e => setConfirmPassword(e.target.value)} id="outlined-required" type="password" label="Confirm password" name="confirm-password" autoComplete='off' required fullWidth />
                    </Grid>
                </Grid>

                <Button onClick={handleSignUpClick} type="submit" fullWidth variant="contained" sx={{ mt: 3, display: 'block', backgroundColor: 'rgb(14, 60, 125)'}}>
                    {signUpLoading ? <CircularProgress sx={{color: 'white', mt: 1}} size={22} /> : "Sign Up"}
                </Button>
            </Box>




        </Container>
    )
}