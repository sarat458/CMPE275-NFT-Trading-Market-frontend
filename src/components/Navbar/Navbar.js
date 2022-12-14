/* eslint-disable no-alert */
/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-filename-extension */
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  Avatar, Menu, MenuItem, Tooltip,
} from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AccountBalance,
  AccountBalanceWallet,
  CollectionsBookmark,
  Dashboard, Insights, Sell, ShoppingCart, Store,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import { useGoogleLogout } from 'react-google-login';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';
import CLIENT_ID from '../../config';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const settings = ['Profile', 'Logout'];

export default function MiniDrawer() {
  const theme = useTheme();
  const [auth] = useState(localStorage.getItem('auth'));
  const [userObj] = useState(JSON.parse(localStorage.getItem('userObj')));
  const [googleUserObj] = useState(JSON.parse(localStorage.getItem('googleUserObj')));
  const [open, setOpen] = React.useState(false);
  const [userProfilePicture, setUserProfilePicture] = React.useState('');
  const [userName, setUserName] = React.useState('Admin');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userObj !== null) {
      if (auth === 'google') {
        localStorage.setItem('profilePicture', googleUserObj?.profileObj?.imageUrl);
        localStorage.setItem('userName', googleUserObj?.profileObj?.name);
        setUserName(googleUserObj?.profileObj?.name);
        setUserProfilePicture(googleUserObj?.profileObj?.imageUrl);
      } else {
        localStorage.setItem('userName', userObj.name);
        setUserName(userObj.name);
      }
    } else {
      setUserProfilePicture('');
      setUserName('Admin');
    }
  }, []);

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const onSuccess = () => {
    // eslint-disable-next-line no-alert
    alert('Logout sucessful');
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const openHome = () => {
    navigate('/user');
  };

  const openCart = () => {
    navigate('/user/cart');
  };

  const openWallet = () => {
    navigate('/user/wallet');
  };

  const openNftStore = () => {
    navigate('/user');
  };

  const openNftSale = () => {
    navigate('/user/nftSale');
  };

  const openNftCollection = () => {
    navigate('/user/collection');
  };

  const openPersonalStats = () => {
    navigate('/user/personalstats');
  };

  const openSystemDashboard = () => {
    navigate('/user/dashboard');
  };

  const openUserProfile = () => {
    navigate('/user/profile');
  };

  const onLogoutSuccess = () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('userObj');
    window.location.reload();
  };

  const onFailure = () => {
    console.log('Handle failure cases');
  };

  const { signOut } = useGoogleLogout({
    clientId: CLIENT_ID,
    onLogoutSuccess,
    onFailure,
  });

  const logOut = () => {
    if (auth === 'google') { signOut(); }
    localStorage.clear();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" style={{ background: '#2E3B55' }} open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'space-between',
            }}
          >
            <IconButton onClick={openHome} style={{ cursor: 'pointer' }} color="inherit">
              <Typography variant="h6" noWrap component="div">
                NFT Trading Market
              </Typography>
            </IconButton>
            <div>
              <IconButton color="inherit" onClick={openWallet} style={{ marginRight: '30px' }}>
                <AccountBalanceWallet fontSize="medium" />
              </IconButton>

              {/* <IconButton color="inherit" onClick={openCart}
              style={{ marginRight: '30px' }} hidden>
                <ShoppingCart fontSize="medium" />
              </IconButton> */}

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={userName}
                    sx={{ width: 30, height: 30 }}
                    src={userProfilePicture}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >

                <Typography textAlign="center" paddingX={3} paddingY={1}>
                  Hello,
                  {' '}
                  {userName}
                </Typography>

                <Divider />

                <MenuItem
                  key="profile"
                  style={{ display: 'block', justifyContent: 'center' }}
                  onClick={openUserProfile}
                >
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>

                <MenuItem
                  key="logout"
                  style={{ display: 'block', justifyContent: 'center' }}
                  onClick={logOut}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </div>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          <ListItem key="nft-store" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={openNftStore}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Store />
              </ListItemIcon>
              <ListItemText primary="NFT Store" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem key="nft-collection" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={openNftCollection}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <CollectionsBookmark />
              </ListItemIcon>
              <ListItemText primary="NFT Collection" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem key="nft-sale" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={openNftSale}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Sell />
              </ListItemIcon>
              <ListItemText primary="Sale" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem key="personal-stats" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={openPersonalStats}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Insights />
              </ListItemIcon>
              <ListItemText primary="Personal Stats" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem key="system-dashboard" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={openSystemDashboard}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="System Dashboard" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

        </List>
        <Divider />
        <List>
          <ListItem key="logout" disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
              onClick={logOut}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
