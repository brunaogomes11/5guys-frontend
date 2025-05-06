"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '../logo';
import MenuButton from '../buttons/menu_button';

export default function Menu() {
    return (
        <Disclosure as="nav" className="bg-blue-primary">
            <div className="relative flex w-full h-[80px] pt-0 px-[32px] items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                    {/* Mobile menu button */}
                    <Logo fontSize="40px" />
                    <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset transition-all duration-200">
                        <Bars3Icon aria-hidden="true" className="block h-6 w-6 group-data-open:hidden" />
                        <XMarkIcon aria-hidden="true" className="hidden h-6 w-6 group-data-open:block" />
                    </DisclosureButton>
                </div>
                <div className="w-full h-[100%] flex flex-row items-center justify-between hidden lg:mx-20 lg:flex">
                    <Logo fontSize="40px" />
                    <div className="flex h-[100%] row items-center justify-center">
                        <MenuButton
                            icon={<img src="/icons/map_icon.svg" alt="Map Icon" className="h-6 w-6" />}
                            onClick={() => console.log('Transporte clicado')}
                            isActive={window.location.pathname === '/transportes'}
                            nome="Transporte"
                        />
                        <MenuButton
                            icon={<img src="/icons/house_icon.svg" alt="House Icon" className="h-6 w-6" />}
                            onClick={() => console.log('Alojamento clicado')}
                            isActive={window.location.pathname === '/alojamentos'}
                            nome="Alojamento"
                        />
                        <MenuButton
                            icon={<img src="/icons/tool_icon.svg" alt="Tool Icon" className="h-6 w-6" />}
                            onClick={() => console.log('Obras clicado')}
                            isActive={window.location.pathname === '/obras'}
                            nome="Obras"
                        />
                        <MenuButton
                            icon={<img src="/icons/users_icon.svg" alt="Users Icon" className="h-6 w-6" />}
                            onClick={() => console.log('Funcionários clicado')}
                            isActive={window.location.pathname === '/funcionarios'}
                            nome="Funcionários"
                        />
                        <MenuButton
                            icon={<img src="/icons/truck_icon.svg" alt="Truck Icon" className="h-6 w-6" />}
                            onClick={() => console.log('Veículos clicado')}
                            isActive={window.location.pathname === '/veiculos'}
                            nome="Veículos"
                        />
                    </div>
                </div>
            </div>
            <DisclosurePanel className="lg:hidden">
                <div className="space-y-1 px-2 pb-3 flex flex-col items-center justify-center">
                    <MenuButton
                        icon={<img src="/icons/map_icon.svg" alt="Map Icon" className="h-6 w-6" />}
                        onClick={() => console.log('Transporte clicado')}
                        isActive={window.location.pathname === '/transportes'}
                        nome="Transporte"
                    />
                    <MenuButton
                        icon={<img src="/icons/house_icon.svg" alt="House Icon" className="h-6 w-6" />}
                        onClick={() => console.log('Alojamento clicado')}
                        isActive={window.location.pathname === '/alojamentos'}
                        nome="Alojamento"
                    />
                    <MenuButton
                        icon={<img src="/icons/tool_icon.svg" alt="Tool Icon" className="h-6 w-6" />}
                        onClick={() => console.log('Obras clicado')}
                        isActive={window.location.pathname === '/obras'}
                        nome="Obras"
                    />
                    <MenuButton
                        icon={<img src="/icons/users_icon.svg" alt="Users Icon" className="h-6 w-6" />}
                        onClick={() => console.log('Funcionários clicado')}
                        isActive={window.location.pathname === '/funcionarios'}
                        nome="Funcionários"
                    />
                    <MenuButton
                        icon={<img src="/icons/truck_icon.svg" alt="Truck Icon" className="h-6 w-6" />}
                        onClick={() => console.log('Veículos clicado')}
                        isActive={window.location.pathname === '/veiculos'}
                        nome="Veículos"
                    />
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}