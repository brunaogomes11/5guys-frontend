import React from 'react';
import Image from 'next/image';

interface DeleteButtonProps {
    onClick: () => void;
    className?: string;
    size?: number;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ 
    onClick, 
    className = '', 
    size = 20 
}) => {
    return (
        <button
            onClick={onClick}
            className={`p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-all duration-200 ${className}`}
            title="Excluir"
        >
            <Image 
                src="/icons/trash_icon.svg" 
                alt="Excluir" 
                width={size} 
                height={size}
                className="text-red-600"
            />
        </button>
    );
};

export default DeleteButton;
