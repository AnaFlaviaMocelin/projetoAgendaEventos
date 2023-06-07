module.exports = async function (signInDTO, userRepository, passwordService) {
  const { email, password } = signInDTO;

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      error: "USER_DOES_NOT_EXISTS",
      data: undefined,
    };
  }

  console.log(user, "user from repository");

  const [userPasswordHash, userPasswordSalt] = user.password.split(":");

  const isPasswordMatching = passwordService.compare(
    password,
    userPasswordHash,
    userPasswordSalt
  );

  console.log(isPasswordMatching, "isPasswordMatching");

  if (!isPasswordMatching) {
    return {
      success: false,
      error: "PASSWORD_IS_NOT_MATCHING",
      data: undefined,
    };
  }

  return {
    success: true,
    error: undefined,
    data: {
      user,
    },
  };
};
