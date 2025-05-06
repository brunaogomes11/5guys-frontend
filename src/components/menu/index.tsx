import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Menu() {

    return (
        <Disclosure as="nav" className="bg-white">
            <div className="relative flex w-full h-[80px] pt-0 mx-[32px] items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                    {/* Mobile menu button*/}
                    <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                        <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                        <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                    </DisclosureButton>
                    <div className="flex shrink-0 items-center">
                        <div className="text-xl">5Guys</div>
                    </div>
                </div>
                <div className='w-full flex flex-row items-center justify-between hidden lg:mx-20 lg:flex'>
                    <div className="flex shrink-0 items-center">
                        <div className="text-xl">5Guys</div>
                    </div>
                    <div className='flex row items-center justify-center'>
                        <div className="bg-black text-white radius-xl">Funcionários</div>
                        <div className="bg-black text-white radius-xl">Teste</div>
                    </div>
                </div>
            </div>
            <DisclosurePanel className="lg:hidden">
                <div className="space-y-1 px-2 pb-3">
                    <div className="bg-black text-white radius-xl">Funcionários</div>
                    <div className="bg-black text-white radius-xl">Teste</div>
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}