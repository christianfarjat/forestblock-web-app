declare module 'react-google-recaptcha' {
  import { Component } from 'react';
  
  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onError?: () => void;
    size?: 'normal' | 'compact' | 'invisible';
    ref?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  export default class ReCAPTCHA extends Component<ReCAPTCHAProps> {
    executeAsync(): Promise<string>;
    reset(): void;
  }
} 