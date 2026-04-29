import {LowerBar} from "@/components/lowerBar"

export default function RootLayout(
    {children} : Readonly<{children : React.ReactNode}>
){
    return (
        <div>
            <main className="flex-1 pb-20">{children}</main>
            <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700 shadow-2xl">
                <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
                    <LowerBar name={"Home"} path={"/PostsPage"}/>
                    <LowerBar name={"Search"} path={"/SearchingPage"}/>
                    <LowerBar name={"Create Post"} path={"/CreatePostPage"}/>
                    <LowerBar name={"Collection"} path={"/MyInfoPage"}/>
                </div>
            </nav>
        </div>
    )
}