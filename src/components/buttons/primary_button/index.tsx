import React from 'react';
import Link from 'next/link';

interface PrimaryButtonProps {
    to?: string;
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ to, onClick, children }) => {
    const baseClass = 'primary-button w-full py-2 px-4 bg-orange-button hover:cursor-pointer text-white font-semibold rounded-[25px] shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2';

    if (to) {
        return (
            <Link href={to} className={baseClass}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={baseClass}>
            {children}
        </button>
    );
};

export default PrimaryButton;