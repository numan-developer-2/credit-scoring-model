import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme, setTheme } from '../stores/slices/themeSlice';

export const useThemeMode = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const setMode = (newMode) => {
    dispatch(setTheme(newMode));
  };

  return {
    mode,
    toggle,
    setMode,
    isDark: mode === 'dark',
  };
};

export default useThemeMode;