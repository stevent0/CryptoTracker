import { Container, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'



export default function Home() {
    return (
        <Container maxWidth="md">
            <Typography align='center' sx={{ mt: 6, fontSize: 45, fontFamily: 'Patua One', fontWeight: 'bold', color: 'rgb(14, 60, 125)' }} >CryptoTracker</Typography>
            <Container>
                <Typography align='center' sx={{ mt: 1, fontSize: 18}}>CryptoTracker is a free service that helps you track all your owned cryptocurrency assets. Create an account or log in to get started.</Typography>
            </Container>

            <Container align='center' sx={{marginTop: 10}}>
                <Button variant="outlined" sx={{ color: 'rgb(14, 60, 125)', marginRight: 8}} component={Link} to={'/signup'}>Sign Up</Button>
                <Button variant="outlined" sx={{ color: 'rgb(14, 60, 125)'}} component={Link} to={'/login'} >Log In</Button>
            </Container>

        </Container>
    )
}

