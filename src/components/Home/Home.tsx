import React from 'react';
import { styled } from '@mui/system';
import { 
    Button,
    Typography 
} from '@mui/material';
import { Link } from 'react-router-dom';

import backgroundimage from '../../assets/rubaitul-azad-WRTBo4wr4h8-unsplash.jpg';


interface Props {
    title: string;
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

const Main = styled('main')({
    backgroundImage: `linear-gradient(
        rgba(0,0,0,0.0), 
        rgba(0,0,0,0.0)),
        url(${backgroundimage})`,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    position: 'absolute'
})

const MainText = styled('div')({
    textAlign: 'left',
    position: 'absolute',
    top: '50%',
    left: '25%',
    transform: 'translate(-50%, -50%)',
    color: 'white'
})

const myStyles = {
    main_button: {
        marginLeft: 'auto',
        backgroundColor: '#DF1D5A',
        '&:hover': {
            backgroundColor: '#36C5F1',
        },
    }
}



export const Home = (props: Props) => {
    return (
        <Root>
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
            <Main>
                <MainText>
                    <Typography variant='h2'>{props.title}</Typography>
                    <Typography variant='h6'>With the convenience of Slack integration!</Typography>
                    <Button sx={myStyles.main_button} variant='contained' component={Link} to='/dashboard'>See Your Items</Button>
                </MainText>
            </Main>
        </Root>
    )
}

