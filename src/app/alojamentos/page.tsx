import PrimaryButton from "@/components/buttons/primary_button";
import Menu from "@/components/menu";

export default function AlojamentosPage() {
    return (
        <div>
            <Menu />
            <div className="w-[100%] h-[100%] m-[32px]">
                <div className="flex"></div>
                <div className="w-[300px] flex justify-center items-center">
                    <PrimaryButton>
                        <img src="icons/plus_icon.svg" alt="Plus Icon"/>
                        Cadastrar novos alojamentos
                    </PrimaryButton>
                </div>
                <div className="w-full"></div>
            </div>
        </div>
    );
}