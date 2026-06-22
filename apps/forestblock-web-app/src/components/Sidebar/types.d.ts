export interface MenuItem {
  href?: string;
  label: string;
  icon: JSX.Element;
  nestedRoutes: string[];
  queryKeys: string[];
  target?: string;
  children?: MenuItem[];
}

export interface MenuProps {
  menuItems: MenuItem[];
  isAuthenticated: boolean;
  isActive: (item: MenuItem) => boolean;
  onItemClick: (item: MenuItem) => void;
  logout: () => void;
}

export interface LogoutButtonProps {
  isAuthenticated: boolean;
  logout: () => void;
}

export interface MobileHamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}
