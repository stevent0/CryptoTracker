import { Container, Typography, Box, Grid, TextField, Button } from '@mui/material'

export default function Signup() {
    return (
        <Container maxWidth='xs' sx={{}}>
            
            <Box sx={{ marginTop: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>

    
                <Typography align='center' sx={{ mb: 4, fontSize: 45, fontFamily: 'Patua One', fontWeight: 'bold', color: 'rgb(14, 60, 125)' }} >CryptoTracker</Typography>
                <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={12}>
                        <TextField id="outlined-required" label="Name" name="name" required fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField id="outlined-required" label="Email" name="email" required fullWidth />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField id="outlined-required" label="Password" name="password" required fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id="outlined-required" label="Confirm password" name="confirm-password" required fullWidth />
                    </Grid>
                </Grid>

                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, display: 'block', backgroundColor: 'rgb(14, 60, 125)'}}>Sign Up</Button>
            </Box>




        </Container>
    )
}