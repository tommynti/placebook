import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import useForm from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import useHttp from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import "./Auth.css";

function Auth() {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, error, sendRequest, clearError} = useHttp();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      // An eimai sto Sign up kai exw pathsei na paw sto login
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined }, // bazw to name undefined gt de thelw na ypologistei sto form Validity
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        { ...formState.inputs, 
          name: { 
            value: "", 
            isValid: false 
          },
          image: {
            value: null,
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs); // User credentials


    if (isLoginMode) {
      //LOG IN
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+'/api/users/login',
        'POST', 
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }),
        {
          'Content-Type': 'Application/json'
        })

        auth.login(responseData.user.id);
      } catch(error) {
        console.log(error);
      }
    } else {
      // SIGN UP
      try {
        // Because i want to send an image to the server i use FormData because images are binary data
        const formData = new FormData();
        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL+'/api/users/signup',
        'POST', 
        formData
        );

        auth.login(responseData.user.id);
      } catch (error) {
        console.log(error);
      }
    }
  };



  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLoginMode ? "Login" : "Sign-Up"} Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              type="text"
              id="name"
              label="Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a nickname or your name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && <ImageUpload id='image' center onInput={inputHandler} />}
          <Input
            element="input"
            type="email"
            id="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            type="password"
            id="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "Sign Up"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch to {isLoginMode ? "Sign Up" : "Login"}
        </Button>
      </Card>
    </React.Fragment>
  );
}

export default Auth;
