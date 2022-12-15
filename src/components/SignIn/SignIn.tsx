import React, { useState } from 'react';
import firebase from 'firebase/app';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth';
import {
    Container,
    Button,
    Typography,
    Snackbar,
    Alert as MUIAlert,
    AlertProps,
    AlertTitle,
    CircularProgress
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { styled } from '@mui/system';
import { useForm } from 'react-hook-form';

import { Input, Input2 } from '../sharedComponents/Input';

const signinStyles = {
    googleButton: {
        backgroundColor: 'rgb(66,133,244)',
        margin: '2em',
        padding: '0',
        color: 'white',
        height: '50px',
        width: '240px',
        border: 'none',
        textAlign: 'center',
        boxShadow: 'rgb(0 0 0 / 25%) 0px 2px 4px 0px',
        fontSize: '16px',
        lineHeight: '48px',
        display: 'block',
        borderRadius: '1px',
        fontFamily: 'Roboto, arial, sans-serif',
        cursor: 'pointer'
    },
    googleLogo: {
        width: '48px',
        height: '48px',
        display: 'block'
    },
    typographyStyle: {
        fontFamily: 'Roboto, arial, sans-serif',
        textAlign: 'center',
        fontSize: '2em'
    },
    containerStyle: {
        marginTop: '2em'
    },
    snackBar: {
        color: 'white',
        backgroundColor: '#4caf50'
    }
}

const Root = styled('div')({
    padding: 0,
    margin: 0
})

const NavbarContainer = styled('div')({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
})

const Logo = styled('div')({
    margin: '0 0 0 0.45em',
})

const LogoA = styled(Link)({
    listStyle: 'none',
    textTransform: 'capitalize',
    textDecoration: 'none',
    color: '#2DB67E'
})

const LogoNavigation = styled('div')({
    listStyle: 'none',
    textTransform: 'capitalize',
    textDecoration: 'none',
    display: 'flex'
})

const NavA = styled(Link)({
    display: 'block',
    padding: '1em',
    textDecoration: 'none',
    color: '#2DB67E'
})

const NavB = styled(Link) ({
    display: 'block',
    color: 'black',
    fontFamily: 'sans-serif',
    marginBottom: '20px'
})

const Alert = (props: AlertProps) => {
    return <MUIAlert elevation={6} variant='filled' />
}

interface buttonProps {
    open?: boolean,
    onClick?: () => void
}

export const GoogleButton = (props:buttonProps) =>{
    const navigate = useNavigate();
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth)

    const signIn = async () =>{
        await signInWithGoogle()
        localStorage.setItem('myAuth', 'true')
        onAuthStateChanged(auth, (user) => {
        if (user) {
            localStorage.setItem("token", user.uid);
            }
        });

        navigate('/dashboard')
        window.location.reload()
    }

    const signUsOut = async () =>{
        await signOut(auth)
        localStorage.clear()
        navigate('/signin')
    }

    if(loading) {
        return <CircularProgress />
    }

    let MyAuth = localStorage.getItem('myAuth')

    if (MyAuth == 'true'){
        return (
            <Button variant='contained' color='secondary' onClick={signUsOut}>Sign Out</Button>
        )
    } else {
        return (
            <Button sx={signinStyles.googleButton} onClick={signIn}>Sign In With Google</Button>
        )
    }
}

interface userProps {
    email?: any,
    password?: any
}

export const SignIn = () =>{
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm({});
    const auth = getAuth()

    const handleSnackOpen = () =>{
        setOpen(true)
    }

    const handleSnackClose = () => {
        setOpen(false)
        navigate('/dashboard', { state: { token: '' } } )
    }

    const onSubmit = async (data:any, event: any) => {
        localStorage.clear()

        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) =>{
                localStorage.setItem('myAuth', 'true')
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                      localStorage.setItem("token", user.uid);
                    }
                  });
                const user = userCredential.user;
                navigate('/dashboard') 
                window.location.reload()
            })
            .catch((error) =>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, error.message)
            });
    }
    return (
        <Container>
            <NavbarContainer>
                <Logo>
                    <LogoA to="/"><Typography variant='h4'>Personal App</Typography></LogoA>
                </Logo>
                <LogoNavigation>
                    <li>
                        <NavA to="/"><Typography variant='h5'>Home</Typography></NavA>
                    </li>
                    <li>
                        <NavA to="/dashboard"><Typography variant='h5'>Dashboard</Typography></NavA>
                    </li>
                    <li>
                        <NavA to="/signin"><Typography variant='h5'>Sign In | Out</Typography></NavA>
                    </li>
                    <li>
                        <NavA to="/signup"><Typography variant='h5'>Sign Up</Typography></NavA>
                    </li>
                </LogoNavigation>
            </NavbarContainer>
            <Container maxWidth='sm' sx={signinStyles.containerStyle}>
                <Typography sx={signinStyles.typographyStyle}>
                    Sign In Below
                </Typography>
                <form onSubmit = {handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <Input {...register('email')} name='email' placeholder='place email here'/>
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <Input2 {...register('password')} name='password' placeholder='place password here' />
                    </div>
                    <Button type='submit'>Submit</Button>
                </form>
                <NavB to = "/signup">Don't Have an Account? Register Now!</NavB>
                <GoogleButton open={open} onClick={handleSnackClose} />
                <Snackbar message="Success" open={open} autoHideDuration={3000}>
                    <Alert severity='success'>
                        <AlertTitle>Succesful Sign In --- Redirect to Dashboard in 3 seconds</AlertTitle>
                    </Alert>
                </Snackbar>
            </Container>
        </Container>  
    )
}

export const SignUp = (props: userProps) => {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm({})
    const auth = getAuth();


    const handleSnackOpen = () => {
        setOpen(true)
    }

    const handleSnackClose = () => {
        setOpen(false)
    }

    const onSubmit = async (data: any, event: any) => {
        localStorage.clear()

        createUserWithEmailAndPassword(auth, data.email, data.password)
            .then((userCredential) => {
                console.log(userCredential)
                const user = userCredential.user;
                console.log(user)
                navigate('/signin')

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
    }
    return (
        <Container>
            <NavbarContainer>
                <Logo>
                    <LogoA to="/"><Typography variant='h4'>Personal App</Typography></LogoA>
                </Logo>
                <LogoNavigation>
                    <li>
                        <NavA to="/"><Typography variant='h5'>Home</Typography></NavA>
                    </li>
                    <li>
                        <NavA to="/dashboard"><Typography variant='h5'>Dashboard</Typography></NavA>
                    </li>
                    <li>
                        <NavA to="/signin"><Typography variant='h5'>Sign In | Out</Typography></NavA>
                    </li>
                    <li>
                        <NavA to="/signup"><Typography variant='h5'>Sign Up</Typography></NavA>
                    </li>
                </LogoNavigation>
            </NavbarContainer>
            <Container maxWidth='sm' sx={signinStyles.containerStyle}>
                <Typography sx={signinStyles.typographyStyle}>
                    Create Your Account Below
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <Input  {...register('email')} name='email' placeholder='enter email here' />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <Input2  {...register('password')} name='password' placeholder='enter password here' />
                    </div>
                    <Button type='submit'>Submit</Button>
                </form>
                <Snackbar message='Success' open={open} autoHideDuration={3000}>
                    <Alert severity='success'>
                        <AlertTitle>Succesful Sign Up --- Redirect to Dashboard in 3 seconds</AlertTitle>
                    </Alert>
                </Snackbar>
            </Container>
        </Container>
    )
}

