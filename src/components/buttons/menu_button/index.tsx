import Link from 'next/link';
import React from 'react';

interface MenuButtonProps {
    icon: React.ReactNode;
    isActive: boolean;
    nome: string;
    link: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, isActive, nome, link }) => {
    if (isActive) {
        return (
            <div
                className={`menu-button w-[140px] flex flex-col gap-[15px] items-center justify-center text-sm font-[24px] h-[100%] bg-bluePrimary transition-colors hover:cursor-default text-white border-b-[2px]`}
            >
                {icon}
                {nome}
            </div>
        );
    }

    return (
        <Link
            href={link}
            className={`menu-button w-[140px] flex flex-col gap-[15px] items-center justify-center text-sm font-[24px] h-[100%] bg-bluePrimary transition-colors hover:cursor-pointer hover:scale-105 text-white`}
        >
            {icon}
            {nome}
        </Link>
    );
};

export default MenuButton;