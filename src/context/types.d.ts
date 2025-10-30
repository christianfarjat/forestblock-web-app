import { Retirement } from "@/types/useRetirements";

export interface RetireContextProps {
  tonnesToRetire: number;
  setTonnesToRetire: React.Dispatch<React.SetStateAction<number>>;
  beneficiary: string;
  setBeneficiary: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  index: number | string;
  setIndex: React.Dispatch<React.SetStateAction<number | string>>;
  totalSupply: number;
  setTotalSupply: React.Dispatch<React.SetStateAction<number>>;
  quoteDetails: QuoteDetails | null;
  setQuoteDetails: React.Dispatch<React.SetStateAction<QuoteDetails | null>>;
  orderDetails: OrderDetails | null;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails | null>>;
  newRetirement: Retirement | undefined;
  setNewRetirement: React.Dispatch<
    React.SetStateAction<Retirement | undefined>
  >;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (data: { token: string; user: User }) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  setRedirectUrl: (url: string) => void;
  redirectUrl: string | null;
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DecodedToken {
  exp: number;
  id: string;
}
