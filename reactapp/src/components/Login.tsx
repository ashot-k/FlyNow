import Button from "react-bootstrap/Button";

export default function Login() {


    return (
        <div>
            Login
            <label>Username
                <input type={"text"} placeholder={"insert username"}/>
            </label>
            <label>Password
                <input type={"password"}/>
            </label>
            <Button variant={"btn"} className={"w-25"}></Button>
        </div>
    )
}