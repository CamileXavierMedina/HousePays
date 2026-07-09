import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    rotulo: string;
    erro?: string | null;
}

export const Input: React.FC<InputProps> = ({ rotulo, erro, className = '', ...props }) => {
    return (
        <div className="w-full">
            <label className="block text-xs font-semibold text-slate-500 mb-1">{rotulo}</label>
            <input
                className={`w-full bg-slate-50 border rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all ${
                    erro ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-200'
                } ${className}`}
                {...props}
            />
            {erro && <p className="text-xs text-rose-600 font-medium mt-1">{erro}</p>}
        </div>
    );
};
export default Input;
