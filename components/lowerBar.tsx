import Link from "next/link"

export function LowerBar({name , path} : {name : string , path : string}){
    return (
        <Link 
            href={path}
            className="group flex-1 flex items-center justify-center px-4 py-3 rounded-lg hover:bg-slate-800/50 transition-all duration-200 ease-in-out transform hover:scale-105 border border-slate-700/50 hover:border-slate-600"
        >
            <span className="text-slate-300 font-semibold text-sm group-hover:text-indigo-400 transition-colors">
                {name}
            </span>
        </Link>
    )
}