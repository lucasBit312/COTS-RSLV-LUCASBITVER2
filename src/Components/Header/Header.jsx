import { AccountCircleOutlined, Close } from '@mui/icons-material';
import AdbIcon from '@mui/icons-material/Adb';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Badge, Menu } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import cartApi from '../../Api/cartApi';
import Login from '../../features/Auth/components/Login/Login';
import Register from '../../features/Auth/components/Register/Register';
import { logout } from '../../features/Auth/userSlide';
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
  const totalCart = useSelector(state =>state.cart.cartItems);
  const [cartTotal, setCartTotal] = React.useState(0); 
  const history = useHistory();
  const isLoggedIn = !!loggedInuser.id;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const openMenu = Boolean(anchorEl);
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

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
    history.push('/foodReceived');
  }
  const handleFoodsClick = () =>{
    history.push('/foods');
  }
  const handleDonateFoodsClick = () =>{
    history.push('/donate-foods');
  }
  const handleLocationFoodsClick = () =>{
    history.push('/location-foods');
  }
  const [mode, setMode] = useState(MODE.LOGIN);
  useEffect(() => {
      (async () => {
        try {
          const dataRes = await cartApi.getTotalCart();
          const data = dataRes.total;
          console.log(data);
          setCartTotal(data);
        } catch (error) {
          console.log(error);
        }
      })();
  }, [totalCart]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" color="warning">
        <Toolbar disableGutters>
          <FastfoodIcon sx={{ marginLeft: "10px" ,display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FoodShare
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem  onClick={handleFoodsClick}>
                <Typography textAlign="center">Thực Phẩm</Typography>
              </MenuItem>
              <MenuItem  onClick={handleFoodsClick}>
                <Typography textAlign="center">Tặng Thực Phẩm</Typography>
              </MenuItem>
              <MenuItem  onClick={handleLocationFoodsClick}>
                <Typography textAlign="center">Điểm Phát Thực Phẩm</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <FastfoodIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            FoodShare
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                onClick={handleFoodsClick}
                sx={{
                  my: 2,
                  color: location.pathname === '/foods' ? '#5BE49B' : 'white', 
                  display: 'block',
                }}
              >
                <Typography textAlign="center">Thực Phẩm</Typography>
              </Button>
              <Button
                onClick={handleDonateFoodsClick}
                sx={{
                  my: 2,
                  color: location.pathname === '/donate-foods' ? '#5BE49B' : 'white', 
                  display: 'block',
                }}
              >
                <Typography textAlign="center">Tặng Thực Phẩm</Typography>
              </Button>
              <Button
                onClick={handleLocationFoodsClick}
                sx={{
                  my: 2,
                  color:
                    location.pathname === '/location-foods' ? '#5BE49B' : 'white', 
                  display: 'block',
                }}
              >
                <Typography textAlign="center">Điểm Phát Thực Phẩm</Typography>
              </Button>
          </Box>
          <Search style={{marginRight:"15px"}}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          {!isLoggedIn && (
            <Tooltip title="Log in">
              <Button onClick={handleClickOpen} color="inherit">Đăng nhập</Button>
            </Tooltip> 
          )}
           {isLoggedIn && (
            <>
              <Tooltip title="Thực Phẩm Đã Nhận">
                <IconButton onClick={handleCartClick} size="large" aria-label="show total cart" color="inherit">
                  <Badge badgeContent={cartTotal} color="error">
                    <CardGiftcardIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
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
