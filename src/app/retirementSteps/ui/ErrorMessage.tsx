const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-64 bg-white border rounded shadow-md">
    <p className="text-center text-red-500">{message}</p>
  </div>
);

export default ErrorMessage;