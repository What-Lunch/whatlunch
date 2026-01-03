export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  contentClassName?: string;
  innerClassName?: string;
  children: React.ReactNode;
}
