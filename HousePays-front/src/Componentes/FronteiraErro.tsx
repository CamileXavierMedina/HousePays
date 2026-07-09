import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Botao from './Botao';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class FronteiraErro extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Erro capturado pela Fronteira de Erro:", error, errorInfo);
    }

    private handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="max-w-xl mx-auto my-12 bg-rose-50/50 border border-rose-100 p-6 rounded-2xl shadow-xs text-center flex flex-col items-center gap-4">
                    <div className="p-3 bg-rose-100/50 rounded-full text-rose-600">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-rose-900">Falha ao carregar informações</h3>
                        <p className="text-sm text-rose-700 mt-2">
                            {this.state.error?.message || "Não foi possível se comunicar com o servidor ou ocorreu um erro de renderização."}
                        </p>
                    </div>
                    <Botao variante="perigo" icone={<RefreshCw className="w-4 h-4" />} onClick={this.handleRetry}>
                        Tentar Novamente
                    </Botao>
                </div>
            );
        }

        return this.props.children;
    }
}
export default FronteiraErro;
