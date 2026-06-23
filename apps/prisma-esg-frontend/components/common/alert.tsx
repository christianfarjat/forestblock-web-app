import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { classNames } from '@/lib/utils';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  message: string;
  onClose?: () => void;
}

export const Alert = ({ type = 'info', message, onClose }: AlertProps) => {
  const styles = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      Icon: Info,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: 'text-green-600',
      Icon: CheckCircle,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-600',
      Icon: AlertTriangle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      Icon: AlertCircle,
    },
  };

  const style = styles[type];
  const Icon = style.Icon;

  return (
    <div className={classNames('rounded-lg border p-4 flex items-start gap-3', style.bg, style.border)}>
      <Icon className={classNames('mt-0.5 flex-shrink-0', style.icon)} size={20} />
      <p className={classNames('flex-1', style.text)}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};
