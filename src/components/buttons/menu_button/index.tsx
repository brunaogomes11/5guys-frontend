import React from 'react';

interface MenuButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
    isActive: boolean;
    nome: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, onClick, isActive, nome }) => {
    return (
        <button
            onClick={onClick}
            className={`menu-button w-[140px] flex flex-col gap-[15px] items-center justify-center text-sm font-[24px] h-[100%] bg-bluePrimary t transition-colors hover:cursor-pointer hover:scale-105 text-white 
                ${isActive
                    ? 'border-b-[2px]'
                    : 'bg-bluePrimary'
                }`}
        >
            {icon}
            {nome}
        </button>
    );
};

export default MenuButton;