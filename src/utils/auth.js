import { saveToStorage, getFromStorage, removeFromStorage } from './storage';
import { mockUsers } from './mockData';

export const login = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);

  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    saveToStorage('currentUser', userWithoutPassword);
    saveToStorage('isAuthenticated', true);
    return { success: true, user: userWithoutPassword };
  }

  return { success: false, error: 'Invalid email or password' };
};

export const logout = () => {
  removeFromStorage('currentUser');
  removeFromStorage('isAuthenticated');
};

export const getCurrentUser = () => {
  return getFromStorage('currentUser');
};

export const isAuthenticated = () => {
  return getFromStorage('isAuthenticated') === true;
};

export const updateUserProfile = (updates) => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...updates };
    saveToStorage('currentUser', updatedUser);
    return { success: true, user: updatedUser };
  }
  return { success: false, error: 'No user logged in' };
};
