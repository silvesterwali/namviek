'use client'

import { Button, Form, Loading, messageError, messageSuccess, useForm } from '@ui-components'
import { validateRegisterUser } from '@namviek/core/validation'
import Link from 'next/link'
import Logo from '../../../components/Logo'
import { useState } from 'react'
import { signup } from '@auth-client'
import { motion } from 'framer-motion'
import { UserStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'

export default function SignupForm() {
  const { push } = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { regField, regHandleSubmit } = useForm({
    values: {
      email: '',
      password: '',
      name: ''
    },
    validateFn: values => {
      return validateRegisterUser(values)
    },
    onSubmit: values => {
      if (loading) return

      setLoading(true)
      signup(values)
        .then(res => {
          const { data, error } = res.data

          if (error) {
            if (error.meta.target === 'User_email_key') {
              messageError('Email already exist')
              return
            }

            messageError('Error')
            console.log(error)
            return
          }

          if (data && data.status === UserStatus.ACTIVE) {
            console.log('done')
            messageSuccess('Congratulations! Your account has been successfully created !')
            push('/sign-in')
            return
          }

          setSuccess(true)
        })
        .catch(err => {
          console.log(err)
          messageError('Your information is invalid')
        })
        .finally(() => setLoading(false))
    }
  })

  return (
    <div className="sign-page relative h-screen w-screen flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 100, scale: 1 }}
        transition={{ delay: 0.5, duration: 2 }}
        className='sign-page-background absolute top-0 left-0 w-full h-full'></motion.div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 100, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex border-4 border-white/30 dark:border-gray-800/50 " style={{ borderRadius: `calc(0.375rem + 4px)` }}>
        <div
          className={`w-[350px] sm:w-[400px] text-center p-8 rounded-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-md ${success ? '' : 'hidden'
            }`}>
          <img src="/email.svg" className="m-auto pb-6 w-[200px]" />
          <h2 className="text-xl sm:text-2xl font-bold mt-3">
            Successfully Registration
          </h2>
          <p className="text-gray-400 text-sm mt-3">
            We have sent an activation link to your email to continue with the
            registration process
          </p>
          <p className="mt-4">
            <Link
              className="text-sm text-indigo-600 hover:underline"
              href={'/sign-in'}>
              Back to Login
            </Link>
          </p>
        </div>

        <form
          onSubmit={regHandleSubmit}
          className={`${success ? 'hidden' : ''
            } bg-white/90 dark:bg-gray-900/95 backdrop-blur-md p-8 w-[350px] sm:w-[400px] rounded-md`}>
          <div className="flex gap-2 items-center">
            <Logo />
            <h2 className="text-xl sm:text-2xl font-bold">Sign up now</h2>
          </div>
          <p className="text-gray-400 text-sm mt-3">
            Our registration process is quick and easy, taking no more than 5
            minutes to complete.
          </p>

          <div className="flex flex-col gap-4 mt-6">
            <Form.Input title="Fullname" {...regField('name')} />
            <Form.Input title="Email" {...regField('email')} />
            <Form.Input
              title="Password"
              type="password"
              {...regField('password')}
            />
            <Button title="Sign up" type="submit" block primary />
          </div>

          <div className="mt-6 text-center text-gray-400 text-sm">
            Have a account ?{' '}
            <Link className="text-indigo-600 hover:underline" href={'/sign-in'}>
              Login
            </Link>
          </div>
        </form>
      </motion.div>

      {/* <SignUp /> */}
    </div>
  )
}
