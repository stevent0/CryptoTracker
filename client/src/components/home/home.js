import { Container, Typography, Button, Grid, Card } from '@mui/material'
import test from './pencil.png'

function Home() {
    return (
        <Container maxWidth="md">
            <Typography align='center' sx={{ mt: 6, fontSize: 45, fontFamily: 'Patua One', fontWeight: 'bold', color: 'rgb(14, 60, 125)' }} >CryptoTracker</Typography>
            <Container>
                <Typography align='center' sx={{ mt: 1, fontSize: 18}}>CryptoTracker is a free service that makes it easy for you to track all your owned cryptocurrency assets. Create an account to get started.</Typography>
            </Container>

            <Container align='center' sx={{marginTop: 10}}>
                <Button variant="outlined" sx={{ color: 'rgb(14, 60, 125)', marginRight: 8}}>Sign Up</Button>
                <Button variant="outlined" sx={{ color: 'rgb(14, 60, 125)'}}>Log In</Button>
            </Container>

        </Container>
    )
}

export default Home

