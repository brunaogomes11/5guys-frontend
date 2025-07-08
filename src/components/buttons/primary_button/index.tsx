import React from 'react';

interface PrimaryButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    icon?: React.ReactNode; // Adicionado para permitir ícones
    isActive?: boolean; // Adicionado para indicar estado ativo, se necessário
    type?: 'button' | 'submit' | 'reset'; // Permite definir o tipo do botão
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onClick, children, className, icon, type = 'button' }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`menu-button w-[20vw] bg-orange-button flex flex-row-reverse p-[10px] rounded rounded-[25px] gap-[15px] items-center text-white text-[14px] hover:cursor-pointer ${icon ? 'justify-between' : 'justify-center'} ${className}`}
        >
            {icon}
            {children}
        </button>
    );
};

export default PrimaryButton;