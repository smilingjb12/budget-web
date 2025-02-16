export function useSignIn() {
  const getErrorTitle = (error: { message: string }) => {
    let errorTitle: string = "";

    if (error.message.includes("Invalid password")) {
      errorTitle = "Password doesn't meed the security requirements";
    }
    if (error.message.includes("InvalidSecret")) {
      errorTitle = "Invalid password";
    }
    if (error.message.includes("InvalidAccountId")) {
      errorTitle = "Account with this email does not exist";
    }
    if (error.message.includes("already exists")) {
      errorTitle = "Account already exists";
    }

    return errorTitle;
  };

  return { getErrorTitle };
}
