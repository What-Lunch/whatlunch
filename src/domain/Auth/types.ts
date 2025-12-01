export interface AutnProps {
  onClose: () => void;
}

export interface SignupModalProps extends AutnProps {
  onLoginOpen: () => void;
}

export interface LoginModalProps extends AutnProps {
  onSignupOpen: () => void;
}
