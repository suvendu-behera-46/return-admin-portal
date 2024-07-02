"use client";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { alpha, styled, useTheme } from "@mui/material/styles";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import CampaignIcon from "@mui/icons-material/Campaign";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Toaster } from "react-hot-toast";

const drawerWidth = 240;

function convertToTitleCase(str) {
  if (str.startsWith("/")) {
    str = str.slice(1);
  }
  var words = str.split("-").map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return words.join(" ");
}

const menuData = [
   {
    name: "Dashboard",
    url: "",
    icon: <CampaignIcon />,
  },
  { name: "Accounts", url: "account", icon: <PersonIcon /> },
  { name: "Installation", url: "install", icon: <InstallDesktopIcon /> },
  {
    name: "Campaigns",
    url: "campaigns",
    icon: <CampaignIcon />,
  },
  {
    name: "Value Impact",
    url: "campaigns/value-impact",
    icon: <CampaignIcon />,
  },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ children }) {
  const theme = useTheme();
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = React.useState(false);
  const [selectedMenu, setSelectedMenu] = React.useState("");
  const [openSubMenu, setOpenSubMenu] = React.useState(false);

  React.useEffect(() => {
    setSelectedMenu(path);
  }, [path]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSubMenuToggle = () => {
    setOpenSubMenu(!openSubMenu);
  };

  const handleMenuItemClick = (url) => {
    console.log(router);
    router.replace(url);
    handleDrawerClose();
  };

  ////////
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const menuId = "primary-search-account-menu";

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={() => {
          signOut({ callbackUrl: "/login" });
          handleMenuClose();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event?.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuOpen();
  };

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("md")]: {
        width: "20ch",
      },
    },
  }));
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          signOut({ callbackUrl: "/login" });
          handleMenuClose();
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );
  ///////
console.log(selectedMenu);
  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />
      <Toaster position="top-right" />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {convertToTitleCase(path)}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                edge="end"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <Drawer variant="permanent" open={open}>
        {/* <DrawerHeader>
          <IconButton onClick={handleDrawerClose}> */}
        <DrawerHeader
          style={{
            backgroundColor: "#6b6bdb",
            color: "white",
            display: "flex",
          }}
        >
          <p
            style={{
              flex: 1,
              maxWdth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "uppercase",
            }}
          >
            Name
          </p>
          <IconButton onClick={handleDrawerClose} style={{ color: "white" }}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuData.map((item, index) => (
            <Tooltip title={item.name} placement="right" key={item.name}>
              <ListItem
                disablePadding
                sx={{
                  display: "block",
                  bgcolor:
                    selectedMenu === `/${item.url}` ? "#F3F5FF" : "inherit",
                }}
                onClick={() => {
                  if (item.subMenu) {
                    handleSubMenuToggle && handleSubMenuToggle();
                    handleMenuItemClick(item.url);
                  } else {
                    handleMenuItemClick(item.url);
                  }
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                  {item.subMenu &&
                    (openSubMenu ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {item.subMenu && openSubMenu && (
                <List component="div" disablePadding>
                  {item.subMenu.map((subItem) => (
                    <ListItemButton
                      key={subItem.name}
                      sx={{ pl: 4 }}
                      onClick={() => handleMenuItemClick(subItem.url)}
                    >
                      <ListItemText primary={subItem.name} />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Tooltip>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#F9FAFC",
          height: "100%",
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
