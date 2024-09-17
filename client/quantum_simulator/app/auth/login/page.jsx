import Image from "next/image"
import AuthForm from "../../../components/AuthForm";
const LoginPage=() => {
    return(
        <div className="container-1 flex  justify-around items-center  bg-black px-5 min-h-screen  ">
            <div className="image flex flex-col  bg-purple-950 ">
               <div className="flex flex-col py-5 gap-2 px-4 ">
                <h1 className="font-semibold text-5xl">Dive Deep Into the</h1>
                <p className="font-normal text-3xl">World of Simulations</p>
               </div>
               <Image 
               src="/loginQun.svg"
               width={500}
               height={500}
               ></Image>
            </div>
            <div className="bg-black min-h-[40em] w-[50%] flex items-center justify-center">
                <AuthForm mode='login' />
            </div>
        </div>
    )
}

export default LoginPage;