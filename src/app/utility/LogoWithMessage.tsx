
import Logo from "./Logo";
const LogoWithMessage = () => {
    return (
        <div className=" flex-shrink-0 flex items-center ">
                    <Logo />
                    <div className="flex flex-col ml-2.5">
                        <h1 className="font-satoshi-medium font-black text-2xl">Advayu.Club</h1>
                        <p className="text-base	">Unlocking Value</p>
                    </div>

                </div>
    );
    }

export default LogoWithMessage;