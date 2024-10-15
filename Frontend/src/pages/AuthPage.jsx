import { useRecoilValue } from "recoil"
import LoginCard from "../components/LoginCard"
import SignupCard from "../components/SignupCard"
import authScreenAtom from "../atoms/authAtom"

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom)

    // state of the component whether login or signup
    // console.log(authScreenState);
    
  return (
    <>
       {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
    </>
  )
}

export default AuthPage