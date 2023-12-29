import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate} from "react-router-dom";
import { useState } from 'react';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Login() {

  const navigate = useNavigate();
  const [token, setToken] = useState()
  const handleSubmit = async(event) => {
    event.preventDefault();
    const infos = new FormData(event.currentTarget);
    
    const dataToSend = {
      email: infos.get('email'),
      password: infos.get('password')
    }
    
    try {
      console.log(dataToSend);
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
    
      const apiData = await response.json();
      if (response.ok) {
        await setToken(apiData.key)
        localStorage.setItem('token', apiData.key);
        console.log(localStorage.getItem("token"));
        console.log(apiData);
        fetch('http://127.0.0.1:8000/api/statistics/current_user/', 
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${apiData.key}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
        ).then((response)=>
          response.json()
        ).then((data)=>{
          console.log(data);
          if(data.account_type ==="Admin"){
          
            console.log(token);
            navigate('/admin/dashboard'); 
          }
          else{
            console.error("only admins are authorized");
            localStorage.removeItem("token");
            fetch("http://127.0.0.1:8000/api/logout/", {
                  method: 'GET',
                  headers: {
                    
                    'Content-Type': 'application/json',
                  },
                  
                });
            
          }
        });
        
      } else {
        // Handle login error
        console.error('Login failed');
      }
      console.log(apiData);
    } catch (error) {
      console.error('Error during login:', error);
    }
    console.log({
      email: infos.get('email'),
      password: infos.get('password'),
    });
    console.log("sdss");

  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(../../../public/administration.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              
            }}
          > 
           <Typography component="h1" variant="h4" sx={{ mt: 1, color: '#22a98a' }}>
              Welcome to Administration
            </Typography>
            <Avatar sx={{ m: 1, bgcolor: '#22a98a' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2,backgroundColor:'#22a98a' }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link color={'#22a98a'} href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
           
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}