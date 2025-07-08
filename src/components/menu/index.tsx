"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter } from 'next/navigation'; // Hook para obter o pathname e o router
import { useEffect, useState } from 'react';
import Logo from '../logo';
import MenuButton from '../buttons/menu_button';
import { useAuth } from '@/contexts/AuthContext'; // Importe o hook de autenticação

export default function Menu() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, loading } = useAuth(); // Adicione loading aqui
    const [displayName, setDisplayName] = useState('Usuário');
    
    // Atualiza o display name quando o user muda
    useEffect(() => {
        if (loading) {
            setDisplayName('Carregando...');
        } else if (user && user.email) {
            setDisplayName(user.email);
        } else {
            setDisplayName('Usuário');
        }
    }, [user, loading]);
    
    // Função para lidar com o logout
    const handleLogout = () => {
        logout(); // Limpa o estado e o token do usuário
        router.push('/login'); // Redireciona para o login usando o router do Next.js
    };

    // Função para obter o display name do usuário
    const getUserDisplayName = () => {
        return displayName;
    };

    return (
        <Disclosure as="nav" className="bg-blue-primary">
            <div className="relative flex w-full h-[80px] pt-0 px-[32px] items-center justify-between">
                <div className="absolute inset-y-0 left-0 px-[32px] flex items-center justify-between w-full lg:hidden">
                    {/* Mobile menu button */}
                    <a href="/" className="flex items-center">
                        <Logo fontSize="40px" />
                    </a>
                    <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset transition-all duration-200">
                        <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-open:hidden" />
                        <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-open:block" />
                    </DisclosureButton>
                </div>
                <div className="w-full h-[100%] flex flex-row items-center justify-between hidden lg:mx-20 lg:flex">
                    <a href="/" className="flex items-center select-none">
                        <Logo fontSize="40px" />
                    </a>
                    <div className="flex h-[100%] row items-center justify-center">
                        <MenuButton
                            icon={<img src="/icons/map_icon.svg" alt="Map Icon" className="h-6 w-6" />}
                            isActive={pathname === '/transportes'}
                            nome="Transportes"
                            link="/transportes"
                        />
                        <MenuButton
                            icon={<img src="/icons/house_icon.svg" alt="House Icon" className="h-6 w-6" />}
                            isActive={pathname === '/alojamentos'}
                            nome="Alojamentos"
                            link="/alojamentos"
                        />
                        <MenuButton
                            icon={<img src="/icons/tool_icon.svg" alt="Tool Icon" className="h-6 w-6" />}
                            isActive={pathname === '/obras'}
                            nome="Obras"
                            link="/obras"
                        />
                        <MenuButton
                            icon={<img src="/icons/users_icon.svg" alt="Users Icon" className="h-6 w-6" />}
                            isActive={pathname === '/funcionarios'}
                            nome="Funcionários"
                            link="/funcionarios"
                        />
                        <MenuButton
                            icon={<img src="/icons/truck_icon.svg" alt="Truck Icon" className="h-6 w-6" />}
                            isActive={pathname === '/veiculos'}
                            nome="Veículos"
                            link="/veiculos"
                        />
                    </div>
                    <div className="relative">
                        <Disclosure>
                            {({ open }) => (
                                <div>
                                    <DisclosureButton className="flex items-center gap-2 rounded-full py-[0.5rem] px-[1rem] cursor-pointer bg-transparent border border-white text-white text-[1rem] font-normal focus:outline-none transition-all duration-200">
                                        {getUserDisplayName()}
                                        <img src="/icons/arrow_down_icon.svg" alt="Arrow Down" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                                    </DisclosureButton>
                                    <DisclosurePanel className="absolute right-0 mt-2 w-full rounded-lg bg-white shadow-lg z-10">
                                        <button
                                            className="block w-full text-left px-4 py-3 text-blue-primary hover:bg-blue-100 rounded-lg text-[1rem] cursor-pointer"
                                            onClick={handleLogout} // Chama a função de logout corrigida
                                        >
                                            Deslogar
                                        </button>
                                    </DisclosurePanel>
                                </div>
                            )}
                        </Disclosure>
                    </div>
                </div>
            </div>
            <DisclosurePanel className="lg:hidden">
                <div className="space-y-1 px-2 pb-3 flex flex-col items-center justify-center w-full h-[100%] bg-blue-primary">
                    <MenuButton
                        icon={<img src="/icons/map_icon.svg" alt="Map Icon" className="h-6 w-6" />}
                        isActive={pathname === '/transportes'}
                        nome="Transporte"
                        link="/transportes"
                    />
                    <MenuButton
                        icon={<img src="/icons/house_icon.svg" alt="House Icon" className="h-6 w-6" />}
                        isActive={pathname === '/alojamentos'}
                        nome="Alojamento"
                        link="/alojamentos"
                    />
                    <MenuButton
                        icon={<img src="/icons/tool_icon.svg" alt="Tool Icon" className="h-6 w-6" />}
                        isActive={pathname === '/obras'}
                        nome="Obras"
                        link="/obras"
                    />
                    <MenuButton
                        icon={<img src="/icons/users_icon.svg" alt="Users Icon" className="h-6 w-6" />}
                        isActive={pathname === '/funcionarios'}
                        nome="Funcionários"
                        link="/funcionarios"
                    />
                    <MenuButton
                        icon={<img src="/icons/truck_icon.svg" alt="Truck Icon" className="h-6 w-6" />}
                        isActive={pathname === '/veiculos'}
                        nome="Veículos"
                        link="/veiculos"
                    />
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}