import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isActive?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      className={`menu-button w-[20vw] bg-orange-button flex flex-row-reverse p-[10px] rounded rounded-[25px] gap-[15px] items-center text-white text-[14px] hover:cursor-pointer ${icon ? 'justify-between' : 'justify-center'} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
};

export default PrimaryButton;
