import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import React, { useState } from 'react';
import Register from '../../features/Auth/components/Register/Register';
import { AccountCircleOutlined, CardGiftcardOutlined, Close } from '@mui/icons-material';
import Login from '../../features/Auth/components/Login/Login';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Badge, Menu } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { logout } from '../../features/Auth/userSlide';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { cartItemsCountSelector } from '../../features/Cart/Selectors';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));
const MODE = {
  LOGIN: 'login',
  REGISTER: 'register'
}
function Header(props) {

  const [open, setOpen] = React.useState(false);
  const loggedInuser = useSelector(state =>state.user.current);
  const history = useHistory();
  const isLoggedIn = !!loggedInuser.id;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const openMenu = Boolean(anchorEl);
  const cartItemsCount = useSelector(cartItemsCountSelector);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleClickOpen = () => {
    setOpen(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setMode(MODE.LOGIN);
    setOpen(false);
  };
  const handleLogoutClick = () =>{
    const action = logout();
    dispatch(action);
  }
  const handleCartClick = () =>{
    history.push('/cart');
  }
  const [mode, setMode] = useState(MODE.LOGIN);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="warning">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            FoodShare
          </Typography>
          <Search style={{marginRight:"15px"}}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <IconButton onClick={handleCartClick} size="large" aria-label="show total cart" color="inherit">
              <Badge badgeContent={cartItemsCount} color="error">
                <AddShoppingCartIcon />
              </Badge>
            </IconButton>
          {!isLoggedIn && (
            <Tooltip title="Log in">
              <Button onClick={handleClickOpen} color="inherit">Đăng nhập</Button>
            </Tooltip> 
          )}
           {isLoggedIn && (
            <>
              <IconButton
                alt="User"
                onClick={handleClickMenu}
                aria-controls="basic-menu"
                aria-haspopup="true"
                color="inherit"
                aria-expanded={openMenu ? 'true' : undefined}
              >
                <AccountCircleOutlined/>
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)} 
                onClose={handleCloseMenu}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem >Profile</MenuItem>
                <MenuItem >My account</MenuItem>
                <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
              </Menu>
            </>
          )}
         
        </Toolbar>
      </AppBar>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <IconButton style={{ position: 'absolute',
        top:  '6px',
        right: '6px',
        color: 'grey',
        zIndex: 1,}}>
          <Close onClick={handleClose}/>
        </IconButton>
        <DialogContent>
          {mode ===MODE.REGISTER &&(
            <>
              <Register closeDialog={handleClose} />
              <Box textAlign="center">
                <Button onClick={() => setMode(MODE.LOGIN)}>Bạn đã có tài khoản? Đăng nhập tại đây </Button>
              </Box>
            </>
          )}
           {mode ===MODE.LOGIN &&(
            <>
              <Login closeDialog={handleClose}/>
              <Box textAlign="center">
                <Button onClick={() => setMode(MODE.REGISTER)}
                >Bạn chưa đã có tài khoản? Đăng kí tại đây 
                </Button>
              </Box>
            </>
          )}
          
        </DialogContent>
      </Dialog>
    </Box>
  );
}

Header.propTypes = {
};

export default Header;
