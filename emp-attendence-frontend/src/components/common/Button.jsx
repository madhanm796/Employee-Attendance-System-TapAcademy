import { ArrowRight, Loader2 } from 'lucide-react'
import React from 'react'

function Button({isLoading, onClick, title}) {
  return (
     <button
        type="submit"
        disabled={isLoading}
        onClick={onClick}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-200 flex items-center justify-center gap-2 mt-2"
    >
        {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
        ) : (
        <>
            {title} <ArrowRight size={20} />
        </>
        )}
    </button>
  )
}

export default Button