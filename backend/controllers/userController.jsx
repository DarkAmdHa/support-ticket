//@desc     Register a new user
//@route    /api/users
//@access   Public
const registerUser = (req, res) => {
  res.send('Register Route')
}

//@desc     Login a new user
//@route    /api/users/login
//@access   Public
const loginUser = (req, res) => {
  req.send('Login User')
}

module.exports = {
  registerUser,
  loginUser,
}
