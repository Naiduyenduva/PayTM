import React from 'react'

const Login = () => {
  return (
    <div>Login
        <div>
            <label>Username</label><br/>
            <input placeholder='Enter your username' className='h-10 w-72'/><br/>
            <label>Password</label><br/>
            <input placeholder='Enter your password' className='h-10 w-72'/><br/>
            <button>Login</button>
        </div>
    </div>
  )
}

export default Login