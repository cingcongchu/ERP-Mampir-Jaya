import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as SalesIcon,
  Assessment as ReportsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 280;

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const location = useLocation();

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDesktopOpen(!desktopOpen);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Products', icon: <InventoryIcon />, path: '/products' },
    { text: 'Sales', icon: <SalesIcon />, path: '/sales' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  ];

  const drawer = (
    <Box>
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
              MJ
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
              display: desktopOpen || isMobile ? 'block' : 'none',
              fontSize: '1.1rem',
            }}
          >
            MAMPIR JAYA ERP
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main + '20',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main + '30',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary,
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  display: (desktopOpen || isMobile) ? 'block' : 'none',
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    color: location.pathname === item.path
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* App Bar */}
      <Box
        component="nav"
        sx={{
          width: { md: desktopOpen ? drawerWidth : 64 },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: desktopOpen ? drawerWidth : 64,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open={desktopOpen}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${desktopOpen ? drawerWidth : 64}px)` },
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
        }}
      >
        {/* Mobile menu button */}
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1100,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Top welcome bar */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            borderBottom: `1px solid ${theme.palette.divider}`,
            mt: 2,
          }}
        >
          <Toolbar sx={{ minHeight: '64px' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Welcome to MAMPIR JAYA ERP
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Building Materials Management System • {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;