import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  TextField,
  Avatar,
  IconButton,
} from '@mui/material';
import { AccountCircle, PhotoCamera, Language, Palette, Security, Notifications } from '@mui/icons-material';
import { useThemeMode } from '../../hooks/useThemeMode';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function Settings() {
  const user = useSelector((state) => state.auth.user);
  const { mode, toggle } = useThemeMode();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account settings and preferences.
      </Typography>

      {/* Profile Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Profile Information
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
              {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'background.paper' },
              }}
              size="small"
            >
              <PhotoCamera fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ ml: 3 }}>
            <Typography variant="h6">{user?.full_name || 'User'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.is_superuser ? 'Administrator' : 'User'}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { sm: '1fr 1fr' }, gap: 2 }}>
          <TextField label="Full Name" value={user?.full_name || ''} fullWidth />
          <TextField label="Email Address" value={user?.email || ''} fullWidth />
        </Box>
      </Paper>

      {/* Appearance & Preferences */}
      <Paper sx={{ p: 0, overflow: 'hidden', mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Preferences
          </Typography>
        </Box>
        <List sx={{ pt: 0 }}>
          <ListItem divider>
            <ListItemIcon>
              <Palette color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Dark Mode"
              secondary="Switch between light and dark theme"
            />
            <Switch checked={mode === 'dark'} onChange={toggle} />
          </ListItem>
          <ListItem divider>
            <ListItemIcon>
              <Notifications color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive alerts for new scored applications"
            />
            <Switch checked={notifications} onChange={() => setNotifications(!notifications)} />
          </ListItem>
          <ListItem divider>
            <ListItemIcon>
              <Language color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Email Alerts"
              secondary="Receive daily reports via email"
            />
            <Switch checked={emailAlerts} onChange={() => setEmailAlerts(!emailAlerts)} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Security color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Two-Factor Authentication"
              secondary="Add an extra layer of security to your account"
            />
            <Button variant="outlined" size="small">Enable</Button>
          </ListItem>
        </List>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 4 }}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save Changes</Button>
      </Box>
    </Box>
  );
}

export default Settings;
