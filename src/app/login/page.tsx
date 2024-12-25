import classes from "./Login.module.scss"
import LoginComponent from "@/components/loginComponent/loginComponent"

export default function Login(){


    return(
        <>
            <div className={classes.wrapper}>
                <div className={classes.insideWrapper}>
                    <LoginComponent />


                </div>

            </div>
        
        </>
    )
}