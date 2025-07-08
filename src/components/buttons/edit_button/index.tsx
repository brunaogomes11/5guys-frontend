import React from "react";

interface EditButtonProps {
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick, className = "", disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center ${className}`}
        >
            <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
            >
                <path 
                    d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" 
                    fill="currentColor"
                />
            </svg>
        </button>
    );
};

export default EditButton;
