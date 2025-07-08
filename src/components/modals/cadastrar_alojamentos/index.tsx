import React, { useState, useRef, useEffect } from "react";
import TextInput from "@/components/inputs/text_input";
import PrimaryButton from "@/components/buttons/primary_button";
import CancelButton from "@/components/buttons/cancel_button";
import ModalSucessoCadAlojamento from "@/components/modals/sucesso_cad_alojamentos";
import ModalSelecaoEnd from "@/components/maps/modal_selecao_end";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void; // Callback para atualizar a tabela
}

const ModalCadastrarAlojamento: React.FC<ModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [form, setForm] = useState({
        nome: "",
        endereco: "",
        numero: "",
        cidade: "",
        estado: "",
        quantidade_de_vagas: "",
        cep: "",
        latitude: "",
        longitude: "",
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [showMap, setShowMap] = useState(false);
    const [showFormError, setShowFormError] = useState(false);
    const [isSearchingCoordinates, setIsSearchingCoordinates] = useState(false);
    const [searchStatus, setSearchStatus] = useState<string>('');
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Cleanup do timer quando o componente for desmontado
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Função para buscar coordenadas quando campos relevantes são alterados
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newForm = { ...form, [e.target.name]: e.target.value };
        setForm(newForm);
        
        // Limpa timer anterior
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        // Cria novo timer para buscar coordenadas após 1.5 segundos sem digitação
        debounceTimer.current = setTimeout(() => {
            // Busca se tem endereço + cidade + estado OU se tem CEP válido
            const temEnderecoCompleto = newForm.endereco && newForm.cidade && newForm.estado;
            const temCepValido = newForm.cep && newForm.cep.replace(/\D/g, '').length === 8;
            
            if (temEnderecoCompleto || temCepValido) {
                buscarCoordenadasComForm(newForm);
            }
        }, 1500);
    };

    // Função específica para mudanças no CEP
    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let cep = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        
        // Aplica máscara de CEP (00000-000)
        if (cep.length > 5) {
            cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
        }
        
        setForm({ ...form, cep });
        
        // Limpa timer anterior
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        // Se CEP tem 8 dígitos, busca automaticamente
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            debounceTimer.current = setTimeout(() => {
                buscarEnderecoPorCep(cepLimpo);
            }, 1000);
        }
    };

    // Função para buscar endereço completo pelo CEP
    const buscarEnderecoPorCep = async (cep: string) => {
        setIsSearchingCoordinates(true);
        setSearchStatus('Buscando endereço pelo CEP...');
        try {
            const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const viaCepData = await viaCepResponse.json();
            
            if (!viaCepData.erro) {
                // Atualiza form com dados do CEP
                setForm(prevForm => ({
                    ...prevForm,
                    endereco: viaCepData.logradouro || prevForm.endereco,
                    cidade: viaCepData.localidade || prevForm.cidade,
                    estado: viaCepData.uf || prevForm.estado,
                    cep: viaCepData.cep || prevForm.cep
                }));

                setSearchStatus('Buscando coordenadas...');

                // Busca coordenadas com os dados atualizados
                const formAtualizado = {
                    ...form,
                    endereco: viaCepData.logradouro || form.endereco,
                    cidade: viaCepData.localidade || form.cidade,
                    estado: viaCepData.uf || form.estado,
                    cep: viaCepData.cep || form.cep
                };
                
                setTimeout(() => {
                    buscarCoordenadasComForm(formAtualizado);
                }, 500);
            } else {
                setSearchStatus('CEP não encontrado');
                setIsSearchingCoordinates(false);
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            setSearchStatus('Erro ao buscar CEP');
            setIsSearchingCoordinates(false);
        }
    };

    // Função auxiliar para buscar coordenadas com form específico
    const buscarCoordenadasComForm = async (formData: typeof form) => {
        setIsSearchingCoordinates(true);
        setSearchStatus('Buscando coordenadas...');
        try {
            let enderecoCompleto = '';
            let coordenadasEncontradas = false;

            // Primeira tentativa: Se tem CEP, busca pelo ViaCEP
            if (formData.cep) {
                const cepLimpo = formData.cep.replace(/\D/g, '');
                if (cepLimpo.length === 8) {
                    try {
                        const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                        const viaCepData = await viaCepResponse.json();
                        
                        if (!viaCepData.erro) {
                            // Usa endereço do ViaCEP + número se fornecido
                            enderecoCompleto = `${viaCepData.logradouro}${formData.numero ? ', ' + formData.numero : ''}, ${viaCepData.localidade}, ${viaCepData.uf}, Brasil`;
                        }
                    } catch (error) {
                        console.log('Erro no ViaCEP, tentando com endereço manual');
                    }
                }
            }

            // Segunda tentativa: Se não encontrou pelo CEP, usa endereço fornecido
            if (!enderecoCompleto && formData.endereco && formData.cidade && formData.estado) {
                enderecoCompleto = `${formData.endereco}${formData.numero ? ', ' + formData.numero : ''}, ${formData.cidade}, ${formData.estado}, Brasil`;
            }

            // Busca coordenadas usando múltiplas APIs para maior precisão
            if (enderecoCompleto) {
                try {
                    // Primeira tentativa: Nominatim com restrição para Brasil
                    const nominatimResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}&countrycodes=br&limit=1&addressdetails=1`);
                    const nominatimData = await nominatimResponse.json();
                    
                    if (nominatimData && nominatimData.length > 0) {
                        const { lat, lon } = nominatimData[0];
                        setForm(prevForm => ({
                            ...prevForm,
                            latitude: lat,
                            longitude: lon
                        }));
                        coordenadasEncontradas = true;
                        setSearchStatus('Coordenadas encontradas!');
                    }
                } catch (error) {
                    console.log('Erro no Nominatim:', error);
                }

                // Se não encontrou, tenta uma busca mais genérica
                if (!coordenadasEncontradas) {
                    try {
                        const enderecoSimples = `${formData.cidade}, ${formData.estado}, Brasil`;
                        const fallbackResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoSimples)}&countrycodes=br&limit=1`);
                        const fallbackData = await fallbackResponse.json();
                        
                        if (fallbackData && fallbackData.length > 0) {
                            const { lat, lon } = fallbackData[0];
                            setForm(prevForm => ({
                                ...prevForm,
                                latitude: lat,
                                longitude: lon
                            }));
                            coordenadasEncontradas = true;
                            setSearchStatus('Coordenadas aproximadas da cidade');
                        }
                    } catch (error) {
                        console.error('Erro na busca de fallback:', error);
                    }
                }
            }

            if (!coordenadasEncontradas) {
                setSearchStatus('Coordenadas não encontradas');
            }

        } catch (error) {
            console.error('Erro ao buscar coordenadas:', error);
            setSearchStatus('Erro na busca de coordenadas');
        } finally {
            setIsSearchingCoordinates(false);
            // Limpa status após 3 segundos
            setTimeout(() => setSearchStatus(''), 3000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowFormError(true);
        setFormError(null);
        try {
            const payload = {
                nome: form.nome,
                endereco: form.endereco,
                numero: form.numero,
                cidade: form.cidade,
                estado: form.estado,
                quantidade_de_vagas: form.quantidade_de_vagas ? Number(form.quantidade_de_vagas) : 1,
                latitude: form.latitude ? Number(form.latitude).toFixed(6) : undefined,
                longitude: form.longitude ? Number(form.longitude).toFixed(6) : undefined,
                cep: form.cep,
            };
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/alojamentos/cadastrar/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowSuccess(true);
                // Chama callback para atualizar a tabela
                if (onSuccess) {
                    onSuccess();
                }
                // Reset do formulário para próximo cadastro
                setForm({
                    nome: "",
                    endereco: "",
                    numero: "",
                    cidade: "",
                    estado: "",
                    quantidade_de_vagas: "",
                    cep: "",
                    latitude: "",
                    longitude: "",
                });
                setFormError(null);
                setShowFormError(false);
            } else {
                const errorData = await res.json();
                let errorMsg = 'Erro ao cadastrar alojamento.';
                if (typeof errorData === 'object' && errorData !== null) {
                    errorMsg = Object.entries(errorData)
                        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                        .join('\n');
                }
                setFormError(errorMsg);
            }
        } catch {
            setFormError('Erro de conexão com o servidor.');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {showMap && (
                <ModalSelecaoEnd
                    isOpen={showMap}
                    onClose={() => setShowMap(false)}
                    onSelect={(lat, lng, cep, endereco, cidade, estado) => {
                        setForm(f => ({
                            ...f,
                            latitude: lat ? String(lat) : "",
                            longitude: lng ? String(lng) : "",
                            cep: cep || "",
                            endereco: endereco || "",
                            cidade: cidade || "",
                            estado: estado || "",
                        }));
                        setShowMap(false);
                    }}
                />
            )}
            <div className="fixed top-0 left-0 w-screen h-screen bg-[#000000AA] flex items-center justify-center z-[1000]">
                <div className="bg-blue-primary py-[3.25rem] px-[5.5rem] rounded-lg min-w-[350px] shadow-lg relative">
                    <h2 className="text-[#FFFFFF] mb-4 text-center">Cadastrar Alojamento</h2>
                    <form onSubmit={handleSubmit}>
                        {(formError && showFormError) && (
                            <div className="mb-3 text-red-600 bg-red-100 border border-red-300 rounded p-2 text-sm">
                                {formError.split('\n').map((line, idx) => <div key={idx}>{line}</div>)}
                            </div>
                        )}
                        <div className="mb-3">
                            <TextInput label="Nome" name="nome" value={form.nome} onChange={handleChange} className="w-full" />
                        </div>
                        <div className="mb-3 flex gap-2 items-end">
                            <TextInput 
                                label="Endereço" 
                                name="endereco" 
                                value={form.endereco} 
                                onChange={handleAddressChange} 
                                className="flex-1" 
                                placeholder="Rua, Avenida..." 
                            />
                            <TextInput 
                                label="Nº" 
                                name="numero" 
                                value={form.numero} 
                                onChange={handleAddressChange} 
                                className="w-[100px]" 
                                placeholder="Número" 
                            />
                            <PrimaryButton
                                className="ml-2 px-2 py-1 rounded"
                                onClick={() => {
                                    setShowMap(true);
                                }}
                            >
                                Selecionar pelo mapa
                            </PrimaryButton>
                        </div>
                        <div className="mb-3 flex gap-2">
                            <TextInput 
                                label="Cidade" 
                                name="cidade" 
                                value={form.cidade} 
                                onChange={handleAddressChange} 
                                className="flex-1" 
                            />
                            <TextInput 
                                label="UF" 
                                name="estado" 
                                value={form.estado} 
                                onChange={handleAddressChange} 
                                className="w-1/3" 
                                maxLength={2} 
                                placeholder="UF" 
                            />
                        </div>
                        <div className="mb-3">
                            <TextInput 
                                label="CEP" 
                                name="cep" 
                                value={form.cep} 
                                onChange={handleCepChange} 
                                className="w-full" 
                                placeholder="00000-000"
                                maxLength={9}
                            />
                        </div>
                        
                        {/* Indicador de busca de coordenadas */}
                        {isSearchingCoordinates && (
                            <div className="mb-3 text-yellow-300 text-sm flex items-center">
                                <span className="animate-spin mr-2">🔄</span>
                                {searchStatus || 'Buscando...'}
                            </div>
                        )}
                        
                        {/* Status da busca (sucesso ou erro) */}
                        {!isSearchingCoordinates && searchStatus && (
                            <div className={`mb-3 text-sm flex items-center ${
                                searchStatus.includes('encontrada') || searchStatus.includes('aproximada')
                                    ? 'text-green-300' 
                                    : 'text-red-300'
                            }`}>
                                <span className="mr-2">
                                    {searchStatus.includes('encontrada') || searchStatus.includes('aproximada') ? '✅' : '❌'}
                                </span>
                                {searchStatus}
                            </div>
                        )}
                        
                        {/* Exibir coordenadas se encontradas */}
                        {(form.latitude && form.longitude) && (
                            <div className="mb-3 text-green-300 text-xs">
                                📍 Coordenadas: {Number(form.latitude).toFixed(6)}, {Number(form.longitude).toFixed(6)}
                            </div>
                        )}
                        <div className="mb-3">
                            <TextInput 
                                label="Quantidade de Vagas" 
                                name="quantidade_de_vagas" 
                                value={form.quantidade_de_vagas} 
                                onChange={handleChange} 
                                className="w-full" 
                                type="number"
                                min="1"
                                placeholder="1" 
                            />
                        </div>
                        <div className="flex flex-row gap-2 border-box">
                            <PrimaryButton type="submit" className="mt-2 mx-auto relative">
                                Cadastrar Alojamento
                            </PrimaryButton>
                            <CancelButton className="mt-2 mx-auto relative" onClick={onClose}>
                                Cancelar
                            </CancelButton>
                        </div>
                    </form>
                </div>
            </div>
            {showSuccess && (
                <ModalSucessoCadAlojamento isOpen={showSuccess} onClose={() => { setShowSuccess(false); onClose(); }} />
            )}
        </>
    );
};

export default ModalCadastrarAlojamento;