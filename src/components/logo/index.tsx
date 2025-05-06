import React from 'react';

interface LogoProps {
    fontSize?: string; // Permite alterar o tamanho da fonte dinamicamente
}

const Logo: React.FC<LogoProps> = ({ fontSize = '40px' }) => {
    return (
        <div
            style={{
                fontFamily: "'Edu AU VIC WA NT Hand', cursive",
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: fontSize,
                lineHeight: '70px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                letterSpacing: '0.28em',
                color: '#FFFFFF',
            }}
        >
            5Guys
        </div>
    );
};

export default Logo;