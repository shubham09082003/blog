import { SignupInput } from "@shubhambhatt/common";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import { BACKEND_URL } from '../../config'



export const Auth = ({type} : {type : "/" | "signin"}) => {
    const navigate = useNavigate()
    const [postInputs, setPostInputs] = useState<SignupInput>({
        name : "",
        username : "",
        password : ""
    })


    async function sendRequest() {
        try{
            const response = await axios.post(`${BACKEND_URL}api/v1/user/${type === "/" ? "signup" : "signin"}`,postInputs);
            const jwt = response.data.jwt;
            localStorage.setItem("token", jwt);
            navigate("/blogs");
        }
        catch(e) {
            // alert the user here that request failed
            alert()
        }
    }


    return <div className="h-screen flex justify-center flex-col">
        <div className="flex justify-center">
            <div>
                <div className="px-10">
                    <div className="text-3xl font-extrabold">
                        Create an account 
                    </div>
                    <div className="text-slate-400">
                        {type === "signin" ? "Don't have account?" : "Already have an account?"}
                        <Link className="ml-2 underline" to={type === "signin" ? "/" : "/signin"}>
                        {type === "signin" ? "Sign up" : "Sign in"}
                        </Link>
                    </div>
                </div>

                <div className="pt-4">
                    {type === "/" ? <LabeledInput label="Name" placeholder="Shubham Bhatt..." onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            name: e.target.value
                        })
                    }} /> : null}
                    <LabeledInput label="Username" placeholder="Shubham@gmail.com" onChange={(e) => {   
                        setPostInputs({
                            ...postInputs,
                            username: e.target.value
                        })
                    }} />
                    <LabeledInput label="Password" type={'password'} placeholder="12345" onChange={(e) => {
                        setPostInputs({
                            ...postInputs,
                            password: e.target.value
                        })
                    }} />

                    <button type="button" className="py-2.5 px-5 me-2 mb-2 text-md font-medium text-white focus:outline-none
                    bg-black rounded-lg border border-gray-200 hover:bg-gray-500 hover:text-black
                    focus:z-10 focus:ring-4 focus:ring-gray-1000 mt-5 w-full" onClick={sendRequest}>{type === "signin" ? "Sign In" : "Sign Up"}</button>
                </div>
            </div>
        </div>

    </div>
}

interface LabeledInputType {
    label : string,
    placeholder : string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type? : string
}

function LabeledInput( {label , placeholder , onChange, type }: LabeledInputType) {
    return <div>
        <label className="block mb-2 text-sm font-semibold text-black pt-4">{label}</label>
        <input type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300
        text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder} onChange={onChange} required />

    </div>
}

