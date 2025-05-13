import React from 'react';

interface CancelButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode; // Adicionado para permitir ícones
    isActive?: boolean; // Adicionado para indicar estado ativo, se necessário
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick, children, className, icon }) => {
    return (
        <button
            onClick={onClick}
            className={`menu-button w-[250px] bg-red-cancel flex flex-row-reverse p-[10px] rounded rounded-[25px] gap-[15px] items-center text-white text-[14px] hover:cursor-pointer hover:bg-red-600 justify-center ${className}`}
        >
            {icon}
            {children}
        </button>
    );
};

export default CancelButton;